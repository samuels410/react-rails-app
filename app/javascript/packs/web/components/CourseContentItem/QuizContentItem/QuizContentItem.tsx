import React, { useState } from 'react'
import { Button, Typography, Grid, Box } from '@material-ui/core'
import {
  QuizModuleItemData,
  QuizSubmissionData,
  ExcludeUnusableValues,
} from '../../../../common/types'
import styles from './QuizContentItem.module.css'
import { readableDate, minutesToText } from '../../../../common/utils'
import { quizTypes } from '../../../../common/utils/courses'
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogActions,
} from '../../Utils/Dialog'
// import AttemptHistory from './AttemptHistory'

interface Props {
  itemData: QuizModuleItemData
  startQuiz?: () => void
  lockedByStartDate: boolean
  score: number | null
  submissions: QuizSubmissionData[]
}

const QuizContentItem = (props: Props) => {
  const [startQuizConfirmation, showStartQuizConfirmation] = useState(false)
  if (
    !props.itemData.itemContent ||
    props.itemData.itemContent instanceof Error
  ) {
    return null
  }

  const { itemContent } = props.itemData
  return (
    <div>
      <Grid container className={styles.quizInfo} spacing={1}>
        <Grid item container alignItems="center" xs={12} md={6} lg={4}>
          <Grid item xs={6} lg={4}>
            Type
          </Grid>
          <Grid item xs={1}>
            :
          </Grid>
          <Grid item xs={5} lg={7}>
            {quizTypes[itemContent.quiz_type] || 'N.A.'}
          </Grid>
        </Grid>
        {itemContent.allowed_attempts !== 1 && (
          <Grid item container alignItems="center" xs={12} md={6} lg={4}>
            <Grid item xs={6} lg={4}>
              Attempts
            </Grid>
            <Grid item xs={1}>
              :
            </Grid>
            <Grid item xs={5} lg={7}>
              {`${props.submissions.length || '--'}/${
                itemContent.allowed_attempts > 0
                  ? itemContent.allowed_attempts
                  : '--'
              }`}
            </Grid>
          </Grid>
        )}
        <Grid item container alignItems="center" xs={12} md={6} lg={4}>
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
        <Grid item container alignItems="center" xs={12} md={6} lg={4}>
          <Grid item xs={6} lg={4}>
            Questions
          </Grid>
          <Grid item xs={1}>
            :
          </Grid>
          <Grid item xs={5} lg={7}>
            {itemContent.question_count}
          </Grid>
        </Grid>
        {itemContent.points_possible ? (
          <Grid item container alignItems="center" xs={12} md={6} lg={4}>
            <Grid item xs={6} lg={4}>
              Your Score
            </Grid>
            <Grid item xs={1}>
              :
            </Grid>
            <Grid item xs={5} lg={7}>
              {`${typeof props.score === 'number' ? props.score : '--'}/${
                itemContent.points_possible
              }`}
            </Grid>
          </Grid>
        ) : null}
        <Grid item container alignItems="center" xs={12} md={6} lg={4}>
          <Grid item xs={6} lg={4}>
            Time
          </Grid>
          <Grid item xs={1}>
            :
          </Grid>
          <Grid item xs={5} lg={7}>
            {typeof itemContent.time_limit === 'number'
              ? minutesToText(itemContent.time_limit)
              : '--'}
          </Grid>
        </Grid>
      </Grid>
      {itemContent.description ? (
        <div>
          <Typography variant="h6">Instructions</Typography>
          <div
            dangerouslySetInnerHTML={{
              __html: itemContent.description,
            }}
          />
        </div>
      ) : null}

      {props.lockedByStartDate ? (
        <Typography color="error" className={styles.lockedByStartDate}>
          {props.itemData.content_details &&
          props.itemData.content_details.lock_info &&
          props.itemData.content_details.lock_info.unlock_at
            ? `This quiz will be available to you after ${readableDate(
                props.itemData.content_details.lock_info.unlock_at,
                { hour: '2-digit', minute: '2-digit', hour12: true }
              )}`
            : 'This quiz will be available to you soon'}
        </Typography>
      ) : null}
      {props.startQuiz ? (
        <div className={styles.quizStartButtonContainer}>
          <Button
            className={styles.quizStartButton}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => showStartQuizConfirmation(true)}
          >
            START
          </Button>
          {startQuizConfirmation ? (
            <Dialog open={startQuizConfirmation}>
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                Are you sure you want to start the quiz?
              </DialogContent>
              <DialogActions>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    className={styles.dialogButton}
                    onClick={() => showStartQuizConfirmation(false)}
                    size="medium"
                  >
                    No
                  </Button>
                  <Button
                    className={styles.dialogButton}
                    onClick={props.startQuiz}
                    size="medium"
                    variant="contained"
                    color="primary"
                  >
                    Yes
                  </Button>
                </Box>
              </DialogActions>
            </Dialog>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default QuizContentItem
