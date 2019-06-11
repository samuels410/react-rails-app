import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { getGradesMiddleware, getGradesAPI } from '../Grades.middlewares'
import getGradesReducer from '../Grades.reducer'
import { fetchGrades, fetchGradesCancel } from '../Grades.actions'

describe('Courses/GradesProvider', () => {
  const mockData = [
    {
      created_at: '2019-01-12',
      id: 21,
      score: 12,
      total: 100,
      title: 'Assignment: 3',
    },
    {
      created_at: '2019-01-10',
      id: 20,
      score: 45,
      total: 100,
      title: 'Assignment: 2',
    },
    {
      created_at: '2019-01-14',
      id: 24,
      score: 52,
      total: 100,
      title: 'Assignment: 3',
    },
    {
      created_at: '2019-01-02',
      id: 2,
      score: 62,
      total: 100,
      title: 'Assignment: 1',
    },
  ]

  test('Fetches course grades data successfully', async () => {
    const { storeState } = await expectSaga(getGradesMiddleware)
      .withReducer(getGradesReducer as any)
      .provide([[matchers.call.fn(getGradesAPI), mockData]])
      .dispatch(fetchGrades({ courseId: 12 }, { courseId: 12 }))
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
      byCourse: {
        12: { data: [24, 21, 20, 2], loading: false, error: false },
      },
    })
  })

  test('Able to handle any error', async () => {
    const error = new Error('error')
    const { storeState } = await expectSaga(getGradesMiddleware)
      .withReducer(getGradesReducer as any)
      .provide([[matchers.call.fn(getGradesAPI), throwError(error)]])
      .dispatch(fetchGrades({ courseId: 12 }, { courseId: 12 }))
      .run()

    expect(storeState).toMatchObject({
      byCourse: { 12: { loading: false, error } },
    })
  })

  test('Dispatching cancel action resets state to initial state', async () => {
    const { storeState } = await expectSaga(getGradesMiddleware)
      .withReducer(getGradesReducer as any)
      .dispatch(fetchGrades({ courseId: 12 }, { courseId: 12 }))
      .dispatch(fetchGradesCancel({ courseId: 12 }, { courseId: 12 }))
      .run()

    expect(storeState).toMatchObject({
      byCourse: { 12: { loading: false } },
    })
  })
})
