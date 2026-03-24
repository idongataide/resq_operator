import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, Select } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { addAmbulanceLead } from "@/api/ambulanceLeadsApi";
import { useSWRConfig } from "swr";

const { Option } = Select;

interface AddAmbulanceLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onLeadAdded?: () => void;
}

const AddAmbulanceLeadModal: React.FC<AddAmbulanceLeadModalProps> = ({
  open,
  onClose,
  onSubmit,
  onLeadAdded,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Adding ambulance lead...");

    const payload = {
      full_name: values.full_name,
      phone_number: values.phone_number,
      emergency_contact: values.emergency_contact,
      residential_address: values.residential_address,
      email: values.email || "", // Optional field
      type: values.user_type, // Add user_type to payload
    };

    try {
      const response = await addAmbulanceLead(payload);

      if (response.status === 'ok') {
        toast.success("Ambulance lead added successfully!", { id: loadingToast });
        globalMutate("/providers/ambulance-leads/");

        form.resetFields();

        onLeadAdded?.();
        onSubmit?.(response);
        onClose();
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to add ambulance lead';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to add ambulance lead", {
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
          Add New Lead
        </h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="px-6! py-6!"
        initialValues={{ user_type: "lead" }}
      >
        <Form.Item
          label="Full Name"
          name="full_name"
          rules={[{ required: true, message: "Full name is required" }]}
        >
          <Input size="large" placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[{ required: true, message: "Phone number is required" }]}
        >
          <Input size="large" placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          label="Emergency Contact"
          name="emergency_contact"
          rules={[{ required: true, message: "Emergency contact is required" }]}
        >
          <Input size="large" placeholder="Enter emergency contact" />
        </Form.Item>

        <Form.Item
          label="Residential Address"
          name="residential_address"
          rules={[{ required: true, message: "Residential address is required" }]}
        >
          <Input.TextArea 
            size="large" 
            placeholder="Enter residential address" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input size="large" type="email" placeholder="Enter email (optional)" />
        </Form.Item>

        <Form.Item
          label="User Type"
          name="user_type"
          rules={[{ required: true, message: "User type is required" }]}
        >
          <Select size="large" placeholder="Select user type">
            <Option value="lead">Lead</Option>
            <Option value="driver">Driver</Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            className="px-8! bg-[#F5EAEA]! h-[45px]! text-[#DB4A47]! font-medium! border-none!"
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            htmlType="submit"
            type="primary"
            className="px-8! bg-[#DB4A47]! h-[45px]! hover:bg-[#c63d3a]! border-none!"
            loading={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddAmbulanceLeadModal;