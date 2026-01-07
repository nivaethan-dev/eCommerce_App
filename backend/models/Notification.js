import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'userType' },
    userType: { type: String, required: true, enum: ['Customer', 'Admin'] }, // links to Customer or Admin model dynamically
    type: { type: String, required: true },       // e.g., 'ORDER_PLACED', 'PRODUCT_UPDATED'
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    metadata: { type: Object, default: {} },     // store orderId, productId, old/new status, etc.
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
