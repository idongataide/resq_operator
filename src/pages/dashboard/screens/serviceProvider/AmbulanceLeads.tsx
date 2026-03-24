import React, { useState } from "react";
import { Table, Button } from "antd";
import { Modal } from "antd";

import {
  SearchOutlined,
  FilterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { FiClock } from "react-icons/fi";
import Images from "@/components/images";

interface AmbulanceLeadRecord {
  key: number;
  addedDateTime: string;
  name: string;
  email: string;
  phoneNumber: string;
}

const AmbulanceLeads = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AmbulanceLeadRecord | null>(null);

  const data: AmbulanceLeadRecord[] = Array.from({ length: 8 }, (_, index) => ({
    key: index,
    addedDateTime: "Today · 12:34pm",
    name: "Babalola Swiss",
    email: "example@email.com",
    phoneNumber: index === 2 ? "0801 234 12345678" : "0801 234 5678",
  }));

  const columns = [
    {
      title: "Added Date & Time",
      dataIndex: "addedDateTime",
      key: "addedDateTime",
      render: (text: string) => (
        <div className="flex items-center gap-2 text-[#354959]">
          <FiClock className="text-gray-400" />
          {text}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: AmbulanceLeadRecord) => (
        <Button
          className="bg-[#FDF6F6]! font-medium! text-[#DB4A47]! border-0! rounded-lg!"
          onClick={() => {
            setSelectedRecord(record);
            setViewDetailsOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#354959] font-bold uppercase text-sm">
            AMBULANCE LEADS
          </h1>

          <div className="flex gap-3">
            <Button
              icon={<SearchOutlined />}
              className="bg-[#FDF6F6]! text-[#DB4A47]! border-0!"
            />
            <Button
              icon={<UploadOutlined />}
              className="bg-[#FDF6F6]! text-[#DB4A47]! border-0!"
            />
            <Button
              icon={<FilterOutlined />}
              className="bg-[#FDF6F6]! text-[#DB4A47]! border-0!"
            >
              Filter
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
          }}
          rowClassName="hover:bg-gray-50"
        />

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-[#808D97] mt-4">
          <span>Showing page 24 of 30</span>
        </div>
      </div>

      {/* View Details Modal */}
      <Modal
        open={viewDetailsOpen}
        footer={null}
        onCancel={() => setViewDetailsOpen(false)}
        centered
        width={500}
      >
        <div className="">
          
          <div className="">
            <img src={Images.ambulancebg} alt="bg"/>
          </div>
          <div className="p-6 bg-white">
              <h3 className="text-[#000A0F] font-bold text-xl mb-3">John OludareE</h3>
              <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3">
                <div className="flex justify-between">
                  <p className="text-[#354959] text-sm">Name</p>
                  <p className="text-[#000A0F] text-sm font-medium">
                    {selectedRecord?.name || "John Oludare"}
                  </p>
                </div>
                <hr className="border-b border-[#DADCDD] p-0"/>
                {/* Email */}
                <div className="flex justify-between">
                  <p className="text-[#354959] text-sm">Email</p>
                  <p className="text-[#000A0F] text-sm font-medium">
                    {selectedRecord?.email || "example@email.com"}
                  </p>
                </div>
                <hr className="border-b border-[#DADCDD] p-0"/>
                {/* Phone */}
                <div className="flex justify-between">
                  <p className="text-[#354959] text-sm">Phone</p>
                  <p className="text-[#000A0F] text-sm font-medium">
                    {selectedRecord?.phoneNumber || "08012345678"}
                  </p>
                </div>
            </div>

             <div className="flex justify-end gap-4 mt-6">
                <Button
                    size="large"
                    onClick={() => setViewDetailsOpen(false)}
                    className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
                    >
                    Close
                </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AmbulanceLeads;