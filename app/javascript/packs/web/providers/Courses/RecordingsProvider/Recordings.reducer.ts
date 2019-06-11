import { Reducer } from 'redux'
import {
  RECORDINGS_FETCH_SUCCESS,
  RECORDINGS_FETCH,
  RECORDINGS_FETCH_FAILURE,
  RECORDINGS_FETCH_CANCEL,
} from './Recordings.types'
import {
  RecordingsActionTypes,
  fetchRecordingsSuccess,
} from './Recordings.actions'
import {
  CourseRecordingData,
  RecordingID,
  CourseID,
} from '../../../../common/types'

export interface RecordingsState {
  data: {
    byId: { [s in RecordingID]?: CourseRecordingData }
  }
  byCourse: {
    [s in CourseID]?: {
      data: RecordingID[] | null
      loading: boolean
      error: false | Error
    }
  }
}

function getNormalizedData(
  state: RecordingsState,
  action: ReturnType<typeof fetchRecordingsSuccess>
) {
  const RecordingsAPI = state.byCourse[action.payload.courseId]
  let recordingsList: RecordingID[] =
    RecordingsAPI && Array.isArray(RecordingsAPI.data)
      ? RecordingsAPI.data.slice()
      : []

  const moduleMap = action.payload.reduce(
    (
      acc: { [s in RecordingID]: CourseRecordingData },
      item: CourseRecordingData
    ) => {
      recordingsList.push(item.id)
      acc[item.id] = item
      return acc
    },
    {}
  )

  recordingsList = [...new Set(recordingsList)]
  return {
    data: moduleMap,
    list: recordingsList,
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

const RecordingsReducer: Reducer<RecordingsState, RecordingsActionTypes> = (
  state = initialState,
  action
): RecordingsState => {
  switch (action.type) {
    case RECORDINGS_FETCH: {
      return {
        ...state,
        byCourse: {
          ...state.byCourse,
          [action.meta.courseId]: {
            ...initialAPIState,
            ...state.byCourse[action.meta.courseId],
            loading: true,
            error: false,
          },
        },
      }
    }
    case RECORDINGS_FETCH_SUCCESS: {
      const res = getNormalizedData(state, action)
      res.list.sort(
        (a: RecordingID, b: RecordingID) =>
          res.data[b].createdAt - res.data[a].createdAt
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
    case RECORDINGS_FETCH_FAILURE: {
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
    case RECORDINGS_FETCH_CANCEL: {
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

export default RecordingsReducer
