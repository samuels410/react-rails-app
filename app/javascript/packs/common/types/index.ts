export type ObjectKey = string | number
export type ObjectMap<Key extends string | number, Value> = {
  [key in Key]: Value
}
export type PartialObjectMap<K extends string | number, T> = Partial<
  ObjectMap<K, T>
>

export type InvalidValues = null | undefined | 0 | '' | false | Error
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
export type ValidValue<T> = Exclude<T, null | undefined | 0 | '' | false>
export type ObjectWithStringValues = ObjectMap<ObjectKey, string>

export type NestedObjectWithStringValues = {
  [key in ObjectKey]: string | NestedObjectWithStringValues
}

export type FunctionReturningBoolean = (...args: any[]) => boolean

export type ProgramID = string | number
export type CourseID = string | number
export type ModuleID = string | number
export type ItemID = string | number
export type RecordingID = string | number
export type IndustryArticleID = string | number
export type GradedItemID = string | number

export type QuizID = string | number
export type ContentID = QuizID

// Course Grade Item: Assignment | Quiz
export interface GradedItemData {
  id: GradedItemID
  total: number
  score: number
  name: string
  created_at: string
}

// Course Recording
export interface CourseRecordingData {
  id: RecordingID
  imageUrl: string
  authorName: string
  createdAt: number
  title: string
  duration: number
}

// Industry Articles
export interface IndustryArticleData {
  id: IndustryArticleID
  url: string
  title: string
  desc: string
  source: string
  imgUrl: string
}

// Module Items
export type ModuleItem = {
  id: ItemID
  content_id: ContentID
  content_details?: {
    due_at?: string
    locked_for_user?: boolean
    lock_info?: {
      unlock_at?: string
      can_view?: boolean
    }
  }
  title: string
  itemContent?:
    | {
        [s: string]: any
      }
    | Error
}
export interface AssignmentModuleItemData extends ModuleItem {
  type: 'Assignment'
  progress?: number
  isCompleted?: boolean
  score?: number
  total?: number
  itemContent?:
    | {
        [s: string]: any
      }
    | Error
}
export interface VideoModuleItemData extends ModuleItem {
  type: 'Video'
  title: string
  videoLength?: number
  videoWatchedLength?: number
}
export interface PageModuleItemData extends ModuleItem {
  type: 'Page'
  title: string
  videoLength?: number
  videoWatchedLength?: number
}
export interface LearningMaterialModuleItemData extends ModuleItem {
  type: 'Learning'
  progress?: number
}
export interface SubHeaderModuleItemData extends ModuleItem {
  type: 'SubHeader'
}
export interface LinkModuleItemData extends ModuleItem {
  type: 'ExternalUrl'
  external_url: string
}
export interface ResourceModuleItemData extends ModuleItem {
  type: 'File'
  url: string
  itemContent?:
    | {
        filename: string
        url: string
      }
    | Error
}
export interface QuizModuleItemData extends ModuleItem {
  type: 'Quiz'
  title: string
  isCompleted?: boolean
  content_id: QuizID
  score?: number
  total?: number
  itemActivity?: {
    activeAttempt?: {
      attemptNo: QuizAttemptNo | null
      status: 'starting' | 'active' | 'submitting' | 'submitted'
      activeQuestionId: QuizQuestionID | null
      orderOfQuestions: QuizQuestionID[] | null
      error?: Error
    } | null
    submissions?:
      | PartialObjectMap<QuizAttemptNo, QuizSubmissionData>
      | Error
      | null
  }
  itemContent?:
    | {
        quiz_type: 'assignment' | 'survey' | 'practice_quiz'
        allowed_attempts: number
        question_count: number
        points_possible: number | null
        description: string
        due_at: string | null
        time_limit: number | null
      }
    | Error
}
export interface DiscussionQuestionModuleItemData extends ModuleItem {
  type: 'Discussion'
  progress?: number
  isCompleted?: boolean
  score?: number
  total?: number
}
export interface FallbackModuleItemData extends ModuleItem {
  type: ''
}

export type ModuleItemData =
  | AssignmentModuleItemData
  | VideoModuleItemData
  | PageModuleItemData
  | SubHeaderModuleItemData
  | LearningMaterialModuleItemData
  | LinkModuleItemData
  | ResourceModuleItemData
  | QuizModuleItemData
  | DiscussionQuestionModuleItemData

export type ExcludeUnusableValues<
  T,
  K extends keyof T,
  C = InvalidValues
> = Omit<T, K> & { [a in K]-?: Exclude<T[a], C> }

/** COURSE DATA */
export interface CourseDataBase {
  desc?: string
  course_id: CourseID
  course_name: string
  image_url?: string
  start_date?: string
  end_date?: string
}

export interface ActiveCourseData extends CourseDataBase {
  marks?: number
  total_marks?: number
  progress?: number
  end_date?: string
  grade?: string
}

export interface CompletedCourseData extends CourseDataBase {
  grade?: string
  marks: number
  total_marks: number
}

export interface UpcomingCourseData extends CourseDataBase {}

export interface FailedCourseData extends CompletedCourseData {}
export type CourseData =
  | ActiveCourseData
  | CompletedCourseData
  | UpcomingCourseData
  | FailedCourseData

export interface ModuleData {
  id: ModuleID
  name?: string
  state: 'locked' | 'unlocked' | 'started' | 'completed'
  unlock_at: string | null
}

export type QuizAttemptID = string
export type QuizAttemptNo = number
export type QuizSubmissionID = string | number
export interface QuizSubmissionData {
  id: QuizSubmissionID
  quiz_id: QuizID
  started_at: string
  score: number
  kept_score: number
  workflow_state:
    | 'complete'
    | 'untaken'
    | 'preview'
    | 'settings_only'
    | 'pending_review'
  end_at: string
  finished_at: string
  validation_token: string
  attempts_left: number
  attempt: QuizAttemptNo
  answers?: Partial<ObjectMap<QuizQuestionID, QuizAnswerData>> | null | Error
  questions?: ObjectMap<QuizQuestionID, QuizQuestionData> | null | Error
}

export type QuizQuestionID = number | string
export type QuizAnswerOptionID = number | string

interface QuizQuestionBase {
  id: QuizQuestionID
  position: number
  question_name: string
  question_text: string
  flagged: boolean
}

export interface MCQQuizQuestion extends QuizQuestionBase {
  question_type: 'multiple_choice_question'
  answers: { id: QuizAnswerOptionID; text: string }[]
}

export interface MAQQuizQuestion extends QuizQuestionBase {
  question_type: 'multiple_answers_question'
  answers: { id: QuizAnswerOptionID; text: string }[]
}

export interface TrueFalseQuizQuestion extends QuizQuestionBase {
  question_type: 'true_false_question'
  answers: [
    { id: QuizAnswerOptionID; text: 'True' },
    { id: QuizAnswerOptionID; text: 'False' }
  ]
}

export interface EssayQuizQuestion extends QuizQuestionBase {
  question_type: 'essay_question'
}

export type QuizQuestionData =
  | MCQQuizQuestion
  | MAQQuizQuestion
  | TrueFalseQuizQuestion
  | EssayQuizQuestion

interface QuizAnswerBase {
  id: QuizQuestionID
  flagged: boolean
}

export interface MCQQuizAnswer extends QuizAnswerBase {
  answer: QuizAnswerOptionID | null
}

export interface MAQQuizAnswer extends QuizAnswerBase {
  answer: QuizAnswerOptionID[] | null
}

export interface EssayQuizAnswer extends QuizAnswerBase {
  answer: string | null
}

export interface TrueFalseQuizAnswer extends QuizAnswerBase {
  answer: QuizAnswerOptionID | null
}

export type QuizAnswerData =
  | MAQQuizAnswer
  | MCQQuizAnswer
  | EssayQuizAnswer
  | TrueFalseQuizAnswer
