import { createHmac, randomBytes } from "crypto";
import { Document, Schema, model, Model } from "mongoose";
import { createToken } from "../services/auth";

export interface IUser extends Document {
  name: string,
  email: string,
  salt: string,
  profileImageURL: string,
  role: string,
  password: string,
}
export interface UserModel extends Model<IUser> {
  matchPasswordAndGenerateToken(email: string, password: string): string,
}
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String,
  },
  profileImageURL: {
    type: String,
    default: 'avatar.svg'
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

UserSchema.pre<IUser>('save', function (next) {
  if (!this.isModified('password'))
    return next();

  const salt = randomBytes(16).toString();
  const hashPassword = createHmac('sha256', salt)
    .update(this.password)
    .digest('hex')
  this.salt = salt;
  this.password = hashPassword;
  return next()
})

UserSchema.static('matchPasswordAndGenerateToken', async function (email: string, password: string): Promise<string> {

  const user: IUser | null = await this.findOne<IUser>({ email });
  // console.log(user)
  if (!user)
    throw new Error('User not Found')

  const hashPassword = createHmac('sha256', user.salt)
    .update(password)
    .digest('hex')
  if (hashPassword !== user.password)
    throw new Error('Wrong Password')
    
  return createToken(user);
})

const User = model<IUser, UserModel>('User', UserSchema);

export default User;