try {
  process.loadEnvFile?.()
} catch {}

const http = require('node:http')
const crypto = require('node:crypto')
const { promisify } = require('node:util')
const mysql = require('mysql2/promise')

const scrypt = promisify(crypto.scrypt)
const sessions = new Map()
const sessionMaxAge = 7 * 24 * 60 * 60 * 1000
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.MYSQLHOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306),
  user: process.env.MYSQL_USER || process.env.MYSQLUSER || 'root',
  password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || 'movie_rating_app',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  ssl: { rejectUnauthorized: false }
})
function sendJson(res, status, value, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers })
  res.end(JSON.stringify(value))
}

async function readJson(req) {
  let body = ''
  for await (const chunk of req) {
    body += chunk
    if (body.length > 16 * 1024) throw Object.assign(new Error('Request body is too large.'), { status: 413 })
  }
  try {
    return body ? JSON.parse(body) : {}
  } catch {
    throw Object.assign(new Error('Request body must be valid JSON.'), { status: 400 })
  }
}

function getSession(req) {
  const token = req.headers.cookie
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith('movie_session='))
    ?.slice('movie_session='.length)
  const session = token && sessions.get(token)
  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token)
    return null
  }
  session.expiresAt = Date.now() + sessionMaxAge
  return session
}

function setSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { userId, expiresAt: Date.now() + sessionMaxAge })
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `movie_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAge / 1000}${secure}`)
}

function clearSession(req, res) {
  const token = req.headers.cookie
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith('movie_session='))
    ?.slice('movie_session='.length)
  if (token) sessions.delete(token)
  res.setHeader('Set-Cookie', 'movie_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0')
}

function publicError(error) {
  if (error.status) return { status: error.status, message: error.message }
  if (error.code === 'ER_DUP_ENTRY') return { status: 409, message: 'That username is already registered.' }
  console.error(error)
  return { status: 500, message: 'The server could not complete the request.' }
}

async function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = await scrypt(password, salt, 64)
  return `${salt}:${derived.toString('hex')}`
}

async function verifyPassword(password, storedHash) {
  const [salt, expectedHex] = storedHash.split(':')
  if (!salt || !expectedHex) return false
  const expected = Buffer.from(expectedHex, 'hex')
  const actual = await scrypt(password, salt, expected.length)
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

function validCredentials(username, password) {
  return typeof username === 'string' && username.length >= 3 && username.length <= 50 &&
    typeof password === 'string' && password.length >= 8 && password.length <= 200
}

async function getMovieRatingSummary(movieId, userId = null) {
  const [summaryRows] = await pool.execute(
    'SELECT COUNT(*) AS rating_count, AVG(rating) AS average_rating FROM ratings WHERE tmdb_movie_id = ?',
    [movieId]
  )
  const count = Number(summaryRows[0]?.rating_count || 0)
  const avg = count > 0 && summaryRows[0]?.average_rating !== null
    ? Number(parseFloat(summaryRows[0].average_rating).toFixed(1))
    : null

  let userRating = null
  if (userId) {
    const [userRows] = await pool.execute(
      'SELECT rating FROM ratings WHERE user_id = ? AND tmdb_movie_id = ?',
      [userId, movieId]
    )
    userRating = userRows[0]?.rating ?? null
  }

  return {
    rating: userRating,
    userRating,
    currentUserRating: userRating,
    averageRating: avg,
    average_rating: avg,
    ratingCount: count,
    rating_count: count
  }
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const path = url.pathname

  if (req.method === 'GET' && path === '/api/health') {
    await pool.query('SELECT 1')
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === 'POST' && (path === '/api/auth/register' || path === '/api/auth/login')) {
    const { username, password } = await readJson(req)
    if (!validCredentials(username, password)) {
      throw Object.assign(new Error('Username must be 3–50 characters and password must be 8–200 characters.'), { status: 400 })
    }

    if (path.endsWith('/register')) {
      const usernamePattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{3,50}$/
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,200}$/
      if (!usernamePattern.test(username)) {
        throw Object.assign(new Error('Username needs an uppercase letter and a special symbol.'), { status: 400 })
      }
      if (!passwordPattern.test(password)) {
        throw Object.assign(new Error('Password needs uppercase and lowercase letters, a number, and a special symbol.'), { status: 400 })
      }
      const passwordHash = await hashPassword(password)
      const [result] = await pool.execute(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        [username, passwordHash]
      )
      await pool.execute('INSERT INTO login_records (user_id) VALUES (?)', [result.insertId])
      setSession(res, result.insertId)
      return sendJson(res, 201, { user: { id: result.insertId, username } })
    }

    const [users] = await pool.execute(
      'SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1',
      [username]
    )
    if (!users.length || !(await verifyPassword(password, users[0].password_hash))) {
      throw Object.assign(new Error('Invalid username or password.'), { status: 401 })
    }
    const user = users[0]
    await pool.execute('INSERT INTO login_records (user_id) VALUES (?)', [user.id])
    setSession(res, user.id)
    return sendJson(res, 200, { user: { id: user.id, username: user.username } })
  }

  if (req.method === 'GET' && path === '/api/auth/me') {
    const session = getSession(req)
    if (!session) return sendJson(res, 200, { user: null })
    const [users] = await pool.execute('SELECT id, username FROM users WHERE id = ? LIMIT 1', [session.userId])
    return sendJson(res, 200, { user: users[0] || null })
  }

  if (req.method === 'POST' && path === '/api/auth/logout') {
    clearSession(req, res)
    return sendJson(res, 200, { ok: true })
  }

  const ratingMatch = path.match(/^\/api\/ratings\/(\d+)$/)
  if (ratingMatch && (req.method === 'GET' || req.method === 'PUT')) {
    const session = getSession(req)
    const movieId = BigInt(ratingMatch[1]).toString()

    if (req.method === 'GET') {
      const summary = await getMovieRatingSummary(movieId, session?.userId)
      return sendJson(res, 200, summary)
    }

    if (!session) throw Object.assign(new Error('Log in to manage movie ratings.'), { status: 401 })
    const { rating } = await readJson(req)
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw Object.assign(new Error('Rating must be a whole number from 1 to 5.'), { status: 400 })
    }
    await pool.execute(
      `INSERT INTO ratings (user_id, tmdb_movie_id, rating) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [session.userId, movieId, rating]
    )
    const summary = await getMovieRatingSummary(movieId, session.userId)
    return sendJson(res, 200, summary)
  }

  const reviewsMatch = path.match(/^\/api\/reviews\/(\d+)$/)
  if (reviewsMatch && req.method === 'GET') {
    const movieId = BigInt(reviewsMatch[1]).toString()
    const [rows] = await pool.execute(
      `SELECT r.id, r.review_text, u.username
       FROM reviews r LEFT JOIN users u ON u.id = r.user_id
       WHERE r.tmdb_movie_id = ? ORDER BY r.created_at DESC, r.id DESC`,
      [movieId]
    )
    return sendJson(res, 200, { reviews: rows.map(row => ({ id: row.id, text: row.review_text, username: row.username || 'Guest' })) })
  }

  if (reviewsMatch && req.method === 'POST') {
    const { review } = await readJson(req)
    if (typeof review !== 'string' || !review.trim() || review.trim().length > 2000) {
      throw Object.assign(new Error('Review must contain 1–2,000 characters.'), { status: 400 })
    }
    const session = getSession(req)
    const movieId = BigInt(reviewsMatch[1]).toString()
    await pool.execute(
      'INSERT INTO reviews (user_id, tmdb_movie_id, review_text) VALUES (?, ?, ?)',
      [session?.userId ?? null, movieId, review.trim()]
    )
    return sendJson(res, 201, { ok: true })
  }

  return sendJson(res, 404, { message: 'Not found.' })
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(error => {
    const result = publicError(error)
    if (!res.headersSent) sendJson(res, result.status, { message: result.message })
    else res.destroy()
  })
})

const port = Number(process.env.PORT || process.env.API_PORT || 3001)
server.listen(port, '0.0.0.0', () => {
  console.log(`Movie app API listening on port ${port}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    server.close()
    await pool.end()
    process.exit(0)
  })
}
