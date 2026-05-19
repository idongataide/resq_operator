// components/AssignOperatorModal.tsx
import React, { useState } from "react";
import { Modal, Button, Select, Spin } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { assignBookingRequest } from "@/api/bookingsApi";
import { useAmbulances } from "@/hooks/useAmbulance";



interface AssignOperatorModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  booking?: any; // Add booking prop to access schedule_id
  onAssigned?: () => void;
}

const { Option } = Select;

const AssignOperatorModal: React.FC<AssignOperatorModalProps> = ({
  open,
  onClose,
  bookingId,
  booking,
  onAssigned,
}) => {
  const [selectedAmbulance, setSelectedAmbulance] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();
  
  const { data: ambulancesLeads, isLoading: leadsLoading } = useAmbulances();

  // Helper functions for ambulance display
  const getAmbulanceDisplayName = (ambulance: any) => {
    return ambulance.lead_data?.full_name || ambulance.lead_name || 'Unnamed Lead';
  };

  const getAmbulanceKey = (ambulance: any) => {
    return ambulance.ambulance_id;
  };

  const getAmbulanceValue = (ambulance: any) => {
    return ambulance.ambulance_id;
  };

  const handleAssign = async () => {
    if (!selectedAmbulance) {
      toast.error("Please select an ambulance lead");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Assigning lead...");

    try {
      const payload = {
        booking_id: booking.schedule_id || bookingId, // Use schedule_id for non-emergency, bookingId for emergency
        ambulance_id: selectedAmbulance,
      };

      const response = await assignBookingRequest(payload);

      if (response?.status === "ok") {
        toast.success("Lead assigned successfully!", { id: loadingToast });
        
        // Mutate the correct endpoints based on booking type
        if (booking?.schedule_id) {
          // Non-emergency booking
          mutate(`/bookings/schedule/${booking.schedule_id}`);
        } else {
          // Emergency booking
          mutate(`/bookings/${bookingId}`);
        }
        mutate('/bookings');
        
        onAssigned?.();
        onClose();
        
        // Reset selection
        setSelectedAmbulance("");
      } else {
        toast.error(response?.message || "Failed to assign lead", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Assign error:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to assign lead", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAmbulance("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={500}
      closeIcon={<FiX className="text-[#808D97]" />}
      destroyOnClose
    >
      <div className="bg-[#F3F5F9] px-4 py-6 mb-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">Assign Lead</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select an ambulance lead to assign to this booking
        </p>
      </div>

      <div className="px-6 pb-6">
        {leadsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Select
              placeholder="Select ambulance lead"
              className="w-full capitalize"
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
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-between gap-4 pt-6 mt-4 border-t border-gray-200">
          <Button
            size="large"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
          >
            Cancel
          </Button>

          <Button
            size="large"
            type="primary"
            onClick={handleAssign}
            loading={isSubmitting}
            disabled={!selectedAmbulance || isSubmitting}
            className="w-full bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none! text-white!"
          >
            Assign Lead
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignOperatorModal;