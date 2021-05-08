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
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      height: '100%',

      [theme.breakpoints.up('sm')]: {
        flexDirection: 'column',
        textAlign: 'center',
      },
    },
    illustration: {
      width: '32%',
      flexShrink: 0,
      marginRight: theme.spacing(2),

      [theme.breakpoints.up('sm')]: {
        width: '100%',
        marginRight: 0,
      },
    },
    title: {
      marginBottom: theme.spacing(1),

      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(2),
      },
    },

    number: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.secondary,
      border: `2px solid ${theme.palette.primary.main}`,
      fontSize: '1.1rem',
      fontWeight: 'bold',

      [theme.breakpoints.down('xs')]: {
        border: 'none',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translate(-50%, -50%) ',
      },
    },
  }),
)

const gridContent = [
  {
    illustration: <Create />,
    title: 'Write',
    text: `Compose your secret message, submit and you'll receive a one-time link.`,
  },
  {
    illustration: <Share />,
    title: 'Share',
    text: 'Share your secret link using your preferred communication channel.',
  },
  {
    illustration: <Burn />,
    title: 'Burn',
    text: 'The secret link can be accessed one time. Afterwards it gets destroyed.',
  },
]

const HowItWorks = () => {
  const classes = useStyles()
  return (
    <Grid container spacing={2} justify="center">
      {gridContent.map(({ illustration, title, text }, index) => {
        return (
          <Grid item xs={12} sm={4} key={index}>
            <Paper className={classes.paper}>
              <Typography component="div" className={classes.number}>
                {index + 1}
              </Typography>
              <div className={classes.illustration}>{illustration}</div>
              <div>
                <Typography className={classes.title} variant="h3">
                  {title}
                </Typography>
                <Typography variant="body1">{text}</Typography>
              </div>
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
}
export default HowItWorks
