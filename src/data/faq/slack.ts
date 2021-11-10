const slackAppFaq = [
  {
    id: 'slack-security',
    category: 'slack',
    heading: 'Is the Slack App secure?',
    body: `The honest answer: We can't know for sure. It's important to understand that **end-to-end-encryption is not possible** with Slack apps. However, the communication between our app server and Slack is encrypted and we therefore believe that for 99% of use cases it's safe to use. Still, please be aware that **Slack is proprietary software** and we don't have control over code that runs your Slack instance. **In case you need to be 100% sure, create secrets via the website instead.**`,
  },
  {
    id: 'slack-trust',
    category: 'slack',
    heading: 'Why should I trust you?',
    body: `Short answer: Don't. That said, we believe in trust through transparency. While you might have something to hide, we don't. That's why all code is open source and available on [Gitlab](https://gitlab.com/kingchiller/scrt-link-slack). Feel free to launch your own private Slack App.`,
  },
  {
    id: 'slack-data-collection',
    category: 'slack',
    heading: 'What data do you collect?',
    body: `We only store data that is necessary to run the app. When you install the app, you grant us specific access rights (e.g. the right to post a secret link in your name). This data includes basic user information as well as the individual authorization tokens. Additionally, we temporarily store data required for read receipts.  
    **We don't store any other data. We do not use data for any other purpose, nor do we sell or distribute any of that.**`,
  },
  {
    id: 'slack-not-approved',
    category: 'slack',
    heading: `Why isn't this app approved by Slack?`,
    body: `We are working on submitting the app to the Slack App Directory to get officially listed. This process may take several weeks to complete.`,
  },
  {
    id: 'slack-scopes',
    category: 'slack',
    heading: 'What permissions are required?',
    body: `The app requires basic information about the user, channels and conversations. Additionally, the app needs the permission to post in your name, join a conversation and make use of _slash commands_ and _shortcuts_. You'll get more detailed information about permission scopes during the app installation.`,
  },
  {
    id: 'slack-user-account',
    category: 'slack',
    heading: 'Do I need an account to use the Slack app?',
    body: `No. Currently not. You are welcome.`,
  },
  {
    id: 'slack-premium-account',
    category: 'slack',
    heading: 'Do I need a premium subscription to use the Slack app?',
    body: `No. You are very welcome. But, you may of course support this project with a paid subscriptions regardless 🤓.`,
  },
]

export default slackAppFaq
