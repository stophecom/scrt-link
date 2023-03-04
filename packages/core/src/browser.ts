/**
 * This file is the entrypoint of browser builds.
 * The code executes when loaded in a browser.
 */
import { createSecret, CreateSecret, retrieveSecret, RetrieveSecret } from './main'

declare global {
  interface Window {
    createSecret: CreateSecret
    retrieveSecret: RetrieveSecret
  }
}

window.createSecret = createSecret
window.retrieveSecret = retrieveSecret

console.log('Method "createSecret" and "retrieveSecret" were added to the window object."')
