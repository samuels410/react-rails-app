import recordingsMiddleware from './Recordings.middlewares'
import recordingsReducer, { RecordingsState } from './Recordings.reducer'
import { fetchRecordings, fetchRecordingsCancel } from './Recordings.actions'

export type RecordingsState = RecordingsState

export {
  recordingsMiddleware,
  recordingsReducer,
  fetchRecordings,
  fetchRecordingsCancel,
}
