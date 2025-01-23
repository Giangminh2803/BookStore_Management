
import {
  
  Button,
  Col,
  Form,
  Input,
  Row,
  Tabs,
} from "antd";
import { TabsProps } from "antd/lib";
import ManageInformation from "./manage.info";
import ManagePassword from "./manage.password";
const ManageAccount = () => {
  
  const onChange = (key: string) => {
    console.log(key);
  };
  ;
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: <ManageInformation/>,
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: (
        <ManagePassword/>
      ),
    },
  ];
  return (
    <div className="p-2">
      <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
    </div>
  );
};

export default ManageAccount;
