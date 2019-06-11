import React from 'react'
import Grid from '@material-ui/core/Grid'
import AttachFile from '@material-ui/icons/AttachFile'
import SaveAlt from '@material-ui/icons/SaveAlt'
import { Typography } from '@material-ui/core'
import styles from './ResourceContentItem.module.css'
import { ResourceModuleItemData } from '../../../../common/types'

interface Props {
  data: ResourceModuleItemData
  downloadFile: () => void
  downloadAll: () => void
}

interface DownloadFileProps {
  data: ResourceModuleItemData
  downloadFile: () => void
}

const DownloadFile = (props: DownloadFileProps) => {
  if (!props.data.itemContent || !('filename' in props.data.itemContent)) {
    return null
  }
  return (
    <Grid
      className={styles.fileContainer}
      container
      onClick={props.downloadFile}
    >
      <Grid item xs={1} className={styles.iconContainer}>
        <AttachFile className={styles.icon} />
      </Grid>
      <Grid item className={styles.fileTitleGrid}>
        <Typography className={styles.itemTitle} variant="subtitle2" noWrap>
          {props.data.itemContent.filename}
        </Typography>
      </Grid>
      <Grid item xs={1} className={styles.iconContainer}>
        <SaveAlt className={styles.icon} />
      </Grid>
    </Grid>
  )
}

const ResourceContentItem = (props: Props) => {
  return (
    <div className={styles.container}>
      <Typography
        className={styles.downloadAll}
        color="primary"
        onClick={props.downloadAll}
      >
        Download All
      </Typography>
      <DownloadFile data={props.data} downloadFile={props.downloadFile} />
    </div>
  )
}

export default ResourceContentItem
