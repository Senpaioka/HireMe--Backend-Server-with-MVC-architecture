import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../config/env';
import {IUser} from '../types/user.types'

// creating user schema
const userSchema = new Schema<IUser>(
    {
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['employee', 'employer', 'admin'], required: true, default: 'employee'},
    }, 
    {
    timestamps: true,
    }
);


// pre-save hook to hash password before saving user
userSchema.pre('save', async function () {
  const user = this;

  if (!user.isModified('password')) return;

  user.password = await bcrypt.hash(
    user.password as string,
    Number(config.bcrypt_salt_rounds)
  );
});

// post-save hook to remove password field from returned user object
userSchema.post('save', function (doc) {
    doc.password = '';
})

// Better alternative to remove password field from returned user object
// userSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     delete ret.password;
//     return ret;
//   },
// });


export const User = model<IUser>('User', userSchema);