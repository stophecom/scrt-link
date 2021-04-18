import { useState, useEffect } from 'react'
import Pusher from 'pusher-js'

import { baseUrl, pusherCluster } from '@/constants'

export const usePusher = <T>(
  apiEndpoint: string,
  channel: string,
  event: string,
  realtime = false,
): T => {
  const [data, updateData] = useState({} as T)

  Pusher.logToConsole = true

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${baseUrl}/api${apiEndpoint}`, { method: 'POST' })
      const json = await res.json()
      updateData(json)
    }
    fetchStats()

    if (realtime) {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
        cluster: pusherCluster,
      })
      const pusherChannel = pusher.subscribe(channel)
      pusherChannel.bind(event, function (incomingData: T) {
        updateData(incomingData)
      })
    }
  }, [realtime])

  return data
}
