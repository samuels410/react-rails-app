import React from 'react'
import { AssignmentModuleItemData } from '../../../../common/types'
import AssignmentContentItem from '../../../components/CourseContentItem/AssignmentContentItem'

interface AssignmentItemTypeContentProps {
  itemData: AssignmentModuleItemData
}

const AssignmentItemTypeContent = (props: AssignmentItemTypeContentProps) => {
  const { itemData } = props

  if (itemData.itemContent && !(itemData.itemContent instanceof Error))
    return <AssignmentContentItem itemData={itemData} />
  return null
}

export default AssignmentItemTypeContent
