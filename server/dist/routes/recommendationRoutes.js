"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recommendationController_1 = require("../controllers/recommendationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/analysis/:analysisId', authMiddleware_1.optionalAuthMiddleware, recommendationController_1.recommendationController.getRecommendationsByAnalysis);
router.get('/shared/:shareToken', recommendationController_1.recommendationController.getSharedRecommendations);
router.post('/save/:recommendationId', authMiddleware_1.authMiddleware, recommendationController_1.recommendationController.saveRecommendation);
router.get('/saved', authMiddleware_1.authMiddleware, recommendationController_1.recommendationController.getSavedRecommendations);
router.delete('/saved/:savedId', authMiddleware_1.authMiddleware, recommendationController_1.recommendationController.deleteSavedRecommendation);
router.get('/premium/analysis/:analysisId', authMiddleware_1.authMiddleware, authMiddleware_1.premiumMiddleware, recommendationController_1.recommendationController.getPremiumRecommendations);
exports.default = router;
//# sourceMappingURL=recommendationRoutes.js.map