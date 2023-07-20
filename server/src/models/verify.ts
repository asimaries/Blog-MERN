import { Schema, SchemaType, model } from "mongoose"

interface IVerify extends Document {
  id: Schema.Types.ObjectId;
  token: String;
}

const verifySchema = new Schema<IVerify>({
  id: {
    require: true,
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  token: { type: String, require: true, }
})

const verifyModel = model('verification', verifySchema)

export default verifyModel;