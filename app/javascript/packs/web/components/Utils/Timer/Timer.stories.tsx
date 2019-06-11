import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Timer from './Timer'

storiesOf('Utils/Timer', module).add('default', () => (
  <Timer duration={10} onEnd={action('Timer Completed')} />
))
