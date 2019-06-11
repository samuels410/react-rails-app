import React, { ChangeEvent } from 'react'
import Attachment from '@material-ui/icons/Attachment'
import styles from './FileUpload.module.css'

interface FileUploadProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const FileUpload = (props: FileUploadProps) => (
  <div className={styles.uploadContainer}>
    <Attachment className={styles.icon} />
    Drag your files here or &nbsp;
    <label htmlFor="multi" className={styles.label}>
      browse
      <input
        type="file"
        id="multi"
        style={{ display: 'none' }}
        multiple
        onChange={props.onChange}
      />
    </label>
    &nbsp; for a file to upload
  </div>
)

export default FileUpload
