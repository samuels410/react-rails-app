import React from 'react'
import { connect } from 'react-redux'
import styles from './NavigationContent.module.css'
import ItemsNavigator, {
  ItemsNavigatorData,
} from '../../../../components/ItemsNavigator'
import {
  CourseID,
  ModuleItemData,
  ItemID,
  ModuleID,
} from '../../../../../common/types'
import { AppState } from '../../../../store'
import { ModulesState } from '../../../../providers/Courses/ModulesProvider'
import {
  ModuleItemsState,
  fetchModuleItems,
} from '../../../../providers/Courses/ModuleItemsProvider'
import {
  isModuleLocked,
  isItemLocked,
} from '../../../../../common/utils/courses'
import { BooleanFilter } from '../../../../../common/utils'

export interface NavigationContentProps {
  courseId: CourseID
  moduleId: ModuleID
  itemId: ItemID
  modules: ModulesState
  moduleItems: ModuleItemsState
  fetchModuleItems: typeof fetchModuleItems
}

export const NavigationContent = React.memo((props: NavigationContentProps) => {
  const { courseId, moduleId, itemId, moduleItems, modules } = props

  const courseModules = modules.byCourse[courseId]
  const moduleIds =
    courseModules && courseModules.data ? courseModules.data : undefined

  const navigationData: ItemsNavigatorData =
    moduleIds && !(moduleIds instanceof Error)
      ? moduleIds
          .map(id => {
            const courseModuleIdData = moduleItems.byModule[id]

            let moduleItemIds: ItemID[] = []

            if (courseModuleIdData) {
              moduleItemIds = [...courseModuleIdData.data]

              // to fetch the rest of the items of a module if the item count is higher than the current count
              if (
                courseModuleIdData.count !==
                (courseModuleIdData.data || []).length
              ) {
                const params = {
                  courseId,
                  moduleId,
                  include: ['content_details'],
                  per_page: 50,
                  page: 2,
                }
                const meta = {
                  courseId,
                  moduleId,
                }
                props.fetchModuleItems(params, meta)
              }
            }
            const moduleData = modules.data.byId[id]
            if (!moduleData) {
              return null
            }
            const moduleName = moduleData ? moduleData.name : ''
            const locked = isModuleLocked(moduleData)

            const moduleObj = { id, name: moduleName, locked }

            if (moduleItemIds) {
              const items: (ModuleItemData & { itemLocked: boolean })[] = []
              moduleItemIds.forEach(moduleItemId => {
                const itemData = moduleItems.data.byId[moduleItemId]
                if (itemData && itemData.type !== 'SubHeader') {
                  const itemLocked = isItemLocked(itemData.content_details)
                  items.push({ ...itemData, itemLocked })
                }
              })
              const moduleObjItems = { ...moduleObj, items }
              return moduleObjItems
            }
            return moduleObj
          })
          .filter(BooleanFilter)
      : null

  if (navigationData !== null)
    return (
      <div className={styles.container}>
        <ItemsNavigator
          items={navigationData}
          path={`/courses/${courseId}/modules/`}
          defaultPanel={moduleId}
          defaultPanelItem={itemId}
        />
      </div>
    )
  return null
})

const mapStateToProps = (state: AppState) => ({
  moduleItems: state.moduleItems,
  modules: state.modules,
})
export default connect(
  mapStateToProps,
  { fetchModuleItems }
)(NavigationContent)
