import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RepoSchemaClass {
  @Prop()
  projectOwner: string;

  @Prop()
  name: string;

  @Prop()
  stars: number;

  @Prop()
  forks: number;

  @Prop()
  issues: number;

  @Prop()
  dateTimeUTC: string;
}

@Schema()
export class UserSchema extends Document {
  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  githubKey: string;
}

export const UserSchemaModel = SchemaFactory.createForClass(UserSchema);
export const RepoSchema = SchemaFactory.createForClass(RepoSchemaClass);