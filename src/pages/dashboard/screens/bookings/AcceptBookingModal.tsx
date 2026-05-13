// components/AcceptBookingModal.tsx
import { Modal, Select, Button } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { acceptBooking } from "@/api/bookingsApi";
import { useAmbulanceLeadsSearch } from "@/hooks/useAmbulanceLeads";
import { useAmbulances } from "@/hooks/useAmbulance";

const { Option } = Select;

interface AcceptBookingModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  bookingType?: "all" | "emergency" | "non-emergency";
  onSuccess?: () => void;
}

const AcceptBookingModal = ({ 
  open, 
  onClose, 
  booking, 
  onSuccess 
}: AcceptBookingModalProps) => {
  const [selectedAmbulance, setSelectedAmbulance] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine booking type from the booking object itself
  const actualBookingType = booking?.schedule_id ? "non-emergency" : "emergency";
  
  console.log("Booking Type", actualBookingType);

  
  // Fetch data based on booking type
  const { data: ambulancesLeads, isLoading: leadsLoading } = useAmbulanceLeadsSearch({
    type: 'lead',
  });
  
  const { data: ambulances, isLoading: ambulancesLoading } = useAmbulances();
  
  const { mutate } = useSWRConfig();

  // Determine which data to use and which API call to make
  const isEmergency = actualBookingType === "emergency";
  const ambulanceOptions = isEmergency ? ambulancesLeads : ambulances;
  const isLoading = isEmergency ? leadsLoading : ambulancesLoading;

  const handleAccept = async () => {
    if (!booking) {
      toast.error("Booking data not available");
      return;
    }

    const id = booking?.schedule_id || booking?.booking_id;
    if (!id) return;   

    if (!selectedAmbulance) {
      toast.error("Please select an ambulance");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Accepting booking...');

    try {
      let response;
      
      if (isEmergency) {
        // Emergency booking - use lead_id
        response = await acceptBooking({
          booking_id: booking.booking_id,
          lead_id: selectedAmbulance,
        });
      } else {
        // Non-emergency booking - use ambulance_id
        response = await acceptBooking({
          booking_id: booking.schedule_id,
          ambulance_id: selectedAmbulance,
        });
      }
      
      if (response?.status === 'ok') {
        toast.success('Booking accepted successfully!', { id: loadingToast });
        mutate(`/bookings/${booking.booking_id}`);
        mutate('/bookings');
        onSuccess?.();
        handleClose();
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

  // Get display name based on the data source
  const getAmbulanceDisplayName = (ambulance: any) => {
    if (isEmergency) {
      // From useAmbulanceLeadsSearch
      return ambulance.full_name || ambulance.lead_name || 'Unnamed Lead';
    } else {
      // From useAmbulances - has lead_data with full_name
      if (ambulance.lead_data?.full_name) {
        return `${ambulance.lead_data.full_name} - ${ambulance.plate_number || ambulance.model}`;
      }
      return ambulance.plate_number || ambulance.model || ambulance.ambulance_type || 'Unnamed Ambulance';
    }
  };

  // Get unique key for React
  const getAmbulanceKey = (ambulance: any) => {
    if (isEmergency) {
      return ambulance.lead_id;
    } else {
      return ambulance.ambulance_id;
    }
  };

  // Get value for the Select component
  const getAmbulanceValue = (ambulance: any) => {
    if (isEmergency) {
      return ambulance.lead_id;
    } else {
      return ambulance.ambulance_id;
    }
  };

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
          {isEmergency ? "Assign Operator" : "Assign Ambulance"}
        </h2>
        <p className="text-sm text-gray-500">This action would approve the booking request</p>
      </div>
      
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <label className="text-sm text-[#354959] font-medium">
            {isEmergency ? "Select Ambulance Lead" : "Select Ambulance"}
          </label>
          <Select
            placeholder={isEmergency ? "Select ambulance lead" : "Select ambulance"}
            className="w-full"
            size="large"
            value={selectedAmbulance}
            onChange={(value) => setSelectedAmbulance(value)}
            allowClear
            loading={isLoading}
            notFoundContent={isLoading ? "Loading..." : "No available ambulances"}
          >
            {Array.isArray(ambulanceOptions) && ambulanceOptions?.length > 0 ? (
              ambulanceOptions?.map((ambulance: any) => (
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