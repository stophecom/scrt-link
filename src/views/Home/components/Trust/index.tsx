import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Lock, Security, SupervisedUserCircle } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
    illustration: {
      fontSize: '1rem',
      marginRight: '.3rem',
    },
    title: {
      fontSize: '.7rem',
      color: theme.palette.text.primary,
    },
  }),
)

const HowItWorks = () => {
  const classes = useStyles()

  const gridContent = [
    {
      illustration: <Lock className={classes.illustration} />,
      title: 'End-to-end encryption (AES)',
    },
    {
      illustration: <Security className={classes.illustration} />,
      title: 'Protected Privacy',
    },
    {
      illustration: <SupervisedUserCircle className={classes.illustration} />,
      title: '100% Anonymous',
    },
  ]

  return (
    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} p={1}>
      {gridContent.map(({ illustration, title }, index) => {
        return (
          <Box key={index} p={1} className={classes.box}>
            {illustration}
            <Typography className={classes.title}>{title}</Typography>
          </Box>
        )
      })}
    </Box>
  )
}
export default HowItWorks