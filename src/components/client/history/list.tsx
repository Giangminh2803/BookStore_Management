import { getHistoryOrder } from "@/services/api/order/odder.api";
import { Descriptions, Divider, Drawer, Table, Tag } from "antd";
import { DescriptionsProps } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const HistoryList = () => {
  const [item, setItem] = useState<IOrder[]>([]);
  const [itemDetail, setItemDetail] = useState<IOrder>();
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  useEffect(() => {
    const fetchHistoryOrder = async () => {
      const res = await getHistoryOrder();
      if (res.statusCode === 200 && res.data) {
        setItem(res.data);
      }
    };
    fetchHistoryOrder();
  }, []);
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (index: any) => <>{index}</>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: Date) => <span>{dayjs(text).format("MM-DD-YYYY")}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text: number) => {
        return (
          <span>
            {text.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ̲"}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (text: string) => {
        return (
          <Tag color={text === "PAID" ? "green" : "red"}>
            {text === "UNPAID" && "Chưa thanh toán"}
            {text === "PAID" && "Đã thanh toán"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (record: IOrder) => {
        return (
          <span onClick={() => handleDetail(record)} className="text-blue-600">
            Xem chi tiết
          </span>
        );
      },
    },
  ];

  const handleDetail = (dataDetail: IOrder) => {
    console.log(dataDetail);
    setOpenDetail(true);
    setItemDetail(dataDetail);
  };
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Mã đơn hàng",
      children: itemDetail?._id,
    },
    {
      key: "2",
      label: "Người nhận",
      children: itemDetail?.name,
    },
    {
      key: "3",
      label: "Phương thức thanh toán",
      children: itemDetail?.type,
    },
    {
      key: "4",
      label: "Số điện thoại",
      children: itemDetail?.phone,
    },
    {
      key: "5",
      label: "Địa chỉ nhận hàng",
      children: (
        <>
          {itemDetail?.address === undefined
            ? "Đang cập nhật"
            : itemDetail?.address}
        </>
      ),
    },
    {
      key: "6",
      label: "Tổng tiền đơn hàng",
      children: (
        <div className="text-blue-500 font-medium text-md">
          {itemDetail?.totalPrice
            .toString()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ̲"}
        </div>
      ),
    },
    {
      key: "6",

      children: (
        <div>
          {itemDetail?.detail.map((item) => {
            return (
              <div>
                <div>Tên sách: {item.bookName}</div>

                <div> Số lượng: {item.quantity}</div>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div className="p-4 text-lg font-medium">Lịch sử mua hàng</div>
        <Divider />
        <Table bordered columns={columns} dataSource={item} />
        <div>
          <Drawer
            width={"100vh"}
            title="Chi tiết đơn hàng"
            open={openDetail}
            onClose={() => setOpenDetail(false)}
          >
            <Descriptions column={2} items={items} />
          </Drawer>
        </div>
      </div>
    </>
  );
};
export default HistoryList;
