import React from 'react'
import { Grid, Typography } from '@material-ui/core'

import UnorderedList from '@/components/UnorderedList'
const Slack = () => (
  <>
    Slack App&nbsp;
    <Typography color="primary">
      <sup>NEW</sup>
    </Typography>
  </>
)
const items = [
  ['Unlimited secrets', 'Increased character limit', 'SMS read receipts', 'Email service'],
  [<Slack key="slack" />, 'Browser extensions', 'Secret files (late 2021)', 'More to come…'],
]

export const AccountTeaser = () => (
  <Grid container spacing={0}>
    {items.map((list, index) => (
      <Grid key={index} item xs={12} sm={6}>
        <UnorderedList items={list} />
      </Grid>
    ))}
  </Grid>
)

export default AccountTeaser
