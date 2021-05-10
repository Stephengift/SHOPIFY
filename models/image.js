const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Image", ImageSchema);