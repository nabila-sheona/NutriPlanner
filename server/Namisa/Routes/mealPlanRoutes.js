const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/jwt.js");
const {
  saveMealPlan,
  getMealPlans,
} = require("../Controller/mealPlanController.js");

router.post("/save", verifyToken, saveMealPlan);
router.get("/myplans", verifyToken, getMealPlans);

module.exports = router;
