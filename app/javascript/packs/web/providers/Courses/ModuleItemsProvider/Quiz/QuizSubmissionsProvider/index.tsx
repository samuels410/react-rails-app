import quizSubmissionsReducer, {
  QuizSubmissionsState,
} from './QuizSubmissions.reducer'
import quizSubmissionsMiddleware from './QuizSubmissions.middlewares'
import {
  startQuizSubmission,
  completeQuizSubmission,
  fetchQuizSubmissions,
  fetchQuizSubmissionsCancel,
  QuizSubmissionsActionTypes,
} from './QuizSubmissions.actions'
import * as quizSubmissionTypes from './QuizSubmissions.types'

export type QuizSubmissionsState = QuizSubmissionsState
export type QuizSubmissionsActionTypes = QuizSubmissionsActionTypes

export {
  quizSubmissionsReducer,
  quizSubmissionsMiddleware,
  quizSubmissionTypes,
  /** ACTION CREATORS */
  startQuizSubmission,
  completeQuizSubmission,
  fetchQuizSubmissions,
  fetchQuizSubmissionsCancel,
}
