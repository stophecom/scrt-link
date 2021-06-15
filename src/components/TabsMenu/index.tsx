import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

export type TabsMenuItem = { label: string; key: string }

type TabsMenuProps = {
  value: string
  handleChange: any
  tabsMenu: TabsMenuItem[]
  label?: string
}
const TabsMenu = ({ value, handleChange, label = 'Menu', tabsMenu = [] }: TabsMenuProps) => {
  return (
    <Tabs
      value={value}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleChange}
      aria-label={label}
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabsMenu.map(({ label, key }, index) => (
        <Tab label={label} id={key} value={key} key={index} />
      ))}
    </Tabs>
  )
}

export default TabsMenu
