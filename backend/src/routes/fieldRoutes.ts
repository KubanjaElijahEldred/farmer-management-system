import { Router } from 'express';
import { FieldController } from '../controllers/fieldController';

const router = Router();
const fieldController = new FieldController();

router.post('/', (req, res) => fieldController.createField(req, res));
router.get('/:id', (req, res) => fieldController.getFieldById(req, res));
router.get('/farmer/:farmerId', (req, res) => fieldController.getFieldsByFarmerId(req, res));
router.get('/', (req, res) => fieldController.getAllFields(req, res));
router.put('/:id', (req, res) => fieldController.updateField(req, res));
router.delete('/:id', (req, res) => fieldController.deleteField(req, res));

export default router;