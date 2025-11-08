"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fieldController_1 = require("../controllers/fieldController");
const router = (0, express_1.Router)();
const fieldController = new fieldController_1.FieldController();
router.post('/', (req, res) => fieldController.createField(req, res));
router.get('/:id', (req, res) => fieldController.getFieldById(req, res));
router.get('/farmer/:farmerId', (req, res) => fieldController.getFieldsByFarmerId(req, res));
router.get('/', (req, res) => fieldController.getAllFields(req, res));
router.put('/:id', (req, res) => fieldController.updateField(req, res));
router.delete('/:id', (req, res) => fieldController.deleteField(req, res));
exports.default = router;
//# sourceMappingURL=fieldRoutes.js.map