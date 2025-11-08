import { Router } from 'express';
import { ReportController } from '../controllers/reportController';

const router = Router();
const reportController = new ReportController();

router.post('/', (req, res) => reportController.createReport(req, res));
router.get('/:id', (req, res) => reportController.getReportById(req, res));
router.get('/type/:type', (req, res) => reportController.getReportsByType(req, res));
router.get('/user/:userId', (req, res) => reportController.getReportsByUser(req, res));
router.get('/', (req, res) => reportController.getAllReports(req, res));
router.put('/:id', (req, res) => reportController.updateReport(req, res));
router.delete('/:id', (req, res) => reportController.deleteReport(req, res));

export default router;