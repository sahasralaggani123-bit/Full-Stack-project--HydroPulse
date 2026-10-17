import jwt from 'jsonwebtoken'

export const COOKIE_NAME = 'hydropulse_token'

export const cookieOptions = {
  httpOnly: true, // JavaScript in the browser cannot read this cookie
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

// Protects a route: the request must carry a valid login token.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  const token = req.cookies?.[COOKIE_NAME] || (header?.startsWith('Bearer ') ? header.slice(7) : null)
  const payload = token ? verifyToken(token) : null

  if (!payload) return res.status(401).json({ error: 'Authentication required.' })
  req.userId = Number(payload.sub)
  next()
}
