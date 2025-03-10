import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // trim: true
    },
    composition: {
        type: String,
        // required: true,
        // trim: true
    }
});

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
