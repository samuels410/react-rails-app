import { all } from 'redux-saga/effects'
import { HeaderMiddleware } from '../containers/Header'

/** Courses */
import { coursesMiddleware } from '../providers/Courses/CoursesProvider'
import { modulesMiddleware } from '../providers/Courses/ModulesProvider'
import { moduleItemsMiddleware } from '../providers/Courses/ModuleItemsProvider'
import { recordingsMiddleware } from '../providers/Courses/RecordingsProvider'
import { industryArticlesMiddleware } from '../providers/Courses/IndustryArticlesProvider'
import { gradesMiddleware } from '../providers/Courses/GradesProvider'

export default function* rootSaga() {
  yield all([
    ...HeaderMiddleware,
    /** Courses */
    ...coursesMiddleware,
    ...modulesMiddleware,
    ...moduleItemsMiddleware,
    ...recordingsMiddleware,
    ...industryArticlesMiddleware,
    ...gradesMiddleware,
  ])
}
