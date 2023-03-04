import React, { ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { usePlausible } from 'next-plausible'

import { MarkdownStyled as Markdown } from '@/components/Markdown'

const PREFIX = 'FaqAccordion'

const classes = {
  heading: `${PREFIX}-heading`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.heading}`]: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
    '& p': {
      marginBottom: 0,
    },
  },
}))

type FaqAccordionProps = { items: { heading: string; body: string }[]; name?: string }
const FaqAccordion: React.FC<FaqAccordionProps> = ({ items, name }) => {
  const plausible = usePlausible()

  return (
    <Root id={name}>
      {items.map(({ heading, body }, index) => (
        <Accordion
          key={index}
          onChange={(_event, expanded) => {
            if (expanded) {
              plausible('FAQAccordion', { props: { question: heading } })
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`aria-faq-${index}`}
            id={`faq-${index}`}
          >
            <Markdown className={classes.heading} source={heading} />
          </AccordionSummary>
          <AccordionDetails>
            <Markdown source={body} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Root>
  )
}

type SimpleAccordionTypes = { items: { heading: ReactNode; body?: string }[]; name: string }
export const SimpleAccordion: React.FunctionComponent<SimpleAccordionTypes> = ({ items, name }) => {
  return (
    <div>
      {items.map(({ heading, body }, index) => (
        <Accordion key={index} elevation={0}>
          <AccordionSummary
            expandIcon={!!body && <ExpandMoreIcon />}
            aria-controls={`aria-${name}-${index}`}
            id={`${name}-${index}`}
            style={{ pointerEvents: body ? 'auto' : 'none' }}
          >
            {heading}
          </AccordionSummary>
          {body && (
            <AccordionDetails>
              <Box pl={4}>
                <Typography variant="body1" align="left" component="div">
                  <Markdown source={body} />
                </Typography>
              </Box>
            </AccordionDetails>
          )}
        </Accordion>
      ))}
    </div>
  )
}

export default FaqAccordion
