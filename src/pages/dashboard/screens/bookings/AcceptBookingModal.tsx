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
  onSuccess?: () => void;
}

const AcceptBookingModal = ({ open, onClose, booking, onSuccess }: AcceptBookingModalProps) => {
  const [selectedAmbulance, setSelectedAmbulance] = useState("");
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Fetch only available ambulances (not on trip)
  const { data: ambulancesLeads, isLoading: ambulancesLoading } = useAmbulanceLeadsSearch({
    online: 'no',
    type: 'lead',
  });
  
  console.log("Available ambulances for assignment:s", ambulancesLeads);
  const { mutate } = useSWRConfig();

  const handleAccept = async () => {
    if (!booking?.booking_id) return;

    if (!selectedAmbulance) {
      toast.error("Please select an ambulance");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Accepting booking...');

    try {
      const response = await acceptBooking({
        booking_id: booking.booking_id,
        lead_id: selectedAmbulance,
        booking_reason: reason || undefined,
      });
      
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
    setReason("");
    onClose();
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={handleClose}
      centered
      width={500}
      destroyOnClose
    >
      <div className="bg-[#F3F5F9] px-4 py-6">
        <h2 className="text-xl font-semibold text-[#354959] mb-1">Assign Operator</h2>
        <p className="text-sm text-gray-500">This action would approve the booking request</p>
      </div>
      
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <label className="text-sm text-[#354959] font-medium">Select Ambulance Lead</label>
          <Select
            placeholder="Select ambulance"
            className="w-full"
            size="large"
            value={selectedAmbulance}
            onChange={(value) => setSelectedAmbulance(value)}
            allowClear
            loading={ambulancesLoading}
            notFoundContent={ambulancesLoading ? "Loading..." : "No available ambulances"}
          >
            {Array.isArray(ambulancesLeads) && ambulancesLeads?.length > 0 ? (
                ambulancesLeads?.map((ambulance: any) => (
                    <Option key={ambulance.lead_id} value={ambulance.lead_id}>
                    {ambulance.full_name || 'Unnamed'}
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