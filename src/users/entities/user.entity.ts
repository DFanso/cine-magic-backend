import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

export type UserDocument = Document & User;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  // Other properties as defined in your original schema
  // ...

  @Prop({ select: false })
  password: string;

  // Add other fields as necessary
}

const UserSchema = SchemaFactory.createForClass(User);

// Pagination plugin
UserSchema.plugin(mongoosePaginate);

// Password hashing middleware
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export { UserSchema };
