import { Paragraph, styled } from '@hanzo/gui'

export const LI = styled(Paragraph, {
  display: 'list-item' as any,
  render: 'li',
  size: '$5',
  pb: '$1',
  style: {
    listStyleType: 'disc',
  },
})
