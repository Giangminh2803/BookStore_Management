import { dateRangeValidate, FORMATE_DATE } from "@/services/helper";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";

import { CSVLink } from "react-csv";
import ModalUser from "./modal/modal.add.user";
import ModalAddUserBulk from "./modal/modal.add.bulk";
import UserDetail from "./modal/modal.detail.user";
import UpdateUser from "./modal/modal.edit.user";
import { deleteUserAPI, getUsersAPI } from "@/services/api/user/user.api";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const TableUser = () => {
  const actionRef = useRef<ActionType>();

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  const [dataDetail, setDataDetail] = useState<IUser | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isOpenBulk, setIsOpenBulk] = useState<boolean>(false);
  const [dataCurrentTable, setDataCurrentTable] = useState<IUser[]>([]);

  const reloadTable = () => {
    actionRef.current?.reload();
  };
  const handleOpenDetail = (dataUser: IUser) => {
    setOpenDetail(true);
    setDataDetail(dataUser);
  };
  const handleOpenUpdate = (dataUser: IUser) => {
    setOpenUpdate(true);
    setDataDetail(dataUser);
  };
  const confirmDeleteUser = async (id: string) => {
    const res = await deleteUserAPI(id);
    if (res.data) {
      message.success("Xoá người dùng thành công");
      reloadTable();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.error,
      });
    }
  };

  const cancel = () => {
    // message.error('Click on No')
  };
  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "_id",
      dataIndex: "_id",
      hideInSearch: true,
      render(_dom, entity) {
        return (
          <a
            onClick={() => handleOpenDetail(entity)}
            className="cursor-pointer text-blue-600"
          >
            {entity._id}
          </a>
        );
      },
    },
    {
      title: "Fullname",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Created At",
      hideInTable: true,
      valueType: "dateRange",
      dataIndex: "createdAtRange",
    },
    {
      title: "Created At",
      hideInSearch: true,
      dataIndex: "createdAt",
      sorter: true,
      render(_dom, entity) {
        return <span>{dayjs(entity.createdAt).format(FORMATE_DATE)}</span>;
      },
    },
    {
      hideInSearch: true,
      title: "Action",
      render: (_dom, entity) => (
        <div className="flex gap-3 cursor-pointer">
          <span onClick={() => handleOpenUpdate(entity)}>
            <EditOutlined style={{ color: "orange" }} />
          </span>
          <span>
            <Popconfirm
              title="Xoá người dùng"
              description="Bạn có chắc chắn muốn xoá người dùng này không?"
              onConfirm={() => confirmDeleteUser(entity._id)}
              onCancel={cancel}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <DeleteOutlined style={{ color: "red" }} />
            </Popconfirm>
          </span>
        </div>
      ),
    },
  ];
  return (
    <>
      <UpdateUser
        showDetail={openUpdate}
        setShowDetail={setOpenUpdate}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        reload={reloadTable}
      />
      <UserDetail
        showDetail={openDetail}
        setShowDetail={setOpenDetail}
        dataDetail={dataDetail}
      />
      <ModalUser show={openModal} setShow={setOpenModal} reload={reloadTable} />
      <ModalAddUserBulk
        isOpenBulk={isOpenBulk}
        setIsOpenBulk={setIsOpenBulk}
        refreshTable={reloadTable}
      />
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          let query = `current=${params.current}&pageSize=${params.pageSize}`;
          if (params.fullName) {
            query += `&fullName=/${params.fullName}/i`;
          }
          if (params.email) {
            query += `&email=/${params.email}/i`;
          }

          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else {
            query += `&sort=-createdAt`;
          }

          const date = dateRangeValidate(params.createdAtRange);
          if (date) {
            query += `&createdAt>=${date[0]}&createdAt<=${date[1]}`;
          }

          const res = await getUsersAPI(query);

          if (res.data) {
            setMeta(res.data.meta);
            setDataCurrentTable(res.data.result);
          }
          return {
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên {total}
              </div>
            );
          },
        }}
        search={{
          labelWidth: "auto",
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === "get") {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        dateFormatter="string"
        headerTitle="Table user"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<ExportOutlined />}
            type="primary"
          >
            <CSVLink
              data={dataCurrentTable}
              filename={`export-${dayjs().format(FORMATE_DATE)}-user`}
            >
              {" "}
              Export
            </CSVLink>
          </Button>,
          <Button
            key="button"
            icon={<ImportOutlined />}
            onClick={() => setIsOpenBulk(true)}
            type="primary"
          >
            Import
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setOpenModal(true)}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />
    </>
  );
};

export default TableUser;
