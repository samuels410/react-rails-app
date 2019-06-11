import React from 'react'
import { Checkbox, FormControlLabel, FormControl } from '@material-ui/core'
import styles from './MAQ.module.css'
import {
  QuizAnswerOptionID,
  QuizQuestionID,
  MAQQuizQuestion,
} from '../../../../../common/types'

interface Props {
  id: QuizQuestionID
  answer?: QuizAnswerOptionID[]
  data: MAQQuizQuestion['answers']
  onChange: (ans: QuizAnswerOptionID[]) => {}
}

const MAQ = (props: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (!props.answer || !props.answer.includes(e.target.value)) {
        props.onChange([...(props.answer || []), e.target.value])
      }
    } else if (props.answer && props.answer.includes(props.id)) {
      props.onChange(props.answer.filter(optId => optId !== e.target.value))
    }
  }

  return (
    <FormControl className={styles.container}>
      {props.data.map(option => (
        <FormControlLabel
          className={styles.option}
          value={option.id.toString()}
          label={option.text}
          control={
            <Checkbox
              checked={(props.answer || [])
                .map(i => i.toString())
                .includes(option.id.toString())}
              onChange={handleChange}
            />
          }
        />
      ))}
    </FormControl>
  )
}

export default MAQ
