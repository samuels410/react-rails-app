import { takeLatest, put, call, cancelled, all } from 'redux-saga/effects'
import { MODULES_FETCH, MODULES_FETCH_CANCEL } from './Modules.types'
import {
  fetchModulesFailure,
  fetchModulesSuccess,
  fetchModules,
} from './Modules.actions'
import { cancelable, stringify } from '../../../../common/utils'
import {
  moduleItemsBulkInsert,
  BulkModuleItemsInsertParams,
  fetchModuleItems,
} from '../ModuleItemsProvider'
import { ModuleID } from '../../../../common/types'

export async function getModulesAPI(
  action: ReturnType<typeof fetchModules>,
  signal: AbortSignal
) {
  const params = stringify({
    access_token: process.env.REACT_APP_API_ACCESS_TOKEN,
    include: ['items', 'content_details'],
    ...action.payload,
  })

  const { courseId } = action.meta
  const response = await fetch(
    `${
      process.env.REACT_APP_API_URL_1
    }v1/courses/${courseId}/modules?${params}`,
    { signal }
  )
  if (response.ok) {
    const responseBody = await response.json()
    return responseBody
  }
  throw new Error(response.statusText)
}

function* getModulesHandler(action: ReturnType<typeof fetchModules>) {
  const abortController = new AbortController()
  try {
    const data: any[] = yield call(
      getModulesAPI,
      action,
      abortController.signal
    )

    /** Accumulate all module Items grouped by module */
    const moduleItems: BulkModuleItemsInsertParams = data.reduce(
      (accumulator: BulkModuleItemsInsertParams, moduleData: any) => {
        accumulator[moduleData.id] = {
          items: moduleData.items || {},
          count: moduleData.items_count || 0,
        }
        return accumulator
      },
      {}
    )

    /** Delete all module items from moduleData  */
    data.forEach((d, i) => {
      delete data[i].items
    })

    /** Push Module data in Redux state */
    yield put(fetchModulesSuccess(data, action.meta))

    /** Push Module items data in Redux state */
    yield put(moduleItemsBulkInsert(moduleItems))

    /** Aggregate all modules whose module items are not available */
    const moduleItemsMissingList: ModuleID[] = Object.entries(moduleItems)
      .filter(
        ([moduleId, moduleObj]) =>
          (moduleObj.count > 0 && !('items' in moduleObj)) ||
          moduleObj.items.length === 0
      )
      .map(([moduleId]) => moduleId)

    /** Trigger data fetch for modules which have a module items count(>0) but missing in response  */
    yield all(
      moduleItemsMissingList.map(moduleId =>
        put(
          fetchModuleItems(
            { courseId: action.meta.courseId, moduleId },
            { courseId: action.meta.courseId, moduleId }
          )
        )
      )
    )
  } catch (e) {
    yield put(fetchModulesFailure(e, action.meta))
  } finally {
    if (cancelled()) {
      abortController.abort()
    }
  }
}

export function* getModulesMiddleware() {
  yield takeLatest(
    MODULES_FETCH,
    cancelable(getModulesHandler, MODULES_FETCH_CANCEL)
  )
}

export default ([] as any).concat(getModulesMiddleware())
