// Loads data from a GET endpoint and reports loading, error and data.
// If the page changes before the answer arrives, the request is cancelled,
// so an old answer can never overwrite a newer one.

import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../api/client.js'

export function useApi(path) {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })

  const requestKey = path ? `${path}#${reloadCount}` : null

  useEffect(() => {
    if (!requestKey) return undefined
    const controller = new AbortController()

    apiRequest(path, { signal: controller.signal })
      .then((data) => setResult({ key: requestKey, data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setResult({ key: requestKey, data: null, error })
        }
      })

    return () => controller.abort()
  }, [path, requestKey])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  const loading = requestKey !== null && result.key !== requestKey
  return {
    loading,
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    reload,
  }
}
