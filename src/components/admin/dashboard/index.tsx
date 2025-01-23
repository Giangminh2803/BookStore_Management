import { getAmountAPI } from "@/services/api/dashboard/dashboard.api";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const DashBoard = () => {
  const [data, setData] = useState<IDashboard>({
    countBook: 0,
    countUser: 0,
    countOrder: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      const res = await getAmountAPI();
      if (res && res.data) {
        setData(res.data);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Row className="flex justify-between" gutter={[20, 20]}>
        <Col md={8}>
          <div className="bg-white p-6 rounded">
            <span className="opacity-70">Tổng User</span>
            <br />
            <span className="text-xl"><CountUp end={data.countUser} /></span>
          </div>
        </Col>

        <Col md={8}>
          <div className="bg-white p-6 rounded">
            <span className="text-medium opacity-70">Tổng Đơn hàng</span>
            <br />
            <span className="text-xl"><CountUp end={data.countOrder} /></span>
          </div>
        </Col>

        <Col md={8}>
          <div className="bg-white p-6 rounded">
            <span className="opacity-70">Tổng Sách</span>
            <br />
            <span className="text-xl"><CountUp end={data.countBook} /></span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashBoard;
