import React from 'react'
import { render } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CourseItem } from './CourseItem'
import store from '../../../../store'
import { ModuleItemData, ObjectMap, ItemID } from '../../../../../common/types'

describe('CourseItem', () => {
  const courseId = 123
  const moduleId = 12
  const itemId = 1
  const mockData: ObjectMap<ItemID, ModuleItemData> = {
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
  }

  const defaultProps = {
    courseId,
    moduleId,
    locked: false,
    itemId,
    moduleItem: mockData[20],
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const renderComponent = (props = {}) =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseItem {...defaultProps} {...props} />
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
})
