import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import TrueFalse from './TrueFalse'

storiesOf('Quiz/AnswerTypes/TrueFalse', module).add('default', () => (
  <TrueFalse
    id="4534"
    data={[{ id: '1', text: 'True' }, { id: '2', text: 'False' }]}
    onChange={action('Option Clicked') as any}
  />
))
