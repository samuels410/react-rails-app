import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  fetchModules as fetchModulesAction,
  ModulesFetchParams,
  ModulesState,
} from '../../../providers/Courses/ModulesProvider'
import styles from './CourseModules.module.css'
import { CourseID } from '../../../../common/types'
import AsyncDOM from '../../../components/Utils/AsyncDOM'
import Loader from '../../../components/Utils/Loader'
import CourseModule from '../CourseModule'
import { AppState } from '../../../store'

interface OwnProps {
  courseId: CourseID
}
interface StateProps {
  modulesAPI: ModulesState['byCourse']['x']
  modulesData: ModulesState['data']['byId']
}
interface DispatchProps {
  fetchModules: typeof fetchModulesAction
}

type Props = OwnProps & DispatchProps & StateProps

export const CourseModules = (props: Props) => {
  const { courseId, fetchModules, modulesAPI, modulesData } = props

  useEffect(() => {
    if (
      !modulesAPI ||
      (modulesAPI.loading === false && modulesAPI.data === null)
    ) {
      const params: ModulesFetchParams = {
        courseId,
      }
      fetchModules(params, { courseId })
    }
  }, [courseId, fetchModules, modulesAPI])

  if (!modulesAPI) {
    return null
  }

  return (
    <AsyncDOM data={Boolean(modulesAPI.data)}>
      <AsyncDOM.Loader show={modulesAPI.loading && !modulesAPI.data}>
        <Loader />
      </AsyncDOM.Loader>

      <AsyncDOM.Content>
        {(modulesAPI.data || []).map(moduleId =>
          modulesData[moduleId] ? (
            <CourseModule
              key={moduleId}
              className={styles.module}
              courseId={props.courseId}
              moduleId={moduleId}
              moduleData={props.modulesData[moduleId]!}
            />
          ) : null
        )}
      </AsyncDOM.Content>
    </AsyncDOM>
  )
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  modulesAPI: state.modules.byCourse[ownProps.courseId],
  modulesData: state.modules.data.byId,
})

export default connect(
  mapStateToProps,
  { fetchModules: fetchModulesAction }
)(CourseModules)
