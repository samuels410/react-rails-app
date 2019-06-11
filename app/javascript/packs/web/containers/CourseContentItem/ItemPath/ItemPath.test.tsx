import React from 'react'
import { render } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ItemPath, ItemPathProps } from './ItemPath'
import store from '../../../store'

describe('ItemPath', () => {
  const fetchCourseDetailsMock = jest.fn()
  const courseId = 3161
  const itemId = 77178
  const defaultProps: ItemPathProps = {
    fetchCourseDetails: fetchCourseDetailsMock,
    courses: {
      data: { byId: {} },
      byProgram: {},
      byCourse: {},
    },
    courseId,
    itemId,
    moduleItems: {
      data: {
        byId: {},
      },
      byModule: {},
    },
  }
  const renderComponent = (props: ItemPathProps = defaultProps) =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ItemPath {...props} />
        </MemoryRouter>
      </Provider>
    )

  test('show courseName breadcrumb when course details are available', () => {
    const { queryByText } = renderComponent({
      ...defaultProps,
      courses: {
        ...defaultProps.courses,
        data: {
          byId: {
            3161: {
              course_name: 'Predictive Modeling',
              course_id: 3161,
              start_date: '2019-03-12',
              image_url:
                'https://d9jmtjs5r4cgq.cloudfront.net/images/pgpbabi/PM-min.jpg',
            },
          },
        },
      },
    })
    expect(queryByText(new RegExp('courses', 'i'))).toBeTruthy()
    expect(queryByText(new RegExp('Predictive Modeling', 'i'))).toBeTruthy()
  })

  test('show moduleItem Name breadcrumb when moduleItems data is available', () => {
    const { queryByText } = renderComponent({
      ...defaultProps,
      courses: {
        ...defaultProps.courses,
        data: {
          byId: {
            3161: {
              course_name: 'Predictive Modeling',
              course_id: 3161,
              start_date: '2019-03-12',
              image_url:
                'https://d9jmtjs5r4cgq.cloudfront.net/images/pgpbabi/PM-min.jpg',
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
    expect(
      queryByText(new RegExp('Overview of Machine Learning', 'i'))
    ).toBeTruthy()
  })
})
