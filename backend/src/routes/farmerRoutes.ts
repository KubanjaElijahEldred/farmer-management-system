import { Router } from 'express';
import { FarmerController } from '../controllers/farmerController';

const router = Router();
const farmerController = new FarmerController();

router.post('/', (req, res) => farmerController.createFarmer(req, res));
router.get('/:id', (req, res) => farmerController.getFarmerById(req, res));
router.get('/user/:userId', (req, res) => farmerController.getFarmerByUserId(req, res));
router.get('/', (req, res) => farmerController.getAllFarmers(req, res));
router.put('/:id', (req, res) => farmerController.updateFarmer(req, res));
router.delete('/:id', (req, res) => farmerController.deleteFarmer(req, res));
router.post('/:id/fields', (req, res) => farmerController.addFieldToFarmer(req, res));

export default router;