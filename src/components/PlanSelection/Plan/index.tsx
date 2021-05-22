import React, { ReactNode } from 'react'
import { Check } from '@material-ui/icons'
import { Box, Paper, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      height: '100%',
      flexDirection: 'column',
      textAlign: 'center',
    },
    planTitle: {
      marginBottom: '.4em',
    },
    check: {
      width: '2em',
      height: '2em',
      position: 'absolute',
      borderRadius: '50%',
      backgroundColor: `${theme.palette.primary.main}`,
      color: `${theme.palette.text.primary}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.4rem',
      right: '0',
      top: '0',
      transform: 'translate(20%, -20%)',
    },
  }),
)

type PlanProps = {
  title: string
  subtitle: ReactNode
  overline?: ReactNode
  children?: ReactNode
  isCurrentPlan?: boolean
}
const Plan: React.FunctionComponent<PlanProps> = ({
  title,
  subtitle,
  overline,
  children,
  isCurrentPlan,
}) => {
  const classes = useStyles()
  return (
    <Paper className={classes.paper}>
      {isCurrentPlan && (
        <div className={classes.check}>
          <Check />
        </div>
      )}
      <Box mb={2}>
        <Box display="flex" justifyContent="center" p={1} fontSize="small">
          <small>{isCurrentPlan ? 'Current plan' : overline}</small>
        </Box>
        <Typography variant="h3" className={classes.planTitle}>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {subtitle}
        </Typography>
      </Box>
      <Box>{children}</Box>
    </Paper>
  )
}

export default Plan
