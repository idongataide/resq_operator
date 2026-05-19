// teamsLayout.tsx
import React from "react";
import RevenueMetrics from "./revenueMetrics";
import OperatorRevenue from "./operatorRevenue";

interface OverviewLayoutProps {
  isNonEmergency?: boolean;
}

const OverviewLayout: React.FC<OverviewLayoutProps> = ({ isNonEmergency = false }) => {
    console.log("OverviewLayout - isNonEmergency:", isNonEmergency);
    return (
        <div className="w-full">
            {/* Revenue Metrics and Teams Table */}
            <div className="space-y-6">
                <RevenueMetrics isNonEmergency={isNonEmergency} />
                <OperatorRevenue isNonEmergency={isNonEmergency} />
            </div>
        </div>
    );
};

export default OverviewLayout;