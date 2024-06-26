"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mobile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MobileSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    modelName: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    picture: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});
exports.Mobile = mongoose_1.default.model('Mobile', MobileSchema);
