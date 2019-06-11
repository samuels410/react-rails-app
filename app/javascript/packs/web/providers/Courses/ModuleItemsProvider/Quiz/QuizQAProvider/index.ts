import quizQAReducer, { QuizQAState } from './QuizQA.reducer'
import quizQAMiddleware from './QuizQA.middlewares'
import * as quizQAActionTypes from './QuizQA.types'
import {
  fetchQuizQuestions,
  saveQuizAnswers,
  QuizQAActionTypes,
  flagQuizQuestion,
  unFlagQuizQuestion,
  updateQuizQuestionAnswer,
} from './QuizQA.actions'

export type QuizQAState = QuizQAState
export type QuizQAActionTypes = QuizQAActionTypes

export {
  quizQAActionTypes,
  quizQAReducer,
  quizQAMiddleware,
  fetchQuizQuestions,
  saveQuizAnswers,
  flagQuizQuestion,
  unFlagQuizQuestion,
  updateQuizQuestionAnswer,
}
