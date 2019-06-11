import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import {
  fetchGrades,
  GradesState,
} from '../../providers/Courses/GradesProvider'
import { AppState } from '../../store'
import { CourseID } from '../../../common/types'
import CourseGradesComponent from '../../components/CourseGrades'
import AsyncDOM from '../../components/Utils/AsyncDOM'
import Loader from '../../components/Utils/Loader'
import { pickIntoArray } from '../../../common/utils'
import styles from './CourseGrades.module.css'

interface DispatchProps {
  fetchGrades: typeof fetchGrades
}

interface StateProps {
  courseGradesData: GradesState['data']['byId']
  courseGradesAPI: GradesState['byCourse']['x']
}

interface OwnProps {
  courseId: CourseID
  className?: string
}

type Props = OwnProps & DispatchProps & StateProps

export const CourseGrades = (props: Props) => {
  useEffect(() => {
    if (
      !props.courseGradesAPI ||
      (!props.courseGradesAPI.loading && !props.courseGradesAPI.data)
    ) {
      const { courseId } = props
      props.fetchGrades({ courseId }, { courseId })
    }
  }, [])

  if (!props.courseGradesAPI) {
    return null
  }

  return (
    <div className={cx(styles.container, props.className)}>
      <AsyncDOM data={!!props.courseGradesAPI.data}>
        <AsyncDOM.Loader
          show={props.courseGradesAPI.loading && !props.courseGradesAPI.data}
        >
          <Loader className={styles.loader} />
        </AsyncDOM.Loader>
        <AsyncDOM.Content>
          <CourseGradesComponent
            data={pickIntoArray(
              props.courseGradesData,
              props.courseGradesAPI.data || []
            )}
          />
        </AsyncDOM.Content>
      </AsyncDOM>
    </div>
  )
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
  courseGradesData: state.grades.data.byId,
  courseGradesAPI: state.grades.byCourse[ownProps.courseId],
})

export default connect(
  mapStateToProps,
  { fetchGrades }
)(CourseGrades)
