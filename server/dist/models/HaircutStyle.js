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
exports.HaircutStyle = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Recommendation_1 = require("./Recommendation");
let HaircutStyle = class HaircutStyle extends sequelize_typescript_1.Model {
};
exports.HaircutStyle = HaircutStyle;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], HaircutStyle.prototype, "style_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], HaircutStyle.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false
    }),
    __metadata("design:type", String)
], HaircutStyle.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
        allowNull: false
    }),
    __metadata("design:type", Array)
], HaircutStyle.prototype, "suitable_face_shapes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
        allowNull: false
    }),
    __metadata("design:type", Array)
], HaircutStyle.prototype, "suitable_hair_types", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
        allowNull: false
    }),
    __metadata("design:type", Array)
], HaircutStyle.prototype, "suitable_genders", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('short', 'medium', 'long'),
        allowNull: false
    }),
    __metadata("design:type", String)
], HaircutStyle.prototype, "length_category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }),
    __metadata("design:type", Number)
], HaircutStyle.prototype, "maintenance_level", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], HaircutStyle.prototype, "image_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true
    }),
    __metadata("design:type", Object)
], HaircutStyle.prototype, "style_attributes", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], HaircutStyle.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'updated_at'
    }),
    __metadata("design:type", Date)
], HaircutStyle.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Recommendation_1.Recommendation, {
        foreignKey: 'style_id'
    }),
    __metadata("design:type", Array)
], HaircutStyle.prototype, "recommendations", void 0);
exports.HaircutStyle = HaircutStyle = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'haircut_styles',
        timestamps: true,
        underscored: true
    })
], HaircutStyle);
//# sourceMappingURL=HaircutStyle.js.map