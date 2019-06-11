import { Reducer, combineReducers } from 'redux'
import {
  QuizSubmissionData,
  QuizAnswerData,
} from '../../../../../../common/types'
import { QuizQAActionTypes } from './QuizQA.actions'
import * as types from './QuizQA.types'
import { convertArrayToObjectMap } from '../../../../../../common/utils'

export type QuizQAState = Pick<QuizSubmissionData, 'questions' | 'answers'>

const quizQuestionsReducer: Reducer<
  QuizQAState['questions'],
  QuizQAActionTypes
> = (state = null, action): QuizQAState['questions'] => {
  console.log('inside questions', state, action)
  switch (action.type) {
    case types.QUIZ_QUESTIONS_FETCH:
      return null
    case types.QUIZ_QUESTIONS_FETCH_SUCCESS:
      return convertArrayToObjectMap(action.payload, 'id')
    case types.QUIZ_QUESTIONS_FETCH_FAILURE:
      return action.payload
    default:
      return state
  }
}

const initialState = {
  answer: null,
  flagged: false,
}

const quizAnswersReducer: Reducer<QuizQAState['answers'], QuizQAActionTypes> = (
  state = null,
  action
): QuizQAState['answers'] => {
  switch (action.type) {
    case types.QUIZ_SUBMISSION_ANSWERS_FETCH:
      return null
    case types.QUIZ_SUBMISSION_ANSWERS_FETCH_SUCCESS:
      return convertArrayToObjectMap(action.payload, 'id')
    case types.QUIZ_SUBMISSION_ANSWERS_FETCH_FAILURE:
      return action.payload
    case types.QUIZ_QUESTION_FLAG:
      return state instanceof Error
        ? state
        : {
            ...state,
            [action.meta.questionId]: {
              ...initialState,
              ...(state ? state[action.meta.questionId] : {}),
              id: action.meta.questionId,
              flagged: true,
            },
          }
    case types.QUIZ_QUESTION_UNFLAG:
      return state instanceof Error
        ? state
        : {
            ...state,
            [action.meta.questionId]: {
              ...initialState,
              ...(state ? state[action.meta.questionId] : {}),
              id: action.meta.questionId,
              flagged: false,
            },
          }
    case types.QUIZ_QUESTION_UPDATE_ANSWER:
      return state instanceof Error
        ? state
        : {
            ...state,
            [action.meta.questionId]: <QuizAnswerData>{
              ...initialState,
              ...(state ? state[action.meta.questionId] : {}),
              id: action.meta.questionId,
              answer: action.payload,
            },
          }
    default:
      return state
  }
}

export default combineReducers<QuizQAState, QuizQAActionTypes>({
  answers: quizAnswersReducer,
  questions: quizQuestionsReducer,
})
