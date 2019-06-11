import React, { Fragment } from 'react'
import { Button } from '@material-ui/core'
import cx from 'classnames'
import Timer from '../Utils/Timer'
import styles from './QuizContent.module.css'
import {
  QuizQuestionData,
  QuizQuestionID,
  QuizAnswerData,
} from '../../../common/types'
import AnswerTypes from './AnswerTypes'
import { QuizQAState } from '../../providers/Courses/ModuleItemsProvider/Quiz/QuizQAProvider'

interface Props {
  answers: Exclude<QuizQAState['answers'], Error>
  activeQuestion: QuizQuestionData
  activeAnswer?: QuizAnswerData
  updateAnswer: (ans: QuizAnswerData['answer']) => {}
  activeQuestionIdx: number
  orderOfQuestions: QuizQuestionID[]
  updateActiveQuestion: (a: QuizQuestionID) => void
  onSubmit: () => void
  onNext: null | (() => void)
  endAt: string | null
}

const QuizContent = (props: Props) => {
  const answers = props.answers || {}
  const getQuestionStatus = (questionId: QuizQuestionID) => {
    const answer = answers[questionId]
    if (!answer) {
      return undefined
    }
    if (answer.answer) {
      return styles.answered
    }
    if (answer.flagged) {
      return styles.flagged
    }
    return undefined
  }
  return (
    <div className={styles.container}>
      <div className={styles.quizStatus}>
        <div>
          Question: {props.activeQuestionIdx + 1}/
          {props.orderOfQuestions.length}
        </div>
        <div>
          {props.endAt ? (
            <Fragment>
              Time Remaining:{' '}
              <Timer endAt={props.endAt} onEnd={props.onSubmit} />
            </Fragment>
          ) : null}
        </div>
      </div>
      <div className={styles.questionButtonContainer}>
        {props.orderOfQuestions.map((questionId, idx) => (
          <Button
            key={questionId}
            className={cx(styles.questionButton, getQuestionStatus(questionId))}
            onClick={() => props.updateActiveQuestion(questionId)}
          >
            {idx + 1}
          </Button>
        ))}
      </div>
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: props.activeQuestion.question_text,
          }}
        />
        <AnswerTypes
          answer={props.activeAnswer}
          question={props.activeQuestion}
          onChange={props.updateAnswer}
        />
      </div>
      <div>
        <Button onClick={props.onSubmit} variant="contained">
          Submit
        </Button>

        {props.onNext ? (
          <Button onClick={props.onNext} variant="contained">
            Next
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default QuizContent
