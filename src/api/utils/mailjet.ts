import mj, { Email } from 'node-mailjet'

const mailjet = ({ To, Subject = 'Pssst', ...props }: Partial<Email.SendParamsMessage>) =>
  mj
    .connect(`${process.env.MJ_APIKEY_PUBLIC}`, `${process.env.MJ_APIKEY_PRIVATE}`)
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: 'pssst@scrt.link',
            Name: 'scrt.link',
          },
          To,
          Subject,
          ...props,
        },
      ],
    })

export default mailjet
