import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  App,
  Col,
  Divider,
  Form,
  FormProps,
  GetProp,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import {
  createBookAPI,
  getCategoryAPI,
  uploadFileAPI,
} from "@/services/api/book/book.api";
import { UploadFile } from "antd/lib";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { UploadChangeParam } from "antd/es/upload";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type UserUploadType = "thumbnail" | "slider";
interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  reloadTable: () => void;
}

type FieldType = {
  mainText: string;
  author: string;
  price: number;
  category: string;
  quantity: number;
  thumbnail: any;
  slider: any;
};
const ModalAddBook = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable } = props;
  const {message} = App.useApp();
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
  const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const [listCategory, setListCategory] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryAPI();
      if (res && res.data) {
        const data = res.data.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
        setListCategory(data);
      }
    };
    fetchCategory();
  }, []);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLt2M) {
      message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    }
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };

  const handleRemove = async (file: UploadFile, type: UserUploadType) => {
    if (type === "thumbnail") {
      setFileListThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = fileListSlider.filter((item) => item.uid !== file.uid);
      setFileListSlider(newSlider);
    }
  };

  const handleUploadFile = async (
    options: RcCustomRequestOptions,
    type: UserUploadType
  ) => {
    const file = options.file as UploadFile;
    const res = await uploadFileAPI(file, "book");
    if (res && res.data) {
      const uploadedFile: any = {
        uid: file.uid,
        name: res.data.fileUploaded,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          res.data.fileUploaded
        }`,
      };
      if (type === "thumbnail") {
        setFileListThumbnail([{ ...uploadedFile }]);
      } else {
        setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
      }
    }
  };
  const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
    
    if (info.file.status === "uploading") {
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
      return;
    }
    if (info.file.status === "done") {
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
    if (info.file.status === "removed") {
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { mainText, author, price, quantity, category } = values;
    const thumbnail = fileListThumbnail[0]?.name ?? "";
    const slider = fileListSlider.map((item) => item.name) ?? [];
    const book = await createBookAPI(
      mainText,
      author,
      price,
      quantity,
      category,
      thumbnail,
      slider
    );
    if (book) {
      message.success("Thêm mới sách thành công");
      setOpenModal(false);
      form.resetFields();
      reloadTable()
    } else {
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <>
      <Modal
        width={"50vw"}
        title="Thêm mới sách"
        open={openModal}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields();
          setFileListSlider([]);
          setFileListThumbnail([]);
          setOpenModal(false);
        }}
        okText="Thêm mới"
        cancelText="Huỷ"
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: "45vw" }}
          autoComplete="off"
          onFinish={onFinish}
        >
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item<FieldType>
                required
                label="Tên sách"
                name={"mainText"}
                rules={[
                  { required: true, message: "Tên sách không được để trống" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                rules={[
                  {
                    required: true,
                    message: "Tên Tác giả không được để trống",
                  },
                ]}
                required
                label="Tác giả"
                name={"author"}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                rules={[
                  { required: true, message: "Số lượng không được để trống" },
                ]}
                label="Giá tiền"
                name={"price"}
              >
                <InputNumber
                  min={1}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  addonAfter=" đ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                required
                label="Thể loại"
                name={"category"}
                rules={[
                  { required: true, message: "Thể loại không được để trống" },
                ]}
              >
                <Select
                  options={listCategory}
                  showSearch
                  allowClear
                  style={{ width: "70%" }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                rules={[
                  { required: true, message: "Số lượng không được để trống" },
                ]}
                label="Số lượng"
                name={"quantity"}
              >
                <InputNumber
                  min={1}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  addonAfter="sản phẩm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                required
                label="Ảnh bìa"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                // rules={[
                //   {
                //     required: true,
                //     message: "Ảnh thumbnail không được để trống",
                //   },
                // ]}
              >
                <Upload
                  customRequest={(options) =>
                    handleUploadFile(options, "thumbnail")
                  }
                  maxCount={1}
                  multiple={false}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "thumbnail")}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemove(file, "thumbnail")}
                  fileList={fileListThumbnail}
                  listType="picture-card"
                >
                  <div>
                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                required
                label="Ảnh slider"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  { required: true, message: "Ảnh slider không được để trống" },
                ]}
              >
                <Upload
                  listType="picture-card"
                  multiple
                  customRequest={(options) =>
                    handleUploadFile(options, "slider")
                  }
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemove(file, "slider")}
                  fileList={fileListSlider}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Modal>
    </>
  );
};

export default ModalAddBook;
