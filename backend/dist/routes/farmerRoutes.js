"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farmerController_1 = require("../controllers/farmerController");
const router = (0, express_1.Router)();
const farmerController = new farmerController_1.FarmerController();
router.post('/', (req, res) => farmerController.createFarmer(req, res));
router.get('/:id', (req, res) => farmerController.getFarmerById(req, res));
router.get('/user/:userId', (req, res) => farmerController.getFarmerByUserId(req, res));
router.get('/', (req, res) => farmerController.getAllFarmers(req, res));
router.put('/:id', (req, res) => farmerController.updateFarmer(req, res));
router.delete('/:id', (req, res) => farmerController.deleteFarmer(req, res));
router.post('/:id/fields', (req, res) => farmerController.addFieldToFarmer(req, res));
exports.default = router;
//# sourceMappingURL=farmerRoutes.js.map