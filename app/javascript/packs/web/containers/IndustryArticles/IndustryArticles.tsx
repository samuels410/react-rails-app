import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { connect } from 'react-redux'
import { CourseID } from '../../../common/types'
import {
  fetchIndustryArticles as fetchIndustryArticlesAction,
  IndustryArticlesState,
} from '../../providers/Courses/IndustryArticlesProvider'
import AsyncDOM from '../../components/Utils/AsyncDOM'
import Loader from '../../components/Utils/Loader'
import IndustryArticle from '../../components/IndustryArticle'
import { AppState } from '../../store'
import styles from './IndustryArticles.module.css'

interface OwnProps {
  courseId: CourseID
}
interface StateProps {
  industryArticlesData: IndustryArticlesState['data']['byId']
  industryArticlesAPI: IndustryArticlesState['byCourse']['x']
}
interface DispatchProps {
  fetchIndustryArticles: typeof fetchIndustryArticlesAction
}
type Props = DispatchProps & StateProps & OwnProps

export const IndustryArticles = (props: Props) => {
  const { courseId, industryArticlesAPI, fetchIndustryArticles } = props

  useEffect(() => {
    if (
      !industryArticlesAPI ||
      (!industryArticlesAPI.loading && !industryArticlesAPI.data)
    ) {
      fetchIndustryArticles({ courseId }, { courseId })
    }
  }, [courseId, industryArticlesAPI, fetchIndustryArticles])

  if (!props.industryArticlesAPI) {
    return null
  }

  return (
    <div className={styles.container}>
      <AsyncDOM data={!!props.industryArticlesAPI.data}>
        <AsyncDOM.Loader
          show={
            props.industryArticlesAPI.loading && !props.industryArticlesAPI.data
          }
        >
          <Loader />
        </AsyncDOM.Loader>
        <AsyncDOM.Content>
          <Grid container spacing={4}>
            {(props.industryArticlesAPI.data || []).map(articleId =>
              props.industryArticlesData[articleId] ? (
                <Grid item xs={12} key={articleId} zeroMinWidth>
                  <IndustryArticle
                    data={props.industryArticlesData[articleId]!}
                  />
                </Grid>
              ) : null
            )}
          </Grid>
        </AsyncDOM.Content>
      </AsyncDOM>
    </div>
  )
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
  industryArticlesData: state.industryArticles.data.byId,
  industryArticlesAPI: state.industryArticles.byCourse[ownProps.courseId],
})

export default connect(
  mapStateToProps,
  { fetchIndustryArticles: fetchIndustryArticlesAction }
)(IndustryArticles)
