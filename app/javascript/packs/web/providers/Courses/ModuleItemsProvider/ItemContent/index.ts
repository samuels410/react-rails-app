import itemContentMiddleware from './ItemContent.middlewares'
import itemContentReducer from './ItemContent.reducer'
import {
  fetchItemContent,
  fetchItemContentCancel,
  ItemContentActionTypes,
} from './ItemContent.actions'
import {
  ITEM_CONTENT_FETCH,
  ITEM_CONTENT_FETCH_CANCEL,
  ITEM_CONTENT_FETCH_FAILURE,
  ITEM_CONTENT_FETCH_SUCCESS,
} from './ItemContent.types'

export type ItemContentActionTypes = ItemContentActionTypes

export {
  itemContentMiddleware,
  itemContentReducer,
  /** Actions */
  fetchItemContent,
  fetchItemContentCancel,
  /** Action Types */
  ITEM_CONTENT_FETCH,
  ITEM_CONTENT_FETCH_CANCEL,
  ITEM_CONTENT_FETCH_FAILURE,
  ITEM_CONTENT_FETCH_SUCCESS,
}
