import {
  takeEvery,
  put,
  call,
  select,
  debounce,
  delay,
} from 'redux-saga/effects'
import {
  fetchQuizQuestions,
  fetchQuizQuestionsFailure,
  fetchQuizQuestionsSuccess,
  saveQuizAnswers,
  saveQuizAnswersSuccess,
  saveQuizAnswersFailure,
} from './QuizQA.actions'
import * as types from './QuizQA.types'
import {
  stringify,
  BooleanFilter,
  cancelable,
} from '../../../../../../common/utils'
import {
  QuizQuestionData,
  QuizModuleItemData,
} from '../../../../../../common/types'
import { AppState } from '../../../../../store'
import { quizSubmissionTypes } from '../QuizSubmissionsProvider'

/** QUIZ SUBMISSION CREATE */
export async function getQuizQuestionsAPI(
  payload: ReturnType<typeof fetchQuizQuestions>['payload'],
  meta: ReturnType<typeof fetchQuizQuestions>['meta'] & {
    question_count: number
  }
) {
  const PAGINATE_SIZE = 50
  const { quizId, question_count, courseId } = meta
  const noOfRequests = Math.ceil(question_count / PAGINATE_SIZE)

  const requests = Array.from({ length: noOfRequests }).map((item, idx) => {
    const params = stringify({
      access_token: process.env.REACT_APP_API_ACCESS_TOKEN,
      page: idx + 1,
      per_page: PAGINATE_SIZE,
      ...payload,
    })
    return fetch(
      `${
        process.env.REACT_APP_API_URL_1
      }v1/courses/${courseId}/quizzes/${quizId}/questions?${params}`,
      { method: 'GET' }
    ).then(res => res.json())
  })

  const response = await Promise.all(requests)
  return response
}

function* getQuizQuestionsHandler(
  action: ReturnType<typeof fetchQuizQuestions>
) {
  try {
    const { itemId } = action.meta
    const quizContent: QuizModuleItemData['itemContent'] = yield select(
      (state: AppState) =>
        (state.moduleItems.data.byId[itemId] as QuizModuleItemData)!
          .itemContent!
    )

    if (!quizContent || quizContent instanceof Error) {
      return
    }

    const { question_count } = quizContent

    const data = yield call(getQuizQuestionsAPI, action.payload, {
      ...action.meta,
      question_count,
    })
    const questions: QuizQuestionData[] = [].concat(...data)
    yield put(fetchQuizQuestionsSuccess(questions, action.meta))
  } catch (e) {
    yield put(fetchQuizQuestionsFailure(e, action.meta))
  }
}

export function* fetchQuizQuestionsMiddleware() {
  yield takeEvery(types.QUIZ_QUESTIONS_FETCH, getQuizQuestionsHandler)
}

export async function saveQuizAnswersAPI(data: any) {
  const { submissionId, quiz_questions, ...otherParams } = data
  const urlParams = stringify({
    access_token: process.env.REACT_APP_API_ACCESS_TOKEN,
    ...otherParams,
  })
  const body = JSON.stringify({
    quiz_questions,
  })
  const response = await fetch(
    `${
      process.env.REACT_APP_API_URL_1
    }v1/quiz_submissions/${submissionId}/questions?${urlParams}`,
    { body, method: 'POST' }
  )
  if (response.ok) {
    const responseBody = await response.json()
    return responseBody
  }
  throw new Error(response.statusText)
}

function* saveQuizAnswersHandler(action: ReturnType<typeof saveQuizAnswers>) {
  try {
    const { itemId, attemptNo } = action.meta
    const quizActivity: QuizModuleItemData['itemActivity'] = yield select(
      (state: AppState) =>
        (state.moduleItems.data.byId[itemId] as QuizModuleItemData)!
          .itemActivity!
    )
    if (
      !quizActivity ||
      !quizActivity.activeAttempt ||
      !quizActivity.submissions ||
      quizActivity.submissions instanceof Error
    ) {
      return
    }

    const submission = quizActivity.submissions[attemptNo]
    if (
      !submission ||
      !submission.answers ||
      submission.answers instanceof Error
    ) {
      return
    }

    const answers = Object.values(submission.answers)
      .filter(BooleanFilter)
      .map(answer => ({
        id: answer.id,
        answer: answer.answer,
        flagged: answer.flagged,
      }))

    const data = {
      attempt: attemptNo,
      validation_token: submission.validation_token,
      quiz_questions: answers,
      submissionId: submission.id,
    }

    yield call(saveQuizAnswersAPI, data)
    yield put(saveQuizAnswersSuccess(data, action.meta))
    yield delay(10000)
    yield put(saveQuizAnswers(action.payload, action.meta))
  } catch (e) {
    yield put(saveQuizAnswersFailure(e, action.meta))
  }
}

export function* saveQuizQuestionsMiddleware() {
  yield debounce(
    1000,
    types.QUIZ_SUBMISSION_ANSWERS_SAVE,
    cancelable(
      saveQuizAnswersHandler,
      quizSubmissionTypes.QUIZ_SUBMISSION_COMPLETE
    )
  )
}

export function* triggerQuizSaveMiddleware() {
  yield takeEvery(types.QUIZ_QUESTION_UPDATE_ANSWER, saveQuizAnswersHandler)
}

export default ([] as any).concat(
  fetchQuizQuestionsMiddleware(),
  saveQuizQuestionsMiddleware(),
  triggerQuizSaveMiddleware()
)
