import { Reducer } from 'redux'
import {
  ITEM_CONTENT_FETCH_SUCCESS,
  ITEM_CONTENT_FETCH_FAILURE,
} from './ItemContent.types'
import { ItemContentActionTypes } from './ItemContent.actions'
import { ModuleItemsState } from '../ModuleItems.reducer'
import { ModuleItemData } from '../../../../../common/types'

const initialState: ModuleItemsState = {
  data: { byId: {} },
  byModule: {},
}

const initialItemState = {}

const itemContentReducer: Reducer<ModuleItemsState, ItemContentActionTypes> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ITEM_CONTENT_FETCH_SUCCESS: {
      const data = (state.data.byId[action.meta.itemId] ||
        initialItemState) as ModuleItemData
      return {
        ...state,
        data: {
          ...state.data,
          byId: {
            ...state.data.byId,
            [action.meta.itemId]: {
              ...data,
              itemContent: action.payload,
            },
          },
        },
      }
    }
    case ITEM_CONTENT_FETCH_FAILURE: {
      const data = (state.data.byId[action.meta.itemId] ||
        initialItemState) as ModuleItemData
      return {
        ...state,
        data: {
          ...state.data,
          byId: {
            ...state.data.byId,
            [action.meta.itemId]: {
              ...data,
              itemContent: action.payload,
            },
          },
        },
      }
    }
    default:
      return state
  }
}

export default itemContentReducer
