import * as styleUtils from './styles'

describe('Style Utils', () => {
  describe('convertToCSSVariablesFormat', () => {
    const { convertToCSSVariablesFormat } = styleUtils
    test('Able to get color variables in correct format', () => {
      expect(
        convertToCSSVariablesFormat({
          darkGreen: 'green',
          veryLightBlue: '#eaecef',
          'pallette.primary.textContrast': '#0f0',
        })
      ).toEqual(
        expect.objectContaining({
          '--dark-green': 'green',
          '--very-light-blue': '#eaecef',
          '--pallette-primary-text-contrast': '#0f0',
        })
      )
    })
  })
})
