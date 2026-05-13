import React, { useState } from "react";
import { Modal, Select, Button } from "antd";
import { FaPlus } from "react-icons/fa";
import { FiFileText, FiX } from "react-icons/fi";
import { createInvoice } from "@/api/invoiceApi";
import toast from "react-hot-toast";
import { useFees } from "@/hooks/useSettings";
import { useBooking } from "@/hooks/useBookings";

const { Option } = Select;

interface InvoiceCardProps {
  booking: any;
  bookingType?: "emergency" | "non-emergency";
  onSuccess?: () => void;
  onRefresh?: () => void;
}

interface SelectedFee {
  service_id: string;
  name: string;
  amount: number;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ booking, bookingType, onSuccess, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFees, setSelectedFees] = useState<SelectedFee[]>([]);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);
  
  const { data: feesData, isLoading: feesLoading } = useFees();
  
  const bookingId = booking?.booking_id || booking?.schedule_id;
  const { mutate: mutateBooking } = useBooking(bookingId, bookingType);

  // Get invoices from booking data
  const invoices = booking?.invoice || booking?.service_rendered_data || [];
  const hasInvoices = invoices.length > 0;
  const isEmergency = bookingType === "emergency";
  
  // Get payment status from booking data
  const paymentStatus = booking?.payment_status === 1 || booking?.payment_status === "paid" ? "Paid" : "Pending";
  const isPaid = paymentStatus === "Paid";
  
  // Get payment method
  const paymentMethod = booking?.payment_method || "Not specified";
  
  // Extract fees array from response and filter only active fees (status === 1)
  const allFees = feesData?.data || feesData || [];
  const feesList = allFees.filter((fee: any) => fee.status === 1);

  // Get selected fee object
  const getSelectedFeeObject = (serviceId: string) => {
    return feesList.find((fee: any) => fee.service_id === serviceId);
  };

  // Calculate total amount from invoices or selected fees
  const totalAmount = hasInvoices 
    ? invoices.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0)
    : selectedFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);

  // Handle add fee from dropdown
  const handleAddFee = () => {
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }

    const feeToAdd = getSelectedFeeObject(selectedService);
    if (!feeToAdd) {
      toast.error("Service not found");
      return;
    }

    // Check if service already added
    if (selectedFees.some(f => f.service_id === selectedService)) {
      toast.error("This service has already been added");
      return;
    }

    setSelectedFees(prev => [...prev, {
      service_id: feeToAdd.service_id,
      name: feeToAdd.name,
      amount: feeToAdd.amount,
    }]);

    setSelectedService(undefined);
    toast.success(`${feeToAdd.name} added to invoice`);
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
        service_rendered: selectedFees.map(fee => fee.service_id)
      });

      if (response?.status === 'ok' || response?.success) {
        toast.success('Invoice sent successfully!', { id: loadingToast });
        
        // Mutate the specific booking to refresh data
        await mutateBooking();
        
        // Also call the onRefresh prop if provided
        if (onRefresh) {
          onRefresh();
        }
        
        // Call onSuccess callback
        if (onSuccess) {
          onSuccess();
        }
        
        // Clear selected fees
        setSelectedFees([]);
        
        // Close modal if open
        setIsModalOpen(false);
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
  const handleRemoveFee = (serviceId: string) => {
    setSelectedFees(prev => prev.filter(f => f.service_id !== serviceId));
  };

  // Don't show add button for emergency bookings
  const showAddButton = !isEmergency && !hasInvoices;
  const showSendButton = !isEmergency && !hasInvoices && selectedFees.length > 0;

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm overflow-hidden mt-3">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#FDF6F6] px-6 py-4">
        <div className="flex items-center gap-2">
          <FiFileText className="text-[#DB4A47] text-lg" />
          <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
            INVOICE
          </h2>
        </div>

        {/* Payment Status Badge */}
        {hasInvoices ? (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            isPaid ? 'bg-[#E8F5E9]' : 'bg-[#FFF7E8]'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isPaid ? 'bg-[#4EA507]' : 'bg-[#BB7F05]'
            }`} />
            <span className={`text-sm font-medium ${
              isPaid ? 'text-[#4EA507]' : 'text-[#BB7F05]'
            }`}>
              {paymentStatus}
            </span>
          </div>
        ) : showAddButton ? (
          <div className="flex items-center gap-2 bg-[#FFF7E8] px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#BB7F05]" />
            <span className="text-sm text-[#BB7F05] font-medium">
              {selectedFees.length > 0 ? `${selectedFees.length} item(s)` : "Pending"}
            </span>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-[#DB4A47] p-1 hover:bg-[#c03e3b] transition-colors cursor-pointer"
            >
              <FaPlus className="text-[#fff] text-xs" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-[#FFF7E8] px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#BB7F05]" />
            <span className="text-sm text-[#BB7F05] font-medium">
              Not Applicable
            </span>
          </div>
        )}
      </div>

      {/* Invoice Body */}
      <div className="p-4">
        <div className="bg-[#F3F5F9] rounded-xl p-5">
          
          {/* Total Amount */}
          <div className="text-center py-3">
            <h3 className="text-2xl font-semibold text-[#021C2F]">
              ₦{totalAmount.toLocaleString()}
            </h3>
            <p className="text-sm text-[#808D97]">Total Amount</p>
          </div>
        </div>

        <div className="bg-[#fff] p-5">
          {/* Payment Method - Show when invoices exist */}
          {hasInvoices && (
            <div className="flex justify-between py-3 border-b border-[#E4E7EC] text-sm">
              <span className="text-[#000A0F]">Payment Method</span>
              <span className="text-[#021C2F] font-medium">{paymentMethod}</span>
            </div>
          )}
          
          {/* Dynamic Service Items - Show invoices if exists, otherwise show selected fees */}
          {hasInvoices ? (
            // Display existing invoices
            invoices.map((fee: any, index: number) => (
              <div 
                key={fee._id || fee.service_id}
                className={`flex justify-between py-3 text-sm ${
                  index !== invoices.length - 1 ? 'border-b border-[#E4E7EC]' : ''
                }`}
              >
                <span className="text-[#000A0F]">{fee.name}</span>
                <span className="text-[#021C2F] font-medium">
                  ₦{fee.amount?.toLocaleString()}
                </span>
              </div>
            ))
          ) : selectedFees.length > 0 ? (
            // Display selected fees for sending (only for non-emergency)
            selectedFees.map((fee, index) => (
              <div 
                key={fee.service_id}
                className={`flex justify-between py-3 text-sm ${
                  index !== selectedFees.length - 1 ? 'border-b border-[#E4E7EC]' : ''
                }`}
              >
                <span className="text-[#000A0F]">{fee.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#021C2F] font-medium">
                    ₦{fee.amount?.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemoveFee(fee.service_id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              {isEmergency 
                ? "No invoice available" 
                : "No services added yet. Click the + button to add services."}
            </div>
          )}
        </div>
        
        {/* Send Invoice Button - Only show for non-emergency without existing invoices */}
        {showSendButton && (
          <div className="flex justify-center mt-6">
            <button 
              onClick={handleSendInvoice}
              disabled={isSending}
              className={`px-6 py-2 rounded-lg bg-[#DB4A47] text-[#fff] text-sm font-medium 
                ${isSending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c03e3b]'}
                transition-colors`}
            >
              {isSending ? 'Sending...' : 'Send Invoice'}
            </button>
          </div>
        )}
      </div>

      {/* Service Selection Modal with Dropdown - Only show for non-emergency without existing invoices */}
      {showAddButton && (
        <Modal
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedService(undefined);
          }}
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
              Select services to add to this invoice
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {feesLoading ? (
              <div className="text-center py-8 text-gray-500">Loading services...</div>
            ) : feesList && feesList.length > 0 ? (
              <div className="space-y-4">
                {/* Selected Services List */}
                {selectedFees.length > 0 && (
                  <div className="mb-4">
                    <label className="text-sm text-[#354959] font-medium mb-2 block">
                      Added Services ({selectedFees.length})
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {selectedFees.map((fee) => (
                        <div key={fee.service_id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                          <span className="text-sm text-[#000A0F]">{fee.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">₦{fee.amount?.toLocaleString()}</span>
                            <button
                              onClick={() => handleRemoveFee(fee.service_id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Dropdown */}
                <div>
                  <label className="text-sm text-[#354959] font-medium mb-2 block">
                    Select Service
                  </label>
                  <Select
                    placeholder="Choose a service"
                    className="w-full"
                    size="large"
                    value={selectedService}
                    onChange={(value) => setSelectedService(value)}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {feesList
                      .filter((fee: any) => !selectedFees.some(f => f.service_id === fee.service_id))
                      .map((fee: any) => (
                        <Option key={fee.service_id} value={fee.service_id}>
                          {fee.name} - ₦{fee.amount?.toLocaleString()}
                        </Option>
                      ))}
                  </Select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    size="large"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedService(undefined);
                    }}
                    className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
                  >
                    Cancel
                  </Button>

                  <Button
                    size="large"
                    type="primary"
                    onClick={handleAddFee}
                    disabled={!selectedService}
                    className="px-8 bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
                  >
                    Add Service
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No active services available
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InvoiceCard;