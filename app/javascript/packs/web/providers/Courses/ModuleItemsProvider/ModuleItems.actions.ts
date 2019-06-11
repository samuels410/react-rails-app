import { CourseID, ModuleID, ModuleItemData } from '../../../../common/types'
import {
  MODULE_ITEMS_BULK_INSERT,
  MODULE_ITEMS_FETCH,
  MODULE_ITEMS_FETCH_CANCEL,
  MODULE_ITEMS_FETCH_FAILURE,
  MODULE_ITEMS_FETCH_SUCCESS,
} from './ModuleItems.types'

export interface ModuleItemsFetchParams {
  courseId: CourseID
  moduleId: ModuleID
  include?: string[]
  page?: number
  per_page?: number
}

export interface ModuleItemMetaParams {
  moduleId: ModuleID
}

export const fetchModuleItems = (
  payload: ModuleItemsFetchParams,
  meta: { courseId: CourseID } & ModuleItemMetaParams
) => ({
  type: MODULE_ITEMS_FETCH as typeof MODULE_ITEMS_FETCH,
  payload,
  meta,
})

export const fetchModuleItemsFailure = (
  payload: Error,
  meta: ModuleItemMetaParams
) => ({
  type: MODULE_ITEMS_FETCH_FAILURE as typeof MODULE_ITEMS_FETCH_FAILURE,
  payload,
  meta,
})

export const fetchModuleItemsSuccess = (
  payload: ModuleItemData[],
  meta: ModuleItemMetaParams
) => ({
  type: MODULE_ITEMS_FETCH_SUCCESS as typeof MODULE_ITEMS_FETCH_SUCCESS,
  payload,
  meta,
})

export const fetchModuleItemsCancel = (
  payload: any,
  meta: ModuleItemMetaParams
) => ({
  type: MODULE_ITEMS_FETCH_CANCEL as typeof MODULE_ITEMS_FETCH_CANCEL,
  payload,
  meta,
})

export type BulkModuleItemsInsertParams = {
  [s in ModuleID]: { items: ModuleItemData[]; count: number }
}

export const moduleItemsBulkInsert = (
  payload: BulkModuleItemsInsertParams
) => ({
  type: MODULE_ITEMS_BULK_INSERT as typeof MODULE_ITEMS_BULK_INSERT,
  payload,
})

export type ModuleItemsActionTypes =
  | ReturnType<typeof fetchModuleItems>
  | ReturnType<typeof fetchModuleItemsSuccess>
  | ReturnType<typeof fetchModuleItemsFailure>
  | ReturnType<typeof fetchModuleItemsCancel>
  | ReturnType<typeof moduleItemsBulkInsert>
