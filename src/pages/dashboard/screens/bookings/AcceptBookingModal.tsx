// components/AcceptBookingModal.tsx
import { Modal, Select, Button } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { acceptBooking } from "@/api/bookingsApi";
import { useAmbulanceLeadsSearch } from "@/hooks/useAmbulanceLeads";

const { Option } = Select;

interface AcceptBookingModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  bookingType?: "all" | "emergency" | "non-emergency";
  onSuccess?: () => void;
  onAcceptComplete?: (acceptedBooking: any) => void; 
}

const AcceptBookingModal = ({ 
  open, 
  onClose, 
  booking, 
  onSuccess,
  onAcceptComplete,
}: AcceptBookingModalProps) => {
  const [selectedAmbulance, setSelectedAmbulance] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine booking type from the booking object itself
  const actualBookingType = booking?.schedule_id ? "non-emergency" : "emergency";
  
  // Fetch data based on booking type (only needed for emergency)
  const { data: ambulancesLeads, isLoading: leadsLoading } = useAmbulanceLeadsSearch({
    type: 'lead',
  });
  
  const { mutate } = useSWRConfig();

  const isEmergency = actualBookingType === "emergency";

  const handleAccept = async () => {
    if (!booking) {
      toast.error("Booking data not available");
      return;
    }

    const id = booking?.schedule_id || booking?.booking_id;
    if (!id) return;   

    // For non-emergency, no need to check selected ambulance
    if (isEmergency && !selectedAmbulance) {
      toast.error("Please select an ambulance lead");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading(isEmergency ? 'Assigning ambulance...' : 'Accepting booking...');

    try {
      let response;
      
      if (isEmergency) {
        // Emergency booking - send lead_id
        response = await acceptBooking({
          booking_id: booking.booking_id,
          lead_id: selectedAmbulance,
        });
      } else {
        response = await acceptBooking({
          booking_id: booking.schedule_id,
        });
      }
      
      if (response?.status === 'ok') {
        toast.success(isEmergency ? 'Ambulance assigned successfully!' : 'Booking accepted successfully!', { id: loadingToast });
        
        // Mutate based on booking type
        if (isEmergency) {
          mutate(`/bookings/${booking.booking_id}`);
        } else {
          mutate(`/bookings/schedule/${booking.schedule_id}`);
        }
        mutate('/bookings');
        onSuccess?.();

        handleClose();
        
        // Call onAcceptComplete after modal closes for non-emergency to open services modal
        if (onAcceptComplete && !isEmergency) {
          setTimeout(() => {
            onAcceptComplete(booking);
          }, 100);
        }
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to accept booking';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to accept booking', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedAmbulance("");
    onClose();
  };

  // Get display name for emergency ambulance leads
  const getAmbulanceDisplayName = (ambulance: any) => {
    return ambulance.full_name || ambulance.lead_name || 'Unnamed Lead';
  };

  // Get unique key for React
  const getAmbulanceKey = (ambulance: any) => {
    return ambulance.lead_id;
  };

  // Get value for the Select component
  const getAmbulanceValue = (ambulance: any) => {
    return ambulance.lead_id;
  };

  // For non-emergency, show a simpler modal
  if (!isEmergency) {
    return (
      <Modal
        open={open && !!booking}
        footer={null}
        onCancel={handleClose}
        centered
        width={500}
        destroyOnClose
      >
        <div className="bg-[#F3F5F9] px-4 py-6">
          <h2 className="text-xl font-semibold text-[#354959] mb-1">
            Accept Booking
          </h2>
          <p className="text-sm text-gray-500">
            This action would approve the non-emergency booking request
          </p>
        </div>
        
        <div className="space-y-4 p-6">
          {/* Show booking details for confirmation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Booking Details:</div>
            <div className="text-sm font-medium text-[#354959]">
              {booking?.customer_data?.full_name || 'Customer'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Booking ID: {booking?.booking_ref || booking?.booking_id?.slice(-8).toUpperCase()}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={handleClose}
              disabled={isProcessing}
              className="px-8 bg-[#F5EAEA]! flex-1 text-[#DB4A47]! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              type="primary"
              loading={isProcessing}
              className="px-8 bg-[#DB4A47]! text-[#fff]! flex-1 border-none!"
              onClick={handleAccept}
            >
              Approve & Continue
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // For emergency bookings, show the ambulance selection modal
  return (
    <Modal
      open={open && !!booking}
      footer={null}
      onCancel={handleClose}
      centered
      width={500}
      destroyOnClose
    >
      <div className="bg-[#F3F5F9] px-4 py-6">
        <h2 className="text-xl font-semibold text-[#354959] mb-1">
          Assign Operator
        </h2>
        <p className="text-sm text-gray-500">This action would approve the emergency booking request</p>
      </div>
      
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <label className="text-sm text-[#354959] font-medium">
            Select Ambulance Lead
          </label>
          <Select
            placeholder="Select ambulance lead"
            className="w-full"
            size="large"
            value={selectedAmbulance}
            onChange={(value) => setSelectedAmbulance(value)}
            allowClear
            loading={leadsLoading}
            notFoundContent={leadsLoading ? "Loading..." : "No available ambulances"}
          >
            {Array.isArray(ambulancesLeads) && ambulancesLeads?.length > 0 ? (
              ambulancesLeads?.map((ambulance: any) => (
                <Option key={getAmbulanceKey(ambulance)} value={getAmbulanceValue(ambulance)}>
                  {getAmbulanceDisplayName(ambulance)}
                </Option>
              ))
            ) : (
              <Option disabled>No ambulances available</Option>
            )}
          </Select>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            size="large"
            onClick={handleClose}
            disabled={isProcessing}
            className="px-8 bg-[#F5EAEA]! flex-1 text-[#DB4A47]! border-none!"
          >
            Cancel
          </Button>

          <Button
            size="large"
            type="primary"
            loading={isProcessing}
            className="px-8 bg-[#DB4A47]! text-[#fff]! flex-1 border-none!"
            onClick={handleAccept}
            disabled={!selectedAmbulance}
          >
            Approve & Dispatch
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AcceptBookingModal;