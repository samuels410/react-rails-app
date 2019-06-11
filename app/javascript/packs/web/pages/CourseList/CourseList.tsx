import React from 'react'
import Courses from '../../containers/Courses'
import ErrorBoundary from '../../components/Utils/ErrorBoundary'

const CourseList = () => (
  <ErrorBoundary>
    <Courses />
  </ErrorBoundary>
)

export default CourseList
