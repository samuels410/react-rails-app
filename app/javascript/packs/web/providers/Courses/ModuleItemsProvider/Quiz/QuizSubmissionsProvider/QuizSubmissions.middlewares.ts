import { takeLatest, take, put, call, cancelled } from 'redux-saga/effects'
import {
  startQuizSubmission,
  startQuizSubmissionFailure,
  startQuizSubmissionSuccess,
  completeQuizSubmission,
  completeQuizSubmissionSuccess,
  completeQuizSubmissionFailure,
  fetchQuizSubmissions,
  fetchQuizSubmissionsFailure,
  fetchQuizSubmissionsSuccess,
} from './QuizSubmissions.actions'
import * as types from './QuizSubmissions.types'
import { cancelable, stringify } from '../../../../../../common/utils'
import {
  quizQAMiddleware,
  quizQAActionTypes,
  saveQuizAnswers,
  fetchQuizQuestions,
} from '../QuizQAProvider'
import { QuizSubmissionData } from '../../../../../../common/types'

/** QUIZ SUBMISSION CREATE */
export async function startQuizSubmissionAPI(
  action: ReturnType<typeof startQuizSubmission>
) {
  const { quizId, courseId } = action.meta
  const params = stringify({
    access_token: process.env.REACT_APP_API_ACCESS_TOKEN,
    ...action.payload,
  })
  const response = await fetch(
    `${
      process.env.REACT_APP_API_URL_1
    }v1/courses/${courseId}/quizzes/${quizId}/submissions?${params}`,
    { method: 'POST' }
  )
  const responseBody = await response.json()
  return responseBody
}

function* startQuizSubmissionHandler(
  action: ReturnType<typeof startQuizSubmission>
) {
  try {
    const data = yield call(startQuizSubmissionAPI, action)
    const submissionData: QuizSubmissionData = data.quiz_submissions[0]
    yield put(startQuizSubmissionSuccess(submissionData, action.meta))

    const payload = {
      attemptNo: submissionData.attempt,
      validation_token: submissionData.validation_token,
      quiz_submission_id: submissionData.id,
      quiz_submission_attempt: submissionData.attempt,
    }
    const meta = {
      ...action.meta,
      attemptNo: submissionData.attempt,
    }
    yield put(fetchQuizQuestions(payload, meta))
  } catch (e) {
    yield put(startQuizSubmissionFailure(e, action.meta))
  }
}

export function* startQuizSubmissionMiddleware() {
  yield takeLatest(types.QUIZ_SUBMISSION_START, startQuizSubmissionHandler)
}

/**
 * QUIZ SUBMISSION COMPLETE
 */
export async function completeQuizSubmissionAPI(
  action: ReturnType<typeof completeQuizSubmission>
) {
  const { quizId, courseId, submissionId } = action.meta
  const params = stringify({
    access_token: process.env.REACT_APP_API_ACCESS_TOKEN,
    ...action.payload,
  })
  const response = await fetch(
    `${
      process.env.REACT_APP_API_URL_1
    }v1/courses/${courseId}/quizzes/${quizId}/submissions/${submissionId}/complete?${params}`,
    { method: 'POST' }
  )
  const responseBody = await response.json()
  return responseBody
}

function* completeQuizSubmissionHandler(
  action: ReturnType<typeof completeQuizSubmission>
) {
  try {
    yield put(saveQuizAnswers({}, action.meta))
    yield take(quizQAActionTypes.QUIZ_SUBMISSION_ANSWERS_SAVE_SUCCESS)
    const data = yield call(completeQuizSubmissionAPI, action)
    const submissionData = data.quiz_submissions[0]
    yield put(completeQuizSubmissionSuccess(submissionData, action.meta))
  } catch (e) {
    yield put(completeQuizSubmissionFailure(e, action.meta))
  }
}

export function* completeQuizSubmissionMiddleware() {
  yield takeLatest(
    types.QUIZ_SUBMISSION_COMPLETE,
    cancelable(
      completeQuizSubmissionHandler,
      quizQAActionTypes.QUIZ_SUBMISSION_ANSWERS_FETCH_FAILURE
    )
  )
}

/** QUIZ SUBMISSIONS FETCH */
export async function getQuizSubmissionsAPI(
  action: ReturnType<typeof fetchQuizSubmissions>,
  signal: AbortSignal
) {
  const { quizId, courseId } = action.meta
  const params = stringify({
    access_token: process.env.REACT_APP_API_ACCESS_TOKEN,
    include: ['submission'],
    ...action.payload,
  })
  const response = await fetch(
    `${
      process.env.REACT_APP_API_URL_1
    }v1/courses/${courseId}/quizzes/${quizId}/submissions?${params}`,
    { signal }
  )
  const responseBody = await response.json()
  return responseBody
}

function* getQuizSubmissionsHandler(
  action: ReturnType<typeof fetchQuizSubmissions>
) {
  const abortController = new AbortController()
  try {
    const data = yield call(
      getQuizSubmissionsAPI,
      action,
      abortController.signal
    )
    const submissionData = data.quiz_submissions
    yield put(fetchQuizSubmissionsSuccess(submissionData, action.meta))
  } catch (e) {
    yield put(fetchQuizSubmissionsFailure(e, action.meta))
  } finally {
    if (cancelled()) {
      abortController.abort()
    }
  }
}

export function* getQuizSubmissionsMiddleware() {
  yield takeLatest(
    types.QUIZ_SUBMISSIONS_FETCH,
    cancelable(getQuizSubmissionsHandler, types.QUIZ_SUBMISSIONS_FETCH_CANCEL)
  )
}

export default ([] as any).concat(
  startQuizSubmissionMiddleware(),
  completeQuizSubmissionMiddleware(),
  getQuizSubmissionsMiddleware(),
  ...quizQAMiddleware
)
