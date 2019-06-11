import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import ThumbUp from '@material-ui/icons/ThumbUp'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import BookmarkBorder from '@material-ui/icons/BookmarkBorder'
import ThumbDown from '@material-ui/icons/ThumbDown'
import { makeStyles } from '@material-ui/styles'
import cx from 'classnames'
import Tooltip from '@material-ui/core/Tooltip'
import {
  ModuleItemData,
  ItemID,
  ModuleID,
  CourseID,
} from '../../../../../common/types'
import styles from './MainContent.module.css'
import LinkButton from '../../../../components/Utils/LinkButton'
import { AppState } from '../../../../store'
import {
  fetchItemContent,
  ModuleItemsState,
} from '../../../../providers/Courses/ModuleItemsProvider'
import Loader from '../../../../components/Utils/Loader'
import ItemTypeContent from '../../../ItemTypeContent'
import { ModulesState } from '../../../../providers/Courses/ModulesProvider'

const useStyles = makeStyles(() => ({
  label: {
    textTransform: 'capitalize' as 'capitalize',
  },
}))

export interface MainContentProps {
  itemData: ModuleItemData
  courseId: CourseID
  itemId: ItemID
  moduleId: ModuleID
  modules: ModulesState
  moduleItems: ModuleItemsState
  fetchItemContent: typeof fetchItemContent
}

const MainContent = (props: MainContentProps) => {
  const classes = useStyles()
  const { itemData, moduleItems, itemId, moduleId, modules, courseId } = props
  const [buttonPath, setbuttonPath] = useState({
    prevPath: '',
    nextPath: '',
    prevItemTitle: '',
    nextItemTitle: '',
  })
  const path = `/courses/${courseId}/modules/`

  const courseModules = modules.byCourse[courseId]
  const moduleIds =
    courseModules && courseModules.data ? courseModules.data : undefined

  let currentItemIndex: number = -1
  const arrayOfItems: {
    moduleId: ModuleID
    itemId: ItemID
    itemTitle: string
  }[] = []
  const arrayOfItemsConstruction = () => {
    if (moduleIds)
      moduleIds.forEach(mId => {
        const moduleIdData = moduleItems.byModule[mId]
        if (moduleIdData) {
          const itemIds = moduleIdData.data
          if (itemIds !== null) {
            itemIds.forEach(iId => {
              if (iId == itemId) {
                currentItemIndex = arrayOfItems.length
              }
              const itemInfo = moduleItems.data.byId[iId]
              if (itemInfo && itemInfo.type !== 'SubHeader')
                arrayOfItems.push({
                  moduleId: mId,
                  itemId: iId,
                  itemTitle: itemInfo.title,
                })
            })
          }
        }
      })
  }

  const buttonPathSet = () => {
    const prevIndex = currentItemIndex - 1
    const nextIndex = currentItemIndex + 1
    let prevPath = '#'
    let nextPath = '#'
    let prevItemTitle = ''
    let nextItemTitle = ''
    if (arrayOfItems[prevIndex]) {
      prevPath = `${path}${arrayOfItems[prevIndex].moduleId}/items/${
        arrayOfItems[prevIndex].itemId
      }`
      prevItemTitle = arrayOfItems[prevIndex].itemTitle
    }

    if (arrayOfItems[nextIndex]) {
      nextPath = `${path}${arrayOfItems[nextIndex].moduleId}/items/${
        arrayOfItems[nextIndex].itemId
      }`
      nextItemTitle = arrayOfItems[nextIndex].itemTitle
    }
    setbuttonPath({ prevPath, nextPath, prevItemTitle, nextItemTitle })
  }

  useEffect(() => {
    if (!itemData.itemContent && 'url' in itemData && itemData.url) {
      props.fetchItemContent({ url: itemData.url }, { itemId: itemData.id })
    }
    arrayOfItemsConstruction()
    buttonPathSet()
  }, [itemId])

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.mainContentHeader}>
          <span className={styles.itemTitle}> {itemData.title} </span>
          <IconButton className={styles.bookmark}>
            <BookmarkBorder className={styles.thumbIcon} />
          </IconButton>
        </div>
        {'itemContent' in itemData && !(itemData instanceof Error) ? (
          <ItemTypeContent
            itemData={itemData}
            itemId={props.itemId}
            courseId={props.courseId}
          />
        ) : (
          <Loader />
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.reportBar}>
          <div className={styles.report}>
            <span style={{ fontSize: 13 }}>Was this content useful?</span>
            <IconButton>
              <ThumbUp className={styles.thumbIcon} />
            </IconButton>
            <IconButton>
              <ThumbDown className={styles.thumbIcon} />
            </IconButton>
          </div>
          <LinkButton to="/courses" color="primary" className={classes.label}>
            Report
          </LinkButton>
        </div>
        <div className={styles.navigationButtons}>
          <Tooltip title={buttonPath.prevItemTitle} placement="right-start">
            <div>
              <LinkButton
                variant="contained"
                to={buttonPath.prevPath}
                key="PrevButton"
                className={cx(classes.label, styles.label)}
                disabled={buttonPath.prevPath === '#'}
              >
                <ChevronLeft />
                Previous
              </LinkButton>
            </div>
          </Tooltip>
          <Tooltip title={buttonPath.nextItemTitle} placement="left-start">
            <div>
              <LinkButton
                variant="contained"
                to={buttonPath.nextPath}
                key="NextButton"
                className={cx(classes.label, styles.label)}
                disabled={buttonPath.nextPath === '#'}
              >
                Next
                <ChevronRight />
              </LinkButton>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: AppState) => ({
  modules: state.modules,
  moduleItems: state.moduleItems,
})

export default connect(
  mapStateToProps,
  { fetchItemContent }
)(MainContent)
