import { getMedicineAvailableModel } from '../models/MedicineAvailable.js';
import express from 'express';

const router = express.Router();

// router.get('/available', async (req, res) => {
//   try {
//     const MedicineAvailable = getMedicineAvailableModel(); // get model after connection
//     const q = req.query.q || '';
//     const stock = await MedicineAvailable.find(
//       { itemName: new RegExp(q, 'i'), qty: { $gt: 0 } },
//       { itemName: 1, qty: 1, _id: 0 }
//     )
//       .limit(20)
//       .sort({ itemName: 1 }); // ✅ fixed syntax

//     res.json(stock);
//   } catch (error) {
//     console.error('❌ Error fetching pharmacy stock:', error.message);
//     res.status(500).json({ error: 'Failed to fetch pharmacy stock' });
//   }
// });

router.get('/available', async (req, res) => {
  try {
    const MedicineAvailable = getMedicineAvailableModel(); // get model after connection
    const q = req.query.q || '';

    // Get medicines matching search query and with qty > 0
    const medicines = await MedicineAvailable.find({
      itemName: new RegExp(q, 'i'),
      qty: { $gt: 0 }
    }).lean();

    const currentDate = new Date();

    // Filter out expired medicines
    const validMedicines = medicines.filter(med => {
      if (!med.expiry) return false;
      const [month, year] = med.expiry.split('/');
      const expiryDate = new Date(`20${year}`, month - 1, 1);
      return expiryDate >= currentDate;
    });

    // Group by itemName
    const grouped = validMedicines.reduce((acc, med) => {
      if (!acc[med.itemName]) acc[med.itemName] = [];
      acc[med.itemName].push({
        batch: med.batch,
        expiry: med.expiry,
        mrp: med.mrp,
        gst: med.gst,
        qty: med.qty,
        discount: med.discount || 0,
        itemId: med._id
      });
      return acc;
    }, {});

    // Convert to array
    const result = Object.keys(grouped).map(itemName => ({
      itemName,
      batches: grouped[itemName]
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error fetching pharmacy stock:', error.message);
    res.status(500).json({ error: 'Failed to fetch pharmacy stock' });
  }
});


export default router;
