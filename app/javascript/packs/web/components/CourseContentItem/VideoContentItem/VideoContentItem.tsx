import React from 'react'
import styles from './VideoContentItem.module.css'

interface VideoContentItemProps {
  itemContentBody: string
}

const VideoContentItem = (props: VideoContentItemProps) => (
  <div className={styles.container}>
    <span className={styles.extraDetail}>
      Estimated time to complete: 3 min
    </span>
    <div dangerouslySetInnerHTML={{ __html: props.itemContentBody }} />
  </div>
)

export default VideoContentItem
