import React from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

type MarkdownProps = {
  source: string
  className?: string
}
const Markdown: React.FunctionComponent<MarkdownProps> = ({ source, className }) => (
  <Typography component="div">
    <ReactMarkdown
      source={source}
      renderers={{
        image: (props) => <img loading="lazy" alt="" {...props} />,
      }}
      className={className}
    />
  </Typography>
)

const StyledMarkdown = styled(Markdown)`
  p {
    margin-top: 0;
  }
  a {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`

export default StyledMarkdown
