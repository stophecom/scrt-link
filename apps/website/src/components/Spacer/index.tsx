import { Box, BoxProps } from '@mui/material'
import { styled } from '@mui/system'

type SpacerProps = BoxProps & {
  spacing: number
  // To make it a required prop
  flexDirection: BoxProps['flexDirection']
}

const Spacer = styled(Box)<SpacerProps>`
  display: flex;
  align-items: ${({ alignItems, flexDirection }) =>
    alignItems ?? flexDirection === 'row' ? 'center' : undefined};
  > *:not(:last-child) {
    ${({ flexDirection, theme, spacing }) =>
      flexDirection === 'row'
        ? `
            margin-right: ${theme.spacing(spacing)};
          `
        : `
            margin-bottom: ${theme.spacing(spacing)};
          `}
  }
`

export default Spacer
