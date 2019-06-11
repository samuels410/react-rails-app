import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Essay from './Essay'

storiesOf('Quiz/AnswerTypes/Essay', module).add('default', () => (
  <Essay id="4534" onChange={action('Option Clicked') as any} />
))
