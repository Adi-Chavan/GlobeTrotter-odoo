const express = require("express");
const router = express.Router();
const budgetController = require("../controller/budgetController");
const { protect } = require("../middleware/authMiddleware");

// Trip-specific expense routes
router.get("/:tripId/expenses", protect, budgetController.getExpenses);
router.post("/:tripId/expenses", protect, budgetController.addExpense);
router.put("/:tripId/expenses/:expenseId", protect, budgetController.updateExpense);
router.delete("/:tripId/expenses/:expenseId", protect, budgetController.deleteExpense);
router.get("/:tripId/summary", protect, budgetController.getBudgetSummary);

// Original budget routes (for backward compatibility)
router.get("/", protect, budgetController.getBudgets);
router.get("/:id", protect, budgetController.getBudgetById);
router.post("/", protect, budgetController.createBudget);
router.put("/:id", protect, budgetController.updateBudget);
router.delete("/:id", protect, budgetController.deleteBudget);

module.exports = router;
