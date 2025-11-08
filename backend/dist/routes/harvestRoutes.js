"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const harvestController_1 = require("../controllers/harvestController");
const router = (0, express_1.Router)();
const harvestController = new harvestController_1.HarvestController();
router.post('/', (req, res) => harvestController.createHarvest(req, res));
router.get('/:id', (req, res) => harvestController.getHarvestById(req, res));
router.get('/farmer/:farmerId', (req, res) => harvestController.getHarvestsByFarmerId(req, res));
router.get('/field/:fieldId', (req, res) => harvestController.getHarvestsByFieldId(req, res));
router.get('/', (req, res) => harvestController.getAllHarvests(req, res));
router.put('/:id', (req, res) => harvestController.updateHarvest(req, res));
router.delete('/:id', (req, res) => harvestController.deleteHarvest(req, res));
exports.default = router;
//# sourceMappingURL=harvestRoutes.js.map