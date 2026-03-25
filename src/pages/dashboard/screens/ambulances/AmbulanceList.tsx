import React, { useState, useMemo } from "react";
import { Table, Button, Modal} from "antd";
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
import AddAmbulanceModal from "./AddAmbulanceModal";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { useAmbulances } from "@/hooks/useAmbulance";
import UpdateAmbulanceModal from "./UpdateAmbulanceModal.tsx";
import { deleteAmbulance } from "@/api/ambulancesApi";



interface Ambulance {
  ambulance_id: string;
  plate_number: string;
  color: string;
  model: string;
  ambulance_type: string;
  ambulance_lead: string;
  lead_email?: string;
  lead_phone?: string;
  documents?: Array<{
    name: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const AmbulancesTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [searchText] = useState("");
  const [filterType] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: ambulances, isLoading, mutate } = useAmbulances();
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
    if (!selectedAmbulance?.ambulance_id) {
      toast.error("Ambulance ID not found");
      return;
    }
    
    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting ambulance...');

    try {
      const response = await deleteAmbulance(selectedAmbulance.ambulance_id);
      
      if (response?.response?.data?.msg || response?.message) {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to delete ambulance';
        toast.error(errorMsg, { id: loadingToast });
      } else if (response?.status === 'ok' || response?.success) {
        toast.success('Ambulance deleted successfully!', { id: loadingToast });
        
        globalMutate('/providers/ambulances/');
        mutate();
        
        setDeleteModalOpen(false);
        setViewDetailsOpen(false);
        setSelectedAmbulance(null);
      } else {
        toast.success('Ambulance deleted successfully!', { id: loadingToast });
        globalMutate('/providers/ambulances/');
        mutate();
        setDeleteModalOpen(false);
        setViewDetailsOpen(false);
        setSelectedAmbulance(null);
      }
    } catch (error: any) {
      console.error('Error deleting ambulance:', error);
      toast.error(error?.message || 'Failed to delete ambulance', { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit
  const handleEdit = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance);
    setIsEditModalOpen(true);
    setViewDetailsOpen(false);
  };

  // Handle delete click
  const handleDeleteClick = (ambulance: Ambulance, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAmbulance(ambulance);
    setDeleteModalOpen(true);
  };

  // Handle view details
  const handleViewDetails = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance);
    setViewDetailsOpen(true);
  };

  // Handle row click
  const handleRowClick = (record: Ambulance) => {
    setSelectedAmbulance(record);
    setViewDetailsOpen(true);
  };

  // Filter data based on search and type filter
  const filteredAmbulances = useMemo(() => {
    if (!ambulances) return [];
    
    return ambulances.filter((ambulance: Ambulance) => {
      const matchesSearch = 
        ambulance.plate_number.toLowerCase().includes(searchText.toLowerCase()) ||
        ambulance.model.toLowerCase().includes(searchText.toLowerCase()) ||
        ambulance.ambulance_lead.toLowerCase().includes(searchText.toLowerCase()) ||
        ambulance.ambulance_type.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesType = filterType ? ambulance.ambulance_type === filterType : true;
      
      return matchesSearch && matchesType;
    });
  }, [ambulances, searchText, filterType]);

  

  // Table columns
  const columns = [
  
    {
      title: "Added Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Ambulance, b: Ambulance) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-400" />
          <span>{formatDate(text)}</span>
        </div>
      ),
    },
    {
      title: "Plate Number",
      dataIndex: "plate_number",
      key: "plate_number",
      sorter: (a: Ambulance, b: Ambulance) => a.plate_number.localeCompare(b.plate_number),
    },
    {
      title: "Colour/Model",
      key: "colour",
      render: (_: any, record: Ambulance) => (
        <span className="capitalize">{record.color}, {record.model}</span>
      ),
    },
    {
      title: "Ambulance Lead",
      dataIndex: "ambulance_lead",
      key: "ambulance_lead",
      render: (_: any, record: Ambulance & { lead_data?: { full_name?: string } }) => record?.lead_data?.full_name || "N/A",
    },
    {
      title: "Type of Ambulance",
      dataIndex: "ambulance_type",
      key: "ambulance_type",
      render: (text: string) => (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Ambulance) => (
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
              ALL AMBULANCES ({filteredAmbulances?.length || 0})
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
                Add New
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredAmbulances}
          rowKey="ambulance_id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} ambulances`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border-none"
          rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => handleRowClick(record)
          })}
        />


        {/* View Ambulance Details Modal */}
        <Modal
          open={viewDetailsOpen}
          footer={null}
          onCancel={() => setViewDetailsOpen(false)}
          centered
          width={500}
          closeIcon={<FiX className="text-[#354959]" />}
        >
          {selectedAmbulance && (
            <div>
              <img src={Images.ambulancebg2} alt="Ambulance" className="w-full h-40 object-cover" />

              <div className="p-6 bg-white">
                <h3 className="text-[#000A0F] font-bold text-xl mb-3">
                  Ambulance {selectedAmbulance.plate_number}
                </h3>

                {/* Details Section */}
                <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm">Name</p>
                    <p className="font-medium text-right">
                      {selectedAmbulance.ambulance_lead}
                    </p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>

                  <div className="flex justify-between">
                    <p className="text-sm">Model</p>
                    <p className="font-medium text-right">
                      {selectedAmbulance.model}
                    </p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>

                  <div className="flex justify-between">
                    <p className="text-sm">Plate Number</p>
                    <p className="font-medium">
                      {selectedAmbulance.plate_number}
                    </p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>
                  
                  <div className="flex justify-between">
                    <p className="text-sm">Type/Category</p>
                    <p className="font-medium">
                      {selectedAmbulance.ambulance_type}
                    </p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>

                  <div className="flex justify-between">
                    <p className="text-sm">Colour</p>
                    <p className="font-medium">
                      {selectedAmbulance.color}
                    </p>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3 mt-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">DOCUMENTS</p>
                  </div>
                  {selectedAmbulance.documents && selectedAmbulance.documents.length > 0 ? (
                    selectedAmbulance.documents.map((doc, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <p className="text-sm">{doc.name}</p>
                        <Button 
                          type="link" 
                          className="text-[#DB4A47]! p-0"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  )}
                </div>

                {/* Contact Section */}
                <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3 mt-3">
                  <div className="flex justify-between">
                    <p className="text-sm">Ambulance Lead</p>
                    <p className="font-medium">
                      {selectedAmbulance.ambulance_lead}
                    </p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>
                  <div className="flex justify-between">
                    <p className="text-sm">Email</p>
                    <p className="font-medium">{selectedAmbulance?.lead_email || 'N/A'}</p>
                  </div>
                  <hr className="border-b border-[#DADCDD] p-0"/>

                  <div className="flex justify-between">
                    <p className="text-sm">Phone</p>
                    <p className="font-medium">
                      {selectedAmbulance?.lead_phone || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6">
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

        {/* Delete Ambulance Modal */}
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
              Delete Ambulance
            </h3>
            
            <p className="text-sm text-[#354959] mb-8">
              This action would remove ambulance {selectedAmbulance?.plate_number} from the platform and is irreversible
            </p>

            <div className="flex justify-center gap-4">
              <Button
                size="large"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-8 bg-gray-100! flex-1 text-gray-700! border-none!"
              >
                Cancel
              </Button>

              <Button
                size="large"
                danger
                loading={isDeleting}
                onClick={handleDelete}
                className="px-8 bg-[#DB4A47]! flex-1 text-white! border-none! hover:bg-[#c63d3a]!"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>

        <AddAmbulanceModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAmbulanceAdded={() => {
            mutate();
            setIsModalOpen(false);
          }}
        />
        <UpdateAmbulanceModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAmbulance(null);
          }}
          onAmbulanceUpdated={() => {
            mutate();
            setIsEditModalOpen(false);
            setSelectedAmbulance(null);
          }}
          ambulance={selectedAmbulance}
        />
      </div>
    </>
  );
};

export default AmbulancesTable;