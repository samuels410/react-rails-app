import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Typography, IconButton } from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import { ReactComponent as ArticleIcon } from '../../../../../common/images/icons/article.svg'
import itemStyles from '../CourseItem.module.css'
import {
  CourseID,
  ModuleID,
  ItemID,
  LearningMaterialModuleItemData,
} from '../../../../../common/types'
import { ProgressIcon } from '../../../Utils/Icons'
import AlertComponent from '../../../Utils/AlertComponent/AlertComponent'

interface Props {
  itemId: ItemID
  courseId: CourseID
  moduleId: ModuleID
  locked: boolean
  moduleItem: LearningMaterialModuleItemData
}

const LearningMaterialItem = (props: Props) => {
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
          <ArticleIcon width={24} height={24} className={itemStyles.itemIcon} />
        </div>
      </Grid>
      <Grid item className={itemStyles.itemTitleGrid} zeroMinWidth>
        <Typography className={itemStyles.itemTitle} variant="subtitle2" noWrap>
          {props.moduleItem.title}
        </Typography>
      </Grid>
      <Grid item xs={2} zeroMinWidth>
        <Typography
          className={itemStyles.itemDescText}
          variant="subtitle2"
          noWrap
        >
          Video Not Completed
        </Typography>
      </Grid>
      <Grid item xs={1} className={itemStyles.itemStatusIconGrid}>
        <IconButton
          disabled={props.locked}
          className={itemStyles.itemStatusButton}
        >
          {props.locked ? (
            <LockIcon className={itemStyles.itemStatusIcon} />
          ) : (
            <ProgressIcon size={24} value={props.moduleItem.progress || 0} />
          )}
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default LearningMaterialItem
