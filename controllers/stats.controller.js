import User from "../models/User.model.js";
import statsService from "../services/stats.service.js";
import { sendResponse } from "../utils/response.js";

const getUserStats = async (req, res) => {
    try {
        const stats = await statsService.calculateUserStats(req.user.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const setSpendingLimit = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { monthlySpendingLimit: req.body.monthlySpendingLimit },
            { new: true },
        );
        sendResponse(
            res,
            200,
            { monthlySpendingLimit: user.monthlySpendingLimit },
            "Spending limit updated successfully",
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { getUserStats, setSpendingLimit };
