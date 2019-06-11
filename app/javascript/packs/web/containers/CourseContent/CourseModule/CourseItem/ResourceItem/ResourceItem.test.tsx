import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { ResourceItem } from './ResourceItem'

describe('CourseItem/ResourceItem', () => {
  const fetchItemContent = jest.fn()
  const courseId = 1
  const moduleId = 12
  const itemId = 134
  const moduleItem = {
    type: 'File' as 'File',
    id: 134,
    url: 'https://api.example.com',
    external_url: 'https://www.google.com',
    title: 'Sample URL',
  }

  const defaultProps = {
    fetchItemContent,
    moduleId,
    courseId,
    itemId,
    locked: false,
    moduleItem,
  }
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <ResourceItem {...defaultProps} />
      </MemoryRouter>
    )

  test('Clicking on download button triggers API request', () => {
    const { getByTestId, rerender } = renderComponent()
    fireEvent.click(getByTestId('Download File'))
    expect(fetchItemContent).toHaveBeenCalledTimes(1)

    rerender(
      <MemoryRouter>
        <ResourceItem {...defaultProps} />
      </MemoryRouter>
    )
  })
})
