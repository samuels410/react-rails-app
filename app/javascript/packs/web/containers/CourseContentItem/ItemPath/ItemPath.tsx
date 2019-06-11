import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BreadcrumbsNavigation from '../../../components/Utils/BreadCrumbs'
import styles from './ItemPath.module.css'
import { AppState } from '../../../store'
import {
  CoursesState,
  fetchCourseDetails,
} from '../../../providers/Courses/CoursesProvider'
import { CourseID, ItemID } from '../../../../common/types'
import { ModuleItemsState } from '../../../providers/Courses/ModuleItemsProvider'

export interface ItemPathProps {
  fetchCourseDetails: typeof fetchCourseDetails
  courses: CoursesState
  courseId: CourseID
  itemId: ItemID
  moduleItems: ModuleItemsState
}

export const ItemPath = (props: ItemPathProps) => {
  const { courseId, itemId } = props

  const courseDetails = props.courses.data.byId[courseId]
  const itemDetails = props.moduleItems.data.byId[itemId]

  useEffect(() => {
    if (!courseDetails) {
      props.fetchCourseDetails({ courseId }, { courseId })
    }
  }, [])

  const breadCrumbsData = [{ pathName: 'Courses', pathUrl: '/courses' }]
  if (courseDetails) {
    breadCrumbsData.push({
      pathName: courseDetails.course_name,
      pathUrl: `/courses/${courseId}`,
    })
    if (itemDetails) {
      breadCrumbsData.push({ pathName: itemDetails.title, pathUrl: '' })
    }
  }
  return (
    <div className={styles.container}>
      <BreadcrumbsNavigation breadCrumbs={breadCrumbsData} />
    </div>
  )
}

const mapStateToProps = (state: AppState) => ({
  courses: state.courses,
  moduleItems: state.moduleItems,
})

export default connect(
  mapStateToProps,
  { fetchCourseDetails }
)(ItemPath)
