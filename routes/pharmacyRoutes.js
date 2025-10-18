import { getMedicineAvailableModel } from '../models/MedicineAvailable.js';
import express from 'express';

const router = express.Router();

router.get('/available', async (req, res) => {
  try {
    const MedicineAvailable = getMedicineAvailableModel(); // get model after connection
    const q = req.query.q || '';
    const stock = await MedicineAvailable.find(
      { itemName: new RegExp(q, 'i'), qty: { $gt: 0 } },
      { itemName: 1, qty: 1, _id: 0 }
    )
      .limit(20)
      .sort({ itemName: 1 }); // ✅ fixed syntax

    res.json(stock);
  } catch (error) {
    console.error('❌ Error fetching pharmacy stock:', error.message);
    res.status(500).json({ error: 'Failed to fetch pharmacy stock' });
  }
});

export default router;
