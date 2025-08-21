export function getApiErrorMessage(error: any, fallbackMessage: string) {
  // ofetch FetchError usually has: error.data (parsed body) and error.response
  const data = (error && (error.data || error._data || error.response?._data)) || null
  const candidates = [
    data?.message,
    data?.error?.message,
    data?.errors?.[0]?.message,
    typeof error?.message === 'string' ? error.message : null
  ].filter(Boolean)
  return (candidates[0] as string) || fallbackMessage
}


