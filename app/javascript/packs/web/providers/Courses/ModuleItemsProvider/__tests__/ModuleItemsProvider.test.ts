import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import {
  getModuleItemsMiddleware,
  getModuleItemsAPI,
} from '../ModuleItems.middlewares'
import ModuleItemsReducer from '../ModuleItems.reducer'
import {
  fetchModuleItems,
  fetchModuleItemsCancel,
} from '../ModuleItems.actions'

describe('Courses/ModuleItemsProvider', () => {
  const courseId = 12
  const moduleId = 13
  const mockData = [
    {
      date: '2019-01-12',
      id: 21,
      score: 12,
      total: 100,
      title: 'Assignment: 3',
    },
    {
      date: '2019-01-10',
      id: 20,
      score: 45,
      total: 100,
      title: 'Assignment: 2',
    },
    {
      date: '2019-01-14',
      id: 24,
      score: 52,
      total: 100,
      title: 'Assignment: 3',
    },
    {
      date: '2019-01-02',
      id: 2,
      score: 62,
      total: 100,
      title: 'Assignment: 1',
    },
  ]

  test('Fetches modules grades data successfully', async () => {
    const { storeState } = await expectSaga(getModuleItemsMiddleware)
      .withReducer(ModuleItemsReducer as any)
      .provide([[matchers.call.fn(getModuleItemsAPI), mockData]])
      .dispatch(
        fetchModuleItems({ courseId, moduleId }, { courseId, moduleId })
      )
      .run()

    expect(storeState).toMatchObject({
      data: {
        byId: {
          2: expect.any(Object),
          20: expect.any(Object),
          21: expect.any(Object),
          24: expect.any(Object),
        },
      },
      byModule: {
        [moduleId]: { data: [21, 20, 24, 2], loading: false, error: false },
      },
    })
  })

  test('Able to handle any error', async () => {
    const error = new Error('error')
    const { storeState } = await expectSaga(getModuleItemsMiddleware)
      .withReducer(ModuleItemsReducer as any)
      .provide([[matchers.call.fn(getModuleItemsAPI), throwError(error)]])
      .dispatch(
        fetchModuleItems({ courseId, moduleId }, { courseId, moduleId })
      )
      .run()

    expect(storeState).toMatchObject({
      byModule: { [moduleId]: { loading: false, error } },
    })
  })

  test('Dispatching cancel action resets state to initial state', async () => {
    const { storeState } = await expectSaga(getModuleItemsMiddleware)
      .withReducer(ModuleItemsReducer as any)
      .dispatch(
        fetchModuleItems({ courseId, moduleId }, { courseId, moduleId })
      )
      .dispatch(fetchModuleItemsCancel({ courseId, moduleId }, { moduleId }))
      .run()

    expect(storeState).toMatchObject({
      byModule: { [moduleId]: { loading: false } },
    })
  })
})
