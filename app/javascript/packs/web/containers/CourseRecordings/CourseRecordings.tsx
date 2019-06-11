import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Grid } from '@material-ui/core'
import { AppState } from '../../store'
import {
  fetchRecordings as fetchRecordingsAction,
  RecordingsState,
} from '../../providers/Courses/RecordingsProvider'
import CourseRecordingComponent from '../../components/CourseRecording'
import { CourseID } from '../../../common/types'
import AsyncDOM from '../../components/Utils/AsyncDOM'
import Loader from '../../components/Utils/Loader'
import styles from './CourseRecordings.module.css'

interface OwnProps {
  courseId: CourseID
}

interface DispatchProps {
  fetchRecordings: typeof fetchRecordingsAction
}

interface StateProps {
  recordingsData: RecordingsState['data']['byId']
  recordingsAPI: RecordingsState['byCourse']['x']
}

type Props = StateProps & OwnProps & DispatchProps

export const CourseRecordings = (props: Props) => {
  const { recordingsAPI, courseId, fetchRecordings } = props

  useEffect(() => {
    if (
      !recordingsAPI ||
      (recordingsAPI.loading === false && recordingsAPI.data === null)
    ) {
      fetchRecordings({ courseId }, { courseId })
    }
  }, [courseId, recordingsAPI, fetchRecordings])

  if (!recordingsAPI) {
    return null
  }

  return (
    <div className={styles.container}>
      <AsyncDOM data={!!recordingsAPI.data}>
        <AsyncDOM.Loader show={recordingsAPI.loading && !recordingsAPI.data}>
          <Loader />
        </AsyncDOM.Loader>
        <AsyncDOM.Content>
          <Grid container spacing={4}>
            {(recordingsAPI.data || []).map(recordingId =>
              props.recordingsData[recordingId] ? (
                <Grid key={recordingId} item xs={4}>
                  <CourseRecordingComponent
                    recordingId={recordingId}
                    data={props.recordingsData[recordingId]!}
                  />
                </Grid>
              ) : null
            )}
          </Grid>
        </AsyncDOM.Content>
      </AsyncDOM>
    </div>
  )
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
  recordingsData: state.recordings.data.byId,
  recordingsAPI: state.recordings.byCourse[ownProps.courseId],
})

export default connect(
  mapStateToProps,
  { fetchRecordings: fetchRecordingsAction }
)(CourseRecordings)
