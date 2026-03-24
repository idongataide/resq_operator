import React, { useState } from "react";
import { Table, Button, Modal, Input } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FiClock } from "react-icons/fi";
import Images from "@/components/images";

const Ambulances = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const data = Array.from({ length: 8 }, (_, index) => ({
    key: index,
    createdDateTime: "Today · 12:34pm",
    vehicleModel: "Ford Ecoline",
    plateNumber: `ABC 12${index} DE`,
    typeCategory: "BL3",
    status: index < 2 ? "Pending" : "Approved",
    documents: "Vehicle License, Insurance",
    leadName: "John Oludare",
    leadEmail: "example@email.com",
    leadPhone: "08012345678",
  }));

  const handleApprove = () => {
    setApproveOpen(false);
    setSelectedRecord(null);
  };

  const handleReject = () => {
    setRejectOpen(false);
    setRejectReason("");
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: "Created Date & Time",
      dataIndex: "createdDateTime",
      key: "createdDateTime",
      render: (text: string) => (
        <div className="flex items-center gap-2 text-[#354959]">
          <FiClock className="text-gray-400" />
          {text}
        </div>
      ),
    },
    {
      title: "Vehicle Model",
      dataIndex: "vehicleModel",
      key: "vehicleModel",
    },
    {
      title: "Plate Number",
      dataIndex: "plateNumber",
      key: "plateNumber",
    },
    {
      title: "Type/Category",
      dataIndex: "typeCategory",
      key: "typeCategory",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const isPending = status === "Pending";
        return (
          <span
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              isPending
                ? "bg-[#FFF7E8] text-[#BB7F05]"
                : "bg-[#F8FEF5] text-[#4EA507]"
            }`}
          >
            ● {status}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          {record.status === "Pending" && (
            <>
              <Button
                icon={<CheckOutlined />}
                className="bg-[#E6F4EA]! text-[#2E7D32]! border-0! rounded-lg!"
                onClick={() => {
                  setSelectedRecord(record);
                  setApproveOpen(true);
                }}
              />
              <Button
                icon={<CloseOutlined />}
                className="bg-[#FBE9E7]! text-[#DB4A47]! border-0! rounded-lg!"
                onClick={() => {
                  setSelectedRecord(record);
                  setRejectOpen(true);
                }}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#354959] font-bold uppercase text-sm">
            AMBULANCES
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
          onRow={(record) => ({
            onClick: () => {
              setSelectedRecord(record);
              setViewDetailsOpen(true);
            },
          })}
        />


        <div className="flex justify-between items-center text-sm text-[#808D97] mt-4">
          <span>Showing page 1 of 1</span>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        open={approveOpen}
        footer={null}
        onCancel={() => setApproveOpen(false)}
        centered
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Approve Ambulance?</h2>

          <p className="text-gray-500">
            This action would approve{" "}
            <strong>
              {selectedRecord?.vehicleModel} -{" "}
              {selectedRecord?.plateNumber}
            </strong>{" "}
            and is irreversible.
          </p>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => setApproveOpen(false)}
              className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              type="primary"
              className="px-8 bg-[#DB4A47]! border-none!"
              onClick={handleApprove}
            >
              Approve
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={rejectOpen}
        footer={null}
        onCancel={() => setRejectOpen(false)}
        centered
      >
        <div className="space-y-4 p-6">
          <img src={Images.icon.caution} alt="img" />

          <h2 className="text-xl font-semibold">Reject Ambulance?</h2>

          <p className="text-gray-500">
            This action would reject{" "}
            <strong>
              {selectedRecord?.vehicleModel} -{" "}
              {selectedRecord?.plateNumber}
            </strong>{" "}
            and is irreversible.
          </p>

          <Input.TextArea
            rows={6}
            placeholder="Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button
              size="large"
              onClick={() => setRejectOpen(false)}
              className="px-8 bg-[#F5EAEA]! text-[#DB4A47]! border-none!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              type="primary"
              className="px-8 bg-[#DB4A47]! border-none!"
              onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        open={viewDetailsOpen}
        footer={null}
        onCancel={() => setViewDetailsOpen(false)}
        centered
        width={500}
      >
        <div>
          <img src={Images.ambulancebg} alt="bg" />

          <div className="p-6 bg-white">
            <h3 className="text-[#000A0F] font-bold text-xl mb-3">
              {selectedRecord?.vehicleModel}{" "}
              {selectedRecord?.plateNumber}
            </h3>

            <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3">
              <div className="flex justify-between">
                <p className="text-sm">Model</p>
                <p className="font-medium">
                  {selectedRecord?.vehicleModel}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-sm">Plate Number</p>
                <p className="font-medium">
                  {selectedRecord?.plateNumber}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-sm">Type/Category</p>
                <p className="font-medium">
                  {selectedRecord?.typeCategory}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-sm">Documents</p>
                <p className="font-medium">
                  {selectedRecord?.documents}
                </p>
              </div>
            </div>

            <div className="bg-[#F3F5F9] p-3 rounded-md space-y-3 mt-3">
              <div className="flex justify-between">
                <p className="text-sm">Ambulance Lead</p>
                <p className="font-medium">
                  {selectedRecord?.leadName}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-sm">Email</p>
                <p className="font-medium">
                  {selectedRecord?.leadEmail}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-sm">Phone</p>
                <p className="font-medium">
                  {selectedRecord?.leadPhone}
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
      </Modal>
    </>
  );
};

export default Ambulances;
