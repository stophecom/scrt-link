import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Typography } from '@mui/material'
import { styled } from '@mui/system'

const StyledMarkdown = styled('div')`
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

type MarkdownProps = {
  source: string
  className?: string
}
export const MarkdownStyled: React.FunctionComponent<MarkdownProps> = ({ source, className }) => (
  <Typography component="div">
    <StyledMarkdown>
      <ReactMarkdown className={className}>{source}</ReactMarkdown>
    </StyledMarkdown>
  </Typography>
)

export const MarkdownRaw: React.FunctionComponent<MarkdownProps> = ({ source, className }) => (
  <ReactMarkdown className={className}>{source}</ReactMarkdown>
)

export default MarkdownRaw
