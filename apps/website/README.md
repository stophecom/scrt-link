![Uptime Robot](https://img.shields.io/uptimerobot/status/m790332623-d87562e4e90c2e4ed1b5625f)

## scrt.link

**Scrt.link** lets you share one-time secrets with a link that self-destructs after the first visit.

Live: **[scrt.link](https://scrt.link)**.

### Development

First, add `.env.development` with ENV variables listed in `.env.example`.

```js
// Install
pnpm

// Development server
pnpm dev

// Build and start server. Note that build command requires .env.production.
pnpm build
pnpm start

```

#### Run with Docker (WIP)

```js
// Docker: Build image. Note that Docker build requires .env.production file.
docker build -t scrt .

// Docker: Build image without cache
docker build --no-cache -t scrt .

// Docker: Run
docker run -p 3000:3000 scrt



// With MongoDB
docker-compose up

// Re-build images
docker-compose up --build
```

### Localization

- Based on https://github.com/isaachinman/next-i18next
- All translation files are stored under `/public/locales/`.
- There is a folder for every locale: e.g. `/public/locales/de/common.json`
- Currently only namespace (common) is used - this might change in the future.
- Currently using tolgee.io to manage translations.

#### Helper scripts

```js
// To parse translations, use:
pnpm parse-translations

// To fetch latest translation files from tolgee.io
pnpm fetch-translations

```

#### How to add a new language

- Edit `next-i18next.config` and add language
- Make sure to update `/src/utils/validationSchemas.ts` to enable translated form validation (yup)
- Check mail and sms template texts in `src/constants` - which are currently hardcoded.
- Add translation via json file in `/public/locales/`. (Or via tolgee.io)
- Add translated versions for images in `/public/images/{locale}`

### Stripe Webhooks

```js
// Forward stripe webhooks to localhost (via stripe cli)
// More info: https://stripe.com/docs/webhooks/test
stripe listen --load-from-webhooks-api --forward-to localhost:3000

```

### Credits/Inspiration

- [PrivateBin](https://github.com/PrivateBin/PrivateBin)
- [OneTimeSecret](https://github.com/onetimesecret/onetimesecret)
- [Yopass](https://github.com/jhaals/yopass)
- [Saltify](https://www.saltify.io/)
- [hat.sh](https://github.com/sh-dv/hat.sh)
- [OnURL](https://github.com/onderonur/onurl)

### Licenses

MIT

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>
