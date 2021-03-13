import React from 'react'
import { useWindupString } from 'windups'

interface TextWindupProps {
  message: string
}
const TextWindup = ({ message }: TextWindupProps) => {
  const [text] = useWindupString(message)
  return <div>{text}</div>
}

export default TextWindup
