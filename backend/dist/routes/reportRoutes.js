"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const router = (0, express_1.Router)();
const reportController = new reportController_1.ReportController();
router.post('/', (req, res) => reportController.createReport(req, res));
router.get('/:id', (req, res) => reportController.getReportById(req, res));
router.get('/type/:type', (req, res) => reportController.getReportsByType(req, res));
router.get('/user/:userId', (req, res) => reportController.getReportsByUser(req, res));
router.get('/', (req, res) => reportController.getAllReports(req, res));
router.put('/:id', (req, res) => reportController.updateReport(req, res));
router.delete('/:id', (req, res) => reportController.deleteReport(req, res));
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map