export const generateEncryptionKeyString = async () => {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  )
  const exportedKey = await crypto.subtle.exportKey('jwk', key)
  console.log({ exportedKey })

  if (!exportedKey.k) {
    throw Error('Failed to generate encryption key.')
  }

  return exportedKey.k
}

export const importKeyFromString = async (key: string) =>
  await crypto.subtle.importKey(
    'jwk',
    {
      kty: 'oct',
      k: key, // The encryption key
      alg: 'A256GCM',
      ext: true,
    },
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt'],
  )

export const encryptFile = async (file: File, encryptionKey: string) => {
  const data = await file.arrayBuffer()

  const iv = crypto.getRandomValues(new Uint8Array(16)) // Initialization Vector (IV)
  const cryptoKey = await importKeyFromString(encryptionKey)
  const result = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, data)

  return { encryptedFile: new Blob([iv, result]) } // Adding IV
}

export const decryptFile = async (file: Blob, decryptionKey: string, fileName: string) => {
  const key = await importKeyFromString(decryptionKey)

  const [iv, data] = await Promise.all([
    file.slice(0, 16).arrayBuffer(), // Extracting IV
    file.slice(16).arrayBuffer(), // The actual file
  ])

  let decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data,
  )
  return new File([decryptedData], fileName)
}
