import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useTranslation } from 'next-i18next'

import UnorderedList from '@/components/UnorderedList'
const Slack = () => (
  <>
    Slack App&nbsp;
    <Typography color="primary">
      <sup>NEW</sup>
    </Typography>
  </>
)

export const AccountTeaser = () => {
  const { t } = useTranslation()

  const items = [
    t('common:components.AccountTeaser.items1', {
      returnObjects: true,
      defaultValue: [
        'Unlimited secrets',
        'Increased character limit',
        'SMS read receipts',
        'Email service',
      ],
    }) as string[],
    [
      <Slack key="slack" />,
      ...(t('common:components.AccountTeaser.items2', {
        returnObjects: true,
        defaultValue: ['Browser extensions', 'Secret files (late 2021)', 'More to come…'],
      }) as string[]),
    ],
  ]

  return (
    <Grid container spacing={0}>
      {items.map((list, index) => (
        <Grid key={index} item xs={12} sm={6}>
          <UnorderedList items={list} />
        </Grid>
      ))}
    </Grid>
  )
}
export default AccountTeaser
