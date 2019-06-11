import moduleItemsMiddleware from './ModuleItems.middlewares'
import moduleItemsReducer, { ModuleItemsState } from './ModuleItems.reducer'
import {
  fetchModuleItems,
  fetchModuleItemsCancel,
  moduleItemsBulkInsert,
  BulkModuleItemsInsertParams,
} from './ModuleItems.actions'
import { fetchItemContent, fetchItemContentCancel } from './ItemContent'

export type ModuleItemsState = ModuleItemsState
export type BulkModuleItemsInsertParams = BulkModuleItemsInsertParams

export {
  moduleItemsMiddleware,
  moduleItemsReducer,
  /** ACTION CREATORS */
  fetchItemContent,
  fetchItemContentCancel,
  fetchModuleItems,
  fetchModuleItemsCancel,
  moduleItemsBulkInsert,
}
