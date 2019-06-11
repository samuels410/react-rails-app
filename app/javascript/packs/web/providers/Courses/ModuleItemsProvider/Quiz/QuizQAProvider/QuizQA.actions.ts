import * as types from './QuizQA.types'
import {
  QuizID,
  QuizQuestionData,
  QuizSubmissionID,
  QuizAttemptNo,
  CourseID,
  ItemID,
  QuizQuestionID,
  QuizAnswerData,
} from '../../../../../../common/types'

interface QuizQABaseMetaParams {
  quizId: QuizID
  itemId: ItemID
  attemptNo: QuizAttemptNo
}

interface QuizQuestionsParams {
  validation_token: string
  attemptNo: QuizAttemptNo
  quiz_submission_id: QuizSubmissionID
  quiz_submission_attempt: QuizAttemptNo
}

interface QuizQuestionsMetaParams extends QuizQABaseMetaParams {}

export const fetchQuizQuestions = (
  payload: QuizQuestionsParams,
  meta: {
    courseId: CourseID
  } & QuizQuestionsMetaParams
) => ({
  type: types.QUIZ_QUESTIONS_FETCH as typeof types.QUIZ_QUESTIONS_FETCH,
  payload,
  meta,
})

export const fetchQuizQuestionsSuccess = (
  payload: QuizQuestionData[],
  meta: QuizQuestionsMetaParams
) => ({
  type: types.QUIZ_QUESTIONS_FETCH_SUCCESS as typeof types.QUIZ_QUESTIONS_FETCH_SUCCESS,
  payload,
  meta,
})

export const fetchQuizQuestionsFailure = (
  payload: Error,
  meta: QuizQuestionsMetaParams
) => ({
  type: types.QUIZ_QUESTIONS_FETCH_FAILURE as typeof types.QUIZ_QUESTIONS_FETCH_FAILURE,
  payload,
  meta,
})

interface QuizQuestionMetaParams extends QuizQABaseMetaParams {
  questionId: QuizQuestionID
}

export const flagQuizQuestion = (
  payload: any,
  meta: QuizQuestionMetaParams
) => ({
  type: types.QUIZ_QUESTION_FLAG as typeof types.QUIZ_QUESTION_FLAG,
  payload,
  meta,
})

export const unFlagQuizQuestion = (
  payload: any,
  meta: QuizQuestionMetaParams
) => ({
  type: types.QUIZ_QUESTION_UNFLAG as typeof types.QUIZ_QUESTION_UNFLAG,
  payload,
  meta,
})

export const updateQuizQuestionAnswer = (
  payload: QuizAnswerData['answer'],
  meta: QuizQuestionMetaParams
) => ({
  type: types.QUIZ_QUESTION_UPDATE_ANSWER as typeof types.QUIZ_QUESTION_UPDATE_ANSWER,
  payload,
  meta,
})

interface SaveQuizAnswers {}

interface SaveQuizAnswersMetaParams extends QuizQABaseMetaParams {
  submissionId: QuizSubmissionID
}

export const saveQuizAnswers = (
  payload: SaveQuizAnswers,
  meta: SaveQuizAnswersMetaParams
) => ({
  type: types.QUIZ_SUBMISSION_ANSWERS_SAVE as typeof types.QUIZ_SUBMISSION_ANSWERS_SAVE,
  payload,
  meta,
})

export const saveQuizAnswersSuccess = (
  payload: any,
  meta: SaveQuizAnswersMetaParams
) => ({
  type: types.QUIZ_SUBMISSION_ANSWERS_SAVE_SUCCESS as typeof types.QUIZ_SUBMISSION_ANSWERS_SAVE_SUCCESS,
  payload,
  meta,
})

export const saveQuizAnswersFailure = (
  payload: SaveQuizAnswers,
  meta: SaveQuizAnswersMetaParams
) => ({
  type: types.QUIZ_SUBMISSION_ANSWERS_SAVE_FAILURE as typeof types.QUIZ_SUBMISSION_ANSWERS_SAVE_FAILURE,
  payload,
  meta,
})

interface SavedQuizAnswersMetaParams extends QuizQABaseMetaParams {}

export const fetchSavedQuizAnswers = (
  payload: any,
  meta: SavedQuizAnswersMetaParams
) => ({
  type: types.QUIZ_SUBMISSION_ANSWERS_FETCH as typeof types.QUIZ_SUBMISSION_ANSWERS_FETCH,
  payload,
  meta,
})

export const fetchSavedQuizAnswersSuccess = (
  payload: QuizAnswerData[],
  meta: SavedQuizAnswersMetaParams
) => ({
  type: types.QUIZ_SUBMISSION_ANSWERS_FETCH_SUCCESS as typeof types.QUIZ_SUBMISSION_ANSWERS_FETCH_SUCCESS,
  payload,
  meta,
})

export const fetchSavedQuizAnswersFailure = (
  payload: any,
  meta: SavedQuizAnswersMetaParams
) => ({
  type: types.QUIZ_SUBMISSION_ANSWERS_FETCH_FAILURE as typeof types.QUIZ_SUBMISSION_ANSWERS_FETCH_FAILURE,
  payload,
  meta,
})

export type QuizQAActionTypes =
  | ReturnType<typeof fetchQuizQuestions>
  | ReturnType<typeof fetchQuizQuestionsSuccess>
  | ReturnType<typeof fetchQuizQuestionsFailure>
  | ReturnType<typeof flagQuizQuestion>
  | ReturnType<typeof unFlagQuizQuestion>
  | ReturnType<typeof saveQuizAnswers>
  | ReturnType<typeof saveQuizAnswersSuccess>
  | ReturnType<typeof saveQuizAnswersFailure>
  | ReturnType<typeof updateQuizQuestionAnswer>
  | ReturnType<typeof fetchSavedQuizAnswers>
  | ReturnType<typeof fetchSavedQuizAnswersSuccess>
  | ReturnType<typeof fetchSavedQuizAnswersFailure>
