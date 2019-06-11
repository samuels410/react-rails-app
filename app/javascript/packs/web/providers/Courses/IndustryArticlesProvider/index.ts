import industryArticlesMiddleware from './IndustryArticles.middlewares'
import industryArticlesReducer, {
  IndustryArticlesState,
} from './IndustryArticles.reducer'
import {
  fetchIndustryArticles,
  fetchIndustryArticlesCancel,
} from './IndustryArticles.actions'

export type IndustryArticlesState = IndustryArticlesState

export {
  industryArticlesMiddleware,
  industryArticlesReducer,
  /** ACTION CREATORS */
  fetchIndustryArticles,
  fetchIndustryArticlesCancel,
}
