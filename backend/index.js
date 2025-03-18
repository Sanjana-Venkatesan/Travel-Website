const app = require('./app')
const logger = require('./utils/logger')

app.listen(3000, () => {
  logger.info(`Server running on port ${3000}`)
})