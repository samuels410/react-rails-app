import React from 'react'
import { render } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { CourseInfo } from '../CourseInfo'

describe('CourseInfo', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockData = {
    course_name: 'Intro to Python',
    progress: 23,
  }

  const fetchCourseDetails = jest.fn()
  const courseId = 12
  const defaultProps = {
    courseId,
    courseAPI: { data: [], loading: false, error: false },
    courseData: undefined,
    fetchCourseDetails,
  }

  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <CourseInfo {...defaultProps} {...props} />
      </MemoryRouter>
    )

  test('Component mounts without any error', () => {
    expect(renderComponent).not.toThrow()
  })

  test('Fires fetch request on mount when no course data is available', () => {
    renderComponent()
    expect(fetchCourseDetails).toHaveBeenCalledTimes(1)
  })

  test('loader is shown after request is triggered', () => {
    const { getByTestId } = renderComponent({
      courseAPI: { data: [], loading: true, error: false },
    })
    expect(getByTestId('loader')).toBeTruthy()
  })

  test('data is shown after request returns successfully', () => {
    const { queryByText, queryByTestId } = renderComponent({
      courseAPI: { data: [1, 2], loading: false, error: false },
      courseData: mockData,
    })
    expect(queryByTestId('loader')).toBeFalsy()
    expect(queryByText(new RegExp(mockData.course_name))).toBeTruthy()
  })
})
