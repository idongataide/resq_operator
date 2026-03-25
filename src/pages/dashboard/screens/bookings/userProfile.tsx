import { useState } from "react";
import { 
  FaCalendarAlt, 
  FaPhone, 
  FaVenusMars,
  FaHashtag,
  FaUser,
  FaEnvelope,
} from 'react-icons/fa';
import { Button, Modal, Input } from 'antd';
import Images from '@/components/images';
import { LuCheckCheck } from "react-icons/lu";
import { AiOutlineStop } from "react-icons/ai";
import { acceptBooking } from "@/api/bookingsApi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import AcceptBookingModal from "./AcceptBookingModal";

interface UserProfileProps {
  booking: any;
}

const UserProfile: React.FC<UserProfileProps> = ({ booking }) => {
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { mutate } = useSWRConfig();

  const operationStatus = booking?.operation_status ?? 0;

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get status badge config
  const getStatusConfig = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: '#FFF7E8', text: '#BB7F05', label: 'Searching for an Ambulance' },
      REQUEST_ACCEPTED: { bg: '#F8FEF5', text: '#4EA507', label: 'Ambulance Assigned' },
      ENROUTE_PICKUP: { bg: '#F2F9FE', text: '#007BFF', label: 'En-route to Pickup' },
      ARRIVED_AT_PICKUP: { bg: '#E8F0FE', text: '#1A5F7A', label: 'Arrived at Pickup' },
      PICKED_PATIENT: { bg: '#E8F5E9', text: '#1B5E20', label: 'Patient Picked Up' },
      ENROUTE_TO_DROPOFF: { bg: '#F2F9FE', text: '#007BFF', label: 'En-route to Hospital' },
      COMPLETED: { bg: '#E8F5E9', text: '#1B5E20', label: 'Completed' },
      CANCELED: { bg: '#FDF5F5', text: '#DE3631', label: 'Cancelled' },
    };

    return statusConfig[status] || statusConfig.PENDING;
  };

  // Handle reject booking
  const handleReject = async () => {
    if (!booking?.booking_id) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Rejecting booking...');

    try {
      const response = await acceptBooking({
        booking_id: booking.booking_id,
        lead_id: "",
        booking_reason: reason || "Rejected by admin",
      });
      
      if (response?.status === 'ok') {
        toast.success('Booking rejected successfully!', { id: loadingToast });
        mutate(`/bookings/${booking.booking_id}`);
        mutate('/bookings');
        setIsRejectModalOpen(false);
        setReason("");
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to reject booking';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to reject booking', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  const statusConfig = getStatusConfig(booking.booking_status);

  return (
    <>
      <div className="w-full rounded-2xl shadow-xs bg-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          
          {/* Profile Image */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-45 lg:h-45 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center mx-auto sm:mx-0">
            <img 
              src={Images.ambulance} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* User Details */}
          <div className="flex-1 w-full">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#000A0F]">
                {booking.customer_data?.full_name || 'N/A'}
              </h2>
              
              {/* Show Accept/Reject buttons only if operation_status is 0 */}
              {operationStatus === 0 && (
                <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                  <Button 
                    icon={<FaEnvelope />} 
                    className="rounded-lg flex bg-[#FDF6F6]! text-[#DB4A47]! border-0! items-center"
                    size="large"
                    onClick={() => window.location.href = `mailto:${booking.user_data?.email || ''}`}
                  />
                  <Button 
                    icon={<AiOutlineStop />} 
                    className="rounded-lg flex bg-[#FDF6F6]! text-[#DB4A47]! border-0! items-center"
                    size="large"
                    onClick={() => setIsRejectModalOpen(true)}
                  >
                    Reject
                  </Button>
                  <Button 
                    type='primary' 
                    className="text-white rounded-xl px-4 py-2 flex items-center gap-2 flex-1 sm:flex-none justify-center"
                    icon={<LuCheckCheck className="w-4 h-4" />}
                    onClick={() => setIsAcceptModalOpen(true)}
                  >
                    Accept
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                <Button 
                  className="rounded-xl px-3 py-2 bg-[#FDF6F6] flex-1 sm:flex-none"
                  icon={<FaPhone className="w-4 h-4 text-[#DB4A47]" />}
                  onClick={() => window.location.href = `tel:${booking.customer_data?.customer_phone || booking.phone_number}`}
                />                
                {operationStatus !== 0 && (
                  <Button 
                    type='primary' 
                    className="text-white rounded-xl px-4 py-2 flex items-center gap-2 flex-1 sm:flex-none justify-center"
                    icon={<FaEnvelope className="w-4 h-4" />}
                    onClick={() => window.location.href = `mailto:${booking.user_data?.email || ''}`}
                  >
                    Chat with User
                  </Button>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 my-4" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 text-sm text-gray-700">
              
              {/* Booking ID */}
              <div className="flex items-start gap-2">
                <FaHashtag className="w-4 h-4 mt-1 text-[#808D97] flex-shrink-0" />
                <div>
                  <p className="text-[#354959]">Booking ID</p>
                  <p className="font-medium text-[#000A0F]">
                    {booking.booking_ref || booking.booking_id?.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* User Type */}
              <div className="flex items-start gap-2">
                <FaUser className="w-4 h-4 mt-1 text-[#808D97] flex-shrink-0" />
                <div>
                  <p className="text-[#354959]">User Type</p>
                  <p className="font-medium text-[#000A0F] capitalize">
                    {booking.user_type || 'Registered'}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-2">
                <FaPhone className="w-4 h-4 mt-1 text-[#808D97] flex-shrink-0" />
                <div>
                  <p className="text-[#354959]">Contact</p>
                  <p className="font-medium text-[#000A0F]">
                    {booking.customer_data?.customer_phone || booking.phone_number || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Emergency Category */}
              <div className="flex items-start gap-2">
                <FaVenusMars className="w-4 h-4 mt-1 text-[#808D97] flex-shrink-0" />
                <div>
                  <p className="text-[#354959]">Emergency Category</p>
                  <p className="font-medium text-[#000A0F] capitalize">
                    {booking.emergency_category || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start gap-2">
                <FaCalendarAlt className="w-4 h-4 mt-1 text-[#808D97] flex-shrink-0" />
                <div>
                  <p className="text-[#354959]">Created At</p>
                  <p className="font-medium text-[#000A0F]">
                    {formatDate(booking.created_at)}
                  </p>
                </div>
              </div>

              {/* Request Status */}
              <div className="flex items-start gap-2">
                <div className="mt-1 w-4 h-4 flex-shrink-0" /> {/* Spacer for alignment */}
                <div>
                  <p className="text-[#354959]">Request Status</p>
                  <span 
                    className="inline-flex items-center mt-1 px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                    style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: statusConfig.text }}
                    />
                    {statusConfig.label}
                  </span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Shared Accept Booking Modal */}
      <AcceptBookingModal
        open={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        booking={booking}
      />

      {/* Reject Booking Modal */}
      <Modal
        open={isRejectModalOpen}
        footer={null}
        onCancel={() => {
          setIsRejectModalOpen(false);
          setReason("");
        }}
        centered
        width={500}
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Reject Booking?</h2>

          <p className="text-gray-500">
            This action would reject booking for{" "}
            <strong>
              {booking?.customer_data?.customer_name || 'this customer'}
            </strong>
          </p>

          <Input.TextArea
            rows={4}
            placeholder="Reason for rejection (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => {
                setIsRejectModalOpen(false);
                setReason("");
              }}
              disabled={isProcessing}
              className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              danger
              loading={isProcessing}
              className="px-8 bg-[#DB4A47]! text-white! border-none!"
              onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserProfile;