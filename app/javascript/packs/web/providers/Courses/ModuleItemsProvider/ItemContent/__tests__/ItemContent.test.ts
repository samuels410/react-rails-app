import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import {
  getItemContentMiddleware,
  getItemContentAPI,
} from '../ItemContent.middlewares'
import itemContentReducer from '../ItemContent.reducer'
import {
  fetchItemContent,
  fetchItemContentCancel,
} from '../ItemContent.actions'

describe('CoursesItemContent/Redux', () => {
  const itemId = 21
  const url = 'abcd.efgh.com'
  const mockData = {
    title: 'Hello World',
  }

  test('Fetches course item content successfully', async () => {
    const { storeState } = await expectSaga(getItemContentMiddleware)
      .withReducer(itemContentReducer as any)
      .provide([[matchers.call.fn(getItemContentAPI), mockData]])
      .dispatch(fetchItemContent({ url }, { itemId }))
      .run()

    expect(storeState).toMatchObject({
      data: {
        byId: {
          [itemId]: {
            itemContent: mockData,
          },
        },
      },
    })
  })

  test('Able to handle any error', async () => {
    const error = new Error('error')
    const { storeState } = await expectSaga(getItemContentMiddleware)
      .withReducer(itemContentReducer as any)
      .provide([[matchers.call.fn(getItemContentAPI), throwError(error)]])
      .dispatch(fetchItemContent({ url }, { itemId }))
      .run()

    expect(storeState).toMatchObject({
      data: {
        byId: {
          [itemId]: {
            itemContent: error,
          },
        },
      },
    })
  })

  test('Dispatching cancel action resets state to initial state', async () => {
    const { storeState } = await expectSaga(getItemContentMiddleware)
      .withReducer(itemContentReducer as any, {
        data: {
          byId: {
            [itemId]: {},
          },
        },
      })
      .dispatch(fetchItemContent({ url }, { itemId }))
      .dispatch(fetchItemContentCancel({ url }, { itemId }))
      .run()

    expect(storeState.data.byId[itemId].itemContent).not.toBeDefined()
  })
})
