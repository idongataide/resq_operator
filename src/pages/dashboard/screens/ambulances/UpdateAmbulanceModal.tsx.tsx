import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Select, Form } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { updateAmbulance } from "@/api/ambulancesApi";
import { useAmbulanceLeads } from "@/hooks/useAmbulanceLeads";

const { Option } = Select;

interface UpdateAmbulanceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onAmbulanceUpdated?: () => void;
  ambulance: any | null;
}

interface Lead {
  lead_id: string;
  lead_data?: {
    full_name: string;
    email: string;
    phone_number: string;
  };
  full_name?: string;
  email?: string;
  phone_number?: string;
}

interface AmbulanceFormData {
  plate_number: string;
  color: string;
  model: string;
  ambulance_type: string;
  lead_id: string;
}

const UpdateAmbulanceModal: React.FC<UpdateAmbulanceModalProps> = ({
  open,
  onClose,
  onSubmit,
  onAmbulanceUpdated,
  ambulance,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();
  
  // Fetch ambulance leads
  const { data: leads, isLoading: leadsLoading } = useAmbulanceLeads();

  // Set form values when ambulance data changes
  useEffect(() => {
    if (ambulance && open) {
      form.setFieldsValue({
        plate_number: ambulance.plate_number,
        color: ambulance.color,
        model: ambulance.model,
        ambulance_type: ambulance.ambulance_type,
        lead_id: ambulance.lead_id,
      });
    }
  }, [ambulance, open, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  // Helper to get lead name
  const getLeadName = (lead: Lead) => {
    if (lead.lead_data?.full_name) return lead.lead_data.full_name;
    if (lead.full_name) return lead.full_name;
    return "Unknown";
  };

  // Helper to get lead phone
  const getLeadPhone = (lead: Lead) => {
    if (lead.lead_data?.phone_number) return lead.lead_data.phone_number;
    if (lead.phone_number) return lead.phone_number;
    return "";
  };

  const handleSubmit = async (values: AmbulanceFormData) => {
    if (!ambulance?.ambulance_id) {
      toast.error("Ambulance ID not found");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Updating ambulance...");

    // Prepare JSON payload
    const payload = {
      plate_number: values.plate_number,
      color: values.color,
      model: values.model,
      ambulance_type: values.ambulance_type,
      lead_id: values.lead_id,
    };

    try {
      const response = await updateAmbulance(ambulance.ambulance_id, payload);

      if (response?.status === 'ok') {
        toast.success("Ambulance updated successfully!", { id: loadingToast });
        globalMutate("/accounts/ambulances");

        form.resetFields();

        onAmbulanceUpdated?.();
        onSubmit?.(response);
        onClose();
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to update ambulance';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update ambulance", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={550}
      closeIcon={<FiX className="text-[#354959]" />}
      destroyOnClose
    >
      <div className="bg-[#F3F5F9] px-4 py-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">
          Update Ambulance
        </h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="px-6! pb-6!"
      >
        <Form.Item
          label="Plate Number"
          name="plate_number"
          rules={[{ required: true, message: "Plate number is required" }]}
        >
          <Input 
            size="large" 
            placeholder="Enter plate number" 
            className="rounded-lg"
          />
        </Form.Item>

        <div className="flex gap-4">
          <div className="flex-1">
            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: "Color is required" }]}
            >
              <Input 
                size="large" 
                placeholder="Enter color" 
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <div className="flex-1">
            <Form.Item
              label="Model"
              name="model"
              rules={[{ required: true, message: "Model is required" }]}
            >
              <Input 
                size="large" 
                placeholder="Enter model" 
                className="rounded-lg"
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          label="Ambulance Type"
          name="ambulance_type"
          rules={[{ required: true, message: "Ambulance type is required" }]}
        >
          <Select 
            size="large" 
            placeholder="Select ambulance type"
            className="rounded-lg"
          >
            <Option value="van">Van</Option>
            <Option value="tricycle">Tricycle</Option>
            <Option value="car">Car</Option>
            <Option value="motorcycle">Motorcycle</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ambulance Lead"
          name="lead_id"
          rules={[{ required: true, message: "Ambulance lead is required" }]}
        >
          <Select 
            size="large" 
            placeholder="Select ambulance lead"
            loading={leadsLoading}
            showSearch
            optionFilterProp="children"
            className="rounded-lg"
            notFoundContent={leadsLoading ? "Loading..." : "No leads available"}
          >
            {leads?.map((lead: Lead) => (
              <Option key={lead.lead_id} value={lead.lead_id}>
                {getLeadName(lead)} {getLeadPhone(lead) && `- ${getLeadPhone(lead)}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            className="px-8! bg-[#F5EAEA]! h-[45px]! text-[#DB4A47]! font-medium! border-none! rounded-lg"
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            htmlType="submit"
            type="primary"
            className="px-8! bg-[#DB4A47]! h-[45px]! hover:bg-[#c63d3a]! border-none! rounded-lg"
            loading={isSubmitting}
          >
            Update
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateAmbulanceModal;