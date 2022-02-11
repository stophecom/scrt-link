import React, { ReactNode, FunctionComponentElement } from 'react'
import { styled } from '@mui/system'
import { Check, SvgIconComponent } from '@mui/icons-material'
import clsx from 'clsx'

const PREFIX = 'UnorderedList'

const classes = {
  root: `${PREFIX}-root`,
  li: `${PREFIX}-li`,
  icon: `${PREFIX}-icon`,
}

const Root = styled('ul')(({ theme }) => ({
  [`&.${classes.root}`]: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    fontSize: '1.2em',
  },

  [`& .${classes.li}`]: {
    display: 'flex',
    marginBottom: '.7em',
    fontWeight: 'bold',
  },

  [`& .${classes.icon}`]: {
    color: theme.palette.primary.main,
    marginRight: '.5em',
  },
}))

type Item = string | ReactNode
type UnorderedListProps = {
  className?: string
  items: Item[]
  icon?: FunctionComponentElement<SvgIconComponent>
  iconClass?: string
}
const UnorderedList: React.FunctionComponent<UnorderedListProps> = ({
  className,
  items = [],
  icon = <Check />,
  iconClass = '',
}) => {
  return (
    <Root className={clsx(classes.root, className)}>
      {items.map((item, key) => (
        <li className={classes.li} key={key}>
          {React.cloneElement(icon, { className: clsx(classes.icon, iconClass) })}
          {item}
        </li>
      ))}
    </Root>
  )
}
export default UnorderedList
