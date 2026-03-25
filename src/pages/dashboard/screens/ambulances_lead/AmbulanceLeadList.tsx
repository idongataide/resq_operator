import React, { useState, useMemo } from "react";
import { Table, Button, Modal } from "antd";
import {  
  FilterOutlined, 
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { FiX, FiClock } from "react-icons/fi";
import Images from "@/components/images";
import AddAmbulanceLeadModal from "./AddAmbulanceLeadModal";
import { deleteAmbulanceLead } from "@/api/ambulanceLeadsApi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { useAmbulanceLeads } from "@/hooks/useAmbulanceLeads";
import UpdateAmbulanceLeadModal from "./UpdateLeadAmbulance";


interface AmbulanceLead {
  lead_id: string;
  provider_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  gender: string;
  user_type: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  online: boolean;
  account_status: number;
  email_status: number;
  avatar: string;
  dob: string;
  address: string;
  emergency_contact: string;
  firebase_token: string;
  suspend_reason: string;
  createdAt: string;
  updatedAt: string;
}

const AmbulanceLeadsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<AmbulanceLead | null>(null);
  const [searchText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: leads, isLoading, mutate } = useAmbulanceLeads();
  const { mutate: globalMutate } = useSWRConfig();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', ' ·');
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedLead?.lead_id) {
      toast.error("Lead ID not found");
      return;
    }
    
    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting ambulance lead...');

    try {
      const response = await deleteAmbulanceLead(selectedLead.lead_id);
      
      if (response?.response?.data?.msg || response?.message) {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to delete lead';
        toast.error(errorMsg, { id: loadingToast });
      } else if (response?.status === 'ok' || response?.success) {
        toast.success('Ambulance lead deleted successfully!', { id: loadingToast });
        
        globalMutate('/providers/ambulance-leads/');
        mutate();
        
        setDeleteModalOpen(false);
        setViewDetailsOpen(false);
        setSelectedLead(null);
      } else {
        toast.success('Ambulance lead deleted successfully!', { id: loadingToast });
        globalMutate('/providers/ambulance-leads/');
        mutate();
        setDeleteModalOpen(false);
        setViewDetailsOpen(false);
        setSelectedLead(null);
      }
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast.error(error?.message || 'Failed to delete lead', { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit
  const handleEdit = (lead: AmbulanceLead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
    setViewDetailsOpen(false);
  };

  // Handle delete click
  const handleDeleteClick = (lead: AmbulanceLead, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setDeleteModalOpen(true);
  };

  // Handle view details
  const handleViewDetails = (lead: AmbulanceLead) => {
    setSelectedLead(lead);
    setViewDetailsOpen(true);
  };

  // Handle row click
  const handleRowClick = (record: AmbulanceLead) => {
    setSelectedLead(record);
    setViewDetailsOpen(true);
  };

  // Filter data based on search
  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    
    return leads.filter((lead: AmbulanceLead) => 
      lead.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.phone_number.includes(searchText) ||
      (lead.emergency_contact && lead.emergency_contact.includes(searchText))
    );
  }, [leads, searchText]);

  // Get account status badge
  const getAccountStatus = (status: number) => {
    return status === 1 ? 
      <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md text-xs">Active</span> : 
      <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md text-xs">Inactive</span>;
  };

  // Table columns
  const columns = [
    {
      title: "Added Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: AmbulanceLead, b: AmbulanceLead) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-400" />
          <span>{formatDate(text)}</span>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a: AmbulanceLead, b: AmbulanceLead) => a.full_name.localeCompare(b.full_name),
      render: (text: string) => <span className="font-medium text-[#354959]">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: AmbulanceLead, b: AmbulanceLead) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
    },  
    {
      title: "Status",
      dataIndex: "account_status",
      key: "account_status",
      render: (status: number) => getAccountStatus(status),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: AmbulanceLead) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            className="flex items-center gap-1 bg-[#F3F5F9]! text-[#354959]! hover:text-[#DB4A47]! border-none shadow-none"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="flex items-center gap-1 bg-[#F3F5F9]! text-[#354959]! hover:text-[#DB4A47]! border-none shadow-none"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => handleDeleteClick(record, e)}
            className="flex items-center gap-1 bg-[#F3F5F9]! text-[#DB4A47]! border-none shadow-none"
          />
        </div>
      ),
    }
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with Filter and Add New */}
        <div className="p-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-[#354959] uppercase text-md font-bold">
              AMBULANCE LEADS ({filteredLeads?.length || 0})
            </h1>  
            <div className="gap-3 flex flex-wrap">
              <Button 
                icon={<UploadOutlined />} 
                className="rounded-lg flex bg-[#FDF6F6]! text-[#DB4A47]! border-0! items-center"
                size="large"
              />              
              <Button 
                icon={<FilterOutlined />} 
                className="rounded-lg flex bg-[#FDF6F6]! text-[#DB4A47]! border-0! items-center"
                size="large"
              >
                Filter
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                className="bg-[#DB4A47]! rounded-lg flex items-center"
                size="large"
                onClick={() => setIsModalOpen(true)}
              >
                Add New Lead
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredLeads}
          rowKey="lead_id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} leads`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border-none p-2"
          rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => handleRowClick(record)
          })}
        />

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-[#808D97]">
          <div>Showing page 1 of {Math.ceil((filteredLeads?.length || 0) / 10)}</div>
         
        </div>

        {/* View Lead Details Modal */}
        <Modal
          open={viewDetailsOpen}
          footer={null}
          onCancel={() => setViewDetailsOpen(false)}
          centered
          width={500}
          closeIcon={<FiX className="text-[#354959]" />}
        >
          {selectedLead && (
            <div>
              <img src={Images.ambulancebg} alt="Ambulance Lead" className="w-full" />

              <div className="p-6 bg-white">
                <h3 className="text-[#000A0F] font-bold text-xl mb-3">
                  {selectedLead.full_name}
                </h3>

                <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm">Full Name</p>
                    <p className="font-medium">
                      {selectedLead.full_name}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm">Email</p>
                    <p className="font-medium">
                      {selectedLead.email}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm">Phone</p>
                    <p className="font-medium">
                      {selectedLead.phone_number}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    size="large"
                    onClick={() => setViewDetailsOpen(false)}
                    className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! border-none!"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Lead Modal */}
        <Modal
          open={deleteModalOpen}
          onCancel={() => setDeleteModalOpen(false)}
          footer={null}
          centered
          width={400}
          closeIcon={<FiX className="text-[#354959]" />}
        >
          <div className="text-left! p-6">
            <div className="flex justify-left! mb-4">
              <img src={Images.icon.question} alt=""/>
            </div>
            
            <h3 className="text-xl font-semibold text-[#001417] mb-2">
              Delete Ambulance Lead
            </h3>
            
            <p className="text-sm text-[#354959] mb-8">
              This action would remove {selectedLead?.full_name} from the platform and is irreversible
            </p>

            <div className="flex justify-center gap-4">
              <Button
                size="large"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-8 bg-gray-100! h-[45px]! flex-1 text-gray-700! border-none!"
              >
                Cancel
              </Button>

              <Button
                size="large"
                danger
                loading={isDeleting}
                onClick={handleDelete}
                className="px-8 bg-[#DB4A47]! h-[45px]! flex-1 text-white! border-none! hover:bg-[#c63d3a]!"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>

        <AddAmbulanceLeadModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLeadAdded={() => {
            mutate();
            setIsModalOpen(false);
          }}
        />
        <UpdateAmbulanceLeadModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLead(null);
          }}
          onLeadUpdated={() => {
            mutate();
            setIsEditModalOpen(false);
            setSelectedLead(null);
          }}
          lead={selectedLead}
        />
      </div>
    </>
  );
};

export default AmbulanceLeadsTable;