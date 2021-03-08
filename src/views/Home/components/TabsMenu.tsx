import React from 'react'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

type TabsMenuProps = {
  value: string
  handleChange: any
}
const TabsMenu = ({ value, handleChange }: TabsMenuProps) => {
  return (
    <Paper square>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="What type of secret do you want to share?"
      >
        <Tab label="Message" id="message" value="message" />
        <Tab label="Redirect URL" id="url" value="url" />
        {/* <Tab label="Password" id="password" value="password" /> */}
      </Tabs>
    </Paper>
  )
}

export default TabsMenu
