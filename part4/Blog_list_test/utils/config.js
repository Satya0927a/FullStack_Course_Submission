require('dotenv').config()

const PORT = process.env.PORT || 3003
const URI = process.env.NODE_ENV === 'test' ? process.env.TESTMONGO_URI : process.env.MONGO_URI

module.exports = {PORT,URI}