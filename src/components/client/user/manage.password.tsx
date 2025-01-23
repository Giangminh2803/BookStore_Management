import { useCurrentApp } from "@/components/context/app.context";
import { changePasswordAPI } from "@/services/api/user/user.api";
import { App, Button, Col, Form, Input, Row } from "antd";
import { useEffect } from "react";

const ManagePassword = () => {
  const { user } = useCurrentApp();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  useEffect(() => {
    form.setFieldsValue({ email: user?.email });
  }, [user]);

  const onFinish = async (values: any) => {
    const { email, password, newPass } = values;

    const res = await changePasswordAPI(email, password, newPass);
    if (res && res.statusCode === 201) {
      message.success("Cập nhật mật khẩu thành công!");
      form.setFieldValue("password", "");
      form.setFieldValue("newPass", "");
    } else {
      message.error("Đã có lỗi xảy ra!");
    }
  };
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col md={12}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item required label="Email" name={"email"}>
              <Input disabled></Input>
            </Form.Item>
            <Form.Item required label="Mật khẩu" name={"password"}>
              <Input.Password></Input.Password>
            </Form.Item>
            <Form.Item required label="Mật khẩu mới" name={"newPass"}>
              <Input.Password></Input.Password>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Cập nhật</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};
export default ManagePassword;
