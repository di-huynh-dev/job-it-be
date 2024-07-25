import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  name: string

  @Prop()
  phone: string

  @Prop()
  age: number

  @Prop()
  address: string

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)