import {
  GRADES_FETCH,
  GRADES_FETCH_CANCEL,
  GRADES_FETCH_FAILURE,
  GRADES_FETCH_SUCCESS,
} from './Grades.types'
import { CourseID } from '../../../../common/types'

interface GradesFetchParams {
  courseId: CourseID
}

interface GradesMetaParams {
  courseId: CourseID
}

export const fetchGrades = (
  payload: GradesFetchParams,
  meta: GradesMetaParams
) => ({
  type: GRADES_FETCH as typeof GRADES_FETCH,
  payload,
  meta,
})

export const fetchGradesSuccess = (payload: any, meta: GradesMetaParams) => ({
  type: GRADES_FETCH_SUCCESS as typeof GRADES_FETCH_SUCCESS,
  payload,
  meta,
})

export const fetchGradesFailure = (payload: Error, meta: GradesMetaParams) => ({
  type: GRADES_FETCH_FAILURE as typeof GRADES_FETCH_FAILURE,
  payload,
  meta,
})

export const fetchGradesCancel = (payload: any, meta: GradesMetaParams) => ({
  type: GRADES_FETCH_CANCEL as typeof GRADES_FETCH_CANCEL,
  payload,
  meta,
})

export type GradesActionTypes =
  | ReturnType<typeof fetchGrades>
  | ReturnType<typeof fetchGradesSuccess>
  | ReturnType<typeof fetchGradesFailure>
  | ReturnType<typeof fetchGradesCancel>
