import {
  ObjectWithStringValues,
  ModuleData,
  ModuleItemData,
  QuizModuleItemData,
} from '../types'

export const grades: ObjectWithStringValues = {
  E: 'Excellent',
  C: 'Completed',
}

export const quizTypes = {
  assignment: 'Graded Quiz',
  practice_quiz: 'Practice Quiz',
  survey: 'Survey',
  graded_survey: 'Graded Survey',
}

export const getGradeText = (grade: string) => {
  return grades[grade.toUpperCase()]
}

export const isLockedByStartDate = (unlockAt: string | null): boolean => {
  if (unlockAt === null) {
    return false
  }
  const unlockDate = new Date(unlockAt).getTime()
  return unlockDate > Date.now()
}

export const isItemLocked = (
  itemContentDetails: ModuleItemData['content_details']
): boolean => {
  if (
    !itemContentDetails ||
    !('locked_for_user' in itemContentDetails) ||
    itemContentDetails.locked_for_user === false
  ) {
    return false
  }

  const { lock_info } = itemContentDetails

  if (lock_info && 'unlock_at' in lock_info) {
    /** Not considering an item as locked, if it is locked by date */
    return !isLockedByStartDate(lock_info.unlock_at!)
  }
  return true
}

export const isModuleLocked = (moduleObj: ModuleData): boolean => {
  if (moduleObj.state !== 'locked') {
    return false
  }
  /** Not considering an item as locked, if it is locked by date */
  return !isLockedByStartDate(moduleObj.unlock_at)
}

/**
 * QUIZ utils:
 */

/**
 * Check if user has valid number of attempts for this quiz
 */
export const hasValidAttemptsAllowed = (allowedAttempts: number | null) =>
  typeof allowedAttempts === 'number' &&
  (allowedAttempts === -1 || allowedAttempts >= 1)

/**
 * Check if user has valid number of attempts remaining for this quiz
 */
export const hasValidAttemptsRemaining = (
  allowedAttempts: number,
  usedAttempts: number
) => allowedAttempts === -1 || usedAttempts < allowedAttempts
