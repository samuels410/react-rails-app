import React from 'react'
import {
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
} from '@material-ui/core'
import styles from './MCQ.module.css'
import {
  QuizAnswerOptionID,
  QuizQuestionID,
  MCQQuizQuestion,
} from '../../../../../common/types'

interface Props {
  id: QuizQuestionID
  answer?: QuizAnswerOptionID
  data: MCQQuizQuestion['answers']
  onChange: (ans: QuizAnswerOptionID) => {}
}

const MCQ = (props: Props) => {
  const handleChange = (e: any, ans: string) => props.onChange(ans)
  return (
    <FormControl className={styles.container}>
      <RadioGroup
        name={props.id.toString()}
        value={(props.answer || '').toString()}
        onChange={handleChange}
      >
        {props.data.map(option => (
          <FormControlLabel
            className={styles.option}
            value={option.id.toString()}
            label={option.text}
            control={<Radio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default MCQ
