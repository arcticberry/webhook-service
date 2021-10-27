import { Schema } from "mongoose"
import * as bcrypt from 'bcrypt';
import { Webhook } from "../models/webhook.model";
import { AppMode, WebhookStatus, WebhookType } from "../enum/webhook.enum";
import { generateString } from "src/shared/utils/helpers.utils";



function transformValue(doc, ret: { [key: string]: any }) {
    ret.id = ret._id;
    delete ret._id;
}

export const WebhookSchema = new Schema<Webhook>({
   
    appId: {
        type: String,
        default: null,
        nullable: true
    },
    eventReference: {
        type: String,
        index: true,
    },
    retryAttempt: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        default: WebhookType.INTERNAL,
        enum: WebhookType
    },
    eventType: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    payload: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        default: AppMode.TEST,
        enum: AppMode
    },
    status: {
        type: String,
        default: WebhookStatus.PENDING,
        enum: WebhookStatus
    },
    histories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'WebhookHistory'
        }
    ],
    deletedAt: {
        type: Date,
        default: null
    },
    updatedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
},

    {
        timestamps: true,
        toObject: {
            virtuals: true,
            versionKey: false,
            transform: transformValue,
        },
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: transformValue,
        },

    }
)
