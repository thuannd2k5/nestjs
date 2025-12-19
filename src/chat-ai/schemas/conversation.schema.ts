
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
    @Prop({ required: true, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({ default: 'CAREER_ADVISOR' })
    type: string;

    @Prop({ default: 'ACTIVE' })
    status: 'ACTIVE' | 'ENDED';

    @Prop({ type: Object })
    context?: {
        intent?: string;
        goal?: string;
        experienceLevel?: string;
        interestedFields?: string[];
        currentTopic?: string;
        relatedEntity?: {
            type: 'job' | 'company' | 'resume' | 'general';
            id?: mongoose.Schema.Types.ObjectId;
        };
        metadata?: Record<string, any>;
    };


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

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
