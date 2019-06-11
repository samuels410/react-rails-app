import {
  QUIZ_SUBMISSIONS_FETCH_SUCCESS,
  QUIZ_SUBMISSIONS_FETCH_FAILURE,
  QUIZ_SUBMISSION_COMPLETE_SUCCESS,
  QUIZ_SUBMISSION_COMPLETE,
  QUIZ_SUBMISSION_START,
  QUIZ_SUBMISSION_START_SUCCESS,
  QUIZ_SUBMISSIONS_FETCH,
  QUIZ_SUBMISSIONS_FETCH_CANCEL,
  QUIZ_SUBMISSION_COMPLETE_FAILURE,
  QUIZ_SUBMISSION_START_FAILURE,
} from './QuizSubmissions.types'
import {
  QuizID,
  CourseID,
  ItemID,
  QuizSubmissionData,
  QuizAttemptNo,
  QuizSubmissionID,
} from '../../../../../../common/types'

interface QuizSubmissionStartPayload {
  quizId: QuizID
}

interface QuizSubmissionStartMeta {
  quizId: QuizID
  itemId: ItemID
}

export const startQuizSubmission = (
  payload: QuizSubmissionStartPayload,
  meta: { courseId: CourseID } & QuizSubmissionStartMeta
) => ({
  type: QUIZ_SUBMISSION_START as typeof QUIZ_SUBMISSION_START,
  payload,
  meta,
})

export const startQuizSubmissionSuccess = (
  payload: QuizSubmissionData,
  meta: QuizSubmissionStartMeta
) => ({
  type: QUIZ_SUBMISSION_START_SUCCESS as typeof QUIZ_SUBMISSION_START_SUCCESS,
  payload,
  meta: {
    ...meta,
    attemptNo: payload.attempt,
  },
})

export const startQuizSubmissionFailure = (
  payload: Error,
  meta: QuizSubmissionStartMeta
) => ({
  type: QUIZ_SUBMISSION_START_FAILURE as typeof QUIZ_SUBMISSION_START_FAILURE,
  payload,
  meta,
})

interface QuizSubmissionCompletePayload {
  attempt: QuizAttemptNo
  validation_token: string
}

interface QuizSubmissionCompleteMetaParams {
  quizId: QuizID
  itemId: ItemID
  submissionId: QuizSubmissionID
  attemptNo: QuizAttemptNo
}

export const completeQuizSubmission = (
  payload: QuizSubmissionCompletePayload,
  meta: { courseId: CourseID } & QuizSubmissionCompleteMetaParams
) => ({
  type: QUIZ_SUBMISSION_COMPLETE as typeof QUIZ_SUBMISSION_COMPLETE,
  payload,
  meta,
})

export const completeQuizSubmissionSuccess = (
  payload: any,
  meta: QuizSubmissionCompleteMetaParams
) => ({
  type: QUIZ_SUBMISSION_COMPLETE_SUCCESS as typeof QUIZ_SUBMISSION_COMPLETE_SUCCESS,
  payload,
  meta,
})

export const completeQuizSubmissionFailure = (
  payload: Error,
  meta: QuizSubmissionCompleteMetaParams
) => ({
  type: QUIZ_SUBMISSION_COMPLETE_FAILURE as typeof QUIZ_SUBMISSION_COMPLETE_FAILURE,
  payload,
  meta,
})

interface QuizSubmissionsFetchMetaParams {
  quizId: QuizID
  itemId: ItemID
}

export const fetchQuizSubmissions = (
  payload: any,
  meta: { courseId: CourseID } & QuizSubmissionsFetchMetaParams
) => ({
  type: QUIZ_SUBMISSIONS_FETCH as typeof QUIZ_SUBMISSIONS_FETCH,
  payload,
  meta,
})

export const fetchQuizSubmissionsSuccess = (
  payload: QuizSubmissionData[],
  meta: QuizSubmissionsFetchMetaParams
) => ({
  type: QUIZ_SUBMISSIONS_FETCH_SUCCESS as typeof QUIZ_SUBMISSIONS_FETCH_SUCCESS,
  payload,
  meta,
})

export const fetchQuizSubmissionsFailure = (
  payload: Error,
  meta: QuizSubmissionsFetchMetaParams
) => ({
  type: QUIZ_SUBMISSIONS_FETCH_FAILURE as typeof QUIZ_SUBMISSIONS_FETCH_FAILURE,
  payload,
  meta,
})

export const fetchQuizSubmissionsCancel = (
  payload: any,
  meta: QuizSubmissionsFetchMetaParams
) => ({
  type: QUIZ_SUBMISSIONS_FETCH_CANCEL as typeof QUIZ_SUBMISSIONS_FETCH_CANCEL,
  payload,
  meta,
})

export type QuizSubmissionsActionTypes =
  | ReturnType<typeof startQuizSubmission>
  | ReturnType<typeof startQuizSubmissionSuccess>
  | ReturnType<typeof startQuizSubmissionFailure>
  | ReturnType<typeof fetchQuizSubmissions>
  | ReturnType<typeof fetchQuizSubmissionsSuccess>
  | ReturnType<typeof fetchQuizSubmissionsFailure>
  | ReturnType<typeof fetchQuizSubmissionsCancel>
  | ReturnType<typeof completeQuizSubmission>
  | ReturnType<typeof completeQuizSubmissionFailure>
  | ReturnType<typeof completeQuizSubmissionSuccess>
