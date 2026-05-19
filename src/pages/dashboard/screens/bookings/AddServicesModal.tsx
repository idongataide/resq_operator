// components/AddServicesModal.tsx
import React, { useState } from "react";
import { Modal, Button, Input, InputNumber } from "antd";
import { FiX } from "react-icons/fi";
import { createInvoice } from "@/api/invoiceApi";
import toast from "react-hot-toast";
import { useBooking } from "@/hooks/useBookings";

interface AddServicesModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  bookingType?: "emergency" | "non-emergency";
  onSuccess?: () => void;
  onRefresh?: () => void;
}

interface SelectedFee {
  name: string;
  amount: number;
}

const AddServicesModal: React.FC<AddServicesModalProps> = ({
  open,
  onClose,
  booking,
  bookingType,
  onSuccess,
  onRefresh,
}) => {
  const [selectedFees, setSelectedFees] = useState<SelectedFee[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [serviceAmount, setServiceAmount] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);

  const bookingId = booking?.booking_id || booking?.schedule_id;
  const { mutate: mutateBooking } = useBooking(bookingId, bookingType);

  // Handle add fee from text fields
  const handleAddFee = () => {
    if (!serviceName.trim()) {
      toast.error("Please enter a service name");
      return;
    }

    if (!serviceAmount || serviceAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setSelectedFees(prev => [...prev, {
      name: serviceName.trim(),
      amount: serviceAmount,
    }]);

    // Clear form fields
    setServiceName("");
    setServiceAmount(null);
    toast.success(`${serviceName} added to invoice`);
  };

  // Handle send invoice
  const handleSendInvoice = async () => {
    if (selectedFees.length === 0) {
      toast.error("Please add at least one service to the invoice");
      return;
    }

    setIsSending(true);
    const loadingToast = toast.loading('Creating invoice...');

    try {
      const response = await createInvoice({
        booking_id: booking.booking_id || booking.schedule_id,
        service_rendered: selectedFees.map(fee => ({
          name: fee.name,
          amount: fee.amount
        }))
      });

      if (response?.status === 'ok' || response?.success) {
        toast.success('Invoice sent successfully!', { id: loadingToast });
        
        // Mutate the specific booking to refresh data
        await mutateBooking();
        
        // Call onRefresh callback if provided
        if (onRefresh) {
          onRefresh();
        }
        
        // Call onSuccess callback
        if (onSuccess) {
          onSuccess();
        }
        
        // Reset and close
        setSelectedFees([]);
        setServiceName("");
        setServiceAmount(null);
        onClose();
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to send invoice';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send invoice', { id: loadingToast });
    } finally {
      setIsSending(false);
    }
  };

  // Remove a fee from the list
  const handleRemoveFee = (index: number) => {
    setSelectedFees(prev => prev.filter((_, i) => i !== index));
  };

  // Reset modal state when closed
  const handleClose = () => {
    setSelectedFees([]);
    setServiceName("");
    setServiceAmount(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={500}
      closeIcon={<FiX className="text-[#354959]" />}
    >
      {/* Header */}
      <div className="bg-[#F3F5F9] px-4 py-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">
          Add Services
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter service details to add to this invoice
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <div className="space-y-4">
          {/* Selected Services List */}
          {selectedFees.length > 0 && (
            <div className="mb-4">
              <label className="text-sm text-[#354959] font-medium mb-2 block">
                Added Services ({selectedFees.length})
              </label>
              <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                {selectedFees.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <span className="text-sm text-[#000A0F] block">{fee.name}</span>
                      <span className="text-xs text-gray-500">₦{fee.amount?.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFee(index)}
                      className="text-red-500 hover:text-red-700 text-xs ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Name Input */}
          <div>
            <label className="text-sm text-[#354959] font-medium mb-2 block">
              Service Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter service name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              size="large"
              className="w-full"
            />
          </div>

          {/* Service Amount Input */}
          <div>
            <label className="text-sm text-[#354959] font-medium mb-2 block">
              Amount (₦) <span className="text-red-500">*</span>
            </label>
            <InputNumber
              placeholder="Enter amount"
              value={serviceAmount}
              onChange={(value) => setServiceAmount(value)}
              size="large"
              className="w-[100%]!"
              min={0}
              precision={2}
              formatter={(value) => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/₦\s?|(,*)/g, '') as unknown as number}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={handleClose}
              className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              type="primary"
              onClick={handleAddFee}
              disabled={!serviceName.trim() || !serviceAmount}
              className="px-8 bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none! text-[#fff]! font-medium!"
            >
              Add Service
            </Button>
          </div>

          {/* Send Invoice Button */}
          {selectedFees.length > 0 && (
            <div className="flex justify-center mt-4 pt-4 border-t border-gray-200">
              <Button
                size="large"
                type="primary"
                onClick={handleSendInvoice}
                loading={isSending}
                className="px-8 bg-[#DB4A47]! w-full hover:bg-[#DB4A47]! border-none! text-[#fff] font-medium!"
              >
                {isSending ? 'Sending...' : 'Send Invoice'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddServicesModal;