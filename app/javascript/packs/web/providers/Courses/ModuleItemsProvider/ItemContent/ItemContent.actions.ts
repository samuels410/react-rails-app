import { ItemID } from '../../../../../common/types'
import {
  ITEM_CONTENT_FETCH,
  ITEM_CONTENT_FETCH_CANCEL,
  ITEM_CONTENT_FETCH_FAILURE,
  ITEM_CONTENT_FETCH_SUCCESS,
} from './ItemContent.types'

export interface ItemContentFetchParams {
  url: string
}

export interface ItemContentMetaParams {
  itemId: ItemID
}

export const fetchItemContent = (
  payload: ItemContentFetchParams,
  meta: ItemContentMetaParams
) => ({
  type: ITEM_CONTENT_FETCH as typeof ITEM_CONTENT_FETCH,
  payload,
  meta,
})

export const fetchItemContentFailure = (
  payload: Error,
  meta: ItemContentMetaParams
) => ({
  type: ITEM_CONTENT_FETCH_FAILURE as typeof ITEM_CONTENT_FETCH_FAILURE,
  payload,
  meta,
})

export const fetchItemContentSuccess = (
  payload: any,
  meta: ItemContentMetaParams
) => ({
  type: ITEM_CONTENT_FETCH_SUCCESS as typeof ITEM_CONTENT_FETCH_SUCCESS,
  payload,
  meta,
})

export const fetchItemContentCancel = (
  payload: any,
  meta: ItemContentMetaParams
) => ({
  type: ITEM_CONTENT_FETCH_CANCEL as typeof ITEM_CONTENT_FETCH_CANCEL,
  payload,
  meta,
})

export type ItemContentActionTypes =
  | ReturnType<typeof fetchItemContent>
  | ReturnType<typeof fetchItemContentSuccess>
  | ReturnType<typeof fetchItemContentFailure>
  | ReturnType<typeof fetchItemContentCancel>
