# @scrt-link/core

[scrt.link](https://scrt.link) lets you share sensitive information online. End-to-end encrypted. One time.

This package allows you to use the service programmatically. Use it whenever you need to share a secret.

## Installation

```bash
yarn add @scrt-link/core
```

## Usage

The examples are based on the assumption that you use [scrt.link](https://scrt.link) as your backend - however, you may use this package with your own backend. Check the [scrt-link](https://gitlab.com/kingchiller/scrt-link) repository for a reference implementation.

### Basic example

```ts
import { createSecret } from '@scrt-link/core'

const { secretLink } = await createSecret('Some confidential information…')
// https://scrt.link/l#hLN8e0jd6xtLuxJqDxp1D/Q4rqaOWQtzFTZIB-7TXEYD2NgI9E1KQdeMXdfsvPykI
```

### With options

```ts
import { createSecret } from "@scrt-link/core";

const { secretLink, alias, encryptionKey } = await createSecret("Some confidential information…", {
  password: "some-passphrase",
  secretType: "neogram", // "text" | "url" | "neogram"
  neogramDestructionMessage: "This messages self-destructs in…"
  neogramDestructionTimeout: 10;
}
});
/*
alias:  hLN8e0jd6xtLuxJqDxp1D
encryptionKey: Q4rqaOWQtzFTZIB-7TXEYD2NgI9E1KQdeMXdfsvPykI
secretLink:  https://scrt.link/de/l#hLN8e0jd6xtLuxJqDxp1D/Q4rqaOWQtzFTZIB-7TXEYD2NgI9E1KQdeMXdfsvPykI
/*
```

Find out about the various secret types and options on [scrt.link](https://scrt.link) - the website's code is open source and available [here](https://gitlab.com/kingchiller/scrt-link).

### Retrieve secret

It's recommended to just use generated link. However, there is a helper function if you need a custom solution. The function expects the **alias** and the **encryption key**.

```ts
import { retrieveSecret } from "@scrt-link/core";

const { message } = await retrieveSecret("hLN8e0jd6xtLuxJqDxp1D", "Q4rqaOWQtzFTZIB-7TXEYD2NgI9E1KQdeMXdfsvPykI")
});
// message: Some confidential information…
```

## Instant usage 💥

There are pre-built packages to use right away. I recommend [Skypack](https://skypack.dev), but you can find it on other CDNs like [jsDelivr](https://www.jsdelivr.com), [cdnjs](https://cdnjs.com), [unpkg.com](https://unpkg.com).

### Via ES Module import

```html
<script type="module">
  import { createSecret } from 'https://cdn.skypack.dev/scrt-link-core'

  // Use as described above…
  createSecret('Some confidential information…').then(({ secretLink }) => {})
</script>
```

[Full demo](https://codepen.io/stophe/pen/JjNMMWe)

### Via script tag

```html
<html>
  <head>
    <!-- Load script via CDN -->
    <script src="https://unpkg.com/scrt-link-core@latest/dist/esbuild/browser.js"></script>
  </head>

  <body>
    <script>
      // Functions are available on the window object
      window.createSecret('Some confidential information…').then(({ secretLink }) => {
        console.log(`Success! Your secret link is: ${secretLink}`)
      })
    </script>
  </body>
</html>
```

[Full demo](https://codepen.io/stophe/pen/qBmpxWW)

## Documentation

[Documentation](https://kingchiller.gitlab.io/scrt-link-core/)

## Credits

Boilerplate: https://github.com/metachris/typescript-boilerplate by Chris Hager
