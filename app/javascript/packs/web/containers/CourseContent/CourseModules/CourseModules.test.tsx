import React from 'react'
import { render, cleanup } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CourseModules } from './CourseModules'
import store from '../../../store'

describe('CourseModules', () => {
  const courseId = 123
  const fetchModules = jest.fn()
  const defaultProps = {
    courseId,
    fetchModules,
    modulesAPI: undefined,
    modulesData: {},
  }

  const mockData = {
    1: {
      name: 'Assignments Section',
    },
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })
  afterEach(cleanup)

  const renderComponent = (props = {}) =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseModules {...defaultProps} {...props} />
        </MemoryRouter>
      </Provider>
    )

  test('Component mounts without any error', () => {
    expect(renderComponent).not.toThrow()
  })

  test('fetch request is triggered on mount', () => {
    renderComponent()
    expect(fetchModules).toBeCalledTimes(1)
  })

  test('loader is shown after request is triggered', () => {
    const { getByTestId } = renderComponent({
      modulesAPI: { data: null, loading: true, error: false },
    })
    expect(getByTestId('loader')).toBeTruthy()
  })

  test('loader is removed after request returns successfully', () => {
    const { queryByTestId } = renderComponent({
      modulesAPI: { data: [1, 2], loading: false, error: false },
      modulesData: mockData,
    })
    expect(queryByTestId('loader')).toBeFalsy()
  })
})
