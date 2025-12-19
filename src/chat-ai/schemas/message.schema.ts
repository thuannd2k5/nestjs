
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
    @Prop({ required: true, ref: 'Conversation' })
    conversationId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, enum: ['user', 'assistant'] })
    role: 'user' | 'assistant';

    @Prop({ required: true })
    content: string;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop()
    createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
