import React from "react";
import Images from "@/components/images";
import { useAmbulanceCounts } from "@/hooks/useAmbulance";


const MetricsCard: React.FC = () => {
  const { data: ambulances } = useAmbulanceCounts();

  console.log("Ambulance Counts:", ambulances);

  return (
    <div className="bg-white rounded-2xl p-5 transition-shadow duration-300 min-h-[350px]">
      <div className="space-y-3">
        <div className="bg-[#F6F8F9] p-4 rounded-lg mb-5">
          <img src={Images.icon.ambulance} alt="Total Providers" className="w-14 h-14 mb-2" />
          <p className="text-sm font-normal text-[#354959] tracking-wide">Total Ambulance</p>
          <p className="text-xl font-semibold text-[#354959] mt-1">{ambulances?.total || 'N/A'}</p>
        </div>
                
        <div className="bg-[#F8FEF5] p-4 rounded-lg">
          <img src={Images.icon.naira} alt="Total Providers" className="w-14 h-14 mb-2" />
          <p className="text-sm font-normal text-[#354959] tracking-wide">Revenue</p>
          <p className="text-xl font-semibold text-[#354959] mt-1">N2,853</p>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;