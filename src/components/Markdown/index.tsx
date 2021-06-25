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
    <ReactMarkdown className={className}>{source}</ReactMarkdown>
  </Typography>
)

const StyledMarkdown = styled(Markdown)`
  font-size: ${({ theme }) => theme.typography.body1.fontSize};

  p {
    margin-top: 0;
  }
  ul li {
    margin-bottom: 0.5em;
  }
  a {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`

export default StyledMarkdown
