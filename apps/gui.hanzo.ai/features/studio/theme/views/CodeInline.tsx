import { Paragraph, styled } from '@hanzo/gui'

export const CodeInline = styled(Paragraph, {
  name: 'CodeInline',
  render: 'code',
  fontFamily: '$mono',
  backgroundColor: '$color02',
  cursor: 'inherit',
  rounded: '$3',
  // @ts-ignore
  fontSize: '85%',
  p: '$1.5',
})
