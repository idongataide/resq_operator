// components/HealthDetails.tsx
import {
  FiNavigation,
  FiEdit,
  FiChevronUp,
  FiEye,
} from "react-icons/fi";
import { Button } from "antd";
import { IoWaterOutline } from "react-icons/io5";
import { BiCapsule } from "react-icons/bi";


interface HealthDetailsProps {
  booking: any; // Replace with your Booking type
}

const HealthDetails: React.FC<HealthDetailsProps> = ({ booking }) => {

  const healthData = {
    bloodType: booking?.customer_data?.blood_type || "N/A",
    currentMedications: booking?.customer_data?.current_medications || "N/A",
    allergies: booking?.customer_data?.allergies || "None reported",
    chronicIllness: booking?.customer_data?.chronic_illness || "None reported",
    genotype: booking?.customer_data?.genotype || "N/A",
  };

  // Format arrays if they come as arrays
  const formatList = (item: string | string[] | undefined) => {
    if (!item) return "None reported";
    if (Array.isArray(item)) return item.join(", ");
    return item;
  };

  // if (isLoading) {
  //   return (
  //     <div className="w-full max-w-5xl rounded-2xl shadow-sm bg-white overflow-hidden mt-3! p-8 flex justify-center items-center">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden mt-3!">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FDF6F6] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
              <FiNavigation className="w-4 h-4 text-[#DB4A47]" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
              User Health Details
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="text"
              className="text-[#DB4A47]! flex items-center font-medium! gap-2"
              onClick={() => {
                // Handle view medical report
                if (booking?.medical_report_url) {
                  window.open(booking.medical_report_url, '_blank');
                }
              }}
            >
              <FiEye className="w-4 h-4 text-[#DB4A47]" />
              View Medical Report
            </Button>

            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FiChevronUp className="w-4 h-4 text-[#DB4A47]" />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-sm text-[#808D97]">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <IoWaterOutline className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Blood Type</p>
                  <p className="font-medium text-[#000A0F]">{healthData.bloodType}</p>
                </div>
              </div>           
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <BiCapsule className="w-4 h-4 text-[#808D97] mt-1" />
                <div>
                  <p className="text-[#808D97]">Current Medications</p>
                  <p className="font-medium text-[#000A0F]">{formatList(healthData.currentMedications)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Health Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#F5F6F7] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiEdit className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Allergies</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {formatList(healthData.allergies)}
              </p>
            </div>
            
            <div className="bg-[#F5F6F7] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiEdit className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Chronic Illness</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {formatList(healthData.chronicIllness)}
              </p>
            </div>
          </div>

          {/* Additional Health Info if available */}
          {booking?.additional_notes && (
            <div className="mt-4 bg-[#F5F6F7] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiEdit className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Additional Notes</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {booking.additional_notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HealthDetails;