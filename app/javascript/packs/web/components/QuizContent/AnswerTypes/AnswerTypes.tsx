import React from 'react'
import Essay from './Essay'
import MAQ from './MAQ'
import MCQ from './MCQ'
import {
  QuizQuestionData,
  QuizAnswerData,
  EssayQuizAnswer,
  MAQQuizAnswer,
  MCQQuizAnswer,
  TrueFalseQuizAnswer,
} from '../../../../common/types'
import TrueFalse from './TrueFalse'

interface Props {
  question: QuizQuestionData
  answer?: QuizAnswerData
  onChange: (ans: QuizAnswerData['answer']) => {}
}

const AnswerTypes = (props: Props) => {
  const answer =
    props.answer && props.answer.answer ? props.answer.answer : undefined
  switch (props.question.question_type) {
    case 'essay_question':
      return (
        <Essay
          id={props.question.id}
          answer={answer as Exclude<EssayQuizAnswer['answer'], null>}
          onChange={props.onChange}
        />
      )
    case 'multiple_answers_question':
      return (
        <MAQ
          id={props.question.id}
          answer={answer as Exclude<MAQQuizAnswer['answer'], null>}
          data={props.question.answers}
          onChange={props.onChange}
        />
      )
    case 'multiple_choice_question':
      return (
        <MCQ
          id={props.question.id}
          data={props.question.answers}
          answer={answer as Exclude<MCQQuizAnswer['answer'], null>}
          onChange={props.onChange}
        />
      )
    case 'true_false_question':
      return (
        <TrueFalse
          id={props.question.id}
          data={props.question.answers}
          answer={answer as Exclude<TrueFalseQuizAnswer['answer'], null>}
          onChange={props.onChange}
        />
      )
    default:
      return null
  }
}

export default AnswerTypes
