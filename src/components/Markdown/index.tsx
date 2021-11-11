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
  p:last-of-type {
    margin-bottom: 0;
  }
  h3,
  h4 {
    margin-bottom: 0.5em;
  }
  h3:not(:first-of-type) {
    margin-top: 2em;
  }
  hr {
    margin-top: 2em;
    margin-bottom: 2em;
    opacity: 0.25;
  }
  ul li {
    margin-bottom: 0.5em;
  }
  img {
    margin-top: 1em;
    margin-bottom: 1em;
    max-width: 100%;
  }
  a {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`

export default StyledMarkdown
