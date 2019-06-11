import { takeEvery, put, call, cancelled } from 'redux-saga/effects'
import { stringify } from 'query-string'
import {
  ITEM_CONTENT_FETCH,
  ITEM_CONTENT_FETCH_CANCEL,
} from './ItemContent.types'
import { cancelable } from '../../../../../common/utils'
import {
  fetchItemContent,
  fetchItemContentSuccess,
  fetchItemContentFailure,
} from './ItemContent.actions'

export async function getItemContentAPI(
  action: ReturnType<typeof fetchItemContent>,
  signal: AbortSignal
) {
  const { url, ...queryParams } = action.payload
  const params = stringify({
    access_token: process.env.REACT_APP_API_ACCESS_TOKEN,
    ...queryParams,
  })
  const response = await fetch(`${url}?${params}`, { signal })
  if (response.ok) {
    const responseBody = await response.json()
    return responseBody
  }
  throw new Error('Unable to fetch course item details')
}

function* getItemContentHandler(action: ReturnType<typeof fetchItemContent>) {
  const abortController = new AbortController()
  try {
    const data = yield call(getItemContentAPI, action, abortController.signal)
    yield put(fetchItemContentSuccess(data, action.meta))
  } catch (e) {
    yield put(fetchItemContentFailure(e, action.meta))
  } finally {
    if (cancelled()) {
      abortController.abort()
    }
  }
}

export function* getItemContentMiddleware() {
  yield takeEvery(
    ITEM_CONTENT_FETCH,
    cancelable(getItemContentHandler, ITEM_CONTENT_FETCH_CANCEL)
  )
}

export default ([] as any).concat(getItemContentMiddleware())
