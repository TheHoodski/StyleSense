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
exports.FaceAnalysis = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const AnonymousSession_1 = require("./AnonymousSession");
const Recommendation_1 = require("./Recommendation");
let FaceAnalysis = class FaceAnalysis extends sequelize_typescript_1.Model {
};
exports.FaceAnalysis = FaceAnalysis;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], FaceAnalysis.prototype, "analysis_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => AnonymousSession_1.AnonymousSession),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true
    }),
    __metadata("design:type", String)
], FaceAnalysis.prototype, "session_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true
    }),
    __metadata("design:type", String)
], FaceAnalysis.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], FaceAnalysis.prototype, "photo_key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('oval', 'round', 'square', 'heart', 'diamond', 'rectangle', 'triangle'),
        allowNull: false
    }),
    __metadata("design:type", String)
], FaceAnalysis.prototype, "face_shape", void 0);
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
], FaceAnalysis.prototype, "confidence_score", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        unique: true,
        allowNull: false
    }),
    __metadata("design:type", String)
], FaceAnalysis.prototype, "share_token", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], FaceAnalysis.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], FaceAnalysis.prototype, "expires_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], FaceAnalysis.prototype, "is_deleted", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => AnonymousSession_1.AnonymousSession, {
        foreignKey: 'session_id',
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", AnonymousSession_1.AnonymousSession)
], FaceAnalysis.prototype, "session", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", User_1.User)
], FaceAnalysis.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Recommendation_1.Recommendation, {
        foreignKey: 'analysis_id',
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", Array)
], FaceAnalysis.prototype, "recommendations", void 0);
exports.FaceAnalysis = FaceAnalysis = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'face_analyses',
        timestamps: true,
        underscored: true
    })
], FaceAnalysis);
//# sourceMappingURL=FaceAnalysis.js.map