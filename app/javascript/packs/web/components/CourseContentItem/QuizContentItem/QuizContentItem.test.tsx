import React from 'react'
import { render } from 'react-testing-library'
import QuizContentItem from './QuizContentItem'
import {
  QuizModuleItemData,
  ValidModuleItemContent,
} from '../../../../common/types'
import { minutesToText } from '../../../../common/utils'
import { quizTypes } from '../../../../common/utils/courses'

describe('QuizContentItem', () => {
  const itemId = 12
  const contentId = 13
  const timeLimit = 37
  const itemData = {
    id: itemId,
    content_id: contentId,
    score: 1,
    title: '',
    total: 25,
    type: 'Quiz' as 'Quiz',
    content_details: {
      locked_for_user: true,
      lock_info: {
        unlock_at: '12-12-2025',
      },
    },
    isCompleted: false,
    itemContent: {
      description: '',
      due_at: '12-12-2026',
      allowed_attempts: 20,
      points_possible: 20,
      time_limit: timeLimit,
      message: '',
      name: '',
      question_count: 47,
      quiz_type: 'practice_quiz' as 'practice_quiz',
      stack: '',
    },
  }

  const defaultProps = {
    submissions: [],
    lockedByStartDate: true,
    score: null,
    itemData,
  }

  const renderComponent = (props: object = {}) =>
    render(<QuizContentItem {...defaultProps} {...props} />)

  test('Mounts without any error', () => {
    expect(renderComponent).not.toThrow()
  })

  test('Shows instructions only if it is present', () => {
    const { queryByText, rerender } = renderComponent()
    expect(queryByText(new RegExp('instructions', 'i'))).toBeFalsy()

    rerender(
      <QuizContentItem
        {...defaultProps}
        itemData={{
          ...itemData,
          itemContent: {
            ...itemData.itemContent,
            description: 'Quiz',
          },
        }}
      />
    )

    expect(queryByText(new RegExp('instructions', 'i'))).toBeTruthy()
  })

  test('Shows score only if it meets conditions', () => {
    const score = 3
    const totalPoints = 20

    const { queryByText, rerender } = renderComponent()
    expect(queryByText(new RegExp('Score', 'i'))).toBeTruthy()

    rerender(
      <QuizContentItem
        {...defaultProps}
        itemData={{
          ...itemData,
          itemContent: {
            ...(itemData.itemContent as Exclude<
              ValidModuleItemContent<QuizModuleItemData>,
              Error
            >),
            points_possible: null,
          },
        }}
      />
    )
    expect(queryByText(new RegExp('Score', 'i'))).toBeFalsy()

    rerender(
      <QuizContentItem
        {...defaultProps}
        itemData={{
          ...itemData,
          itemContent: {
            ...(itemData.itemContent as Exclude<
              ValidModuleItemContent<QuizModuleItemData>,
              Error
            >),
            points_possible: totalPoints,
          },
        }}
        score={3}
      />
    )
    expect(queryByText(`${score}/${totalPoints}`)).toBeTruthy()
  })

  test('Shows time limit only if it is present', () => {
    const { queryByText, rerender } = renderComponent()
    expect(queryByText(new RegExp(minutesToText(timeLimit), 'i'))).toBeTruthy()

    rerender(
      <QuizContentItem
        {...defaultProps}
        itemData={{
          ...itemData,
          itemContent: {
            ...itemData.itemContent,
            time_limit: null,
          },
        }}
      />
    )

    expect(queryByText(new RegExp('instructions', 'i'))).toBeFalsy()
  })

  test('Shows start button only if it is present', () => {
    const { queryByText, rerender } = renderComponent()
    expect(queryByText(new RegExp('start', 'i'))).toBeFalsy()

    rerender(<QuizContentItem {...defaultProps} startQuiz={() => ''} />)

    expect(queryByText(new RegExp('start', 'i'))).toBeTruthy()
  })

  test('Shows question count only if it is present', () => {
    const { queryByText } = renderComponent()
    expect(
      queryByText(itemData.itemContent.question_count.toString())
    ).toBeTruthy()
  })

  test('Shows quiz type only if it is present', () => {
    const { queryByText, rerender } = renderComponent()
    expect(queryByText(new RegExp(quizTypes.practice_quiz, 'i'))).toBeTruthy()

    rerender(<QuizContentItem {...defaultProps} startQuiz={() => ''} />)

    expect(queryByText(new RegExp('start', 'i'))).toBeTruthy()
  })
})
