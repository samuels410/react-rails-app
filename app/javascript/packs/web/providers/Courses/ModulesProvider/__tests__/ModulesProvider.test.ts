import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { combineReducers } from 'redux'
import { getModulesMiddleware, getModulesAPI } from '../Modules.middlewares'
import modulesReducer from '../Modules.reducer'
import { fetchModules, fetchModulesCancel } from '../Modules.actions'
import {
  moduleItemsBulkInsert,
  moduleItemsReducer,
} from '../../ModuleItemsProvider'

describe('Courses/ModulesProvider', () => {
  const mockData = [
    {
      id: 21,
      name: 'Module 1',
      items_count: 20,
      items: [
        {
          id: 123,
          title: 'Introduction to Python',
          type: 'Video',
          videoWatchedLength: 12,
          videoLength: 40,
        },
        {
          id: 124,
          title: 'Introduction to Python - 2',
          type: 'Video',
          videoWatchedLength: 23,
          videoLength: 25,
        },
      ],
    },
    {
      id: 22,
      name: 'Module 2',
      items_count: 12,
      items: [
        {
          id: 125,
          title: 'Introduction to JavaScript',
          type: 'Video',
          videoWatchedLength: 12,
          videoLength: 40,
        },
        {
          id: 126,
          title: 'Introduction to JavaScript - 2',
          type: 'Video',
          videoWatchedLength: 23,
          videoLength: 25,
        },
      ],
    },
  ]

  test('Fetches course modules data successfully', async () => {
    const courseContentReducer = combineReducers({
      modules: modulesReducer,
      moduleItems: moduleItemsReducer,
    })
    const { storeState } = await expectSaga(getModulesMiddleware)
      .withReducer(courseContentReducer as any)
      .put(
        moduleItemsBulkInsert({
          21: {
            count: 20,
            items: [
              {
                id: 123,
                title: 'Introduction to Python',
                type: 'Video',
                videoWatchedLength: 12,
                videoLength: 40,
              },
              {
                id: 124,
                title: 'Introduction to Python - 2',
                type: 'Video',
                videoWatchedLength: 23,
                videoLength: 25,
              },
            ],
          },
          22: {
            count: 12,
            items: [
              {
                id: 125,
                title: 'Introduction to JavaScript',
                type: 'Video',
                videoWatchedLength: 12,
                videoLength: 40,
              },
              {
                id: 126,
                title: 'Introduction to JavaScript - 2',
                type: 'Video',
                videoWatchedLength: 23,
                videoLength: 25,
              },
            ],
          },
        })
      )
      .provide([[matchers.call.fn(getModulesAPI), mockData]])
      .dispatch(fetchModules({ courseId: 12 }, { courseId: 12 }))
      .run()

    expect(storeState).toMatchObject({
      modules: {
        data: {
          byId: {
            21: expect.any(Object),
            22: expect.any(Object),
          },
        },
        byCourse: {
          12: { data: [21, 22], loading: false, error: false },
        },
      },
      moduleItems: {
        data: {
          byId: {
            123: expect.any(Object),
            124: expect.any(Object),
            125: expect.any(Object),
            126: expect.any(Object),
          },
        },
        byModule: {
          21: {
            data: [123, 124],
            loading: false,
            error: false,
          },
          22: {
            data: [125, 126],
            loading: false,
            error: false,
          },
        },
      },
    })
  })

  test('Able to handle any error', async () => {
    const error = new Error('error')
    const { storeState } = await expectSaga(getModulesMiddleware)
      .withReducer(modulesReducer as any)
      .provide([[matchers.call.fn(getModulesAPI), throwError(error)]])
      .dispatch(fetchModules({ courseId: 12 }, { courseId: 12 }))
      .run()

    expect(storeState).toMatchObject({
      byCourse: { 12: { loading: false, error } },
    })
  })

  test('Dispatching cancel action resets state to initial state', async () => {
    const { storeState } = await expectSaga(getModulesMiddleware)
      .withReducer(modulesReducer as any)
      .dispatch(fetchModules({ courseId: 12 }, { courseId: 12 }))
      .dispatch(fetchModulesCancel({ courseId: 12 }, { courseId: 12 }))
      .run()

    expect(storeState).toMatchObject({
      byCourse: { 12: { loading: false } },
    })
  })
})
