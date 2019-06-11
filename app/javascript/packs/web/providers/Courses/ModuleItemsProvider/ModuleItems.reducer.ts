import { Reducer } from 'redux'
import {
  ItemID,
  ModuleID,
  ModuleItemData,
  QuizModuleItemData,
} from '../../../../common/types'
import {
  ModuleItemsActionTypes,
  fetchModuleItemsSuccess,
} from './ModuleItems.actions'
import {
  MODULE_ITEMS_FETCH,
  MODULE_ITEMS_BULK_INSERT,
  MODULE_ITEMS_FETCH_CANCEL,
  MODULE_ITEMS_FETCH_FAILURE,
  MODULE_ITEMS_FETCH_SUCCESS,
} from './ModuleItems.types'
import {
  ITEM_CONTENT_FETCH_FAILURE,
  ITEM_CONTENT_FETCH_SUCCESS,
  itemContentReducer,
  ItemContentActionTypes,
} from './ItemContent'
import {
  QuizSubmissionsActionTypes,
  quizSubmissionTypes,
} from './Quiz/QuizSubmissionsProvider'
import { QuizQAActionTypes, quizQAActionTypes } from './Quiz/QuizQAProvider'
import {
  quizActivityReducer,
  quizActivityTypes,
} from './Quiz/QuizActivityProvider'
import { pick } from '../../../../common/utils'
import { QuizActivityActionTypes } from './Quiz/QuizActivityProvider/QuizActivity.actions'

interface ModuleItemDataByID {
  byId: { [s in ItemID]?: ModuleItemData }
}

export interface ModuleItemsState {
  data: ModuleItemDataByID
  byModule: {
    [s in ModuleID]?: {
      data: ItemID[] | null
      count: number
      loading: boolean
      error: false | Error
    }
  }
}

function addDummyData(item: ModuleItemData): ModuleItemData {
  switch (item.type) {
    case 'Assignment': {
      const isCompleted = Math.random() < 0.5
      return {
        ...item,
        isCompleted,
        ...(!isCompleted
          ? {
              content_details: {
                locked_for_user: false,
                due_at: new Date(
                  new Date().getTime() * Math.random() * 2
                ).toUTCString(),
                ...item.content_details,
              },
            }
          : { score: Math.trunc(Math.random() * 100), total: 100 }),
      }
    }
    case 'Discussion': {
      const isCompleted = Math.random() < 0.5
      return {
        ...item,
        isCompleted,
        ...(!isCompleted
          ? {
              content_details: {
                due_at: new Date(
                  new Date().getTime() * Math.random() * 2
                ).toUTCString(),
                ...item.content_details,
              },
            }
          : { score: Math.trunc(Math.random() * 100), total: 100 }),
      }
    }
    case 'Page': {
      return {
        ...item,
        videoWatchedLength: Math.trunc(Math.random() * 100),
        videoLength: 100,
      }
    }
    case 'Quiz': {
      const isCompleted = Math.random() < 0.5
      return {
        ...item,
        isCompleted,
        ...(!isCompleted
          ? {
              content_details: {
                due_at: new Date(
                  new Date().getTime() * Math.random() * 2
                ).toUTCString(),
                ...item.content_details,
              },
            }
          : { score: Math.trunc(Math.random() * 100), total: 100 }),
      }
    }
    default:
      return item
  }
}

const initialStateModuleItems: ModuleItemsState = {
  data: {
    byId: {},
  },
  byModule: {},
}
const initialModuleAPIData: ModuleItemsState['byModule']['x'] = {
  data: null,
  count: 0,
  loading: false,
  error: false,
}

function getNormalizedData(
  state: ModuleItemsState,
  action: Pick<ReturnType<typeof fetchModuleItemsSuccess>, 'meta' | 'payload'>
) {
  const moduleAPIData = state.byModule[action.meta.moduleId]
  const moduleItemsList: ItemID[] =
    moduleAPIData && Array.isArray(moduleAPIData.data) ? moduleAPIData.data : []

  const moduleItemsMap = action.payload.reduce(
    (
      accumulator: { [s in ModuleID]: ModuleItemData },
      item: ModuleItemData
    ) => {
      accumulator[item.id] = addDummyData(item)
      moduleItemsList.push(item.id)
      return accumulator
    },
    {}
  )

  const uniqueModuleItemsList = [...new Set(moduleItemsList)]
  return {
    data: moduleItemsMap,
    list: uniqueModuleItemsList,
  }
}

const moduleItemsReducer: Reducer<
  ModuleItemsState,
  | ModuleItemsActionTypes
  | ItemContentActionTypes
  | QuizSubmissionsActionTypes
  | QuizQAActionTypes
  | QuizActivityActionTypes
> = (state = initialStateModuleItems, action): ModuleItemsState => {
  switch (action.type) {
    case MODULE_ITEMS_FETCH: {
      const moduleAPIData =
        state.byModule[action.meta.moduleId] || initialModuleAPIData
      return {
        ...state,
        byModule: {
          ...state.byModule,
          [action.meta.moduleId]: {
            ...moduleAPIData,
            loading: true,
            error: false,
          },
        },
      }
    }
    case MODULE_ITEMS_FETCH_FAILURE: {
      const moduleAPIData =
        state.byModule[action.meta.moduleId] || initialModuleAPIData
      return {
        ...state,
        byModule: {
          ...state.byModule,
          [action.meta.moduleId]: {
            ...moduleAPIData,
            loading: false,
            error: action.payload,
          },
        },
      }
    }
    case MODULE_ITEMS_FETCH_SUCCESS: {
      const res = getNormalizedData(state, action)

      const moduleAPIData =
        state.byModule[action.meta.moduleId] || initialModuleAPIData
      return {
        ...state,
        data: {
          ...state.data,
          byId: {
            ...state.data.byId,
            ...res.data,
          },
        },
        byModule: {
          ...state.byModule,
          [action.meta.moduleId]: {
            ...moduleAPIData,
            data: res.list,
            loading: false,
            error: false,
          },
        },
      }
    }
    case MODULE_ITEMS_FETCH_CANCEL: {
      const moduleAPIData =
        state.byModule[action.meta.moduleId] || initialModuleAPIData
      return {
        ...state,
        byModule: {
          ...state.byModule,
          [action.meta.moduleId]: {
            ...moduleAPIData,
            data: moduleAPIData.data,
            error: false,
            loading: false,
          },
        },
      }
    }
    case MODULE_ITEMS_BULK_INSERT: {
      let byId = {}
      let byModule = {}
      Object.entries(action.payload).forEach(([moduleId, moduleObj]) => {
        const res = getNormalizedData(state, {
          payload: moduleObj.items,
          meta: { moduleId },
        })
        byId = {
          ...byId,
          ...res.data,
        }
        byModule = {
          ...byModule,
          [moduleId]: {
            data: res.list,
            count: moduleObj.count,
            loading: false,
            error: false,
          },
        }
      })
      return {
        ...state,
        data: {
          ...state.data,
          byId: {
            ...state.data.byId,
            ...byId,
          },
        },
        byModule: {
          ...state.byModule,
          ...byModule,
        },
      }
    }
    case ITEM_CONTENT_FETCH_FAILURE:
    case ITEM_CONTENT_FETCH_SUCCESS:
      return itemContentReducer(state, action)

    /**
     *
     * QUIZ
     *
     */
    case quizSubmissionTypes.QUIZ_SUBMISSIONS_FETCH:
    case quizSubmissionTypes.QUIZ_SUBMISSIONS_FETCH_SUCCESS:
    case quizSubmissionTypes.QUIZ_SUBMISSIONS_FETCH_FAILURE:
    case quizSubmissionTypes.QUIZ_SUBMISSIONS_FETCH_CANCEL:
    case quizSubmissionTypes.QUIZ_SUBMISSION_START:
    case quizSubmissionTypes.QUIZ_SUBMISSION_START_SUCCESS:
    case quizSubmissionTypes.QUIZ_SUBMISSION_START_FAILURE:
    case quizSubmissionTypes.QUIZ_SUBMISSION_COMPLETE:
    case quizSubmissionTypes.QUIZ_SUBMISSION_COMPLETE_SUCCESS:
    case quizSubmissionTypes.QUIZ_SUBMISSION_COMPLETE_FAILURE:
    case quizQAActionTypes.QUIZ_QUESTIONS_FETCH:
    case quizQAActionTypes.QUIZ_QUESTIONS_FETCH_SUCCESS:
    case quizQAActionTypes.QUIZ_QUESTIONS_FETCH_FAILURE:
    case quizQAActionTypes.QUIZ_QUESTION_FLAG:
    case quizQAActionTypes.QUIZ_QUESTION_UNFLAG:
    case quizQAActionTypes.QUIZ_QUESTION_UPDATE_ANSWER:
    case quizActivityTypes.QUIZ_UPDATE_ACTIVE_QUESTION: {
      return {
        ...state,
        data: {
          ...state.data,
          byId: {
            ...state.data.byId,
            [action.meta.itemId]: <QuizModuleItemData>{
              ...state.data.byId[action.meta.itemId]!,
              itemActivity: quizActivityReducer(
                pick(
                  (state.data.byId[action.meta.itemId] as QuizModuleItemData)
                    .itemActivity || { activeAttempt: null, submissions: null },
                  ['activeAttempt', 'submissions']
                ),
                action
              ),
            },
          },
        },
      }
    }
    default:
      return state
  }
}

export default moduleItemsReducer
