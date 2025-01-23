import { getOrderAPI } from "@/services/api/order/odder.api";
import { FORMATE_DATE } from "@/services/helper";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { useRef, useState } from "react";

const OrderTable = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const columns: ProColumns<IOrder>[] = [
    {
      title: "Id",
      dataIndex: "_id",
      ellipsis: true,
      search: false,
      render(_dom, entity) {
        return (
          <span className="text-blue-500 cursor-pointer">{entity._id}</span>
        );
      },
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      filters: true,
      onFilter: true,
      ellipsis: true,
      sorter: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      hideInSearch: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      hideInSearch: true,
      sorter: true,
      render(_dom, entity) {
        return (
          <span>
            {entity.totalPrice
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " đ̲"}
          </span>
        );
      },
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "createdAt",
      key: "option",
      sorter: true,
      hideInSearch: true,
      render(_dom, entity) {
        return <span>{dayjs(entity.createdAt).format(FORMATE_DATE)}</span>;
      },
    },
  ];
  return (
    <>
      <ProTable<IOrder>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          let query = `current=${params.current}&pageSize=${params.pageSize}&sort=-updatedAt`;

          if (params.mainText) {
            query += `&mainText=/${params.mainText}/i`;
          }
          if (params.author) {
            query += `&author=/${params.author}/i`;
          }
          if (sort.mainText) {
            query += `&sort=${
              sort.mainText === "ascend" ? "mainText" : "-mainText"
            }`;
          }
          if (sort.price) {
            query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`;
          }
          if (sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          }
          const res = await getOrderAPI(query);
          if (res.data) {
            setMeta(res.data.meta);
          }

          return {
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        search={{
          labelWidth: "auto",
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên {total}
              </div>
            );
          },
        }}
        dateFormatter="string"
        headerTitle="Table Book"
      />
    </>
  );
};

export default OrderTable;
