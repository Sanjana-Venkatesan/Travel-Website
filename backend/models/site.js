const { Schema, model } = require("mongoose");

const siteSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    coordinates: { 
        latitude: { type: Number },
        longitude: { type: Number }
    },
    category: { type: String, enum: ["park", "monument", "museum", "historical site"] },  
    rating: { type: Number, min: 0, max: 5 },  // User ratings (0-5)
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

siteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Site = model('Site', siteSchema, 'sites');

module.exports = Site;
