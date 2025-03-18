const { Schema, model } = require("mongoose");

const tipSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true, enum: ["Preparation", "Finance", "Security", "Culture", "General"] },
    content: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
    importance: { type: Number, min: 1, max: 5, required: true },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "User"},
    likes: { type: Number, default: 0 },
    comments: [
        {
            user: { type: String},
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    source: { type: String, default: "Personal Experience" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

tipSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Tip = model("Tip", tipSchema, "tips");

module.exports = Tip;
