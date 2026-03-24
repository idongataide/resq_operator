// HospitalLayout.tsx
import React from "react";
import AmbulancesTable from "./AmbulanceList";

const AmbulanceLayouts: React.FC = () => {
    return (
        <>
        <div className="w-full p-6">
            {/* Teams Table */}
            <div className="mt-4">
                <AmbulancesTable />
            </div>
        </div>
        </>
    );
};

export default AmbulanceLayouts;