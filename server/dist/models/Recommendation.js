"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recommendation = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const FaceAnalysis_1 = require("./FaceAnalysis");
const User_1 = require("./User");
const HaircutStyle_1 = require("./HaircutStyle");
const SavedRecommendation_1 = require("./SavedRecommendation");
let Recommendation = class Recommendation extends sequelize_typescript_1.Model {
};
exports.Recommendation = Recommendation;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], Recommendation.prototype, "recommendation_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => FaceAnalysis_1.FaceAnalysis),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], Recommendation.prototype, "analysis_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true
    }),
    __metadata("design:type", String)
], Recommendation.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => HaircutStyle_1.HaircutStyle),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], Recommendation.prototype, "style_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    }),
    __metadata("design:type", Number)
], Recommendation.prototype, "relevance_score", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], Recommendation.prototype, "position", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false
    }),
    __metadata("design:type", String)
], Recommendation.prototype, "explanation", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], Recommendation.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => FaceAnalysis_1.FaceAnalysis, {
        foreignKey: 'analysis_id',
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", FaceAnalysis_1.FaceAnalysis)
], Recommendation.prototype, "analysis", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", User_1.User)
], Recommendation.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => HaircutStyle_1.HaircutStyle, {
        foreignKey: 'style_id'
    }),
    __metadata("design:type", HaircutStyle_1.HaircutStyle)
], Recommendation.prototype, "style", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SavedRecommendation_1.SavedRecommendation, {
        foreignKey: 'recommendation_id'
    }),
    __metadata("design:type", Array)
], Recommendation.prototype, "saved_instances", void 0);
exports.Recommendation = Recommendation = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'recommendations',
        timestamps: true,
        underscored: true
    })
], Recommendation);
//# sourceMappingURL=Recommendation.js.map