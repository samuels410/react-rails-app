import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import { Provider } from 'react-redux'
import { QuizItemTypeContent, Props } from './QuizItemTypeContent'
import { QuizModuleItemData } from '../../../../common/types'
import store from '../../../store'

describe('ItemTypeContent/Quiz', () => {
  const contentId = 123
  const courseId = 12
  const itemId = 13

  const itemData: QuizModuleItemData = {
    id: itemId,
    content_id: contentId,
    score: 1,
    title: '',
    total: 25,
    type: 'Quiz',
    content_details: {
      locked_for_user: true,
      lock_info: {
        unlock_at: '12-12-2025',
      },
    },
    isCompleted: false,
    itemContent: {
      description: 'Quiz',
      due_at: '12-12-2026',
      allowed_attempts: 20,
      points_possible: 10,
      time_limit: 20,
      message: '',
      name: '',
      question_count: 20,
      quiz_type: 'practice_quiz',
      stack: '',
    },
  }

  const fetchQuizSubmissions = jest.fn()
  const completeQuizSubmission = jest.fn()
  const startQuizSubmission = jest.fn()

  const defaultProps: Props = {
    itemId,
    courseId,
    contentId,
    itemData,
    fetchQuizSubmissions,
    startQuizSubmission,
    completeQuizSubmission,
  }

  beforeEach(jest.resetAllMocks)

  const renderComponent = (props: Partial<Props> = {}) =>
    render(
      <Provider store={store}>
        <QuizItemTypeContent {...defaultProps} {...props} />
      </Provider>,
      {
        container: document.body,
      }
    )

  test('Component mounts without any error', () => {
    expect(renderComponent).not.toThrow()
  })

  test('On mount submissions are fetched', () => {
    expect(fetchQuizSubmissions).toHaveBeenCalledTimes(0)
    renderComponent({
      itemData: {
        ...defaultProps.itemData,
        quizSubmissions: undefined,
      },
    })
    expect(fetchQuizSubmissions).toHaveBeenCalledTimes(1)
  })

  test('Renders quiz details after submissions API returns', () => {
    const { getByText } = renderComponent({
      itemData: {
        ...defaultProps.itemData,
        quizSubmissions: [],
      },
    })

    expect(getByText(new RegExp('instructions', 'i'))).toBeTruthy()
    expect(getByText(new RegExp('practice', 'i'))).toBeTruthy()
  })

  test('Shows option to start quiz if all conditions are met', () => {
    const { queryByText } = renderComponent({
      itemData: {
        ...defaultProps.itemData,
        content_details: {
          locked_for_user: false,
        },
        quizSubmissions: [],
      },
    })

    expect(queryByText(new RegExp('START'))).toBeTruthy()
  })

  test('Blocks option to start quiz if all unlock date condition is not met', () => {
    const { queryByText } = renderComponent({
      itemData: {
        ...defaultProps.itemData,
        content_details: {
          locked_for_user: true,
          lock_info: {
            unlock_at: '2029-12-12',
          },
        },
        quizSubmissions: [],
      },
    })

    expect(queryByText(new RegExp('START'))).toBeFalsy()
  })

  test('Blocks option to start quiz if course requirements are not met', () => {
    const { queryByText } = renderComponent({
      itemData: {
        ...defaultProps.itemData,
        content_details: {
          locked_for_user: true,
          lock_info: {},
        },
        quizSubmissions: [],
      },
    })

    expect(queryByText(new RegExp('START'))).toBeFalsy()
  })

  test('Able to start quiz by clicking on start button', () => {
    const { getByText } = renderComponent({
      itemData: {
        ...defaultProps.itemData,
        content_details: {
          locked_for_user: false,
        },
        quizSubmissions: {
          1: {
            id: 1,
            quiz_id: 2,
            attempt: 4,
            attempts_left: 6,
            started_at: '2019-01-01',
            end_at: '2019-12-12',
            finished_at: '2019-12-12',
            kept_score: 5,
            score: 1,
            validation_token: 'sdfdf',
            workflow_state: 'untaken',
          },
          2: {
            id: 2,
            quiz_id: 2,
            attempt: 4,
            attempts_left: 6,
            started_at: '2019-01-01',
            end_at: '2019-12-12',
            finished_at: '2019-12-12',
            kept_score: 5,
            score: 1,
            validation_token: 'sdfdf',
            workflow_state: 'untaken',
          },
        },
      },
    })

    expect(startQuizSubmission).toBeCalledTimes(0)

    const startButton = getByText(new RegExp('START'))
    fireEvent.click(startButton)

    const noButton = getByText(
      (content, element) =>
        element.tagName.toLowerCase() === 'button' &&
        /no/i.test(element.textContent)
    )
    fireEvent.click(noButton)
    expect(startQuizSubmission).toBeCalledTimes(0)

    fireEvent.click(startButton)

    const yesButton = getByText(
      (content, element) =>
        element.tagName.toLowerCase() === 'button' &&
        /yes/i.test(element.textContent)
    )
    fireEvent.click(yesButton)
    expect(startQuizSubmission).toBeCalledTimes(1)
  })

  test('Quiz is activated when redux store is updated', () => {
    const { queryByText, queryByTestId, rerender } = renderComponent({
      itemData: {
        ...defaultProps.itemData,
        activeAttempt: {
          attempt: 2,
          status: 'starting',
        },
        quizSubmissions: {
          1: {
            id: 1,
            quiz_id: 2,
            attempt: 4,
            attempts_left: 6,
            started_at: '2019-01-01',
            end_at: '2019-12-12',
            finished_at: '2019-12-12',
            kept_score: 5,
            score: 1,
            validation_token: 'sdfdf',
            workflow_state: 'untaken',
          },
          2: {
            id: 2,
            quiz_id: 2,
            attempt: 4,
            attempts_left: 6,
            started_at: '2019-01-01',
            end_at: '2019-12-12',
            finished_at: '2019-12-12',
            kept_score: 5,
            score: 1,
            validation_token: 'sdfdf',
            workflow_state: 'untaken',
          },
        },
        content_details: {
          locked_for_user: false,
        },
      },
    })

    expect(queryByTestId(/loader/)).toBeTruthy()

    rerender(
      <Provider store={store}>
        <QuizItemTypeContent
          {...defaultProps}
          {...{
            itemData: {
              ...defaultProps.itemData,
              activeAttempt: {
                attempt: 1,
                status: 'active',
              },
              quizSubmissions: {
                1: {
                  id: 1,
                  quiz_id: 2,
                  attempt: 4,
                  attempts_left: 6,
                  started_at: '2019-01-01',
                  end_at: '2019-12-12',
                  finished_at: '2019-12-12',
                  kept_score: 5,
                  score: 1,
                  validation_token: 'sdfdf',
                  workflow_state: 'untaken',
                },
              },
              content_details: {
                locked_for_user: false,
              },
            },
          }}
        />
      </Provider>
    )

    expect(queryByTestId(/loader/)).toBeFalsy()
    expect(
      queryByText(
        (content, element) =>
          element.tagName.toLowerCase() === 'button' &&
          /Submit/i.test(element.textContent)
      )
    ).toBeTruthy()
  })
})
