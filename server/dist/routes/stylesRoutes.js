"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stylesController_1 = require("../controllers/stylesController");
const router = express_1.default.Router();
router.get('/', stylesController_1.stylesController.getStyles);
router.get('/:styleId', stylesController_1.stylesController.getStyleById);
router.get('/face-shape/:faceShape', stylesController_1.stylesController.getStylesByFaceShape);
router.post('/filter', stylesController_1.stylesController.filterStyles);
exports.default = router;
//# sourceMappingURL=stylesRoutes.js.map