const Budget = require("../models/Budget");
const Trip = require("../models/Trip");
const mongoose = require("mongoose");

// New expense management methods
exports.getExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Get all expenses for this trip
    const expenses = await Budget.find({ trip: tripId })
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Server error fetching expenses" });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { type, amount, date, description } = req.body;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const expense = new Budget({
      trip: tripId,
      type,
      amount,
      date: date || new Date(),
      description
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(400).json({ message: "Invalid expense data" });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const expense = await Budget.findOneAndUpdate(
      { _id: expenseId, trip: tripId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(400).json({ message: "Invalid expense update data" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const expense = await Budget.findOneAndDelete({ _id: expenseId, trip: tripId });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Server error deleting expense" });
  }
};

exports.getBudgetSummary = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Convert tripId to ObjectId for aggregation
    const tripObjectId = new mongoose.Types.ObjectId(tripId);

    // Aggregate expenses by type
    const expensesByType = await Budget.aggregate([
      { $match: { trip: tripObjectId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate totals
    const totalExpenses = await Budget.aggregate([
      { $match: { trip: tripObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const summary = {
      totalExpenses: totalExpenses[0]?.total || 0,
      budgetRemaining: (trip.totalBudget || 0) - (totalExpenses[0]?.total || 0),
      expensesByType: expensesByType,
      tripBudget: trip.totalBudget || 0
    };

    res.json(summary);
  } catch (err) {
    console.error("Error getting budget summary:", err);
    res.status(500).json({ message: "Server error getting budget summary" });
  }
};

// Original budget methods (for backward compatibility)

exports.getBudgets = async (req, res) => {
  try {
    // Get user's trips first
    const userTrips = await Trip.find({ user: req.user._id }).select('_id');
    const tripIds = userTrips.map(trip => trip._id);

    const budgets = await Budget.find({ trip: { $in: tripIds } })
      .populate("trip", "name primaryDestination") 
      .populate("activity", "name description") 
      .sort({ createdAt: -1 });

    res.json(budgets);
  } catch (err) {
    console.error("Error fetching budgets:", err);
    res.status(500).json({ message: "Server error fetching budgets" });
  }
};

exports.getBudgetById = async (req, res) => {
  try {
    // Get user's trips first
    const userTrips = await Trip.find({ user: req.user._id }).select('_id');
    const tripIds = userTrips.map(trip => trip._id);

    const budget = await Budget.findOne({ 
      _id: req.params.id, 
      trip: { $in: tripIds } 
    })
      .populate("trip", "name primaryDestination")
      .populate("activity", "name description");

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    res.json(budget);
  } catch (err) {
    console.error("Error fetching budget:", err);
    res.status(500).json({ message: "Server error fetching budget" });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const budget = new Budget(req.body);
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    console.error("Error creating budget:", err);
    res.status(400).json({ message: "Invalid budget data" });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    res.json(budget);
  } catch (err) {
    console.error("Error updating budget:", err);
    res.status(400).json({ message: "Invalid budget update data" });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    console.error("Error deleting budget:", err);
    res.status(500).json({ message: "Server error deleting budget" });
  }
};
