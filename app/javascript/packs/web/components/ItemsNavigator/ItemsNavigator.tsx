import React, { useState, useEffect } from 'react'
import { Typography, makeStyles } from '@material-ui/core'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import cx from 'classnames'
import styles from './ItemsNavigator.module.css'
import { ProgressIcon } from '../Utils/Icons'
import LinkButton from '../Utils/LinkButton'
import { ModuleItemData } from '../../../common/types'
import CircleLockIcon from '../Utils/Icons/CircleLock/CircleLock'
import AlertComponent from '../Utils/AlertComponent/AlertComponent'

export type ItemsNavigatorData =
  | {
      id: string | number
      items?: (ModuleItemData & { itemLocked: boolean })[]
      name?: string
      locked: boolean
    }[]
  | null

interface ItemsNavigatorProps {
  items: ItemsNavigatorData
  path: string
  defaultPanel: string | number
  defaultPanelItem: string | number
}

const useStyles = makeStyles(() => ({
  expansionPanelSummary: {},
  expansionPanelSummaryContent: {
    margin: 0,
    flexDirection: 'column',
    overflow: 'hidden',
    '&$expansionPanelSummary': {
      margin: 0,
      marginBottom: 5,
    },
  },
  expansionPanelSummaryRoot: {
    paddingLeft: 16,
    minHeight: 40,
    '&$expansionPanelSummary': {
      minHeight: 40,
      maxHeight: 46,
      paddingLeft: 16,
    },
  },
  expansionPanelDetailsRoot: {
    padding: 0,
  },
  label: {
    textTransform: 'capitalize' as 'capitalize',
  },
  button: {
    width: '100%',
    justifyContent: 'inherit',
    padding: 35,
    paddingBottom: 0,
    paddingTop: 0,
  },
}))

const ItemsNavigator = React.memo((props: ItemsNavigatorProps) => {
  const classes = useStyles()
  const { items, path, defaultPanel, defaultPanelItem } = props
  const [openValue, setOpenValue] = useState(defaultPanel)

  useEffect(() => setOpenValue(defaultPanel), [defaultPanel])

  const handleChange = (value: number | string) => {
    setOpenValue(openValue === value ? '-1' : value)
  }
  return (
    <div className={styles.container}>
      {items !== null &&
        items.map(moduleObj => (
          <ExpansionPanel
            square
            expanded={openValue == moduleObj.id}
            onChange={() => {
              handleChange(moduleObj.id)
            }}
            classes={{
              root: styles.module,
              expanded: styles.moduleExpanded,
            }}
            elevation={0}
            key={moduleObj.id}
          >
            <ExpansionPanelSummary
              classes={{
                root: cx(
                  classes.expansionPanelSummaryRoot,
                  styles.expandedSummaryRoot
                ),
                expanded: cx(
                  classes.expansionPanelSummary,
                  styles.expandedSummary
                ),
                content: classes.expansionPanelSummaryContent,
              }}
            >
              <div className={styles.expansionContainer}>
                <div style={{ width: 24 }}>
                  {moduleObj.locked ? (
                    <CircleLockIcon
                      containerClassName={styles.moduleIcon}
                      lockClassName={styles.icon}
                    />
                  ) : (
                    <ProgressIcon
                      value={100}
                      className={styles.moduleIcon}
                      size={24}
                    />
                  )}
                </div>
                <Typography className={styles.itemTitle} noWrap>
                  {moduleObj.name}
                </Typography>
              </div>
              <span
                className={cx(
                  styles.verticalLine,
                  styles.moduleVerticalLine,
                  openValue === moduleObj.id && styles.newHeight
                )}
              />
            </ExpansionPanelSummary>
            {moduleObj.items &&
              moduleObj.items.map(moduleItem => (
                <ExpansionPanelDetails
                  classes={{
                    root: classes.expansionPanelDetailsRoot,
                  }}
                  className={styles.expandedPanelContent}
                  key={moduleItem.id}
                >
                  <div className={styles.item}>
                    <span
                      className={cx(
                        styles.verticalLine,
                        styles.individualLine,
                        styles.plusSkew
                      )}
                    />
                    <div className={styles.item}>
                      {moduleItem.itemLocked && <AlertComponent />}
                      <LinkButton
                        to={`${path}${moduleObj.id}/items/${moduleItem.id}`}
                        className={`${classes.button} ${classes.label}`}
                        style={{ display: 'flex', flexDirection: 'column' }}
                        activeClassName={styles.activeLink}
                        disableRipple
                      >
                        <div className={styles.expansionContainer}>
                          <div style={{ width: 16 }}>
                            {moduleItem.itemLocked ? (
                              <CircleLockIcon
                                containerClassName={styles.icon}
                                lockClassName={styles.itemLockIcon}
                              />
                            ) : (
                              <ProgressIcon
                                value={Math.trunc(Math.random() * 100)}
                                className={styles.icon}
                                size={16}
                              />
                            )}
                          </div>
                          <Typography
                            className={cx(
                              styles.itemTitle,
                              defaultPanelItem === moduleItem.id.toString() &&
                                styles.activeItemTitle
                            )}
                            noWrap
                          >
                            {moduleItem.title}
                          </Typography>
                        </div>
                      </LinkButton>
                      <span
                        className={cx(
                          styles.verticalLine,
                          styles.itemVerticalLine
                        )}
                      />
                    </div>
                    <span
                      className={cx(
                        styles.verticalLine,
                        styles.individualLine,
                        styles.minusSkew
                      )}
                    />
                  </div>
                </ExpansionPanelDetails>
              ))}
          </ExpansionPanel>
        ))}
    </div>
  )
})
export default ItemsNavigator
