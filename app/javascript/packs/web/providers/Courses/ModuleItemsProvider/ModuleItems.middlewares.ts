import { takeEvery, put, call, cancelled } from 'redux-saga/effects'
import {
  fetchModuleItemsSuccess,
  fetchModuleItemsFailure,
  fetchModuleItems,
} from './ModuleItems.actions'
import {
  MODULE_ITEMS_FETCH,
  MODULE_ITEMS_FETCH_CANCEL,
} from './ModuleItems.types'
import { cancelable, stringify } from '../../../../common/utils'
import { itemContentMiddleware } from './ItemContent'
import { quizSubmissionsMiddleware } from './Quiz/QuizSubmissionsProvider'

export async function getModuleItemsAPI(
  action: ReturnType<typeof fetchModuleItems>,
  signal: AbortSignal
) {
  const { moduleId, courseId } = action.meta
  const params = stringify({
    access_token: process.env.REACT_APP_API_ACCESS_TOKEN,
    ...action.payload,
  })
  const response = await fetch(
    `${
      process.env.REACT_APP_API_URL_1
    }v1/courses/${courseId}/modules/${moduleId}/items?${params}`,
    { signal }
  )
  const responseBody = await response.json()
  return responseBody
}

function* getModuleItemsHandler(action: ReturnType<typeof fetchModuleItems>) {
  const abortController = new AbortController()
  try {
    const data = yield call(getModuleItemsAPI, action, abortController.signal)
    yield put(fetchModuleItemsSuccess(data, action.meta))
  } catch (e) {
    yield put(fetchModuleItemsFailure(e, action.meta))
  } finally {
    if (cancelled()) {
      abortController.abort()
    }
  }
}

export function* getModuleItemsMiddleware() {
  yield takeEvery(
    MODULE_ITEMS_FETCH,
    cancelable(getModuleItemsHandler, MODULE_ITEMS_FETCH_CANCEL)
  )
}

export default ([] as any).concat(
  getModuleItemsMiddleware(),
  ...itemContentMiddleware,
  ...quizSubmissionsMiddleware
)
