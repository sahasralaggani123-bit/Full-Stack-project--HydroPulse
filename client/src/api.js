// Tiny wrapper around fetch() for talking to the Express API.
async function request(method, path, body) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'include', // send the login cookie
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed. Please try again.')
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
}
