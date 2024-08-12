import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'PatientReg', // Assuming you have a Patient model
    },
    content: {
        type: String,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
