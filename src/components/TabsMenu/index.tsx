import React from 'react'
import { Tabs, TabsProps, Tab, TabProps } from '@mui/material'

interface TabsMenuProps extends TabsProps {
  tabsMenu: TabProps[]
}

const TabsMenu = ({ tabsMenu = [], ...props }: TabsMenuProps) => {
  return (
    <Tabs
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      {...props}
    >
      {tabsMenu.map(({ key, ...tabProps }, index) => (
        <Tab key={index} value={key} {...tabProps} />
      ))}
    </Tabs>
  )
}

export default TabsMenu
