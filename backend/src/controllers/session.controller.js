import catchErrors from "../utils/catchErrors.js";
import SessionModel from "../models/session.model.js";
import { OK,NOT_FOUND } from "../constants/http.js";
import appAssert from "../utils/appAssert.js";
import { z } from "zod";

export const getSessionsHandler = catchErrors(
    async (req, res) =>
    { 
        const sessions = await SessionModel.find(
        {
            userId: req.userId,
            expiresAt: { $gt: Date.now() },
        },
        {
            _id: 1,
            userAgent: 1,
            createdAt: 1,
        },
        {
            sort: { createdAt: -1 },
        }
        );

        return res
        .status(OK)
        .json(
            // mark the current session
            sessions.map((session) => ({
              ...session.toObject(),
              ...(session.id === req.sessionId && {
                isCurrent: true,
              }),
            }))
          );
    }
)

export const deleteSessionHandler = catchErrors(
    async (req, res) => {
        const sessionId = z.string().parse(req.params.id);
        const deleted = await SessionModel.deleteOne({
            _id: sessionId,
            userId: req.userId,
        });
        appAssert(deleted, NOT_FOUND, "Session not found");

        return  res
        .status(OK)
        .json({
            message:"Session removed",
        })
    }
)