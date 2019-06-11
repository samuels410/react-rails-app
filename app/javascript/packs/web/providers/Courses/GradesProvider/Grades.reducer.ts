import { Reducer } from 'redux'
import {
  GRADES_FETCH,
  GRADES_FETCH_CANCEL,
  GRADES_FETCH_FAILURE,
  GRADES_FETCH_SUCCESS,
} from './Grades.types'
import {
  GradedItemData,
  GradedItemID,
  CourseID,
} from '../../../../common/types'
import { GradesActionTypes, fetchGradesSuccess } from './Grades.actions'

export interface GradesState {
  data: {
    byId: { [key in GradedItemID]?: GradedItemData }
  }
  byCourse: {
    [key in CourseID]?: {
      data: GradedItemID[] | null
      loading: boolean
      error: false | Error
    }
  }
}

const addDummyData = (item: GradedItemData): GradedItemData => {
  return {
    created_at: `2019-01-${Math.trunc(Math.random() * 31)}`,
    id: Math.trunc(Math.random() * 1000),
    score: Math.trunc(Math.random() * 100),
    total: 100,
    name: `Assignment: ${Math.trunc(Math.random() * 1000)}`,
    ...item,
  }
}

function getNormalizedData(
  state: GradesState,
  action: ReturnType<typeof fetchGradesSuccess>
) {
  const courseRecordingsAPI = state.byCourse[action.payload.courseId]
  let gradedItemsList: GradedItemID[] =
    courseRecordingsAPI && Array.isArray(courseRecordingsAPI.data)
      ? courseRecordingsAPI.data.slice()
      : []

  const moduleMap = action.payload.reduce(
    (acc: { [s in GradedItemID]: GradedItemData }, item: GradedItemData) => {
      gradedItemsList.push(item.id)
      acc[item.id] = addDummyData(item)
      return acc
    },
    {}
  )

  gradedItemsList = [...new Set(gradedItemsList)]
  return {
    data: moduleMap,
    list: gradedItemsList,
  }
}

const initialAPIState = {
  data: null,
  loading: false,
  error: false as false,
}

const initialState = {
  data: { byId: {} },
  byCourse: {},
}

const GradesReducer: Reducer<GradesState, GradesActionTypes> = (
  state = initialState,
  action
): GradesState => {
  switch (action.type) {
    case GRADES_FETCH: {
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
    case GRADES_FETCH_SUCCESS: {
      const res = getNormalizedData(state, action)
      res.list.sort((a: GradedItemID, b: GradedItemID) =>
        res.data[b] && res.data[a]
          ? new Date(res.data[b].created_at).getTime() -
            new Date(res.data[a].created_at).getTime()
          : 1
      )
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
            ...initialAPIState,
            ...state.byCourse[action.meta.courseId],
            data: res.list,
            loading: false,
            error: false,
          },
        },
      }
    }

    case GRADES_FETCH_FAILURE: {
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
    case GRADES_FETCH_CANCEL: {
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

export default GradesReducer
