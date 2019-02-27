import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create the FinEvent Schema.
const FinEventSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    datetime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
});

const FinEvent = mongoose.model("FinEvent", FinEventSchema);

export default FinEvent;