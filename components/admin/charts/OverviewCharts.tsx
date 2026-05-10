"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Sample data - replace with real API data
const monthlyOrdersData = [
  { month: "Jan", orders: 45 },
  { month: "Feb", orders: 52 },
  { month: "Mar", orders: 61 },
  { month: "Apr", orders: 58 },
  { month: "May", orders: 72 },
  { month: "Jun", orders: 85 },
];

const categoryDistribution = [
  { name: "PVC Planen", value: 35, color: "#84cc16" },
  { name: "Gerüstplanen", value: 28, color: "#22c55e" },
  { name: "Kederplanen", value: 20, color: "#14b8a6" },
  { name: "Schutznetze", value: 17, color: "#06b6d4" },
];

const revenueData = [
  { month: "Jan", revenue: 12500, orders: 45 },
  { month: "Feb", revenue: 15200, orders: 52 },
  { month: "Mar", revenue: 18100, orders: 61 },
  { month: "Apr", revenue: 16800, orders: 58 },
  { month: "May", revenue: 21500, orders: 72 },
  { month: "Jun", revenue: 25800, orders: 85 },
];

const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 145 },
  { month: "Mar", users: 178 },
  { month: "Apr", users: 210 },
  { month: "May", users: 256 },
  { month: "Jun", users: 312 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
}

function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                changeType === "positive"
                  ? "text-green-500"
                  : changeType === "negative"
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      </div>
    </div>
  );
}

export function OrdersBarChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Orders</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyOrdersData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" className="text-muted-foreground" />
          <YAxis className="text-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="orders" fill="#84cc16" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryDistribution}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {categoryDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueLineChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue & Orders Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" className="text-muted-foreground" />
          <YAxis yAxisId="left" className="text-muted-foreground" />
          <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#84cc16"
            strokeWidth={2}
            dot={{ fill: "#84cc16" }}
            name="Revenue (€)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ fill: "#06b6d4" }}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UserGrowthChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">User Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userGrowthData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" className="text-muted-foreground" />
          <YAxis className="text-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e" }}
            name="Total Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { StatCard };
