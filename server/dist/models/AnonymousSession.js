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
exports.AnonymousSession = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const FaceAnalysis_1 = require("./FaceAnalysis");
let AnonymousSession = class AnonymousSession extends sequelize_typescript_1.Model {
};
exports.AnonymousSession = AnonymousSession;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], AnonymousSession.prototype, "session_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], AnonymousSession.prototype, "device_fingerprint", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], AnonymousSession.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'last_activity'
    }),
    __metadata("design:type", Date)
], AnonymousSession.prototype, "last_activity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], AnonymousSession.prototype, "ip_address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true
    }),
    __metadata("design:type", String)
], AnonymousSession.prototype, "user_agent", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => FaceAnalysis_1.FaceAnalysis, {
        foreignKey: 'session_id',
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", Array)
], AnonymousSession.prototype, "face_analyses", void 0);
exports.AnonymousSession = AnonymousSession = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'anonymous_sessions',
        timestamps: true,
        underscored: true
    })
], AnonymousSession);
//# sourceMappingURL=AnonymousSession.js.map