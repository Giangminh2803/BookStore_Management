import { useState } from "react";
import OrderDetail from "./order.detail";
import { Button, Result, Steps } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [state, setState] = useState<number>(0);
  const navigate = useNavigate()
  return (
    <div>
      {state === 1 && (
        <div className="!mt-3 rounded text-blue-600 ml-12">
          <span onClick={() => setState(0)}>
            {" "}
            <LeftCircleOutlined />
          </span>
        </div>
      )}
      <div
        className="bg-white p-2 !mt-3 rounded"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Steps
          current={state}
          items={[
            {
              title: "Đơn hàng",
            },
            {
              title: "Đặt hàng",
            },
            {
              title: "Thanh toán",
            },
          ]}
        />
      </div>
      {state === 2 ? (
        <Result
          status="success"
          title="Mua hàng thanh công!"
          subTitle="Hệ thống đã tiếp nhận và xử lí thông tin đơn hàng của bạn!"
          extra={[
            <Button onClick={() => navigate('/')} type="primary" key="console">
              Trang Chủ
            </Button>,
            <Button key="buy">Lịch sử mua hàng</Button>,
          ]}
        />
      ) : (
        <OrderDetail setState={setState} state={state} />
      )}
    </div>
  );
};

export default Order;
