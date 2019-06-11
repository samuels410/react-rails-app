import React from 'react'
import { ResourceModuleItemData } from '../../../../common/types'
import { downloadFile } from '../../../../common/utils'
import ResourceContentItem from '../../../components/CourseContentItem/ResourceContentItem'

interface Props {
  itemData: ResourceModuleItemData
}

const ResourceItemTypeContent = (props: Props) => {
  const downloadHandler = () => {
    if (props.itemData.itemContent && 'url' in props.itemData.itemContent) {
      const { url, filename: fileName } = props.itemData.itemContent
      downloadFile({ url, fileName })
    }
  }

  const downloadAllHandler = () => {
    if (props.itemData.itemContent && 'url' in props.itemData.itemContent) {
      const { url, filename: fileName } = props.itemData.itemContent
      downloadFile({ url, fileName })
    }
  }

  return (
    <ResourceContentItem
      data={props.itemData}
      downloadAll={downloadAllHandler}
      downloadFile={downloadHandler}
    />
  )
}

export default ResourceItemTypeContent
