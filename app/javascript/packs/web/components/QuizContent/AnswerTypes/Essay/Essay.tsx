import React, { useState, useEffect } from 'react'
import { TextField } from '@material-ui/core'
import styles from './Essay.module.css'
import { QuizQuestionID } from '../../../../../common/types'
import useDebounce from '../../../Utils/useDebounce'

interface Props {
  id: QuizQuestionID
  answer?: string
  onChange: (ans: string) => {}
}

const Essay = (props: Props) => {
  const [val, updateVal] = useState(props.answer || '')
  const debouncedVal = useDebounce(val, 500)

  useEffect(() => {
    props.onChange(debouncedVal)
  }, [debouncedVal])

  return (
    <TextField
      id={`quiz_question_${props.id}`}
      multiline
      rows="6"
      fullWidth
      value={val}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        updateVal(e.target.value)
      }
      className={styles.textInput}
      margin="normal"
      variant="filled"
    />
  )
}
export default Essay
