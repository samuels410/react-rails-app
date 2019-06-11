import React from 'react'
import { render, cleanup } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { CourseGrades } from './CourseGrades'

describe('CourseGrades', () => {
  const courseId = 123
  const fetchGrades = jest.fn()
  const defaultProps = {
    courseId,
    fetchGrades,
    courseGradesAPI: undefined,
    courseGradesData: {},
  }

  const mockData = {
    21: {
      date: '2019-01-12',
      id: 21,
      score: 12,
      total: 100,
      name: 'Assignment: 3',
    },
    20: {
      date: '2019-01-10',
      id: 20,
      score: 45,
      total: 100,
      name: 'Assignment: 2',
    },
    24: {
      date: '2019-01-14',
      id: 24,
      score: 52,
      total: 100,
      name: 'Assignment: 3',
    },
    2: {
      date: '2019-01-02',
      id: 2,
      score: 62,
      total: 100,
      name: 'Assignment: 1',
    },
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })
  afterEach(cleanup)

  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <CourseGrades {...defaultProps} {...props} />
      </MemoryRouter>
    )

  test('Component mounts without any error', () => {
    expect(renderComponent).not.toThrow()
  })

  test('fetch request is triggered on mount', () => {
    renderComponent()
    expect(fetchGrades).toBeCalledTimes(1)
  })

  test('loader is shown after request is triggered', () => {
    const { getByTestId } = renderComponent({
      courseGradesAPI: { data: null, loading: true, error: false },
    })
    expect(getByTestId('loader')).toBeTruthy()
  })

  test('data is shown after request returns successfully', () => {
    const { queryByText, queryByTestId } = renderComponent({
      courseGradesAPI: { data: [2, 20, 21, 24], loading: false, error: false },
      courseGradesData: mockData,
    })
    expect(queryByTestId('loader')).toBeFalsy()
    expect(queryByText(new RegExp(mockData[2].name))).toBeTruthy()
  })
})
