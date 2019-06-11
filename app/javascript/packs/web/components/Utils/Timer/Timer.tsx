import React, { useState, useEffect, Fragment, useRef } from 'react'
import {
  getDurationString,
  differenceBetweenTimeInSeconds,
} from '../../../../common/utils'

interface BaseProps {
  onEnd: () => void
}

interface EndAtProps {
  endAt: string
}

interface DurationProps {
  /** Duration in seconds */
  duration: number
}

type Props = (DurationProps | EndAtProps) & BaseProps

const getTimerObj = (prop: DurationProps | EndAtProps) => {
  const duration =
    'endAt' in prop
      ? differenceBetweenTimeInSeconds(new Date(prop.endAt), new Date())
      : prop.duration

  const startTime = new Date(Date.now())
  const endTime = new Date(startTime.getTime() + duration * 1000)

  return {
    startTime,
    endTime,
    timeRemaining: duration,
  }
}

const Timer = (props: Props) => {
  const mounted = useRef(false)
  const [timerObj, updateTimerObj] = useState(getTimerObj(props))
  let interval: null | NodeJS.Timeout

  const clearTimer = () => {
    if (interval) {
      clearInterval(interval)
    }
  }

  const handler = () => {
    const timeRemaining = differenceBetweenTimeInSeconds(
      timerObj.endTime,
      new Date()
    )
    updateTimerObj(prevState => ({ ...prevState, timeRemaining }))
    if (timeRemaining === 0) {
      props.onEnd()
      clearTimer()
    }
  }

  const timerBaseValue = 'endAt' in props ? props.endAt : props.duration

  /** Run only in componentDidUpdate, if timerBaseValue changes */
  useEffect(() => {
    if (mounted.current) {
      updateTimerObj(getTimerObj(props))
    }
    mounted.current = true
  }, [timerBaseValue])

  useEffect(() => {
    interval = setInterval(handler, 1000)
    return () => clearTimer()
  }, [timerObj.endTime])

  return <Fragment>{getDurationString(timerObj.timeRemaining)}</Fragment>
}

export default Timer
