import React, { Fragment } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Box } from '@material-ui/core'
import { twitterLink } from '@/constants'
import Markdown from '@/components/Markdown'

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

const items = [
  {
    heading: 'How does it work?',
    body: `After you submit the form your secret will be encrypted and stored. You can now share the generated short link via text message, email or whatever service you trust. (We recommend Matrix, Signal or Threema) After the recepients clicks the link, the message gets displayed and permanently removed from the server. For extra security you can set a password that will be needed to decrypt the message. (We recommend to share the password via a different channel.)`,
  },
  {
    heading: 'Why should I use this service?',
    body: `Sharing secrets is delicate. You don't want sensitive information, like passwords, to stay in your Slack Channel, Whatsapp chat, Email or any other chat app or communications channel. A one-time disposable link guarantees that your secret is only viewed one time, before it's gone forever.`,
  },
  {
    heading: 'Can I retrieve a secret that has already been shared?',
    body: `Nope. We show it once and then delete it permanently from the database. There is no backup. It's gone for good.`,
  },
  {
    heading: 'What is the maximum message size?',
    body: `The current limit is 280 characters.`,
  },
  {
    heading: 'Can the recepient save the message?',
    body: `Sure. You can always take a screenshot. The idea behind this service is to securely share sensitive information one time. We (obviously) don't have control over what a recepient does with the message.`,
  },
  {
    heading: 'How long do you keep non-viewed secrets?',
    body: `Until the end of times.`,
  },
  {
    heading: 'Why should I trust you?',
    body: `Information without context is useless. Let's say you share a password - we have no way of knowing what service and/or username it belongs to. If you include a password, we use it to encrypt your secret message. We don't store the password (only a hash) so we can never know what the secret is because we can't decrypt it. 
    In any case. Don't take our word for it. Check for yourself, the code is open source on Gitlab. Build your own service!
    `,
  },
  {
    heading: 'Who is behind this service?',
    body: `I'm Christophe, UI-designer and front-end developer from Basel, Switzerland. Follow me on Twitter [@stophecom](${twitterLink}). This project has been heavily influenced by [OnURL](https://github.com/onderonur/onurl) and [OneTimeSecret](https://github.com/onetimesecret/onetimesecret) Thank you!`,
  },
]
const SimpleAccordion = () => {
  const classes = useStyles()

  return (
    <Box py={3}>
      <div className={classes.root}>
        {items.map(({ heading, body }, index) => (
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
