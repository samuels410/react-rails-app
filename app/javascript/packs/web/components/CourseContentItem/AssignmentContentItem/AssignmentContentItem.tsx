import React, {
  useEffect,
  useState,
  ChangeEvent,
  useCallback,
  useRef,
} from 'react'
import { Button, Typography, Grid } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase'
import styles from './AssignmentContentItem.module.css'
import { AssignmentModuleItemData } from '../../../../common/types'
import { readableDate } from '../../../../common/utils'
import AuthorImages from '../../Utils/AuthorImages'
import DragAndDrop from '../../Utils/DragAndDrop'
import FileItems from '../../Utils/FileItems'
import FileUpload from '../../Utils/FileUpload/FileUpload'
import { FileListObject } from '../../Utils/FileItems/FileItems'

let uniqueId = 0

interface AssignmentContentItemProps {
  itemData: AssignmentModuleItemData
}

const AssignmentContentItem = (props: AssignmentContentItemProps) => {
  const { itemContent } = props.itemData
  const [fileList, addToFileList] = useState<FileListObject[]>([])

  const handleDroppedFiles = (files: FileList) => {
    const filesArray: FileListObject[] = []
    for (let i = 0; i < files.length; i += 1) {
      filesArray.push({ file: files[i], id: uniqueId })
      uniqueId += 1
    }
    addToFileList(oldFileList => [...oldFileList, ...filesArray])
  }

  const handleFileUpload = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement
    const filesArray: FileListObject[] = []
    if (target.files !== null)
      for (let i = 0; i < target.files.length; i += 1) {
        filesArray.push({ file: target.files[i], id: uniqueId })
        uniqueId += 1
      }
    addToFileList([...fileList, ...filesArray])
  }

  const onCloseClick = (id: number) => {
    addToFileList(fileList.filter(file => file.id !== id))
  }

  const onSubmitClick = () => {
    console.log('inside onSubmitClick')
  }

  console.log('fileList', fileList)

  return (
    <DragAndDrop handleDrop={handleDroppedFiles}>
      {itemContent && !(itemContent instanceof Error) && (
        <div className={styles.container}>
          <Grid container className={styles.assignmentInfo} spacing={1}>
            <Grid item container xs={9} lg={9} md={9} spacing={1}>
              <Grid item container alignItems="center" xs={12} md={12} lg={6}>
                <Grid item xs={6} lg={4}>
                  Due Date
                </Grid>
                <Grid item xs={1}>
                  :
                </Grid>
                <Grid item xs={5} lg={7}>
                  {itemContent.due_at ? readableDate(itemContent.due_at) : '--'}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" xs={12} md={12} lg={6}>
                <Grid item xs={6} lg={6}>
                  Submission type
                </Grid>
                <Grid item xs={1}>
                  :
                </Grid>
                <Grid item xs={5} lg={5}>
                  {itemContent.submission_types.join(',')}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" xs={12} md={12} lg={6}>
                <Grid item xs={6} lg={4}>
                  Your Score
                </Grid>
                <Grid item xs={1}>
                  :
                </Grid>
                <Grid item xs={5} lg={7}>{`--/${
                  itemContent.points_possible
                }`}</Grid>
              </Grid>
              <Grid item container alignItems="center" xs={12} md={12} lg={6}>
                <Grid item xs={6} lg={6}>
                  Available from
                </Grid>
                <Grid item xs={1}>
                  :
                </Grid>
                <Grid item xs={5} lg={5}>
                  {itemContent.due_at ? readableDate(itemContent.due_at) : '--'}
                </Grid>
              </Grid>
            </Grid>
            <Grid item container xs={3} lg={3} md={3} spacing={1}>
              <Grid item container alignItems="center" xs={12}>
                <Grid item lg={12} md={12}>
                  Your Group
                </Grid>
                <Grid item lg={12} md={12}>
                  <AuthorImages />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div
            dangerouslySetInnerHTML={{
              __html: itemContent.description,
            }}
          />
          <span className={styles.submitTitle}>Submit Assignment</span>
          <span>
            Note: Keep in mind, this submission will count for everyone in your
            test group group.
          </span>
          <FileUpload onChange={handleFileUpload} />
          <FileItems fileList={fileList} onCloseClick={onCloseClick} />
          <InputBase
            className={styles.textArea}
            placeholder="Add comments"
            inputProps={{ 'aria-label': 'Add comments' }}
            multiline
          />
          <Button
            variant="contained"
            color="primary"
            className={styles.submit}
            classes={{ containedPrimary: styles.submitText }}
            onClick={onSubmitClick}
          >
            Submit Assignment
          </Button>
        </div>
      )}
    </DragAndDrop>
  )
}

export default AssignmentContentItem
