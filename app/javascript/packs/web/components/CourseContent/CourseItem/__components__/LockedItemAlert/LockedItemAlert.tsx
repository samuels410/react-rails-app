import React, { Fragment, useState } from 'react'
import Alert from '../../../../Utils/Alert'
import styles from '../../CourseItem.module.css'

interface Props {
  message: string
}

const LockedItemAlert = (props: Props) => {
  const [isOpen, setAlertStatus] = useState(false)
  const onClose = () => setAlertStatus(false)
  const onOpen = () => setAlertStatus(true)
  return (
    <Fragment>
      <div
        role="presentation"
        className={styles.courseItemCTA}
        onClick={onOpen}
      />
      <Alert
        open={isOpen}
        onClose={onClose}
        variant="warning"
        message={props.message}
      />
    </Fragment>
  )
}

LockedItemAlert.defaultProps = {
  message: 'Lesson is not yet released',
}

export default LockedItemAlert
