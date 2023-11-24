// src/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  role: { type: String, default: 'usuario' },  
  githubId: String, 
}, { timestamps: true });


userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('User', userSchema);
