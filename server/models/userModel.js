import mongoose from "mongoose";




const userSchema = new mongoose.Schema({
    username: {
        type:   String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    dob: {
        type: Date,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    createdAt: {
    type: Date,
    default: Date.now
  },
  age: {
    type: Number
  }
})

export default mongoose.model("User", userSchema);