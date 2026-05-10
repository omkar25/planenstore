"use client";

import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import {
  OrdersBarChart,
  CategoryPieChart,
  RevenueLineChart,
  UserGrowthChart,
  StatCard,
} from "@/components/admin/charts/OverviewCharts";

export default function AdminOverviewPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value="156"
          change="+12 this month"
          changeType="positive"
          icon={<Package className="w-6 h-6" />}
        />
        <StatCard
          title="Total Orders"
          value="373"
          change="+28 this week"
          changeType="positive"
          icon={<ShoppingCart className="w-6 h-6" />}
        />
        <StatCard
          title="Total Users"
          value="312"
          change="+56 this month"
          changeType="positive"
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Revenue"
          value="€109,900"
          change="+18.2% vs last month"
          changeType="positive"
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersBarChart />
        <CategoryPieChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueLineChart />
        <UserGrowthChart />
      </div>
    </div>
  );
}