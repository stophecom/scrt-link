import mj, { Email } from 'node-mailjet'
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
