import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Paper, IconButton, Drawer, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import cx from 'classnames'
import NavigationContent from './NavigationContent'
import styles from './ItemContent.module.css'
import AsyncDOM from '../../../components/Utils/AsyncDOM'
import {
  fetchModules,
  ModulesState,
  ModulesFetchParams,
} from '../../../providers/Courses/ModulesProvider'
import { AppState } from '../../../store'
import { CourseID, ItemID, ModuleID } from '../../../../common/types'
import Loader from '../../../components/Utils/Loader'
import OpenDrawerIcon from '../../../components/Utils/Icons/OpenDrawer/OpenDrawer'
import CloseDrawerIcon from '../../../components/Utils/Icons/CloseDrawer/CloseDrawer'
import MainContent from './MainContent'
import { ModuleItemsState } from '../../../providers/Courses/ModuleItemsProvider'

const drawerWidth = 300

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    height: 'auto',
    overflow: 'hidden',
  },
  drawerPaper: {
    width: drawerWidth,
    position: 'relative',
    zIndex: 'auto',
    paddingTop: 10,
    paddingBottom: 20,
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    overflow: 'hidden',
  },
  iconRoot: {
    padding: 7,
    fontSize: 1,
  },
}))

export interface ItemContentProps {
  courseId: CourseID
  fetchModules: typeof fetchModules
  modules: ModulesState
  moduleItems: ModuleItemsState
  itemId: ItemID
  moduleId: ModuleID
}

export const ItemContent = (props: ItemContentProps) => {
  const classes = useStyles()
  const [drawerMode, setDrawerMode] = useState(true)

  const { courseId, moduleId, itemId } = props
  const modulesData = props.modules.byCourse[courseId]
  const itemData = props.moduleItems.data.byId[itemId]

  useEffect(() => {
    const params: ModulesFetchParams = {
      courseId,
    }
    if (!modulesData) {
      props.fetchModules(params, { courseId })
    }
  }, [])

  const drawerOpen = () => {
    setDrawerMode(true)
  }
  const drawerClose = () => {
    setDrawerMode(false)
  }
  return (
    <AsyncDOM data={modulesData && !!modulesData.data}>
      <AsyncDOM.Loader
        show={modulesData && modulesData.loading && modulesData.data === null}
      >
        <Loader />
      </AsyncDOM.Loader>

      <AsyncDOM.Content>
        <div className={styles.container}>
          <Paper className={styles.paper}>
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={drawerMode}
              classes={{
                paper: classes.drawerPaper,
              }}
              aria-expanded={drawerMode}
            >
              <Typography variant="h6" style={{ padding: 10 }}>
                Content
              </Typography>
              <NavigationContent
                courseId={courseId}
                moduleId={moduleId}
                itemId={itemId}
              />
            </Drawer>
            <main
              className={cx(classes.content, {
                [classes.contentShift]: drawerMode,
              })}
            >
              {itemData && (
                <MainContent
                  itemData={itemData}
                  itemId={itemId}
                  courseId={courseId}
                  moduleId={moduleId}
                />
              )}
              <div className={styles.drawerIcons}>
                <IconButton
                  classes={{ root: classes.iconRoot }}
                  onClick={!drawerMode ? drawerOpen : drawerClose}
                  data-testid="drawerButton"
                >
                  {!drawerMode ? <OpenDrawerIcon /> : <CloseDrawerIcon />}
                </IconButton>
              </div>
            </main>
          </Paper>
        </div>
      </AsyncDOM.Content>
    </AsyncDOM>
  )
}

const mapStateToProps = (state: AppState) => ({
  modules: state.modules,
  moduleItems: state.moduleItems,
})

export default connect(
  mapStateToProps,
  { fetchModules }
)(ItemContent)
