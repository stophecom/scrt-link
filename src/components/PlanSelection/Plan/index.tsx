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
    width: '2.4rem',
    height: '2.4rem',
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
    transform: 'translate(15%, -15%)',
  },
}))

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
  const { t } = useTranslation()
  return (
    <StyledPaper className={classes.paper}>
      {isCurrentPlan && (
        <div className={classes.check}>
          <Check />
        </div>
      )}
      <Box mb={2}>
        <Box display="flex" justifyContent="center" p={1} fontSize="small">
          <small>
            {isCurrentPlan
              ? t('common:components.PlanSelection.currentPlan', 'Current Plan')
              : overline}
          </small>
        </Box>
        <Typography variant="h3" className={classes.planTitle}>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {subtitle}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" height="100%">
        {children}
      </Box>
    </StyledPaper>
  )
}

export default Plan
