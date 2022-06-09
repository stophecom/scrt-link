import React from 'react'
import { styled } from '@mui/system'
import { Box, Button, Grid } from '@mui/material'

const Switcher = styled('div')`
  border-radius: 0.5rem;
  padding: 0.15rem;
  border: 1px solid ${({ theme }) => theme.palette.grey['800']};
`
const Background = styled(Box)`
  border-radius: 0.3rem;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: 0.3s ease-out;
  width: 50%;
`

type Option = {
  title: string
  extra?: string
}
type SwitchProps = {
  activeSlide: number
  onChangeActiveSlide: (number: number) => void
  className?: string
  options: Option[]
}
const Switch: React.FunctionComponent<SwitchProps> = ({
  options,
  activeSlide,
  onChangeActiveSlide,
}) => (
  <Switcher>
    <Grid component="div" container spacing={0} position="relative">
      <Background
        sx={{
          backgroundColor: 'background.paper',
          transform: activeSlide === 1 ? 'translateX(100%)' : 'translateX(0)',
        }}
      ></Background>
      {options.map(({ title, extra }, index) => (
        <Grid
          component={Button}
          item
          key={index}
          disableRipple
          xs={6}
          onClick={() => onChangeActiveSlide(index)}
          sx={{
            backgroundColor: 'transparent',
            textTransform: 'initial',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            ...(activeSlide === index ? { color: 'text.primary' } : { color: `text.disabled` }),
          }}
        >
          {title}
          {extra && (
            <Box
              px={1}
              component="small"
              display={'inline-flex'}
              flexShrink={0}
              fontWeight="normal"
              sx={{
                ...(activeSlide === index ? { color: 'primary.main' } : { color: `inherit` }),
              }}
            >
              {extra}
            </Box>
          )}
        </Grid>
      ))}
    </Grid>
  </Switcher>
)

export default Switch
