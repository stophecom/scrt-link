import React from 'react'
import { Tabs, TabsProps, Tab, TabProps } from '@mui/material'

interface TabsMenuProps extends TabsProps {
  tabsMenu: TabProps[]
  isFocusMode?: boolean
}

const TabsMenu = ({ isFocusMode = false, tabsMenu = [], ...props }: TabsMenuProps) => {
  return (
    <Tabs
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      sx={[
        isFocusMode && {
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
            minWidth: '70px',
          }}
          {...tabProps}
        />
      ))}
    </Tabs>
  )
}

export default TabsMenu
