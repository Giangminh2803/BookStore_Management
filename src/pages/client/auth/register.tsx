import { RegisterAPI } from "@/services/api/auth/auth.api";
import type { FormProps } from "antd";
import { App, Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: string;
};

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const { email, fullName, password, phone } = values;
    const res = await RegisterAPI(email, password, fullName, phone);
    if (res.data) {
      message.success("Đăng kí thành công!");
      navigate("/login");
    } else {
      message.error(res.message);
    }
    setIsSubmit(false);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
     errorInfo;
  };
  return (
    <div className="flex justify-center mt-5">
      <div className="p-8 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 w-full lg:w-1/3">
        <div className="text-3xl font-semibold">Đăng kí tài khoản</div>
        <hr className="my-5" />

        <Form
          name="basic"
          labelCol={{ span: 12 }}
          layout={"vertical"}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng điền họ và tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng điền email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng điền mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<FieldType>
            label="Điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng điền số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={isSubmit}>
              Đăng kí
            </Button>
            <Divider>Or</Divider>
            <span className="flex justify-center">
              Đã có tài khoản rồi ?
              <a href="/login" className="text-blue-500 ml-1">
                Đăng nhập
              </a>
            </span>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
