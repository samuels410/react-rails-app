import React from 'react'
import { VideoModuleItemData, PageModuleItemData } from '../../../common/types'
import VideoContentItem from '../../components/CourseContentItem/VideoContentItem'

interface VideoItemTypeContentProps {
  itemData: VideoModuleItemData | PageModuleItemData
}

const VideoItemTypeContent = (props: VideoItemTypeContentProps) => {
  const { itemData } = props

  let itemContentBody = ''
  if (!(itemData.itemContent instanceof Error))
    itemContentBody = `<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' /> <div style="overflow-wrap: break-word;">${
      itemData.itemContent!.body
    }</div>`

  return <VideoContentItem itemContentBody={itemContentBody} />
}

export default VideoItemTypeContent
