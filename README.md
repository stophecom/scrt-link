# scrt.link

**Scrt.link** lets you share one-time secrets with a link that self-destructs after the first visit.

Live: **[scrt.link](https://scrt.link)**.

## Development

This project is set up as a monorepo. In the `/apps` folder we store the website application, in `packages` the common libraries.

The other apps, like the slack app and the browser extensions may be ported eventually.

```bash

# Install dependencies
pnpm i

# Serve (Runs the website and watches the libraries)
pnpm dev

```

## Monorepo structure

- `/apps/website`: The scrt.link website
- `/packages/core`: Core that provides all cryptographic helpers and provides API connection helpers. (WIP - The current version is hosted at https://gitlab.com/kingchiller/scrt-link-core)
