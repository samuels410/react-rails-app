import React from 'react'
import AttachFile from '@material-ui/icons/AttachFile'
import LockIcon from '@material-ui/icons/Lock'
import cx from 'classnames'
import SaveAlt from '@material-ui/icons/SaveAlt'
import { Grid, Typography, IconButton, Tooltip } from '@material-ui/core'
import { Link } from 'react-router-dom'
import itemStyles from '../CourseItem.module.css'
import resourceItemStyles from './ResourceItem.module.css'
import {
  CourseID,
  ModuleID,
  ItemID,
  ResourceModuleItemData,
} from '../../../../../common/types'
import Loader from '../../../Utils/Loader'
import AlertComponent from '../../../Utils/AlertComponent/AlertComponent'

interface Props {
  loading: boolean
  error: boolean
  itemId: ItemID
  locked: boolean
  courseId: CourseID
  moduleId: ModuleID
  moduleItem: ResourceModuleItemData
  fetchResource: () => void
}

interface CTAProps {
  loading: boolean
}

const CTA = (props: CTAProps) => {
  return props.loading ? (
    <Loader
      type="circle"
      className={resourceItemStyles.loader}
      loaderProps={{
        variant: 'indeterminate',
        size: 24,
      }}
    />
  ) : (
    <Tooltip title="Download">
      <SaveAlt className={itemStyles.itemStatusIcon} />
    </Tooltip>
  )
}

const ResourceItem = (props: Props) => {
  return (
    <Grid container className={itemStyles.container}>
      {props.locked ? (
        <AlertComponent />
      ) : (
        <Link
          to={`/courses/${props.courseId}/modules/${props.moduleId}/items/${
            props.itemId
          }`}
          className={itemStyles.courseItemCTA}
        />
      )}
      <Grid item xs={1} className={itemStyles.itemIconGrid}>
        <div className={itemStyles.itemIconWrapper}>
          <AttachFile className={itemStyles.itemIcon} />
        </div>
      </Grid>
      <Grid item className={itemStyles.itemTitleGrid} zeroMinWidth>
        <Typography className={itemStyles.itemTitle} variant="subtitle2" noWrap>
          {props.moduleItem.title}
        </Typography>
      </Grid>
      <Grid
        item
        xs={1}
        className={cx(
          itemStyles.courseItemAboveCTA,
          itemStyles.itemStatusIconGrid
        )}
      >
        <IconButton
          data-testid="Download File"
          disabled={props.locked || props.loading}
          onClick={props.fetchResource}
          className={itemStyles.itemStatusButton}
        >
          {!props.locked ? (
            <CTA loading={props.loading} />
          ) : (
            <LockIcon className={itemStyles.itemStatusIcon} />
          )}
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default ResourceItem
