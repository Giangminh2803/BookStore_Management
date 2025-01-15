import React, { useEffect, useState } from "react";
import {
  Badge,
  Descriptions,
  Divider,
  Drawer,
  GetProp,
  Image,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { DescriptionsProps } from "antd/lib";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { FORMATE_DATE } from "@/services/helper";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface IProps {
  openDetail: boolean;
  setOpenDetail: (v: boolean) => void;
  detailBook: IBookTable | null;
}
const DetailBook = (props: IProps) => {
  const { openDetail, setOpenDetail, detailBook } = props;

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const getImagesBook = () => {
      if (detailBook) {
        let imgThumbnail: any = {},
          imgSlider: UploadFile[] = [];
        if (detailBook.thumbnail) {
          imgThumbnail = {
            uid: uuidv4(),
            name: detailBook.thumbnail,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
              detailBook.thumbnail
            }`,
          };
        }
        if (detailBook.slider.length > 0) {
          detailBook.slider.map((item: string) => {
            imgSlider.push({
              uid: uuidv4(),
              name: item,
              status: "done",
              url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                detailBook.slider
              }`,
            });
          });
        }
        setFileList([imgThumbnail, ...imgSlider]);
      }
    };
    getImagesBook();
  }, [detailBook]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const onClose = () => {
    setOpenDetail(false);
  };
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "id",
      children: (
        <span className="text-blue-500 cursor-pointer">{detailBook?._id}</span>
      ),
    },
    {
      key: "2",
      label: "Tên sách",
      children: detailBook?.mainText,
    },
    {
      key: "3",
      label: "Tác giả",
      children: detailBook?.author,
    },
    {
      key: "4",
      label: "Giá tiền",
      children:
        detailBook?.price
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " đ̲",
    },
    {
      key: "8",
      label: "Đã bán",
      children: detailBook?.sold,
    },
    {
      key: "9",
      label: "Số lượng còn lại",
      children: detailBook?.quantity,
    },
    {
      key: "5",
      label: "Ngày tạo",
      children: dayjs(detailBook?.createdAt).format(FORMATE_DATE),
    },

    {
      key: "7",
      label: "Ngày chỉnh sửa",
      children: dayjs(detailBook?.updatedAt).format(FORMATE_DATE),
    },
  ];
  return (
    <>
      <Drawer
        title="Xem chi tiết sách"
        onClose={onClose}
        open={openDetail}
        width={"75vw"}
      >
        <Descriptions
          column={2}
          title={<Divider orientation="left">Thông tin</Divider>}
          bordered
          items={items}
        />

        <Divider orientation="left">Ảnh Sách</Divider>
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        ></Upload>
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
      </Drawer>
    </>
  );
};

export default DetailBook;
