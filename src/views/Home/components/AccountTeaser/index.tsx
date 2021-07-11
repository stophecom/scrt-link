import React from 'react'
import { Grid } from '@material-ui/core'

import UnorderedList from '@/components/UnorderedList'

const items = [
  ['Unlimited secrets', 'Increased character limit', 'Read receipts', 'Email service'],
  ['Browser extensions', 'Secret files (late 2021)', 'And much more…'],
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
