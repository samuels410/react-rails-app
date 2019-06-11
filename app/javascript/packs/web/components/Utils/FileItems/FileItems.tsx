import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import styles from './FileItems.module.css'

export interface FileListObject {
  file: File
  id: number
}

interface FileItemsProps {
  fileList: FileListObject[]
  onCloseClick: Function
}

const FileItems = (props: FileItemsProps) => {
  if (props.fileList.length > 0)
    return (
      <div className={styles.container}>
        {props.fileList.map(fileObj => (
          <div className={styles.fileItem} key={fileObj.id}>
            <Tooltip title={fileObj.file.name}>
              <Typography className={styles.fileName} noWrap>
                {fileObj.file.name}
              </Typography>
            </Tooltip>
            <Typography className={styles.fileSize}>
              {Math.floor(fileObj.file.size / 1000)} KB
            </Typography>
            <IconButton
              className={styles.closeButton}
              onClick={() => props.onCloseClick(fileObj.id)}
            >
              <Close className={styles.closeIcon} />
            </IconButton>
          </div>
        ))}
      </div>
    )
  return null
}

export default FileItems
