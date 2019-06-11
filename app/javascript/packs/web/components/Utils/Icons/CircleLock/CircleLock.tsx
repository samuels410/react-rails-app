import React from 'react'
import cx from 'classnames'
import { IconProps } from '@material-ui/core/Icon'
import LockIcon from '@material-ui/icons/Lock'
import styles from './CircleLock.module.css'

interface Props extends IconProps {
  containerClassName: string
  lockClassName?: string
}

const CircleLockIcon = ({ containerClassName, lockClassName }: Props) => (
  <div className={cx(styles.container, containerClassName)}>
    <LockIcon className={cx(styles.lock, lockClassName)} />
  </div>
)

export default CircleLockIcon
