![Uptime Robot](https://img.shields.io/uptimerobot/status/m790332623-d87562e4e90c2e4ed1b5625f)

## scrt.link

**Scrt.link** lets you share one-time secrets with a link that self-destructs after the first visit.

Live: **[scrt.link](https://scrt.link)**.

### Development

First, add `.env.development` with ENV variables listed in `.env.example`.

```js
// Install
yarn

// Development server
yarn dev

// Build and start server. Note that build command requires .env.production.
yarn build
yarn start

```

#### Run with Docker

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
yarn parse-translations

// To fetch latest translation files from tolgee.io
yarn fetch-translations

```

#### How to add a new language

- Edit `next-i18next.config` and add language
- Make sure to update `/src/utils/validationSchemas.ts` to enable translated form validation (yup)
- Add translation via json file in `/public/locales/`. (Or via tolgee.io)

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
