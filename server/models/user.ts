import { createHmac, randomBytes } from "crypto";
import { Document, Schema, model, Model } from "mongoose";
import { createToken } from "../services/auth";

export interface IUser extends Document {
  name: string,
  account: string,
  salt: string,
  avatar: string,
  role: string,
  password: string,
}

export interface UserModel extends Model<IUser> {
  matchPasswordAndGenerateToken(account: string, password: string): string,
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please add your name"],
    trim: true,
    maxlength: [20, "Your name should be upto max 20 characters "]
  },
  account : {
    type: String,
    required: [true, "Please add your Email or Phone no."],
    trim: true,
    unique: true,
  },
  salt: {
    type: String,
  },
  avatar: {
    type: String,
    default: 'public/uploads/avatar.png'
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
  password: {
    type: String,
    required: true,
    trim: true,
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

UserSchema.static('matchPasswordAndGenerateToken', async function (account: string, password: string): Promise<string> {

  const user: IUser | null = await this.findOne<IUser>({ account });
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