import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { List } from 'immutable';
import { subDays } from 'date-fns';

export interface DemoDailyBatchCompleteionsRequested {
  type: 'DEMO_DAILY_BATCH_COMPLETIONS_REQUESTED';
}

export interface DemoDailyBatchCompleteionsRejected {
  type: 'DEMO_DAILY_BATCH_COMPLETIONS_REJECTED';
}

export interface DemoDailyBatchCompleteionsFulfilled {
  type: 'DEMO_DAILY_BATCH_COMPLETIONS_FULFILLED';
}
function DemoDailyBatchCompletionsRequested(): DemoDailyBatchCompleteionsRequested {
  return {
    type: 'DEMO_DAILY_BATCH_COMPLETIONS_REQUESTED'
  };
}

function DemoDailyComplteionsRejected(): DemoDailyBatchCompleteionsRejected {
  return {
    type: 'DEMO_DAILY_BATCH_COMPLETIONS_REJECTED'
  };
}

function DemoDailyBatchComplteionsFulfilled(): DemoDailyBatchCompleteionsFulfilled {
  return {
    type: 'DEMO_DAILY_BATCH_COMPLETIONS_FULFILLED'
  };
}

export interface DemoDailyCompletionBatch {
  type: 'DEMO_DAILY_COMPLETION_BATCH';
  id: string;
  completedOn: List<Date>;
}

function DemoDailyCompletionBatch(
  id: string,
  completedOn: List<Date>
): DemoDailyCompletionBatch {
  return {
    type: 'DEMO_DAILY_COMPLETION_BATCH',
    id,
    completedOn
  };
}

export default function demoDailyCompletion(ids: List<string>) {
  const user = auth()!.currentUser!.uid;
  return async (dispatch: Dispatch<any>, getState: Function) => {
    dispatch(DemoDailyBatchCompletionsRequested());

    return Promise.all(
      ids
        .map((id: string, key: number) => {
          const dailyRef = database.ref(
            '/userData/' + user + '/dailies/' + id + '/completedOn'
          );

          let completedOn: List<Date> = List();
          for (let j = 1; j < 150; j++) {
            completedOn = completedOn.push(subDays(new Date(), j));
            Math.floor(Math.random() < 0.1 * (key + 1) ? j++ : (j = j));
          }

          dailyRef.set(completedOn.map((t: Date) => t.getTime()).toJS());
          dispatch(DemoDailyCompletionBatch(id, completedOn));
        })
        .toArray()
    )
      .then(() => dispatch(DemoDailyBatchComplteionsFulfilled()))
      .catch((e: string) => {
        console.log(e);
        dispatch(DemoDailyComplteionsRejected());
      });
  };
}
