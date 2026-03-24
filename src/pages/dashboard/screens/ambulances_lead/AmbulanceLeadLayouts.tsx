// HospitalLayout.tsx
import React from "react";
import AmbulanceLeadsTable from "./AmbulanceLeadList";


const AmbulanceLeadLayout: React.FC = () => {
    return (
        <>
        <div className="w-full p-6">
            {/* Teams Table */}
            <div className="mt-4">
                <AmbulanceLeadsTable />
            </div>
        </div>
        </>
    );
};

export default AmbulanceLeadLayout;