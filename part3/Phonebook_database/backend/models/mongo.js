const mongoose = require('mongoose')
require('dotenv').config()
const uri = process.env.DATABASE_URI

mongoose.connect(uri).then(() => {
  console.log('successfully connected to the database')
})

const personschema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name is required'],
  },
  number: {
    type: String,
    minLength: [8, 'must be 8 numbers long'],
    required: [true, 'Number is required'],
    validate: [
      {
        validator: function (value) {
          return value.includes('-')
        },
        message: 'must contain one "-" in the phone number',
      },
      {
        validator: function (value) {
          const count = value.split('-').length - 1
          if (count === 1) {
            return true
          } else {
            return false
          }
        },
        message: 'shouldn\'t contain more than one \'-\' ',
      },
      {
        validator: function (value) {
          const splitnumarr = value.split('-')
          return splitnumarr[0].length === 3
        },
        message: 'The number before "-" should only be 3 numbers long',
      },
      {
        validator: function (value) {
          const splitnumarr = value.split('-')
          if (/^\d+$/.test(splitnumarr[0]) && /^\d+$/.test(splitnumarr[1])) {
            return true
          } else {
            return false
          }
        },
        message: 'must be a number',
      },
    ],
  },
})

module.exports = mongoose.model('Person', personschema)
// new Person(testdata).save().then(()=>{
//     console.log('saved the data');

// })
