import mj, { Email, SMS } from 'node-mailjet'
import { email } from '@/constants'
const mailjet = ({ To, Subject = 'Shhh', ...props }: Partial<Email.SendParamsMessage>) =>
  mj
    .connect(`${process.env.MJ_APIKEY_PUBLIC}`, `${process.env.MJ_APIKEY_PRIVATE}`)
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: email,
            Name: 'scrt.link',
          },
          To,
          Subject,
          ...props,
        },
      ],
    })

export default mailjet

export const mailjetSms = (props: Omit<SMS.SendParams, 'From'>) =>
  mj
    .connect(process.env.MJ_SMS_TOKEN, {
      url: 'api.mailjet.com', // default is the API url
      version: 'v4', // default is '/v3'
      perform_api_call: true, // used for tests. default is true
    })
    .post('sms-send')
    .request({
      From: 'scrt.link',
      ...props,
    })
