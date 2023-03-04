import twilio from 'twilio'

// Twilio Credentials
// To set up environmental variables, see http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

// require the Twilio module and create a REST client
const client = twilio(accountSid, authToken)

type TwilioMessagingSms = {
  to: string
  body: string
}
export const twilioSms = (props: TwilioMessagingSms) =>
  client.messages.create({
    messagingServiceSid: 'MG27fd1eb9710c531fafbee55ecdc2c2e3', // Read receipts
    ...props,
  })
