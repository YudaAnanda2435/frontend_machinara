import React from "react";
import AppLayout from "../components/Layouts/appLayout";

// --- IMPORT KOMPONEN UI ---
import AlertFeed from "@/components/fragments/AlertFeed";
import AssetHealthOverview from "@/components/fragments/AssetHealthOverview";
import MixBarChart from "@/components/fragments/chart";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 py-6 relative">
        <AssetHealthOverview />
        <AlertFeed />
        <MixBarChart />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
