import { combineReducers } from 'redux'
import { HeaderReducer, HeaderState } from '../containers/Header'

/** COURSES */
import {
  coursesReducer,
  CoursesState,
} from '../providers/Courses/CoursesProvider'
import {
  ModulesState,
  modulesReducer,
} from '../providers/Courses/ModulesProvider'
import {
  moduleItemsReducer,
  ModuleItemsState,
} from '../providers/Courses/ModuleItemsProvider'
import {
  RecordingsState,
  recordingsReducer,
} from '../providers/Courses/RecordingsProvider'
import {
  industryArticlesReducer,
  IndustryArticlesState,
} from '../providers/Courses/IndustryArticlesProvider'
import { gradesReducer, GradesState } from '../providers/Courses/GradesProvider'

export interface StoreState {
  header: HeaderState
  /** Courses */
  courses: CoursesState
  modules: ModulesState
  moduleItems: ModuleItemsState
  recordings: RecordingsState
  industryArticles: IndustryArticlesState
  grades: GradesState
}

export default combineReducers<StoreState>({
  header: HeaderReducer,
  /** Courses */
  courses: coursesReducer,
  modules: modulesReducer,
  moduleItems: moduleItemsReducer,
  recordings: recordingsReducer,
  industryArticles: industryArticlesReducer,
  grades: gradesReducer,
})
