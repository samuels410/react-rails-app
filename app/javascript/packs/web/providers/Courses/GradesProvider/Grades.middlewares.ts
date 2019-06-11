import { takeLatest, put, call, cancelled } from 'redux-saga/effects'
import { GRADES_FETCH, GRADES_FETCH_CANCEL } from './Grades.types'
import { cancelable, stringify } from '../../../../common/utils'
import {
  fetchGradesFailure,
  fetchGradesSuccess,
  fetchGrades,
} from './Grades.actions'

export async function getGradesAPI(
  action: ReturnType<typeof fetchGrades>,
  signal: AbortSignal
) {
  const params = stringify({
    access_token: process.env.REACT_APP_API_ACCESS_TOKEN,
  })

  const { courseId } = action.meta
  const response = await fetch(
    `${
      process.env.REACT_APP_API_URL_1
    }v1/users/32530/courses/${courseId}/assignments?${params}`,
    { signal }
  )
  const responseBody = await response.json()
  return responseBody
}

function* getGradesHandler(action: ReturnType<typeof fetchGrades>) {
  const abortController = new AbortController()
  try {
    const data = yield call(getGradesAPI, action, abortController.signal)
    yield put(fetchGradesSuccess(data, action.meta))
  } catch (e) {
    yield put(fetchGradesFailure(e, action.meta))
  } finally {
    if (cancelled()) {
      abortController.abort()
    }
  }
}

export function* getGradesMiddleware() {
  yield takeLatest(
    GRADES_FETCH,
    cancelable(getGradesHandler, GRADES_FETCH_CANCEL)
  )
}

export default ([] as any).concat(getGradesMiddleware())
