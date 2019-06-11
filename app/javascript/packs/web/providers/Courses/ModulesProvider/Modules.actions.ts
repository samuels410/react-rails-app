import {
  MODULES_FETCH,
  MODULES_FETCH_CANCEL,
  MODULES_FETCH_FAILURE,
  MODULES_FETCH_SUCCESS,
} from './Modules.types'
import { CourseID } from '../../../../common/types'

interface ModulesFetchMetaParams {
  courseId: CourseID
}

export interface ModulesFetchParams {
  courseId: CourseID
}

// Course Modules
export const fetchModules = (
  payload: ModulesFetchParams,
  meta: ModulesFetchMetaParams
) => ({
  type: MODULES_FETCH as typeof MODULES_FETCH,
  payload,
  meta,
})

export const fetchModulesFailure = (
  payload: Error,
  meta: ModulesFetchMetaParams
) => ({
  type: MODULES_FETCH_FAILURE as typeof MODULES_FETCH_FAILURE,
  payload,
  meta,
})

export const fetchModulesSuccess = (
  payload: any,
  meta: ModulesFetchMetaParams
) => ({
  type: MODULES_FETCH_SUCCESS as typeof MODULES_FETCH_SUCCESS,
  payload,
  meta,
})

export const fetchModulesCancel = (
  payload: any,
  meta: ModulesFetchMetaParams
) => ({
  type: MODULES_FETCH_CANCEL as typeof MODULES_FETCH_CANCEL,
  payload,
  meta,
})

export type ModulesActionTypes =
  | ReturnType<typeof fetchModules>
  | ReturnType<typeof fetchModulesSuccess>
  | ReturnType<typeof fetchModulesFailure>
  | ReturnType<typeof fetchModulesCancel>

// Course Module Items
