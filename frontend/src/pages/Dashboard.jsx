import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardKpis from "@/components/dashboard/DashboardKpis";
import GuestTrendChart from "../components/dashboard/GuestLogTrendChart";
import ReviewScoreChart from "../components/dashboard/ReviewScoreChart";
import TopServicesChart from "../components/dashboard/TopServicesChart";
import TopVendorsChart from "../components/dashboard/TopVendorsChart";
import RecentReview from "../components/dashboard/RecentReviews";
import GuestNationalityChart from "../components/dashboard/GuestNationalityChart";
import TopTreatmentsChart from "../components/dashboard/TopTreatmentsChart";
import RevenueTrendChart from "../components/dashboard/RevenueTrendChart";
import RecentNegativeFeedback from "../components/dashboard/RecentNegativeFeedback";
import SentimentSummaryChart from "../components/dashboard/SentimentSummaryChart";
import TodayOverviewWidget from "../components/dashboard/TodayOverviewWidget";
import RecentBookingsTable from "../components/dashboard/RecentBookingsTable";
import AlertsWidget from "../components/dashboard/AlertsWidget";
import TopActivitiesChart from "../components/dashboard/TopActivitiesChart";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const ContextLink = ({ to, label }) => (
    <div className="text-right">
      <Link
        to={to}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        {label} →
      </Link>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mx-auto px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Dashboard Overview
        </h1>

        {/* <Link
          to="/dashboard/print"
          className="text-sm text-blue-600 hover:underline"
        >
          🖨️ Print Summary
        </Link> */}

        <div className="space-y-6">
          <DashboardKpis stats={stats} />
          <TodayOverviewWidget />
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-12">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Business Trends
              </h2>
              <div className="space-y-6">
                <RevenueTrendChart />
                <GuestTrendChart />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Bookings & Services
              </h2>
              <div className="space-y-6">
                <RecentBookingsTable />
                <ContextLink to="/other-revenues" label="See all bookings" />
                <TopServicesChart />
                <TopVendorsChart />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Guest Sentiment
              </h2>
              <div className="space-y-6">
                <SentimentSummaryChart />
                <ReviewScoreChart />
                <ContextLink to="/reviews" label="Explore all reviews" />
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Alerts
              </h2>
              <AlertsWidget />
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Recent Feedback
              </h2>
              <div className="space-y-6">
                <RecentReview />
                <RecentNegativeFeedback />
                <ContextLink to="/guest-logs" label="See full feedback list" />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Guest Demographics
              </h2>
              <GuestNationalityChart />
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Wellness & Activities
              </h2>
              <div className="space-y-6">
                <TopTreatmentsChart />
                <TopActivitiesChart />
                <ContextLink to="/dirasha" label="View full wellness report" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
