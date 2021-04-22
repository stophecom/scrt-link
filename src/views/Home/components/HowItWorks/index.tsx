import React from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

// eslint-disable-next-line import/no-webpack-loader-syntax
import Create from '!@svgr/webpack!@/assets/images/create.svg'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Share from '!@svgr/webpack!@/assets/images/share.svg'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Burn from '!@svgr/webpack!@/assets/images/burn.svg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      height: '100%',
      color: theme.palette.text.secondary,
    },
    gridItem: {
      height: '100%',
    },
    number: {
      opacity: 0.7,
    },
  }),
)

const gridContent = [
  {
    illustration: <Create />,
    title: 'Write',
    text: `Add a secret message. After successful processing you'll receive a one-time link.`,
  },
  {
    illustration: <Share />,
    title: 'Share',
    text: 'Send the secret link using your preferred communications channel.',
  },
  {
    illustration: <Burn />,
    title: 'Burn',
    text: 'Once the link has been clicked, the secret gets revealed, and destroyed.',
  },
]

const HowItWorks = () => {
  const classes = useStyles()
  return (
    <Grid container spacing={2} justify="center">
      {gridContent.map(({ illustration, title, text }, index) => {
        return (
          <Grid item xs={9} sm={4} key={index} className={classes.gridItem}>
            <Paper className={classes.paper}>
              <Typography component="div" className={classes.number}>
                {index + 1}
              </Typography>
              {illustration}
              <Typography variant="h3">{title}</Typography>
              <Typography variant="body1">{text}</Typography>
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
}
export default HowItWorks
