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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const FaceAnalysis_1 = require("./FaceAnalysis");
const Subscription_1 = require("./Subscription");
const UserActivity_1 = require("./UserActivity");
const SavedRecommendation_1 = require("./SavedRecommendation");
const Recommendation_1 = require("./Recommendation");
let User = class User extends sequelize_typescript_1.Model {
    get password() {
        return undefined;
    }
    set password(value) {
        if (value) {
            this.setDataValue('password_hash', bcryptjs_1.default.hashSync(value, 10));
        }
    }
    async comparePassword(password) {
        return bcryptjs_1.default.compare(password, this.password_hash);
    }
    static async hashPassword(instance) {
        if (instance.changed('password_hash')) {
        }
    }
};
exports.User = User;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], User.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
        allowNull: true,
        validate: {
            len: [8, 100]
        }
    }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], User.prototype, "password", null);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_premium", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], User.prototype, "subscription_expires_at", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'updated_at'
    }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], User.prototype, "last_login", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => FaceAnalysis_1.FaceAnalysis, {
        foreignKey: 'user_id'
    }),
    __metadata("design:type", Array)
], User.prototype, "face_analyses", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Subscription_1.Subscription, {
        foreignKey: 'user_id'
    }),
    __metadata("design:type", Array)
], User.prototype, "subscriptions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => UserActivity_1.UserActivity, {
        foreignKey: 'user_id'
    }),
    __metadata("design:type", Array)
], User.prototype, "activities", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SavedRecommendation_1.SavedRecommendation, {
        foreignKey: 'user_id'
    }),
    __metadata("design:type", Array)
], User.prototype, "saved_recommendations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Recommendation_1.Recommendation, {
        foreignKey: 'user_id'
    }),
    __metadata("design:type", Array)
], User.prototype, "recommendations", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPassword", null);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        timestamps: true,
        underscored: true
    })
], User);
//# sourceMappingURL=User.js.map