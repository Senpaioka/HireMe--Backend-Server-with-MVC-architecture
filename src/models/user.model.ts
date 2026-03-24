import bcrypt from 'bcrypt';
import { Schema, model, HydratedDocument, Model } from 'mongoose';
import config from '../config/env';
import {IUser, IUserMethods} from '../types/user.types'

type UserDocument = HydratedDocument<IUser, IUserMethods>;
type UserModel = Model<IUser, {}, IUserMethods>;

// creating user schema
// 👇 important: 3rd generic = methods
const userSchema = new Schema<IUser, IUserMethods>(
    {
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    role: {type: String, enum: ['employee', 'employer', 'admin'], required: true, default: 'employee'},
    }, 
    {
    timestamps: true,
    }
);


// pre-save hook to hash password before saving user
userSchema.pre('save', async function (this: UserDocument) {
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

// comparing provided password with hashed password in database
userSchema.methods.comparePassword = async function (this: UserDocument, plainPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password as string);
};


export const User = model<IUser, UserModel>('User', userSchema);