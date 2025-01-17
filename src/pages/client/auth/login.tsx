import { useCurrentApp } from "@/components/context/app.context";
import { LoginAPI } from "@/services/api/auth/auth.api";
import type { FormProps } from "antd";
import { App, Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username: string;
  password: string;
};
const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { setIsAuthenticated, setUser } = useCurrentApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const { username, password } = values;

    const res = await LoginAPI(username, password);
    res.data;
    if (res.data) {
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem("access_token", res.data?.access_token);
      message.success("Đăng nhập thành công!");
      navigate("/");
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
    <div className="flex justify-center mt-24">
      <div className="p-8 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 w-full mx-3 lg:w-1/3">
        <div className="text-3xl font-semibold">Đăng nhập</div>
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
            label="Email"
            name="username"
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
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={isSubmit}>
              Đăng nhập
            </Button>
            <Divider>Or</Divider>
            <span className="flex justify-center">
              Chưa có tài khoản rồi ?
              <a href="/register" className="text-blue-500 ml-1">
                Đăng kí
              </a>
            </span>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
