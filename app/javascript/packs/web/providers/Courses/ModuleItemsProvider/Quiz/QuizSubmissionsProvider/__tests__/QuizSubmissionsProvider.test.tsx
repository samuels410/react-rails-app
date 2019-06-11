import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import {
  getQuizSubmissionsMiddleware,
  startQuizSubmissionMiddleware,
  completeQuizSubmissionMiddleware,
  getQuizSubmissionsAPI,
  startQuizSubmissionAPI,
  completeQuizSubmissionAPI,
} from '../QuizSubmissions.middlewares'
import quizSubmissionsReducer from '../QuizSubmissions.reducer'
import {
  fetchQuizSubmissions,
  fetchQuizSubmissionsCancel,
  startQuizSubmission,
  completeQuizSubmission,
} from '../QuizSubmissions.actions'

describe('Quiz/QuizSubmissionsProvider', () => {
  const quizId = 23
  const courseId = 12
  const submissionId = 34
  const itemId = 14
  const attempt = 1
  const validation_token = 'dsfsfd'
  const mockData = {
    quiz_submissions: [
      {
        id: 2,
        attempt,
      },
    ],
  }

  describe('Fetch Multiple Submissions', () => {
    test('Fetches course quiz submissions data successfully', async () => {
      const { storeState } = await expectSaga(getQuizSubmissionsMiddleware)
        .withReducer(quizSubmissionsReducer as any)
        .provide([[matchers.call.fn(getQuizSubmissionsAPI), mockData]])
        .dispatch(
          fetchQuizSubmissions({ courseId }, { itemId, courseId, quizId })
        )
        .run()

      expect(storeState).toMatchObject({
        quizSubmissions: {
          1: expect.any(Object),
        },
        activeAttempt: null,
      })
    })

    test('Able to handle any error', async () => {
      const error = new Error('error')
      const { storeState } = await expectSaga(getQuizSubmissionsMiddleware)
        .withReducer(quizSubmissionsReducer as any)
        .provide([[matchers.call.fn(getQuizSubmissionsAPI), throwError(error)]])
        .dispatch(
          fetchQuizSubmissions({ courseId }, { courseId, quizId, itemId })
        )
        .run()

      expect(storeState).toMatchObject({
        quizSubmissions: error,
        activeAttempt: null,
      })
    })

    test('Dispatching cancel action resets state to initial state', async () => {
      const { storeState } = await expectSaga(getQuizSubmissionsMiddleware)
        .withReducer(quizSubmissionsReducer as any)
        .dispatch(
          fetchQuizSubmissions({ courseId }, { courseId, quizId, itemId })
        )
        .dispatch(fetchQuizSubmissionsCancel({ courseId }, { quizId, itemId }))
        .run()

      expect(storeState).toMatchObject({
        quizSubmissions: null,
        activeAttempt: null,
      })
    })
  })

  describe('Start quiz submission', () => {
    test('Start course quiz submissions data successfully', async () => {
      const { storeState } = await expectSaga(startQuizSubmissionMiddleware)
        .withReducer(quizSubmissionsReducer as any)
        .provide([[matchers.call.fn(startQuizSubmissionAPI), mockData]])
        .dispatch(startQuizSubmission({ quizId }, { itemId, courseId, quizId }))
        .run()

      expect(storeState).toMatchObject({
        quizSubmissions: {
          1: expect.any(Object),
        },
        activeAttempt: {
          status: 'active',
          attempt,
        },
      })
    })
  })

  describe('Complete Quiz Submissions', () => {
    test('Fetches course quiz submissions data successfully', async () => {
      const { storeState } = await expectSaga(completeQuizSubmissionMiddleware)
        .withReducer(quizSubmissionsReducer as any)
        .provide([[matchers.call.fn(completeQuizSubmissionAPI), mockData]])
        .dispatch(
          completeQuizSubmission(
            { validation_token, attempt },
            { itemId, courseId, quizId, submissionId }
          )
        )
        .run()

      expect(storeState).toMatchObject({
        quizSubmissions: {
          [attempt]: expect.any(Object),
        },
        activeAttempt: {
          attempt: null,
          status: 'submitted',
        },
      })
    })

    test('Able to handle any error', async () => {
      const error = new Error('error')
      const { storeState } = await expectSaga(completeQuizSubmissionMiddleware)
        .withReducer(quizSubmissionsReducer as any)
        .provide([
          [matchers.call.fn(completeQuizSubmissionAPI), throwError(error)],
        ])
        .dispatch(
          completeQuizSubmission(
            { attempt, validation_token },
            { courseId, quizId, itemId, submissionId }
          )
        )
        .run()

      expect(storeState).toMatchObject({
        quizSubmissions: null,
        activeAttempt: {
          attempt: null,
          status: 'submitting',
        },
      })
    })
  })
})
