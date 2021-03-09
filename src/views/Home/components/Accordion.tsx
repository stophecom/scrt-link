import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Box } from '@material-ui/core'

import Markdown from '@/components/Markdown'

import { faq } from '@/data/faq'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: '-16px',
      marginLeft: '-16px',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
)

const SimpleAccordion = () => {
  const classes = useStyles()

  return (
    <Box py={3}>
      <div className={classes.root}>
        {faq.map(({ heading, body }, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`faq-${index}`}
              id={`faq-${index}`}
            >
              <Typography className={classes.heading}>{heading}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Markdown source={body} />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Box>
  )
}

export default SimpleAccordion
