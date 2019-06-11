import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import MAQ from './MAQ'

storiesOf('Quiz/AnswerTypes/MAQ', module).add('default', () => (
  <MAQ
    id="4534"
    answer={[]}
    data={[
      { id: '1', text: 'This is option 1' },
      { id: '2', text: 'This is option 2' },
    ]}
    onChange={action('Option Clicked') as any}
  />
))
