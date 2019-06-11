import React from 'react'
import { render } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { NavigationContent, NavigationContentProps } from './NavigationContent'

describe('NavigationContent', () => {
  const courseId = 3154
  const itemId = 77047
  const moduleId = 15454
  const fetchModuleItemsMock = jest.fn()
  const defaultProps: NavigationContentProps = {
    fetchModuleItems: fetchModuleItemsMock,
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

  const renderComponent = (props: NavigationContentProps) =>
    render(
      <MemoryRouter>
        <NavigationContent {...props} />
      </MemoryRouter>
    )

  test('show items navigator when navigationData is available', () => {
    const { queryByText, container } = renderComponent({
      ...defaultProps,
      modules: {
        data: {
          byId: {
            15424: {
              id: 15424,
              name: 'Learning Material',
            },
          },
        },
        byCourse: {
          3154: {
            data: [15424],
            loading: false,
            error: false,
          },
        },
      },
      moduleItems: {
        ...defaultProps.moduleItems,
        data: {
          byId: {
            77047: {
              id: 77047,
              title: 'R Objects',
              type: 'Video',
            },
          },
        },
        byModule: {
          15424: {
            data: [77047],
            count: 1,
            loading: false,
            error: false,
          },
        },
      },
    })
    const expansionPanel = container.querySelector('.container')
    expect(expansionPanel).toBeTruthy()
  })
})
