import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Lock, VerifiedUser } from '@material-ui/icons'
import { useTranslation } from 'next-i18next'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.text.secondary,
      opacity: 0.7,
      paddingTop: '.15rem',
      paddingBottom: '.15rem',
    },
    illustration: {
      fontSize: '.9rem',
      marginRight: '.3rem',
    },
    title: {
      fontSize: '.7rem',
      color: theme.palette.text.primary,
    },
  }),
)

const Trust = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  const gridContent = [
    {
      illustration: <Lock className={classes.illustration} />,
      title: t('common:component.Trust.encryption', 'End-to-end encrypted (AES)'),
    },
    {
      illustration: <VerifiedUser className={classes.illustration} />,
      title: t('common:component.Trust.privacy', '100% Privacy protected'),
    },
  ]

  return (
    <Box display="flex" flexWrap="wrap" py={1}>
      {gridContent.map(({ illustration, title }, index) => {
        return (
          <Box key={`trust-${index}`} px={1} className={classes.box}>
            {illustration}
            <Typography className={classes.title}>{title}</Typography>
          </Box>
        )
      })}
    </Box>
  )
}
export default Trust
