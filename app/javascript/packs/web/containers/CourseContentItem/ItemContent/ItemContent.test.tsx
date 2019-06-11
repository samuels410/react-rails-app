import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../store'
import { ItemContent, ItemContentProps } from './ItemContent'

describe('ItemContent', () => {
  const fetchModulesMock = jest.fn()
  const courseId = 3161
  const itemId = 77178
  const moduleId = 15453
  const defaultProps: ItemContentProps = {
    fetchModules: fetchModulesMock,
    modules: {
      data: { byId: {} },
      byCourse: {},
    },
    courseId,
    itemId,
    moduleId,
    moduleItems: {
      data: {
        byId: {},
      },
      byModule: {},
    },
  }

  const renderComponent = (props: ItemContentProps = defaultProps) =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ItemContent {...props} />
        </MemoryRouter>
      </Provider>
    )

  test('show loader when no modules data is fetching', () => {
    const { getByTestId } = renderComponent({
      ...defaultProps,
      modules: {
        ...defaultProps.modules,
        byCourse: {
          3161: {
            data: null,
            loading: true,
            error: false,
          },
        },
      },
    })
    expect(getByTestId('loader')).toBeTruthy()
  })

  test('show drawer when clicked on drawer icon', () => {
    const { queryByTestId, container } = renderComponent({
      ...defaultProps,
      modules: {
        ...defaultProps.modules,
        data: {
          byId: {
            15453: {
              id: 15453,
            },
          },
        },
      },
    })
    const drawerButton = queryByTestId('drawerButton')
    if (drawerButton) {
      fireEvent.click(drawerButton)
      const contentShiftClass = container.querySelector('.MuiDrawer-root')
      expect(contentShiftClass).toHaveAttribute('aria-expanded', 'false')
    }
  })
  test('show main content when module item data is available', () => {
    const { container } = renderComponent({
      ...defaultProps,
      modules: {
        byCourse: {
          3161: {
            data: [15453],
            loading: false,
            error: false,
          },
        },
        data: {
          byId: {
            15453: {
              id: 15453,
            },
          },
        },
      },
      moduleItems: {
        ...defaultProps.moduleItems,
        data: {
          byId: {
            77178: {
              id: 77178,
              title: 'Overview of Machine Learning',
              type: 'Video',
            },
          },
        },
      },
    })
    const mainContent = container.querySelector('.mainContent')
    expect(mainContent).toBeTruthy()
  })
})
