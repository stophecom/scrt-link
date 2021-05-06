import React from 'react'
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
    root: {
      [theme.breakpoints.down('sm')]: {
        marginRight: '-16px',
        marginLeft: '-16px',
      },
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
      '& p': {
        marginBottom: 0,
      },
    },
  }),
)

const SimpleAccordion = () => {
  const classes = useStyles()
  const plausible = usePlausible()

  return (
    <div className={classes.root}>
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

export default SimpleAccordion
