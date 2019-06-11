import * as types from './QuizActivity.types'
import {
  QuizQuestionID,
  ItemID,
  QuizAttemptNo,
} from '../../../../../../common/types'

interface MetaParams {
  attemptNo: QuizAttemptNo
  itemId: ItemID
}

export const updateActiveQuizQuestion = (
  payload: { id: QuizQuestionID },
  meta: MetaParams
) => ({
  type: types.QUIZ_UPDATE_ACTIVE_QUESTION as typeof types.QUIZ_UPDATE_ACTIVE_QUESTION,
  payload,
  meta,
})

export const startQuiz = (payload: any, meta: MetaParams) => ({
  type: types.QUIZ_START as typeof types.QUIZ_START,
  payload,
  meta,
})

export const submitQuiz = (payload: any, meta: MetaParams) => ({
  type: types.QUIZ_SUBMIT as typeof types.QUIZ_SUBMIT,
  payload,
  meta,
})

export type QuizActivityActionTypes = ReturnType<
  typeof updateActiveQuizQuestion
>
