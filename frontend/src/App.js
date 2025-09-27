import React, { useState, useEffect } from "react";
import "./App.css";
import Charts from "./Charts";   // top of App.js


function App() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});

  // Load saved data
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("budgetTracker_transactions")) || [];
    const savedBudgets = JSON.parse(localStorage.getItem("budgetTracker_budgets")) || {};
    setTransactions(savedTransactions);
    setBudgets(savedBudgets);
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem("budgetTracker_transactions", JSON.stringify(transactions));
    localStorage.setItem("budgetTracker_budgets", JSON.stringify(budgets));
  }, [transactions, budgets]);

  // Add new transaction
  const addTransaction = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const type = e.target.type.value;
    const category = e.target.category.value;
    const date = e.target.date.value;
    const notes = e.target.notes.value;

    if (!amount || !type || !category || !date) return;

    const newTransaction = {
      id: Date.now(),
      amount,
      type,
      category,
      date,
      notes,
    };

    setTransactions([newTransaction, ...transactions]);
    e.target.reset();
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Set budget
  const setBudget = (category, amount) => {
    setBudgets({ ...budgets, [category]: amount });
  };

  // Dashboard stats
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  return (
    <div className="container">
      <div className="header">
        <h1>💰 Personal Budget Tracker</h1>
        <p>Track your income, expenses, and budgets</p>
      </div>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="card">
          <h3>Total Income</h3>
          <div className="stat income">${income.toFixed(2)}</div>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <div className="stat expense">${expenses.toFixed(2)}</div>
        </div>
        <div className="card">
          <h3>Balance</h3>
          <div className={`stat ${balance >= 0 ? "income" : "expense"}`}>
            ${balance.toFixed(2)}
          </div>
        </div>
        <div className="card">
          <h3>Transactions</h3>
          <div className="stat">{transactions.length}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Add Transaction Form */}
        <div className="section">
          <h3>Add New Transaction</h3>
          <form id="transactionForm" onSubmit={addTransaction}>
            <div className="form-group">
              <label>Amount ($)</label>
              <input type="number" name="amount" step="0.01" min="0" required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" required>
                <option value="">Select type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" required>
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" required />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input type="text" name="notes" placeholder="Optional description" />
            </div>
            <button type="submit" className="btn">Add Transaction</button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="section">
          <h3>Transaction History</h3>
          <div id="transactionList" className="transaction-list">
            {transactions.length === 0 ? (
              <div className="empty-state">No transactions yet</div>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className={`transaction-item ${t.type}`}>
                  <div className="transaction-details">
                    <div className={`transaction-amount ${t.type}`}>
                      {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                    </div>
                    <div className="transaction-meta">
                      {t.category} • {new Date(t.date).toLocaleDateString()}
                      {t.notes ? ` • ${t.notes}` : ""}
                    </div>
                  </div>
                  <button className="btn btn-danger" onClick={() => deleteTransaction(t.id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Budget Section */}
        <div className="budget-section">
          <h3>Budget Management</h3>
          <div className="budget-form">
            <select id="budgetCategory">
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
            <input type="number" id="budgetAmount" placeholder="Monthly budget ($)" step="0.01" min="0" />
            <button
              type="button"
              className="btn"
              onClick={() => {
                const category = document.getElementById("budgetCategory").value;
                const amount = parseFloat(document.getElementById("budgetAmount").value);
                if (category && amount > 0) setBudget(category, amount);
              }}
            >
              Set Budget
            </button>
          </div>
          <Charts transactions={transactions} />

          <div id="budgetList">
            {Object.keys(budgets).length === 0 ? (
              <div className="empty-state">No budgets set</div>
            ) : (
              Object.entries(budgets).map(([category, budget]) => {
                const spent = transactions
                  .filter((t) => t.type === "expense" && t.category === category)
                  .reduce((s, t) => s + t.amount, 0);
                const percentage = (spent / budget) * 100;
                const overBudget = spent > budget;
                return (
                  <div key={category} className="budget-item">
                    <div className="budget-header">
                      <strong>{category}</strong>
                      <span>${spent.toFixed(2)} / ${budget.toFixed(2)}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${overBudget ? "over-budget" : ""}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
