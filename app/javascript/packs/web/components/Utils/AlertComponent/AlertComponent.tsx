import React, { useState, Fragment } from 'react'
import Alert from '../Alert'
import styles from './AlertComponent.module.css'

interface AlertComponentProps {
  message: string
}

const AlertComponent = (props: AlertComponentProps) => {
  const [isOpen, setAlertStatus] = useState(false)
  const onClose = () => setAlertStatus(false)
  const onOpen = () => setAlertStatus(true)
  return (
    <Fragment>
      <div role="presentation" className={styles.container} onClick={onOpen} />
      <Alert
        open={isOpen}
        onClose={onClose}
        variant="warning"
        message={props.message}
      />
    </Fragment>
  )
}
AlertComponent.defaultProps = {
  message: 'Lesson is not yet released',
}

export default AlertComponent
