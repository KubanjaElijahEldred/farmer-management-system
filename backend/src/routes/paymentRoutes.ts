import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';

const router = Router();
const paymentController = new PaymentController();

router.post('/', (req, res) => paymentController.createPayment(req, res));
router.get('/:id', (req, res) => paymentController.getPaymentById(req, res));
router.get('/farmer/:farmerId', (req, res) => paymentController.getPaymentsByFarmerId(req, res));
router.get('/status/:status', (req, res) => paymentController.getPaymentsByStatus(req, res));
router.get('/', (req, res) => paymentController.getAllPayments(req, res));
router.put('/:id', (req, res) => paymentController.updatePayment(req, res));
router.delete('/:id', (req, res) => paymentController.deletePayment(req, res));

export default router;