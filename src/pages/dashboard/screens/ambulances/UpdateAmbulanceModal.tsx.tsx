import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Select, Form, Upload } from "antd";
import { FiX } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
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
  full_name: string;
  email: string;
  phone_number: string;
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
  const [fileList, setFileList] = useState<any[]>([]);
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
      setFileList([]);
    }
  }, [open, form]);

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values: any) => {
    if (!ambulance?.ambulance_id) {
      toast.error("Ambulance ID not found");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Updating ambulance...");

    // Create FormData for file upload with correct field names
    const formData = new FormData();
    formData.append("plate_number", values.plate_number);
    formData.append("color", values.color);
    formData.append("model", values.model);
    formData.append("ambulance_type", values.ambulance_type);
    formData.append("lead_id", values.lead_id);
    
    if (fileList.length > 0) {
      formData.append("document", fileList[0].originFileObj);
    }

    try {
      const response = await updateAmbulance(ambulance.ambulance_id, formData);

      if (response.status === 'ok') {
        toast.success("Ambulance updated successfully!", { id: loadingToast });
        globalMutate("/accounts/ambulances");

        form.resetFields();
        setFileList([]);

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
          <Input size="large" placeholder="Enter plate number" />
        </Form.Item>

        <div className="flex gap-4">
          <div className="flex-1">
            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: "Color is required" }]}
            >
              <Input size="large" placeholder="Enter color" />
            </Form.Item>
          </div>

          <div className="flex-1">
            <Form.Item
              label="Model"
              name="model"
              rules={[{ required: true, message: "Model is required" }]}
            >
              <Input size="large" placeholder="Enter model" />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          label="Ambulance Type"
          name="ambulance_type"
          rules={[{ required: true, message: "Ambulance type is required" }]}
        >
          <Select size="large" placeholder="Select ambulance type">
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
            filterOption={(input, option) => 
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {leads?.map((lead: Lead) => (
              <Option key={lead.lead_id} value={lead.lead_id}>
                {lead.full_name} - {lead.phone_number}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Upload Document"
          name="document"
        >
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} className="w-full h-[45px]">
              Replace document
            </Button>
          </Upload>
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
            Update
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateAmbulanceModal;