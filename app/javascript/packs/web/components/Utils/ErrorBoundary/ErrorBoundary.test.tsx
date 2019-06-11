import React from 'react'
import { render } from 'react-testing-library'
import ErrorBoundary from './ErrorBoundary'

describe('ErrorBoundary', () => {
  const errorMessage = 'Oops! Something went wrong'

  const SampleComp = (props: any) => {
    if (props.throw) {
      throw new Error(errorMessage)
    }
    return <div>Successful</div>
  }

  const renderComponent = (props: any) =>
    render(
      <ErrorBoundary>
        <SampleComp {...props} />
      </ErrorBoundary>
    )

  test('Mounts without any error', () => {
    expect(renderComponent).not.toThrow()
  })

  test('Contains internal errors', () => {
    const { getByText } = renderComponent({ throw: true })
    expect(getByText(new RegExp(errorMessage))).toBeTruthy()
  })
})
