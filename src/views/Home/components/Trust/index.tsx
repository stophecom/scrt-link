import React from 'react'
import { styled } from '@mui/system'
import { Box, Typography } from '@mui/material'
import { Lock, LocalFireDepartment, HealthAndSafety } from '@mui/icons-material'
import { useTranslation } from 'next-i18next'
const PREFIX = 'Trust'

const classes = {
  box: `${PREFIX}-box`,
  illustration: `${PREFIX}-illustration`,
  title: `${PREFIX}-title`,
}

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.box}`]: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    opacity: 0.7,
    paddingTop: '.15rem',
    paddingBottom: '.15rem',
  },

  [`& .${classes.illustration}`]: {
    fontSize: '.9rem',
    marginRight: '.3rem',
  },

  [`& .${classes.title}`]: {
    fontSize: '.7rem',
    color: theme.palette.text.primary,
  },
}))

const Trust = () => {
  const { t } = useTranslation()

  const gridContent = [
    {
      illustration: <Lock className={classes.illustration} />,
      title: t('common:components.Trust.encryption', 'End-to-end encrypted'),
    },
    {
      illustration: <HealthAndSafety className={classes.illustration} />,
      title: t('common:components.Trust.privacy', 'Swiss Privacy'),
    },
    {
      illustration: <LocalFireDepartment className={classes.illustration} />,
      title: t('common:components.Trust.noTrace', 'Without trace'),
    },
  ]

  return (
    <StyledBox display="flex" flexWrap="wrap" py={1} justifyContent={{ xs: 'center', sm: 'start' }}>
      {gridContent.map(({ illustration, title }, index) => {
        return (
          <Box key={`trust-${index}`} px={1} className={classes.box}>
            {illustration}
            <Typography className={classes.title}>{title}</Typography>
          </Box>
        )
      })}
    </StyledBox>
  )
}
export default Trust
