import 'dotenv/config'

export default {
  port: Number(process.env.PORT) ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? 'jwt_secret',
  cookieSecret: process.env.COOKIE_SECRET ?? 'cookie_secret'
}
