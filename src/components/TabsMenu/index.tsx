import React from 'react'
import { Tabs, TabsProps, Tab, TabProps } from '@mui/material'

interface TabsMenuProps extends TabsProps {
  tabsMenu: TabProps[]
  focusMode?: boolean
}

const TabsMenu = ({ focusMode = false, tabsMenu = [], ...props }: TabsMenuProps) => {
  return (
    <Tabs
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      sx={[
        focusMode && {
          '[aria-selected="false"]': { opacity: 0.4 },
        },
        {
          '.MuiTabs-indicator': {
            opacity: 0,
          },
        },
      ]}
      {...props}
    >
      {tabsMenu.map(({ key, ...tabProps }, index) => (
        <Tab
          key={index}
          value={key}
          sx={{
            fontSize: {
              xs: '0.8rem',
              sm: '0.875rem',
            },
            paddingLeft: {
              xs: '.7rem',
              sm: '1rem',
            },
            paddingRight: {
              xs: '.7rem',
              sm: '1rem',
            },
          }}
          {...tabProps}
        />
      ))}
    </Tabs>
  )
}

export default TabsMenu
