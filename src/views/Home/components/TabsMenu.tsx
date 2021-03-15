import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

export type TabsMenuItem = { label: string; key: string }

type TabsMenuProps = {
  value: string
  handleChange: any
  tabsMenu: TabsMenuItem[]
}
const TabsMenu = ({ value, handleChange, tabsMenu = [] }: TabsMenuProps) => {
  return (
    <Tabs
      value={value}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleChange}
      aria-label="What type of secret do you want to share?"
    >
      {tabsMenu.map(({ label, key }, index) => (
        <Tab label={label} id={key} value={key} key={index} />
      ))}
    </Tabs>
  )
}

export default TabsMenu
