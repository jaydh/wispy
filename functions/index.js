const functions = require('firebase-functions');
const admin = require('firebase-admin');
const scrape = require('scrape-metadata');
const fetch = require('node-fetch');
const pos = require('pos');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const readability = require('readability-node');
const Readability = readability.Readability;
const { Map, Set, List, fromJS } = require('immutable');
const promiseFinally = require('promise.prototype.finally');
promiseFinally.shim();
admin.initializeApp(functions.config().firebase);

exports.getMetadata = functions.database
  .ref('/userData/{uId}/articles/{articleID}/link')
  .onCreate(event => {
    const article = event.data.val();
    const rootRef = event.data.ref.parent.parent.parent.parent.parent;
    const articleDataRef = rootRef
      .child('articleData')
      .child(event.params.articleID);
    const htmlRef = articleDataRef.child('HTMLContent');
    const metaRef = articleDataRef.child('metadata');

    return articleDataRef
      .child('fetching')
      .set(true)
      .then(() =>
        Promise.all([
          articleDataRef.child('link').set(article),
          metaRef
            .once('value')
            .then(snap => snap.val() !== null)
            .then(
              exists =>
                !exists
                  ? new Promise(function(resolve, reject) {
                      scrape(article, (err, meta) => {
                        // Filters out null/undefined values
                        if (meta) {
                          const filteredMeta = fromJS(meta)
                            .filter(t => t)
                            .toJS();
                          resolve(metaRef.set(filteredMeta));
                        }
                      });
                    })
                  : null
            ),
          htmlRef
            .once('value', snapshot => {
              return snapshot.val() === null;
            })
            .then(
              newArticle =>
                newArticle
                  ? JSDOM.fromURL(article, {}).then(dom => {
                      const loc = dom.window.location;
                      var uri = {
                        spec: loc.href,
                        host: loc.host,
                        prePath: loc.protocol + '//' + loc.host,
                        scheme: loc.protocol.substr(
                          0,
                          loc.protocol.indexOf(':')
                        ),
                        pathBase:
                          loc.protocol +
                          '//' +
                          loc.host +
                          loc.pathname.substr(
                            0,
                            loc.pathname.lastIndexOf('/') + 1
                          )
                      };
                      const parsed = new Readability(
                        uri,
                        dom.window.document
                      ).parse();
                      return htmlRef.set(parsed.content);
                    })
                  : null
            )
        ])
      )
      .finally(() => articleDataRef.child('fetching').set(false));
  });

exports.refetchHTML = functions.database
  .ref('/articleData//{articleID}/refetch')
  .onCreate(event => {
    const articleDataRef = event.data.ref.parent;
    const htmlRef = articleDataRef.child('HTMLContent');
    const metaRef = articleDataRef.child('metadata');
    return articleDataRef
      .child('link')
      .once('value')
      .then(snapshot => {
        return articleDataRef
          .child('fetching')
          .set(true)
          .then(() =>
            Promise.all([
              new Promise(function(resolve, reject) {
                scrape(snapshot.val(), (err, meta) => {
                  // Filters out null/undefined values
                  if (meta) {
                    const filteredMeta = fromJS(meta)
                      .filter(t => t)
                      .toJS();
                    resolve(metaRef.set(filteredMeta));
                  }
                });
              }),
              JSDOM.fromURL(snapshot.val(), {})
                .then(dom => {
                  const loc = dom.window.location;
                  var uri = {
                    spec: loc.href,
                    host: loc.host,
                    prePath: loc.protocol + '//' + loc.host,
                    scheme: loc.protocol.substr(0, loc.protocol.indexOf(':')),
                    pathBase:
                      loc.protocol +
                      '//' +
                      loc.host +
                      loc.pathname.substr(0, loc.pathname.lastIndexOf('/') + 1)
                  };
                  const parsed = new Readability(
                    uri,
                    dom.window.document
                  ).parse();
                  return parsed;
                })
                .then(parsed => htmlRef.set(parsed.content))
            ])
          )
          .finally(() =>
            Promise.all([
              articleDataRef.child('fetching').set(false),
              articleDataRef.child('refetch').remove()
            ])
          );
      });
  });

exports.addKeywordsFromMetadata = functions.database
  .ref('/userData/{uID}/articles/{articleID}/projects/{projectID}')
  .onCreate(event => {
    const project = event.data.val();
    const metaToKeep = fromJS([
      'ogTitle',
      'title',
      'ogSiteName',
      'ogDescription',
      'description'
    ]);
    const tagsToKeep = fromJS(['JJ', 'NN', 'NNP', 'NNPS', 'VB']);
    const tagger = new pos.Tagger();

    const articleRef = event.data.ref.parent.parent;
    const masterProjectRef = event.data.ref.parent.parent.parent.parent.child(
      'projects'
    );

    return masterProjectRef
      .once('value')
      .then(function(snapshot) {
        const [key, value] = fromJS(snapshot.val()).findEntry(
          t => t.get('id') === project
        );
        const dictionary = value.get('dictionary');
        if (dictionary) return { key, dictionary };
      })
      .then(projectData =>
        articleRef.once('value').then(function(snapshot) {
          const article = snapshot.val();
          let updatedDictionary = projectData.dictionary;
          if (article.metadata) {
            let newWords = Set(projectData.dictionary);
            const meta = fromJS(article.metadata);
            meta
              .keySeq()
              .filter(t => metaToKeep.includes(t))
              .forEach(t => {
                const words = new pos.Lexer().lex(meta.get(t));
                const taggedWords = fromJS(tagger.tag(words))
                  .filter(p => {
                    return tagsToKeep.includes(p.get(1));
                  })
                  .map(p => p.get(0));
                newWords = newWords.union(taggedWords.valueSeq());
              });
            updatedDictionary = newWords.toJS();
          }
          return {
            key: projectData.key,
            dictionary: updatedDictionary
          };
        })
      )
      .then(updates => {
        masterProjectRef
          .child(updates.key)
          .update({ dictionary: updates.dictionary });
      });
  });

exports.getProjectSynonyms = functions.database
  .ref('/userData/{uID}/projects/{projectPushID}')
  .onCreate(event => {
    const project = event.data.val().id;
    // Gets dictionary data for project and updates project dicionary accordingly
    return fetch(
      `https://words.bighugelabs.com/api/2/b0ccfcccd889eeb6a11c013493465013/${project}/json`
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        let dictionary = fromJS([]);
        const synonymGroups = fromJS(json).toList();
        synonymGroups.forEach(t => {
          dictionary = dictionary.merge(t.get('syn'));
        });
        return dictionary;
      })
      .then(function(dictionary) {
        event.data.ref.set({
          id: project,
          dictionary: dictionary.valueSeq().toJS()
        });
      });
  });
