const { Schema, model } = require("mongoose");

const hotelSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    image: { type: String},
    amenities: [{ type: String }],
    reviews: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String },
        rating: { type: Number, min: 0, max: 5 }
    }],
    contactInfo: {
        phone: { type: String },
        email: { type: String },
        website: { type: String }
    },
    isAvailable: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User'},  // Link to User
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

hotelSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Hotel = model('Hotel', hotelSchema, 'hotels');

module.exports = Hotel;
