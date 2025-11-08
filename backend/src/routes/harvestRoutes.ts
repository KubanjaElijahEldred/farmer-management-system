import { Router } from 'express';
import { HarvestController } from '../controllers/harvestController';

const router = Router();
const harvestController = new HarvestController();

router.post('/', (req, res) => harvestController.createHarvest(req, res));
router.get('/:id', (req, res) => harvestController.getHarvestById(req, res));
router.get('/farmer/:farmerId', (req, res) => harvestController.getHarvestsByFarmerId(req, res));
router.get('/field/:fieldId', (req, res) => harvestController.getHarvestsByFieldId(req, res));
router.get('/', (req, res) => harvestController.getAllHarvests(req, res));
router.put('/:id', (req, res) => harvestController.updateHarvest(req, res));
router.delete('/:id', (req, res) => harvestController.deleteHarvest(req, res));

export default router;