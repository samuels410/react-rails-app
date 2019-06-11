import { combineReducers, Reducer } from 'redux'
import {
  quizSubmissionsReducer,
  QuizSubmissionsActionTypes,
  quizSubmissionTypes,
} from '../QuizSubmissionsProvider'
import {
  QuizModuleItemData,
  QuizQuestionData,
} from '../../../../../../common/types'
import * as types from './QuizActivity.types'
import { QuizActivityActionTypes } from './QuizActivity.actions'
import { quizQAActionTypes } from '../QuizQAProvider'
import { QuizQAActionTypes } from '../QuizQAProvider/QuizQA.actions'

type ActiveAttemptState = Exclude<
  QuizModuleItemData['itemActivity'],
  undefined
>['activeAttempt']
const activeAttemptInitialState: ActiveAttemptState = {
  attemptNo: null,
  status: 'starting',
  activeQuestionId: null,
  orderOfQuestions: null,
}

const activeAttemptReducer: Reducer<
  ActiveAttemptState,
  QuizSubmissionsActionTypes | QuizActivityActionTypes | QuizQAActionTypes
> = (state = null, action): ActiveAttemptState => {
  switch (action.type) {
    case quizSubmissionTypes.QUIZ_SUBMISSION_START:
      return {
        ...activeAttemptInitialState,
        ...state,
        status: 'starting',
      }

    case quizSubmissionTypes.QUIZ_SUBMISSION_START_SUCCESS:
      return {
        ...activeAttemptInitialState,
        ...state,
        attemptNo: action.meta.attemptNo,
        status: 'active',
      }

    case quizQAActionTypes.QUIZ_QUESTIONS_FETCH_SUCCESS: {
      const orderOfQuestions = action.payload
        .sort(
          (quesA: QuizQuestionData, quesB: QuizQuestionData) =>
            quesA.position - quesB.position
        )
        .map(i => i.id)
      return {
        ...activeAttemptInitialState,
        ...state,
        activeQuestionId: orderOfQuestions[0],
        orderOfQuestions,
      }
    }

    case quizSubmissionTypes.QUIZ_SUBMISSION_COMPLETE:
      return {
        ...activeAttemptInitialState,
        ...state,
        status: 'submitting',
      }

    case quizSubmissionTypes.QUIZ_SUBMISSION_COMPLETE_SUCCESS:
      return {
        ...activeAttemptInitialState,
        ...state,
        status: 'submitted',
      }

    case types.QUIZ_UPDATE_ACTIVE_QUESTION:
      return {
        ...activeAttemptInitialState,
        ...state,
        activeQuestionId: action.payload.id,
      }

    default:
      return state
  }
}

export default combineReducers<QuizModuleItemData['itemActivity']>({
  activeAttempt: activeAttemptReducer,
  submissions: quizSubmissionsReducer,
})
