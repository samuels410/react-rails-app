import { takeLatest, put, call, cancelled } from 'redux-saga/effects'
import { RECORDINGS_FETCH, RECORDINGS_FETCH_CANCEL } from './Recordings.types'
import { cancelable, sleep } from '../../../../common/utils'
import {
  fetchRecordingsFailure,
  fetchRecordingsSuccess,
  fetchRecordings,
} from './Recordings.actions'

export async function getRecordingsAPI(signal: AbortSignal) {
  await sleep(1000)
  const responseBody = [
    {
      authorName: 'Kedar Joshi',
      imageUrl:
        'https://greatlearning.hosted.panopto.com/Panopto/Services/FrameGrabber.svc/FrameRedirect?objectId=d862c732-e671-4344-a678-aa4a004e9d29&mode=Delivery&random=0.451539313165256',
      createdAt: 4365464564646,
      id: 21,
      duration: 4535,
      title: 'Session 1',
    },
    {
      authorName: 'Kedar Joshi',
      imageUrl:
        'https://greatlearning.hosted.panopto.com/Panopto/Services/FrameGrabber.svc/FrameRedirect?objectId=06086fa0-8b22-407c-a423-aa28004c870e&mode=Delivery&random=0.451539313165256',
      createdAt: 4365412364646,
      id: 22,
      duration: 56443,
      title: 'Session 2',
    },
    {
      authorName: 'Kedar Joshi',
      imageUrl:
        'https://d9jmtjs5r4cgq.cloudfront.net/images/pgpbabi/PM-min.jpg',
      createdAt: 4365462544646,
      id: 23,
      duration: 3401,
      title: 'Session 3',
    },
    {
      authorName: 'Kedar Joshi',
      imageUrl:
        'https://greatlearning.hosted.panopto.com/Panopto/Services/FrameGrabber.svc/FrameRedirect?objectId=387c0e92-c94d-4648-8d16-aa36006cacb5&mode=Delivery&random=0.451539313165256',
      createdAt: 4365465764646,
      id: 24,
      duration: 1232,
      title: 'Session 4',
    },
    {
      authorName: 'Kedar Joshi',
      imageUrl:
        'https://d9jmtjs5r4cgq.cloudfront.net/images/pgpbabi/PM-min.jpg',
      createdAt: 4365234564646,
      id: 25,
      duration: 2512,
      title: 'Session 5',
    },
  ]
  return responseBody
}

function* getRecordingsHandler({ meta }: ReturnType<typeof fetchRecordings>) {
  const abortController = new AbortController()
  try {
    const data = yield call(getRecordingsAPI, abortController.signal)
    yield put(fetchRecordingsSuccess(data, meta))
  } catch (e) {
    yield put(fetchRecordingsFailure(e, meta))
  } finally {
    if (cancelled()) {
      abortController.abort()
    }
  }
}

export function* getRecordingsMiddleware() {
  yield takeLatest(
    RECORDINGS_FETCH,
    cancelable(getRecordingsHandler, RECORDINGS_FETCH_CANCEL)
  )
}

export default ([] as any).concat(getRecordingsMiddleware())
