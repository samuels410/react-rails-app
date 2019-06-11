import React from 'react'
import { render, fireEvent, getByText } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../../store'
import MainContent, { MainContentProps } from './MainContent'

describe('MainContent', () => {
  const itemId = 77178
  const moduleId = 15453
  const fetchItemContentMock = jest.fn()
  const defaultProps: MainContentProps = {
    fetchItemContent: fetchItemContentMock,
    itemId,
    moduleId,
    itemData: {
      id: 77233,
      title: 'Overview',
      type: 'Video',
    },
    moduleItems: {
      data: {
        byId: {},
      },
      byModule: {},
    },
  }

  const renderComponent = (props: MainContentProps = defaultProps) =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainContent {...props} />
        </MemoryRouter>
      </Provider>
    )

  test('show items navigator when navigationData is available', () => {
    const { container } = renderComponent()
  })
})
