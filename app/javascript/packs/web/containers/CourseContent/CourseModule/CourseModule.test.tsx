import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CourseModule } from './CourseModule'
import store from '../../../store'

describe('CourseModule', () => {
  const courseId = 123
  const moduleId = 12
  const moduleData = {
    id: '1',
    name: 'Module 1',
  }
  const fetchModuleItems = jest.fn()
  const defaultProps = {
    courseId,
    moduleId,
    moduleData,
    fetchModuleItems,
    moduleItemsAPI: undefined,
    moduleItemsData: {},
  }

  const mockData = {
    20: {
      id: 20,
      title: 'Introduction to Python',
      type: 'Video',
      videoWatchedLength: 12,
      videoLength: 40,
    },
    21: {
      id: 21,
      title: 'Introduction to Python - 2',
      type: 'Assignment',
    },
    22: {
      id: 22,
      title: 'Introduction to Python - 2',
      type: 'Discussion',
    },
    23: {
      id: 23,
      title: 'Introduction to Python - 2',
      type: 'Quiz',
    },
    24: {
      id: 24,
      title: 'Introduction to Python - 2',
      type: 'File',
    },
    25: {
      id: 25,
      title: 'Introduction to Python - 2',
      type: 'Learning',
    },
    26: {
      id: 26,
      title: 'Introduction to Python - 2',
      type: 'SubHeader',
    },
    27: {
      id: 27,
      title: 'Introduction to Python - 2',
      type: 'ExternalUrl',
    },
    28: {
      id: 28,
      title: 'Introduction to Python - 2',
      type: 'Page',
    },
    29: {
      id: 29,
      title: 'Introduction to Python - 2',
      type: '',
    },
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const renderComponent = (props = {}) =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseModule {...defaultProps} {...props} />
        </MemoryRouter>
      </Provider>
    )

  test('Component mounts without any error', () => {
    expect(renderComponent).not.toThrow()
  })

  test('Able to render module items if data is available', () => {
    const { queryByText } = renderComponent({
      moduleItemsAPI: { data: [20, 21, 22], loading: false, error: false },
      moduleItemsData: mockData,
    })

    expect(queryByText(mockData[20].title)).toBeTruthy()
  })

  test('Clicking on next button triggers loads next page if data is available', () => {
    const { getByText, queryByText } = renderComponent({
      moduleItemsAPI: {
        data: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        count: 11,
        loading: false,
        error: false,
      },
      moduleItemsData: mockData,
    })

    const showMoreButton = getByText(new RegExp('Show More', 'i')).parentNode
    fireEvent.click(showMoreButton as Element)
    expect(fetchModuleItems).toHaveBeenCalledTimes(0)
    expect(queryByText(new RegExp('Show More', 'i'))).toBeFalsy()
  })

  test('Clicking on next button triggers API call if data not available', () => {
    const { getByText } = renderComponent({
      moduleItemsAPI: {
        data: [20, 21, 22],
        count: 20,
        loading: false,
        error: false,
      },
      moduleItemsData: mockData,
    })

    const showMoreButton = getByText(new RegExp('Show More', 'i')).parentNode
    expect(fetchModuleItems).toHaveBeenCalledTimes(0)
    fireEvent.click(showMoreButton as Element)
    expect(fetchModuleItems).toHaveBeenCalledTimes(1)
  })
})
