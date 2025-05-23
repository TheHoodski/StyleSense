"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/register', userController_1.userController.register);
router.post('/login', userController_1.userController.login);
router.use(authMiddleware_1.authMiddleware);
router.get('/profile', userController_1.userController.getProfile);
router.put('/profile', userController_1.userController.updateProfile);
router.post('/subscription', userController_1.userController.createSubscription);
router.get('/subscription', userController_1.userController.getSubscription);
router.delete('/subscription', userController_1.userController.cancelSubscription);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map