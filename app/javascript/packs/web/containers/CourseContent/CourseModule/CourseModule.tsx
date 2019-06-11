import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import {
  fetchModuleItems,
  ModuleItemsState,
} from '../../../providers/Courses/ModuleItemsProvider'
import { CourseModule as CourseModuleComponent } from '../../../components/CourseContent'
import { AppState } from '../../../store'
import {
  ModuleID,
  CourseID,
  ItemID,
  ModuleData,
} from '../../../../common/types'
import styles from './CourseModule.module.css'
import CourseItem from './CourseItem'
import ShowMore from '../../../components/Utils/ShowMore'
import { isItemLocked, isModuleLocked } from '../../../../common/utils/courses'

interface OwnProps {
  courseId: CourseID
  moduleId: ModuleID
  moduleData: ModuleData
  className?: string
}

interface StateProps {
  moduleItemsAPI: ModuleItemsState['byModule']['x']
  moduleItemsData: ModuleItemsState['data']['byId']
}

interface DispatchProps {
  fetchModuleItems: typeof fetchModuleItems
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  page: number
}

const PAGE_SIZE = 10

export class CourseModule extends React.Component<Props, State> {
  state = {
    page: 1,
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.moduleItemsAPI &&
      this.props.moduleItemsAPI &&
      prevProps.moduleItemsAPI.loading === true &&
      this.props.moduleItemsAPI.loading === false
    ) {
      this.setState(prevState => ({
        page: Math.min(
          prevState.page + 1,
          Math.ceil(this.props.moduleItemsAPI!.count / PAGE_SIZE)
        ),
      }))
    }
  }

  loadNextPage = () => {
    if (!this.props.moduleItemsAPI || !this.props.moduleItemsAPI.data) {
      return
    }

    /** Total number of items available in this module */
    const numOfItemsAvailable = this.props.moduleItemsAPI.count

    /** Number of items currently loaded in the store */
    const numOfItemsLoaded = this.props.moduleItemsAPI.data.length

    /** Number of items required to be shown */
    const numOfItemsRequired = Math.min(
      (this.state.page + 1) * PAGE_SIZE,
      numOfItemsAvailable
    )

    /** If data is available for next page, use the same; else trigger a fetch request */
    if (numOfItemsRequired <= numOfItemsLoaded) {
      this.setState(prevState => ({ page: prevState.page + 1 }))
    } else {
      const { courseId, moduleId } = this.props
      const params = {
        courseId,
        moduleId,
        include: ['content_details'],
        per_page: PAGE_SIZE,
        page: Math.floor(numOfItemsLoaded / PAGE_SIZE) + 1,
      }
      const meta = {
        courseId,
        moduleId,
      }
      this.props.fetchModuleItems(params, meta)
    }
  }

  renderItem = (
    itemId: ItemID,
    idx: number,
    moduleItemsList: ItemID[],
    moduleLocked: boolean
  ) => {
    const moduleItem = this.props.moduleItemsData[itemId]
    if (
      !moduleItem ||
      (moduleItem.type === 'SubHeader' && idx === moduleItemsList.length - 1)
    ) {
      return null
    }

    const isLocked =
      moduleLocked ||
      !!(moduleItem.content_details && isItemLocked(moduleItem.content_details))
    return (
      <CourseItem
        key={itemId}
        locked={isLocked}
        itemId={itemId}
        courseId={this.props.courseId}
        moduleId={this.props.moduleId}
        moduleItem={moduleItem}
      />
    )
  }

  renderModuleItems(moduleItemsList: ItemID[]) {
    const moduleLocked = isModuleLocked(this.props.moduleData)
    return moduleItemsList
      .slice(0, this.state.page * PAGE_SIZE)
      .map((itemId, idx) =>
        this.renderItem(itemId, idx, moduleItemsList, moduleLocked)
      )
  }

  render() {
    const moduleAPIData = this.props.moduleItemsAPI
    if (
      !moduleAPIData ||
      !moduleAPIData.data ||
      moduleAPIData.data.length === 0 ||
      ('count' in moduleAPIData && moduleAPIData.count === 0)
    ) {
      return null
    }

    const isNextPageAvailable =
      moduleAPIData.count > this.state.page * PAGE_SIZE

    return (
      <div className={cx(styles.container, this.props.className)}>
        <CourseModuleComponent
          moduleData={this.props.moduleData}
          className={styles.moduleContainer}
          hasMore={isNextPageAvailable}
        >
          {this.renderModuleItems(moduleAPIData.data)}
          {isNextPageAvailable && (
            <ShowMore
              className={styles.showMore}
              loading={moduleAPIData.loading}
              onClick={this.loadNextPage}
            />
          )}
        </CourseModuleComponent>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
  moduleItemsData: state.moduleItems.data.byId,
  moduleItemsAPI: state.moduleItems.byModule[ownProps.moduleId],
})

export default connect(
  mapStateToProps,
  { fetchModuleItems }
)(CourseModule)
