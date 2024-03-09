import http from 'http'
import config from './config/config'
import app from './app'

const server = http.createServer(app)
const PORT = config.port

server.listen(8080, () => {
  console.log(`🚀 Server running on ${PORT}`)
})
