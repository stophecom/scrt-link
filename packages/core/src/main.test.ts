import { createSecret, retrieveSecret, generateAlias, generateEncryptionKey } from './main'
import { urlAliasLength, encryptionKeyLength } from './constants'

test('Generate alias', async () => {
  expect(generateAlias()).toHaveLength(urlAliasLength)
})

test('Generate encryption key', async () => {
  expect(generateEncryptionKey()).toHaveLength(encryptionKeyLength)
})

test('Create and retrieve secret', async () => {
  const secretMessage = 'I love you!'
  const secret = await createSecret(secretMessage)

  expect(secret).toHaveProperty('secretLink')
  expect(secret).toHaveProperty('alias')
  expect(secret).toHaveProperty('encryptionKey')

  const { alias, encryptionKey } = secret

  const { message } = await retrieveSecret(alias, encryptionKey)

  expect(message).toBe(secretMessage)

  // Second attempt fails since secret is gone.
  try {
    await retrieveSecret(alias, encryptionKey)
  } catch (error) {
    expect(error.message).toContain('Secret not found')
  }
})
