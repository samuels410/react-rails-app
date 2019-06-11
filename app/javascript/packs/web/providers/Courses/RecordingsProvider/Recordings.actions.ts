import {
  RECORDINGS_FETCH,
  RECORDINGS_FETCH_CANCEL,
  RECORDINGS_FETCH_FAILURE,
  RECORDINGS_FETCH_SUCCESS,
} from './Recordings.types'
import { CourseID } from '../../../../common/types'

interface RecordingsFetchParams {
  courseId: CourseID
}

interface RecordingsMetaParams {
  courseId: CourseID
}

export const fetchRecordings = (
  payload: RecordingsFetchParams,
  meta: RecordingsMetaParams
) => ({
  type: RECORDINGS_FETCH as typeof RECORDINGS_FETCH,
  payload,
  meta,
})

export const fetchRecordingsSuccess = (
  payload: any,
  meta: RecordingsMetaParams
) => ({
  type: RECORDINGS_FETCH_SUCCESS as typeof RECORDINGS_FETCH_SUCCESS,
  payload,
  meta,
})

export const fetchRecordingsFailure = (
  payload: Error,
  meta: RecordingsMetaParams
) => ({
  type: RECORDINGS_FETCH_FAILURE as typeof RECORDINGS_FETCH_FAILURE,
  payload,
  meta,
})

export const fetchRecordingsCancel = (
  payload: RecordingsFetchParams,
  meta: RecordingsMetaParams
) => ({
  type: RECORDINGS_FETCH_CANCEL as typeof RECORDINGS_FETCH_CANCEL,
  payload,
  meta,
})

export type RecordingsActionTypes =
  | ReturnType<typeof fetchRecordings>
  | ReturnType<typeof fetchRecordingsSuccess>
  | ReturnType<typeof fetchRecordingsFailure>
  | ReturnType<typeof fetchRecordingsCancel>
