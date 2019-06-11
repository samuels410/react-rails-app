import React from 'react'
import MCQ from '../MCQ'
import {
  QuizAnswerOptionID,
  QuizQuestionID,
  TrueFalseQuizQuestion,
} from '../../../../../common/types'

interface Props {
  id: QuizQuestionID
  answer?: QuizAnswerOptionID
  data: TrueFalseQuizQuestion['answers']
  onChange: (ans: QuizAnswerOptionID) => {}
}

const TrueFalse = (props: Props) => <MCQ {...props} />

export default TrueFalse
