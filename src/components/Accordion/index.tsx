import React, { ReactNode } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { usePlausible } from 'next-plausible'

import Markdown from '@/components/Markdown'

import { shortFaq } from '@/data/faq'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
      '& p': {
        marginBottom: 0,
      },
    },
  }),
)

const FaqAccordion = () => {
  const classes = useStyles()
  const plausible = usePlausible()

  return (
    <div>
      {shortFaq.map(({ heading, body }, index) => (
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
    </div>
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
