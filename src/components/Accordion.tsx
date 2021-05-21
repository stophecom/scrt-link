import React, { ReactNode } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
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

type SimpleAccordionTypes = { items: { heading: ReactNode; body: ReactNode }[]; name: string }
export const SimpleAccordion: React.FunctionComponent<SimpleAccordionTypes> = ({ items, name }) => {
  return (
    <div>
      {items.map(({ heading, body }, index) => (
        <Accordion key={index} elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`aria-${name}-${index}`}
            id={`${name}-${index}`}
          >
            {heading}
          </AccordionSummary>
          <AccordionDetails>{body}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default FaqAccordion
