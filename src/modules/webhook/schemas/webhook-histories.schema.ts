import { Schema } from "mongoose"
import {  WebhookStatus } from "../enum/webhook.enum";
import { WebhookHistory } from "../models/webhook-histories.model";



function transformValue(doc, ret: { [key: string]: any }) {
    ret.id = ret._id
}

export const WebhookHistorySchema = new Schema<WebhookHistory>({
    id: {
        type: String,
        index: true,
    },
    webhook: {
        type: Schema.Types.ObjectId,
        ref: 'Webhook'
    },
    retryAttempt: {
        type: Number,
        default: 0,
    },
    statusCode: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        default: WebhookStatus.PENDING,
        enum: WebhookStatus
    },
    headers: {
        type: Object,
        default: {}
    },
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
