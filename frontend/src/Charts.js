import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Charts({ transactions }) {
  // Split into income and expenses
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  // Expenses by category
  const categories = [...new Set(transactions.filter(t => t.type === "expense").map(t => t.category))];
  const categoryTotals = categories.map(cat =>
    transactions.filter(t => t.type === "expense" && t.category === cat)
                .reduce((s, t) => s + t.amount, 0)
  );

  return (
    <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
      {/* Pie chart: Income vs Expenses */}
      <div style={{ background: "#fff", borderRadius: "15px", padding: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
        <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Income vs Expenses</h3>
        <Pie
          data={{
            labels: ["Income", "Expenses"],
            datasets: [
              {
                data: [income, expenses],
                backgroundColor: ["#28a745", "#dc3545"],
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      {/* Bar chart: Expenses by Category */}
      <div style={{ background: "#fff", borderRadius: "15px", padding: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
        <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Expenses by Category</h3>
        <Bar
          data={{
            labels: categories,
            datasets: [
              {
                label: "Expenses ($)",
                data: categoryTotals,
                backgroundColor: "#4facfe",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Charts;
