export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

export const scrollIntoView = (event: React.MouseEvent) => {
  if (!isBrowser) {
    return
  }

  event.preventDefault()
  const el = event.currentTarget as HTMLAnchorElement
  const hash = el.hash
  if (!hash) {
    throw Error(
      'The current target element needs a proper `href` attribute with hash. E.g. `href="#products"`',
    )
  }
  const element = document.getElementById(hash.substr(1))
  if (!element) {
    throw Error(
      '`scrollIntoView` requires element on the page with an ID that corresponds to the hash link.',
    )
  }

  const yOffset = -80 // Fixed header plus some padding
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

  window.history.pushState(null, '', hash)
  return window.scrollTo({ top: y, behavior: 'smooth' })
}
