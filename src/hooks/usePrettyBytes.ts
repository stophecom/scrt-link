import prettyBytes from 'pretty-bytes'
import { useTranslation } from 'next-i18next'

const usePrettyBytes = () => {
  const { i18n } = useTranslation()

  return (number: number) => prettyBytes(number, { locale: i18n.language })
}

export default usePrettyBytes
