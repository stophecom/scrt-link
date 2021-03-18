## Scrt.link

**Scrt.link** let's you share one-time secrets with a link that self-distructs after first visit.

Live: **[scrt.link](https://scrt.link)**.

### Development

First, you need to set a MongoDB connection string for `DB` in `.env.development`.  
To run it in development mode:

```js
// Install
yarn install

// Development server
yarn run dev

// Build and static export
yarn build
yarn export

// Deploy
vercel
```

### Stack

- Framework: [Next.js](https://nextjs.org/)
- UI Components: [Material-UI](https://material-ui.com/)
- Styling: [styled-components](https://styled-components.com/)
- Forms: [Formik](https://jaredpalmer.com/formik)
- Form Validations: [Yup](https://github.com/jquense/yup)
- Icons: [Material Icons](https://material-ui.com/components/material-icons/)
- SEO: [Next SEO](https://github.com/garmeeh/next-seo)
- Database: [MongoDB](https://www.mongodb.com/)
- ODM: [Mongoose](https://mongoosejs.com/)
- Linting: [ESLint](https://eslint.org/)
- Code Formatting: [Prettier](https://prettier.io/)

### Licence

MIT

### Acknowledgement

This project has been heavily influenced by [OnURL](https://github.com/onderonur/onurl) and
[OneTimeSecret](https://github.com/onetimesecret/onetimesecret) Thank you!`
