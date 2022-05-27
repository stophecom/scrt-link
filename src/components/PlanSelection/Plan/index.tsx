import React, { ReactNode } from 'react'
import { styled } from '@mui/system'
import { Check } from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

const PREFIX = 'Plan'

const classes = {
  paper: `${PREFIX}-paper`,
  planTitle: `${PREFIX}-planTitle`,
  check: `${PREFIX}-check`,
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`&.${classes.paper}`]: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: '100%',
    flexDirection: 'column',
    textAlign: 'center',
  },

  [`& .${classes.planTitle}`]: {
    marginBottom: '.4em',
  },

  [`& .${classes.check}`]: {
    width: '1.2em',
    height: '1.2em',
    borderRadius: '50%',
    backgroundColor: `${theme.palette.primary.main}`,
    color: `${theme.palette.text.primary}`,
    display: 'inline-flex',
    alignItems: 'center',
    position: 'absolute',
    left: 'calc(100% + .5em)',
    justifyContent: 'center',
  },
}))

type PlanProps = {
  title: string
  subtitle: ReactNode
  children?: ReactNode
  isCurrentPlan?: boolean
}
const Plan: React.FunctionComponent<PlanProps> = ({ title, subtitle, children, isCurrentPlan }) => {
  const { t } = useTranslation()
  return (
    <StyledPaper className={classes.paper}>
      <Box mb={2}>
        <Box display="flex" justifyContent="center" p={1} pb={2} fontSize="small">
          {subtitle}
        </Box>
        <Typography
          variant="h4"
          component="div"
          display="inline-flex"
          justifyContent="center"
          position="relative"
          alignItems={'center'}
        >
          {title}{' '}
          {isCurrentPlan && (
            <div className={classes.check}>
              <Check sx={{ fontSize: '.9em' }} />
            </div>
          )}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" height="100%">
        {children}
      </Box>
    </StyledPaper>
  )
}

export default Plan
