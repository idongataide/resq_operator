// components/InvoiceCard.tsx
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";
import { useBooking } from "@/hooks/useBookings";
import AddServicesModal from "./AddServicesModal"; // Import the extracted modal

interface InvoiceCardProps {
  booking: any;
  bookingType?: "emergency" | "non-emergency";
  onSuccess?: () => void;
  onRefresh?: () => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ booking, bookingType, onSuccess, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  // Calculate total amount from invoices
  const totalAmount = hasInvoices 
    ? invoices.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0)
    : 0;

  // Don't show add button for emergency bookings or if invoices already exist
  const showAddButton = !isEmergency && !hasInvoices;

  const handleModalSuccess = async () => {
    await mutateBooking();
    if (onRefresh) {
      onRefresh();
    }
    if (onSuccess) {
      onSuccess();
    }
    setIsModalOpen(false);
    toast.success('Services added successfully!');
  };

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
              Pending
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
          
          {/* Dynamic Service Items - Show invoices if exists */}
          {hasInvoices ? (
            // Display existing invoices
            invoices.map((fee: any, index: number) => (
              <div 
                key={fee._id || fee.service_id || index}
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
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              {isEmergency 
                ? "No invoice available" 
                : "No services added yet. Click the + button to add services."}
            </div>
          )}
        </div>
      </div>

      {/* Add Services Modal */}
      <AddServicesModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={booking}
        bookingType={bookingType}
        onSuccess={handleModalSuccess}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default InvoiceCard;