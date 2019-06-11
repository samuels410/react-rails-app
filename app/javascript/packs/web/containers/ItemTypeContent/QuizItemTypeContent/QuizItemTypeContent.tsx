import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  QuizID,
  QuizModuleItemData,
  CourseID,
  ItemID,
  QuizSubmissionData,
} from '../../../../common/types'
import QuizRunner from '../../QuizRunner'
import {
  isLockedByStartDate,
  hasValidAttemptsAllowed,
  hasValidAttemptsRemaining,
} from '../../../../common/utils/courses'
import QuizContentItem from '../../../components/CourseContentItem/QuizContentItem'
import {
  fetchQuizSubmissions,
  completeQuizSubmission,
  startQuizSubmission,
} from '../../../providers/Courses/ModuleItemsProvider/Quiz/QuizSubmissionsProvider'
import AsyncDOM from '../../../components/Utils/AsyncDOM'
import Loader from '../../../components/Utils/Loader'
import { hasError, pickIntoArray } from '../../../../common/utils'

interface OwnProps {
  itemId: ItemID
  courseId: CourseID
  contentId: QuizID
  itemData: QuizModuleItemData
}

interface DispatchProps {
  completeQuizSubmission: typeof completeQuizSubmission
  fetchQuizSubmissions: typeof fetchQuizSubmissions
  startQuizSubmission: typeof startQuizSubmission
}

export type Props = OwnProps & DispatchProps

export const QuizItemTypeContent = (props: Props) => {
  const { courseId, contentId: quizId, itemId, itemData } = props

  useEffect(() => {
    if (
      typeof itemData.itemActivity === 'undefined' ||
      typeof itemData.itemActivity.submissions === 'undefined'
    ) {
      props.fetchQuizSubmissions({}, { quizId, courseId, itemId })
    }
  }, [itemData, quizId, courseId, itemId])

  if (!itemData.itemContent || itemData.itemContent instanceof Error) {
    return null
  }

  if (
    !itemData.content_details ||
    typeof itemData.itemActivity === 'undefined' ||
    itemData.itemActivity.submissions === undefined ||
    itemData.itemActivity.submissions instanceof Error
  ) {
    return null
  }

  const { activeAttempt } = itemData.itemActivity
  if (
    itemData.itemActivity.submissions &&
    activeAttempt &&
    activeAttempt.status !== 'submitted'
  ) {
    let onQuizSubmit = () => {}
    const activeSubmission =
      activeAttempt.attemptNo &&
      activeAttempt.attemptNo in itemData.itemActivity.submissions
        ? itemData.itemActivity.submissions[activeAttempt.attemptNo]
        : null

    const isActive = !!(
      activeAttempt.status === 'active' &&
      activeSubmission &&
      activeSubmission.questions &&
      !(activeSubmission.questions instanceof Error)
    )

    if (isActive) {
      const {
        validation_token,
        id: submissionId,
        attempt: attemptNo,
      } = activeSubmission!

      onQuizSubmit = () =>
        props.completeQuizSubmission(
          { attempt: attemptNo, validation_token },
          { courseId, quizId, submissionId, itemId, attemptNo }
        )
    }
    return (
      <AsyncDOM>
        <AsyncDOM.Loader
          show={
            activeAttempt.status === 'starting' ||
            activeAttempt.status === 'submitting'
          }
        >
          <Loader />
        </AsyncDOM.Loader>
        <AsyncDOM.Content show={isActive}>
          {isActive && !!activeSubmission ? (
            <QuizRunner
              submission={activeSubmission}
              activeAttempt={activeAttempt}
              itemId={props.itemId}
              quizId={props.contentId}
              courseId={props.courseId}
              onSubmit={onQuizSubmit}
            />
          ) : null}
        </AsyncDOM.Content>
      </AsyncDOM>
    )
  }

  const lockedByStartDate: boolean = itemData.content_details.lock_info
    ? isLockedByStartDate(itemData.content_details.lock_info.unlock_at || null)
    : false

  const attemptIds = itemData.itemActivity.submissions
    ? ((Object.keys(itemData.itemActivity.submissions) as unknown) as number[])
    : []

  const submissions: QuizSubmissionData[] = itemData.itemActivity.submissions
    ? pickIntoArray(itemData.itemActivity.submissions, attemptIds)
    : []

  const canStartQuiz: boolean =
    itemData.content_details.locked_for_user === false &&
    hasValidAttemptsAllowed(itemData.itemContent.allowed_attempts) &&
    hasValidAttemptsRemaining(
      itemData.itemContent.allowed_attempts,
      attemptIds.length
    )

  const score =
    submissions.length > 0
      ? submissions.slice().sort((subA, subB) => subA.attempt - subB.attempt)[0]
          .kept_score
      : null

  const isLoading = itemData.itemActivity.submissions === null
  const error =
    itemData.itemActivity.submissions !== null &&
    hasError(itemData.itemActivity.submissions)

  const hasData = !error && !!itemData.itemActivity.submissions
  const startQuiz = () => {
    props.startQuizSubmission({ quizId }, { quizId, courseId, itemId })
  }
  return (
    <AsyncDOM
      loading={isLoading}
      data={!isLoading && hasData}
      error={!isLoading && error}
    >
      <AsyncDOM.Loader>
        <Loader />
      </AsyncDOM.Loader>
      <AsyncDOM.Content>
        {hasData ? (
          <QuizContentItem
            itemData={itemData}
            lockedByStartDate={lockedByStartDate}
            startQuiz={canStartQuiz ? startQuiz : undefined}
            submissions={submissions}
            score={score}
          />
        ) : null}
      </AsyncDOM.Content>
      <AsyncDOM.Error>Oops! Something went wrong</AsyncDOM.Error>
    </AsyncDOM>
  )
}
export default connect(
  null,
  {
    fetchQuizSubmissions,
    startQuizSubmission,
    completeQuizSubmission,
  }
)(QuizItemTypeContent)
