import React from 'react'
import { Tabs, Tab } from '@material-ui/core'

export type TabsMenuItem = { label: string; key: string; className?: string }

type TabsMenuProps = {
  value: string
  handleChange: any
  tabsMenu: TabsMenuItem[]
  className?: string
  label?: string
}
const TabsMenu = ({
  value,
  handleChange,
  label = 'Menu',
  tabsMenu = [],
  className,
}: TabsMenuProps) => {
  return (
    <Tabs
      className={className}
      value={value}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleChange}
      aria-label={label}
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabsMenu.map(({ label, key, className }, index) => (
        <Tab className={className} label={label} id={key} value={key} key={index} />
      ))}
    </Tabs>
  )
}

export default TabsMenu
