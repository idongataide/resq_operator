// components/ProviderDetails.tsx
import {
  FiUser,
  FiPhone,
  FiCalendar,
  FiTruck,
  FiChevronUp,
  FiCheckCircle,
  FiUserCheck,
} from "react-icons/fi";
import { FaPen } from "react-icons/fa";


interface ProviderDetailsProps {
  booking: any; // Replace with your Booking type
}

const ProviderDetails: React.FC<ProviderDetailsProps> = ({ booking }) => {
  
  
  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Use real data from provider if available, otherwise fallback to booking data
  const providerDetails = {
    providerName: booking?.provider_data?.name || "Not Assigned",
    contact: booking?.provider_data?.phone_number || "N/A",
    email: booking?.provider_data?.email || "N/A",
    approvalDate: booking?.accepted_at 
      ? formatDate(booking.accepted_at)
      : "Not yet accepted",
    ambulancePlate: booking?.provider_data?.reg_number || "N/A",
    colorModel: booking?.vehicle_model || "N/A",
    ambulanceLead: booking?.driver_name || "N/A",
    approvalReasons: booking?.booking_reason  || "No approval reasons provided",
  };


  // if (isLoading) {
  //   return (
  //     <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden mt-4 p-8 flex justify-center items-center">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden mt-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#FDF6F6] px-4 sm:px-6 py-4 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100 flex-shrink-0">
              <FiCheckCircle className="w-4 h-4 text-[#DB4A47]" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
              PROVIDER DETAILS
            </h2>        
          </div>

          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <FiChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#DB4A47]" />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
        
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-x-8 sm:gap-y-6 text-xs sm:text-sm text-[#808D97]">
            {/* Provider Name */}
            <div className="flex items-start gap-2 sm:gap-3">
              <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Provider Name</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.providerName}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-2 sm:gap-3">
              <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Contact</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.contact}</p>
              </div>
            </div>

            {/* Approval Date & Time */}
            <div className="flex items-start gap-2 sm:gap-3">
              <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Approval Date & Time</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.approvalDate}</p>
              </div>
            </div>

            {/* Ambulance Plate */}
            <div className="flex items-start gap-2 sm:gap-3">
              <FiTruck className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Ambulance Plate</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.ambulancePlate}</p>
              </div>
            </div>

            {/* Colour/Model */}
            <div className="flex items-start gap-2 sm:gap-3">
              <FiTruck className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Colour/Model</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.colorModel}</p>
              </div>
            </div>

            {/* Ambulance Lead Name */}
            <div className="flex items-start gap-2 sm:gap-3">
              <FiUserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#808D97] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[#808D97] text-xs sm:text-sm">Ambulance Lead Name</p>
                <p className="font-medium text-[#000A0F] break-words">{providerDetails.ambulanceLead}</p>
              </div>
            </div>
          </div>

          {/* Approval Reasons */}
          <div className="mt-6">
            <div className="bg-[#F5F6F7] rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <FaPen className="w-3 h-3 sm:w-4 sm:h-4 text-[#808D97] flex-shrink-0" />
                <p className="text-xs sm:text-sm text-[#354959] font-medium">Approval Reasons</p>
              </div>
              <p className="text-xs sm:text-sm text-[#000A0F] leading-relaxed break-words">
                {providerDetails.approvalReasons}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderDetails;