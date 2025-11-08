"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
const paymentController = new paymentController_1.PaymentController();
router.post('/', (req, res) => paymentController.createPayment(req, res));
router.get('/:id', (req, res) => paymentController.getPaymentById(req, res));
router.get('/farmer/:farmerId', (req, res) => paymentController.getPaymentsByFarmerId(req, res));
router.get('/status/:status', (req, res) => paymentController.getPaymentsByStatus(req, res));
router.get('/', (req, res) => paymentController.getAllPayments(req, res));
router.put('/:id', (req, res) => paymentController.updatePayment(req, res));
router.delete('/:id', (req, res) => paymentController.deletePayment(req, res));
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map