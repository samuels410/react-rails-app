import { Reducer } from 'redux'
import {
  QuizModuleItemData,
  ObjectMap,
  QuizSubmissionData,
  QuizAttemptNo,
} from '../../../../../../common/types'
import * as types from './QuizSubmissions.types'
import { QuizSubmissionsActionTypes } from './QuizSubmissions.actions'
import {
  QuizQAActionTypes,
  quizQAActionTypes,
  quizQAReducer,
} from '../QuizQAProvider'
import { pick } from '../../../../../../common/utils'

export type QuizSubmissionsState = Exclude<
  QuizModuleItemData['itemActivity'],
  undefined
>['submissions']

const quizSubmissionsReducer: Reducer<
  QuizSubmissionsState,
  QuizSubmissionsActionTypes | QuizQAActionTypes
> = (state = null, action): QuizSubmissionsState => {
  switch (action.type) {
    case types.QUIZ_SUBMISSION_START_SUCCESS: {
      return {
        ...state,
        [action.meta.attemptNo]: {
          ...action.payload,
        },
      }
    }
    case types.QUIZ_SUBMISSIONS_FETCH_SUCCESS: {
      const submissions: ObjectMap<
        QuizAttemptNo,
        QuizSubmissionData
      > = action.payload.reduce(
        (
          acc: ObjectMap<QuizAttemptNo, QuizSubmissionData>,
          item: QuizSubmissionData
        ) => {
          acc[item.attempt] = item
          return acc
        },
        {}
      )
      return {
        ...(state instanceof Error ? {} : state),
        ...submissions,
      }
    }
    case types.QUIZ_SUBMISSIONS_FETCH_FAILURE: {
      return action.payload
    }
    case types.QUIZ_SUBMISSION_COMPLETE_SUCCESS: {
      return {
        ...state,
        [action.meta.attemptNo]: {
          ...action.payload,
        },
      }
    }
    case quizQAActionTypes.QUIZ_QUESTIONS_FETCH:
    case quizQAActionTypes.QUIZ_QUESTIONS_FETCH_FAILURE:
    case quizQAActionTypes.QUIZ_QUESTIONS_FETCH_SUCCESS:
    case quizQAActionTypes.QUIZ_SUBMISSION_ANSWERS_FETCH:
    case quizQAActionTypes.QUIZ_SUBMISSION_ANSWERS_FETCH_FAILURE:
    case quizQAActionTypes.QUIZ_SUBMISSION_ANSWERS_FETCH_SUCCESS:
    case quizQAActionTypes.QUIZ_QUESTION_FLAG:
    case quizQAActionTypes.QUIZ_QUESTION_UNFLAG:
    case quizQAActionTypes.QUIZ_QUESTION_UPDATE_ANSWER:
      return !state || state instanceof Error
        ? state
        : {
            ...state,
            [action.meta.attemptNo]: {
              ...state[action.meta.attemptNo]!,
              ...quizQAReducer(
                pick(state[action.meta.attemptNo]!, ['answers', 'questions']),
                action
              ),
            },
          }
    default:
      return state
  }
}

export default quizSubmissionsReducer
