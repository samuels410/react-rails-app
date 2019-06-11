import { Reducer } from 'redux'
import {
  MODULES_FETCH,
  MODULES_FETCH_CANCEL,
  MODULES_FETCH_FAILURE,
  MODULES_FETCH_SUCCESS,
} from './Modules.types'
import { ModulesActionTypes, fetchModulesSuccess } from './Modules.actions'
import { ModuleID, CourseID, ModuleData } from '../../../../common/types'

// Course Modules

interface ModuleDataByID {
  byId: { [s in ModuleID]?: ModuleData }
}

export interface ModulesState {
  data: ModuleDataByID
  byCourse: {
    [s in CourseID]?: {
      data: ModuleID[] | null
      loading: boolean
      error: false | Error
    }
  }
}

const initialStateModules: ModulesState = {
  data: { byId: {} },
  byCourse: {},
}

function getNormalizedData(
  state: ModulesState,
  action: ReturnType<typeof fetchModulesSuccess>
) {
  const Modules = state.byCourse[action.meta.courseId]
  const modulesList: ModuleID[] =
    Modules && Modules.data ? Modules.data.slice() : []
  const moduleMap = action.payload.reduce(
    (acc: { [s in ModuleID]: ModuleData }, item: ModuleData) => {
      modulesList.push(item.id)
      acc[item.id] = item
      return acc
    },
    {}
  )

  const uniqueModulesList = [...new Set(modulesList)]
  return {
    data: moduleMap,
    list: uniqueModulesList,
  }
}

const initialAPIState = {
  data: null,
  loading: false,
  error: false as false,
}

const ModulesReducer: Reducer<ModulesState, ModulesActionTypes> = (
  state = initialStateModules,
  action
): ModulesState => {
  switch (action.type) {
    case MODULES_FETCH: {
      return {
        ...state,
        byCourse: {
          ...state.byCourse,
          [action.meta.courseId]: {
            ...initialAPIState,
            ...state.byCourse[action.meta.courseId],
            loading: true,
          },
        },
      }
    }
    case MODULES_FETCH_FAILURE: {
      return {
        ...state,
        byCourse: {
          ...state.byCourse,
          [action.meta.courseId]: {
            ...initialAPIState,
            ...state.byCourse[action.meta.courseId],
            loading: false,
            error: action.payload,
          },
        },
      }
    }
    case MODULES_FETCH_SUCCESS: {
      const res = getNormalizedData(state, action)
      return {
        ...state,
        data: {
          ...state.data,
          byId: {
            ...state.data.byId,
            ...res.data,
          },
        },
        byCourse: {
          ...state.byCourse,
          [action.meta.courseId]: {
            ...state.byCourse[action.meta.courseId],
            data: res.list,
            loading: false,
            error: false,
          },
        },
      }
    }
    case MODULES_FETCH_CANCEL: {
      return {
        ...state,
        byCourse: {
          ...state.byCourse,
          [action.meta.courseId]: {
            ...initialAPIState,
            ...state.byCourse[action.meta.courseId],
            loading: false,
          },
        },
      }
    }
    default:
      return state
  }
}
export default ModulesReducer
