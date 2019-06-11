import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import MCQ from './MCQ'

storiesOf('Quiz/AnswerTypes/MCQ', module).add('default', () => (
  <MCQ
    id="4534"
    data={[
      { id: '1', text: 'This is option 1' },
      { id: '2', text: 'This is option 2' },
    ]}
    onChange={action('Option Clicked') as any}
  />
))
