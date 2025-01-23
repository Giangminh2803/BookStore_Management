import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Upload,
  UploadFile,
} from "antd";
import { UploadProps } from "antd/lib";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { uploadFileAPI } from "@/services/api/book/book.api";
import { updateUserInfoAPI } from "@/services/api/user/user.api";
import { useCurrentApp } from "@/components/context/app.context";
const ManageInformation = () => {
  const { user } = useCurrentApp();
  const [avatar, setAvatar] = useState<string>(user?.avatar ?? "");
  const [form] = Form.useForm();
  const urlAvatar = `${
    import.meta.env.VITE_BACKEND_URL
  }/images/avatar/${avatar}`;
  const { message } = App.useApp();
  const handleUpload = async (options: RcCustomRequestOptions) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await uploadFileAPI(file, "avatar");

    if (res && res.data) {
      const newAvt = res.data.fileUploaded;
      setAvatar(newAvt);
      if (onSuccess) {
        onSuccess("ok");
      }
    } else {
      message.error(res.message);
    }
  };
  const onFinish = async (values: any) => {
    const { name, phone } = values;
    const _id = user?.id ?? "";
    const res = await updateUserInfoAPI(_id, name, phone, avatar);
    if (res && res.statusCode === 200) {
      message.success("Cập nhật thành công!");
      

    } else {
      message.error("Đã có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      email: user?.email,
      name: user?.fullName,
      phone: user?.phone,
    });
  },[user]);
  const props: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    customRequest: handleUpload,

    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col md={12}>
          <div className=" flex-col justify-items-center">
            <div className="mb-3">
              <Avatar size={128} src={urlAvatar} />
            </div>
            <div>
              <Upload showUploadList={false} {...props}>
                <Button icon={<UploadOutlined />}>Upload New Avatar</Button>
              </Upload>
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name={"email"}
                label="Email"
                required
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Tên hiển thị"
                name={"name"}
                required
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name={"phone"}
                required
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">Cập nhật</Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ManageInformation;
