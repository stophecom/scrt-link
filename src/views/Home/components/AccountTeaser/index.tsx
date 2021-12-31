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
    [
      t('common:components.AccountTeaser.items1.0', 'Unlimited secrets'),
      t('common:components.AccountTeaser.items1.1', 'Increased character limit'),
      t('common:components.AccountTeaser.items1.2', 'SMS read receipts'),
      t('common:components.AccountTeaser.items1.3', 'Email service'),
    ],
    [
      <Slack key="slack" />,
      t('common:components.AccountTeaser.items2.0', 'Browser extensions'),
      t('common:components.AccountTeaser.items2.1', 'Secret files (early 2022)'),
      t('common:components.AccountTeaser.items2.2', 'More to come…'),
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
