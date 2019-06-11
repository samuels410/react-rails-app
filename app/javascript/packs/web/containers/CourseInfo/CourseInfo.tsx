import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Paper } from '@material-ui/core'
import {
  fetchCourseDetails as fetchCourseDetailsAction,
  CoursesState,
} from '../../providers/Courses/CoursesProvider'
import { AppState } from '../../store'
import AsyncDOM from '../../components/Utils/AsyncDOM'
import Loader from '../../components/Utils/Loader'
import CourseInfoComponent from '../../components/CourseInfo'
import styles from './CourseInfo.module.css'

interface OwnProps {
  courseId: number | string
}

interface DispatchProps {
  fetchCourseDetails: typeof fetchCourseDetailsAction
}

interface StateProps {
  courseAPI: CoursesState['byCourse']['x']
  courseData: CoursesState['data']['byId']['x']
}

type Props = OwnProps & DispatchProps & StateProps

export const CourseInfo = (props: Props) => {
  const { courseData, courseAPI, fetchCourseDetails, courseId } = props

  useEffect(() => {
    if (!courseData) {
      fetchCourseDetails({ courseId }, { courseId })
    }
  }, [courseId])

  if (props.courseAPI && props.courseAPI.error instanceof Error) {
    throw new Error('Oops! Unable to get details of this course.')
  }

  return (
    <Paper className={styles.container}>
      <AsyncDOM
        data={!!courseData}
        loading={!!(courseAPI && courseAPI.loading && !courseData)}
        error={!!(courseAPI && courseAPI.error)}
      >
        <AsyncDOM.Loader>
          <Loader />
        </AsyncDOM.Loader>
        <AsyncDOM.Content>
          {courseData ? (
            <CourseInfoComponent data={courseData} courseId={courseId} />
          ) : null}
        </AsyncDOM.Content>
      </AsyncDOM>
    </Paper>
  )
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  courseAPI: state.courses.byCourse[ownProps.courseId],
  courseData: state.courses.data.byId[ownProps.courseId],
})

export default connect(
  mapStateToProps,
  { fetchCourseDetails: fetchCourseDetailsAction }
)(CourseInfo)
