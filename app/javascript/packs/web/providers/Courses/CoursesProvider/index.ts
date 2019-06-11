import coursesMiddleware from './Courses.middlewares'
import coursesReducer, { CoursesState } from './Courses.reducer'
import {
  fetchCourseDetails,
  fetchCourseDetailsCancel,
  fetchCourseList,
  fetchCourseListCancel,
} from './Courses.actions'

export type CoursesState = CoursesState
export {
  coursesMiddleware,
  coursesReducer,
  /** ACTIONS */
  fetchCourseDetails,
  fetchCourseDetailsCancel,
  fetchCourseList,
  fetchCourseListCancel,
}
