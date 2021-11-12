import React, { ReactNode, FunctionComponentElement } from 'react'
import { Check, SvgIconComponent } from '@material-ui/icons'
import clsx from 'clsx'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
      fontSize: '1.2em',
    },
    li: {
      display: 'flex',
      marginBottom: '.7em',
      fontWeight: theme.typography.fontWeightBold,
    },
    icon: {
      color: theme.palette.primary.main,
      marginRight: '.5em',
    },
  }),
)

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
  const classes = useStyles()

  return (
    <ul className={clsx(classes.root, className)}>
      {items.map((item, key) => (
        <li className={classes.li} key={key}>
          {React.cloneElement(icon, { className: clsx(classes.icon, iconClass) })}
          {item}
        </li>
      ))}
    </ul>
  )
}
export default UnorderedList
