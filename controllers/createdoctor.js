import doctorDetail from "../models/CreateDoctor.js"

export const createdoctor = async(req, res) => {

    try {
        console.log(req.body)
        const { doctorDetails } = req.body;
        const {docId, drName, drGender, drEmail, drNum, drAddress  } = doctorDetails;
        const doctor = new doctorDetail({docId, drName, drGender, drEmail, drNum, drAddress});
        // console.log('Doctor object:', doctor);
        const doctorSaved = await doctor.save();
        res.status(201).json(doctorSaved);
    } catch (err) {
      res.status(500).json("error :" , err);
    }
}



export const getdoctor = async(req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        const doctors = await doctorDetail.find();
        // console.log('Fetched tests:', doctors);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ error: 'Failed to fetch tests' });
    }
}


export const updatedoctor = async(req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        const doctors = await doctorDetail.find(_id);
        // console.log('Fetched tests:', doctors);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ error: 'Failed to fetch tests' });
    }
}

export const getDoctorById = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    try {
        const doctorId = req.params.id; // Get the doctor id from the route parameter
        const doctor = await doctorDetail.findById(doctorId); // Use findById to fetch a doctor by id
        // console.log('Fetched doctor:', doctor);
        
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        res.json(doctor);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ error: 'Failed to fetch doctor' });
    }
}


export const updateDoctor = async (req, res) => {
    const doctorId = req.params.id;
    const updatedData = req.body;
    // console.log(updatedData);

    try {
        const updatedDoctor = await doctorDetail.findByIdAndUpdate(
            doctorId,
            updatedData,
            { new: true }
        );

        res.json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ error: 'Error updating doctor' });
    }
};


export const deleteDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const deletedDoctor = await doctorDetail.findByIdAndDelete(doctorId);

    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor' });
  }
};





export default createdoctor