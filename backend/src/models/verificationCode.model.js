import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        type: {type:String, required:true},
        createdAt: {type: Date, default: Date.now, index: true},
        expiresAt: {type:Date, required:true},
    },
);

const VerificationCodeModel = mongoose.model(
    "VerificationCode",
    verificationCodeSchema,
    "verification_codes"
);
export default VerificationCodeModel;