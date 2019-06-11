import React from 'react'
import {
  Typography,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Button,
} from '@material-ui/core'
import { QuizSubmissionData } from '../../../../common/types'
import styles from './AttemptHistory.module.css'
import { readableDate } from '../../../../common/utils'

interface Props {
  submissions: QuizSubmissionData[]
  allowRetake: boolean
  viewAnswers: () => void
}

const AttemptHistory = (props: Props) => {
  if (props.submissions.length < 1) {
    return null
  }
  return (
    <div>
      <div>
        <Typography>Attempt History</Typography>
        {props.allowRetake && (
          <Button variant="contained" color="primary">
            Retake
          </Button>
        )}
      </div>
      <div>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Attempt #</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {props.submissions.map(submission => (
              <TableRow key={submission.id}>
                <TableCell>{readableDate(submission.finished_at)}</TableCell>
                <TableCell>Attempt No. {submission.attempt}</TableCell>
                <TableCell>{submission.score}</TableCell>
                <TableCell>
                  <Button>View Answers</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AttemptHistory
