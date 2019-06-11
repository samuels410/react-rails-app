import React from 'react'
import { ModuleItemData, CourseID, ItemID } from '../../../common/types'
import VideoItemTypeContent from './VideoItemTypeContent'
import ResourceItemTypeContent from './ResourceItemTypeContent'
import QuizItemTypeContent from './QuizItemTypeContent'
import { isItemLocked } from '../../../common/utils/courses'
import AssignmentItemTypeContent from './AssignmentItemTypeContent';

interface ItemContentProps {
  itemId: ItemID
  courseId: CourseID
  itemData: ModuleItemData
}

const ItemTypeContent = (props: ItemContentProps) => {
  const { itemData } = props
  const itemContent =
    itemData && 'itemContent' in itemData ? itemData.itemContent : undefined
  if (!itemContent) {
    return null
  }
  if (isItemLocked(itemContent.content_details)) {
    return <div style={{ margin: 20 }}>Lesson is not yet released</div>
  }
  switch (itemData.type) {
    case 'File':
      return <ResourceItemTypeContent itemData={itemData} />
    case 'Page':
      return <VideoItemTypeContent itemData={itemData} />
    case 'Quiz':
      return (
        <QuizItemTypeContent
          itemData={itemData}
          itemId={props.itemId}
          courseId={props.courseId}
          contentId={itemData.content_id}
        />
      )
    case 'Assignment':
      return <AssignmentItemTypeContent itemData={itemData} />
    default:
      return null
  }
}
export default ItemTypeContent
