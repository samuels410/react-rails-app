import React from 'react'
import { connect } from 'react-redux'
import {
  ItemID,
  QuizID,
  CourseID,
  QuizModuleItemData,
  QuizSubmissionData,
  QuizQuestionID,
  ExcludeUnusableValues,
  QuizAnswerData,
} from '../../../common/types'
import QuizContent from '../../components/QuizContent'
import {
  fetchQuizQuestions,
  updateQuizQuestionAnswer,
} from '../../providers/Courses/ModuleItemsProvider/Quiz/QuizQAProvider'
import { updateActiveQuizQuestion } from '../../providers/Courses/ModuleItemsProvider/Quiz/QuizActivityProvider'

interface OwnProps {
  courseId: CourseID
  itemId: ItemID
  quizId: QuizID

  submission: QuizSubmissionData
  activeAttempt: NonNullable<
    ExcludeUnusableValues<
      QuizModuleItemData,
      'itemActivity'
    >['itemActivity']['activeAttempt']
  >

  onSubmit: () => void
}

interface DispatchProps {
  fetchQuizQuestions: typeof fetchQuizQuestions
  updateActiveQuizQuestion: typeof updateActiveQuizQuestion
  updateQuizQuestionAnswer: typeof updateQuizQuestionAnswer
}

type Props = OwnProps & DispatchProps

const QuizRunner = (props: Props) => {
  const { itemId, activeAttempt, quizId } = props
  const { questions, answers, end_at } = props.submission
  if (
    !questions ||
    questions instanceof Error ||
    !activeAttempt ||
    answers instanceof Error
  ) {
    return null
  }
  const { activeQuestionId, orderOfQuestions, attemptNo } = activeAttempt

  if (!orderOfQuestions || !activeQuestionId || !attemptNo) {
    return null
  }

  const updateActiveQuestion = (questionId: QuizQuestionID) =>
    props.updateActiveQuizQuestion({ id: questionId }, { itemId, attemptNo })

  const activeQuestionIdx = orderOfQuestions.indexOf(activeQuestionId)

  const nextQuestionIdx = [
    ...orderOfQuestions.slice(activeQuestionIdx + 1),
    ...orderOfQuestions.slice(0, activeQuestionIdx),
  ].filter(
    questionIdx =>
      !answers || !answers[questionIdx] || !answers[questionIdx]!.answer
  )[0]

  const onNext = nextQuestionIdx
    ? () => updateActiveQuestion(nextQuestionIdx)
    : null

  const updateAnswer = (ans: QuizAnswerData['answer']) =>
    props.updateQuizQuestionAnswer(ans, {
      itemId,
      attemptNo,
      questionId: activeQuestionId,
      quizId,
    })

  return (
    <QuizContent
      endAt={end_at}
      onSubmit={props.onSubmit}
      onNext={onNext}
      orderOfQuestions={orderOfQuestions}
      answers={answers}
      activeQuestionIdx={activeQuestionIdx}
      activeQuestion={questions[activeQuestionId]}
      activeAnswer={answers ? answers[activeQuestionId] : undefined}
      updateActiveQuestion={updateActiveQuestion}
      updateAnswer={updateAnswer}
    />
  )
}

export default connect(
  null,
  { fetchQuizQuestions, updateActiveQuizQuestion, updateQuizQuestionAnswer }
)(QuizRunner)
