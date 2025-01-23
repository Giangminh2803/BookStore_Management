import { useCurrentApp } from "@/components/context/app.context";
import { createOrderAPI } from "@/services/api/order/odder.api";
import { DeleteOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Col,
  Divider,
  Form,
  FormProps,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Result,
  Row,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { RadioChangeEvent } from "antd/lib";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  setState: (v: number) => void;
  state: number;
}
type FieldType = {
  name: string;
  phone: string;
  address: string;
  method: string;
};
const OrderDetail = (props: IProps) => {
  const { setState, state } = props;
  const { user } = useCurrentApp();
  const { carts, setCarts } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [value, setValue] = useState<string>("");
  const [form] = Form.useForm();
  const {message} = App.useApp()
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const data = carts.map((item) => ({
      bookName: item.detail.mainText,
      quantity: item.quantity,
      _id: item._id

    }))
    const order: IOrder = {
      name: values.name,
      phone: values.phone,
      type: values.method,
      address: values.address,
      totalPrice: totalPrice,
      detail: data

    }
    const res = await createOrderAPI(order)
    if(res.statusCode === 201){
      message.success('Tạo đơn hàng thành công!')
      localStorage.removeItem('carts')
      setCarts([])
    }else{
      message.error('Đã xảy ra lỗi!')
    }
    
  };
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const navigate = useNavigate();
  useEffect(() => {
    form.setFieldValue("name", user?.fullName);
    form.setFieldValue("phone", user?.phone);
  }, [state === 1]);
  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const handleDeleteBook = (_id: string) => {
    const cartsS = localStorage.getItem("carts");
    if (cartsS) {
      const carts = JSON.parse(cartsS) as ICart[];

      const newCarts = carts.filter((item) => item._id !== _id);

      localStorage.setItem("carts", JSON.stringify(newCarts));
      setCarts(newCarts);
    }
  };
  const onChangeInput = (value: number, book: IBookTable) => {
    if (!value || +value < 1) return;
    if (!isNaN(+value)) {
      const cartsS = localStorage.getItem("carts");
      if (cartsS && book) {
        const carts = JSON.parse(cartsS) as ICart[];

        let isExistIndex = carts.findIndex((c) => c._id === book._id);
        if (isExistIndex > -1) {
          carts[isExistIndex].quantity = +value;
        }
        localStorage.setItem("carts", JSON.stringify(carts));
        setCarts(carts);
      }
    }
  };
  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        {carts.length > 0 ? (
          <Row gutter={[20, 20]}>
            <Col md={18} xs={24}>
              {carts?.map((item, index) => {
                const currentPrice = item.detail.price ?? 0;
                return (
                  <div
                    className="bg-white mb-4 p-4 rounded"
                    key={`index-${index}`}
                  >
                    <div className="grid grid-cols-6 gap-6">
                      <img
                        className="max-w-14"
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          item.detail.thumbnail
                        }`}
                        alt=""
                      />
                      <div className="">{item.detail.mainText}</div>
                      <div>
                        {item?.detail.price
                          .toString()
                          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ̲"}
                      </div>
                      <div>
                        {state === 0 ? (
                          <InputNumber
                            onChange={(value) =>
                              onChangeInput(value as number, item.detail)
                            }
                            min={1}
                            value={item.quantity}
                          />
                        ) : (
                          <div>Số lượng: {item.quantity}</div>
                        )}
                      </div>
                      <div>
                        Tổng: {""}
                        {(currentPrice * item.quantity)
                          .toString()
                          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ̲"}
                      </div>
                      <div className="text-red-500 text-center">
                        <Popconfirm
                          title="Xoá sản phẩm"
                          description="Bạn có muốn xoá sản phẩm ra khỏi giỏ hàng?"
                          onConfirm={() => handleDeleteBook(item._id)}
                          okText="Xoá"
                          cancelText="Huỷ"
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Col>
            {state === 0 && (
              <Col md={6} xs={24}>
                <div className="bg-white rounded p-6">
                  <div className=" flex justify-between">
                    <div>Tạm tính</div>
                    <div>
                      {totalPrice
                        .toString()
                        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ̲"}
                    </div>
                  </div>

                  <Divider />
                  <div className=" flex justify-between mt-8">
                    <div>Tổng tiền</div>
                    <div className="text-blue-600 font-medium text-lg">
                      {totalPrice
                        .toString()
                        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ̲"}
                    </div>
                  </div>
                  <Divider />
                  <div className="mt-12">
                    <Button
                      onClick={() => setState(1)}
                      className="w-full font-medium"
                      type="primary"
                    >
                      Mua hàng ({carts.length})
                    </Button>
                  </div>
                </div>
              </Col>
            )}
            {state === 1 && (
              <Col md={6} xs={24}>
                <div className="bg-white rounded p-6">
                  <div className="">
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                      <Form.Item
                        name={"method"}
                        label="Hình thức thanh toán"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn hình thức thanh toán!",
                          },
                        ]}
                      >
                        <Radio.Group
                          className="mt-3"
                          onChange={onChange}
                          value={value}
                        >
                          <Space direction="vertical">
                            <Radio value={"COD"}>
                              Thanh toán khi nhận hàng
                            </Radio>
                            <Radio value={"BANKING"}>
                              Chuyển khoản ngân hàng
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name={"name"}
                        label="Họ tên"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng điền tên người nhận hàng!",
                          },
                        ]}
                      >
                        <Input></Input>
                      </Form.Item>
                      <Form.Item
                        name={"phone"}
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng điền số điện thoại nhận hàng!",
                          },
                        ]}
                      >
                        <Input></Input>
                      </Form.Item>
                      <Form.Item
                        name={"address"}
                        label="Địa chỉ nhận hàng"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng điền địa chỉ nhận hàng!",
                          },
                        ]}
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Form>
                  </div>

                  <Divider />
                  <div className=" flex justify-between mt-8">
                    <div>Tổng tiền</div>
                    <div className="text-blue-600 font-medium text-lg">
                      {totalPrice
                        .toString()
                        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ̲"}
                    </div>
                  </div>
                  <Divider />
                  <div className="mt-12">
                    <Button
                      onClick={() => {
                        setState(2), form.submit();
                      }}
                      className="w-full font-medium"
                      type="primary"
                    >
                      Thanh toán ({carts.length})
                    </Button>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        ) : (
          <div>
            <Result
              status="404"
              title="Chưa có gì trong giỏ hàng. Cùng mua sắm nào."
              extra={
                <Button onClick={() => navigate("/")} type="primary">
                  Trang chủ
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
