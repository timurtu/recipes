import mongoose from 'mongoose'

const FamilySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  }
})


const Family = mongoose.model('Family', FamilySchema)
export default Family
