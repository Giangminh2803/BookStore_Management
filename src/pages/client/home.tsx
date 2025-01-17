import { getBooksAPI, getCategoryAPI } from "@/services/api/book/book.api";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  InputNumber,
  Pagination,
  PaginationProps,
  Rate,
  Result,
  Row,
  Spin,
  Tabs,
  TabsProps,
} from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type FieldType = {
  range: {
    from: number;
    to: number;
  };
  category: string[];
};
const HomePage = () => {
  const [form] = Form.useForm();
  const [category, setCategory] = useState<String[]>([]);
  const [listBook, setListBook] = useState<IBookTable[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(16);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("-sold");
  const [filter, setFilter] = useState<string>("");
  const navigate = useNavigate()
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (values?.range?.from >= 0 && values.range.to >= 0) {
      let f = `price>=${values.range.from}&price<=${values.range.to}`;
      if (values.category.length > 0) {
        const cate = values.category.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };

  const fetchBook = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;
    if (sort) {
      query += `&sort=${sort}`;
    }
    if (filter) {
      query += `&${filter}`;
    }
    setIsLoading(true);
    const res = await getBooksAPI(query);
    if (res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getCategory = async () => {
      const res = await getCategoryAPI();
      if (res.data) {
        setCategory(res.data);
      }
    };
    getCategory();
  }, []);

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, sort, filter]);

  const onChangeTab = (key: string) => {
    setSort(key);
  };
  const onChangePage: PaginationProps["onChange"] = (
    page: number,
    ps: number
  ) => {
    if (page !== current) {
      setCurrent(page);
    }
    if (ps !== pageSize) {
      setPageSize(ps);
      setCurrent(1);
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "-sold",
      label: "Phổ biến",
      children: <></>,
    },
    {
      key: "createdAt",
      label: "Hàng mới",
      children: <></>,
    },
    {
      key: "price",
      label: "Giá thấp đến cao",
      children: <></>,
    },
    {
      key: "-price",
      label: "Giá cao đến thấp",
      children: <></>,
    },
  ];
  const handleChangeFilter = (changedValues: any, allValues: any) => {
    if (changedValues.category) {
      const cate = allValues.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        setFilter("");
      }
    }
  };
  return (
    <div
      className="container mx-2 md:mx-24 mt-3 "
      style={{ maxWidth: "1440px" }}
    >
      <Row gutter={[20, 20]}>
        <Col md={4} sm={0} xs={0} className="rounded-md bg-white !p-4">
          <div className="flex justify-between">
            <span>
              <FilterTwoTone /> Bộ lọc tìm kiếm
            </span>
            <Button
              onClick={() => {
                form.resetFields(), setFilter("");
              }}
            >
              <ReloadOutlined />
            </Button>
          </div>
          <Form
            form={form}
            onFinish={onFinish}
            onValuesChange={(changedValues, allValues) =>
              handleChangeFilter(changedValues, allValues)
            }
          >
            <Divider orientation="left">Danh mục sản phẩm</Divider>
            <Form.Item name={"category"} labelCol={{ span: 24 }}>
              <Checkbox.Group>
                <Row>
                  {category.map(function (item) {
                    return (
                      <Col span={24}>
                        <Checkbox value={item}>{item}</Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider orientation={"left"}>Khoảng giá</Divider>
            <Form.Item labelCol={{ span: 24 }}>
              <div className="flex justify-between">
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    name="from"
                    min={0}
                    placeholder="Từ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span className="">--</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    name="to"
                    min={0}
                    placeholder="Đến"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  ></InputNumber>
                </Form.Item>
              </div>
              <div>
                <Button
                  onClick={() => form.submit()}
                  className="w-full"
                  type="primary"
                >
                  Áp dụng
                </Button>
              </div>
            </Form.Item>
            <Divider orientation="left">Đánh giá</Divider>
            <Form.Item>
              <Flex gap="middle" vertical>
                <Flex gap="middle">
                  <Rate disabled className="text-sm" defaultValue={5} />
                </Flex>
                <Flex gap="middle">
                  <Rate
                    disabled
                    className="text-sm"
                    defaultValue={4}
                    allowClear={false}
                  />
                  <span>trở lên</span>
                </Flex>
                <Flex gap="middle">
                  <Rate disabled className="text-sm" defaultValue={3} />
                  <span>trở lên</span>
                </Flex>
                <Flex gap="middle">
                  <Rate
                    disabled
                    className="text-sm"
                    defaultValue={2}
                    allowClear={false}
                  />
                  <span>trở lên</span>
                </Flex>
                <Flex gap="middle">
                  <Rate disabled className="text-sm" defaultValue={1} />
                  <span>Trở lên</span>
                </Flex>
              </Flex>
            </Form.Item>
          </Form>
        </Col>
        <Col md={19} sm={24} xs={24} className="rounded-md ml-3 bg-white !p-4">
          <Row>
            <Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} />
          </Row>
          <Spin spinning={isLoading} size="large">
            <Row>
              {listBook.length > 0 ? (
                listBook.map((item) => {
                  return (
                    <Col md={5} sm={7} xs={12}>
                      <Card
                      onClick={() => navigate(`/book/${item._id}`) }
                        className="m-2"
                        hoverable
                        cover={
                          <img
                            className="min-h-56 max-h-56"
                            alt="example"
                            src={`${
                              import.meta.env.VITE_BACKEND_URL
                            }/images/book/${item.thumbnail}`}
                          />
                        }
                      >
                        <span className="line-clamp-2 min-h-12">
                          {item.mainText}
                        </span>
                        <br />
                        <span>
                          {item.price
                            .toString()
                            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " đ̲"}
                        </span>
                        <br />
                        <span className="text-xs">
                          {" "}
                          <Rate
                            disabled
                            className="text-xs mr-3"
                            defaultValue={5}
                          />
                          Đã bán {item.sold}
                        </span>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <div className="flex justify-center w-full">
                  <Result status="404" title="Không tìm thấy sách rùi!" />
                </div>
              )}
            </Row>
          </Spin>
          <div className="flex justify-center mt-6">
            <Pagination
              onChange={onChangePage}
              current={current}
              total={total}
              pageSize={pageSize}
              showSizeChanger={true}
              pageSizeOptions={["4", "16", "24", "48", "99"]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
