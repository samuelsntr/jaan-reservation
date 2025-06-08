// app/dashboard/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  CalendarDays,
  Users,
  UserCheck,
  Clock3,
  LayoutGrid,
  Building2,
} from "lucide-react";
import api from "@/lib/axios";
import clsx from "clsx";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#e11d48", "#0ea5e9"];

export default function DashboardSummary() {
  const [summary, setSummary] = useState({});
  const [reservationsOverTime, setReservationsOverTime] = useState([]);
  const [tableTypes, setTableTypes] = useState([]);
  const [floorUsage, setFloorUsage] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const res = await api.get("/dashboard/summary");
    setSummary(res.data.kpis || {});
    setReservationsOverTime(res.data.trends.reservationsPerDay || []);
    setTableTypes(res.data.charts.tableTypeDistribution || []);
    setFloorUsage(res.data.charts.floorDistribution || []);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Reservation Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Get real-time insights into today’s reservations, usage trends, and
          floor analytics.
        </p>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <KPI
          icon={<Users className="text-blue-600" />}
          title="Total Pax Today"
          value={summary.totalPaxToday}
          color="bg-blue-100"
        />
        <KPI
          icon={<CalendarDays className="text-emerald-600" />}
          title="Total Reservations"
          value={summary.totalReservations}
          color="bg-emerald-100"
        />
        <KPI
          icon={<UserCheck className="text-purple-600" />}
          title="Confirmed"
          value={summary.totalConfirmed}
          color="bg-purple-100"
        />
        <KPI
          icon={<Clock3 className="text-yellow-600" />}
          title="Pending"
          value={summary.totalPending}
          color="bg-yellow-100"
        />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard
          title="Reservation Trend"
          description="Monitor daily reservation volume over time."
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reservationsOverTime}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Table Type Usage"
          description="Distribution of table types used."
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tableTypes}
                dataKey="count"
                nameKey="tableType"
                outerRadius={100}
                label
              >
                {tableTypes.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard
          title="Floor Distribution"
          description="Where guests are mostly seated."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={floorUsage}>
              <XAxis dataKey="floor" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
}

function KPI({ title, value, icon, color }) {
  return (
    <Card
      className={clsx(
        "flex items-center justify-between p-4 shadow hover:shadow-lg transition-shadow border border-muted rounded-2xl",
        "bg-white dark:bg-muted"
      )}
    >
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value ?? 0}</h3>
      </div>
      <div className={clsx("p-2 rounded-full", color)}>{icon}</div>
    </Card>
  );
}

function ChartCard({ title, description, children }) {
  return (
    <Card className="p-4 rounded-2xl border border-muted shadow hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </Card>
  );
}
