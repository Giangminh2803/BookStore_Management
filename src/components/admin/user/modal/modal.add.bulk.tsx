import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, notification, Table, Upload } from "antd";
import { UploadProps } from "antd/lib";
import { useState } from "react";
import { Buffer } from "buffer";
import templateFile from "@/assets/template/users.xlsx?url";
import Exceljs from "exceljs";
import { bulkCreateUserAPI } from "@/services/api/user/user.api";
type IProps = {
  isOpenBulk: boolean;
  setIsOpenBulk: (v: boolean) => void;
  refreshTable: () => void;
};
interface IDataImport {
  fullName: string;
  email: string;
  phone: string;
}
const { Dragger } = Upload;

const ModalAddUserBulk = (props: IProps) => {
  const { isOpenBulk, setIsOpenBulk, refreshTable } = props;
  const { message } = App.useApp();
  const [dataImport, setDataImport] = useState<IDataImport[]>([]);

  const upload: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        if (onSuccess) onSuccess("ok");
      }, 1000);
    },
    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        //(info.file, info.fileList)
      }
      if (status === "done") {
        //message.success(`${info.file.name} file uploaded successfully.`)
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj!(file);
          const workbook = new Exceljs.Workbook();
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          await workbook.xlsx.load(buffer);

          let jsonData: IDataImport[] = [];
          workbook.worksheets.forEach(function (sheet) {
            let firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;

            let keys = firstRow.values as any[];
            sheet.eachRow((row, rowNumber) => {
              if (rowNumber == 1) return;
              let values = row.values as any;
              let obj: any = {};
              for (let i = 1; i < keys.length; i++) {
                obj[keys[i]] = values[i];
              }
              jsonData.push(obj);
            });
          });
          setDataImport(jsonData)(jsonData);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      "Dropped files", e.dataTransfer.files;
    },
  };
  const handleOk = async () => {
    setIsOpenBulk(false);
    const dataSubmit = dataImport.map((item) => ({
      ...item,
      password: import.meta.env.VITE_USER_DEFAULT_PASSWORD,
    }));
    const res = await bulkCreateUserAPI(dataSubmit);
    if (res.data) {
      notification.success({
        message: "Bulk Create Users",
        description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`,
      });
    }
    refreshTable();
    setDataImport([]);
  };

  const handleCancel = () => {
    setIsOpenBulk(false);
    setDataImport([]);
  };

  return (
    <>
      <Modal
        okText="Import Data"
        title="Import User"
        open={isOpenBulk}
        onOk={handleOk}
        onCancel={handleCancel}
        width={"50vw"}
        destroyOnClose={true}
        okButtonProps={{
          disabled: dataImport.length > 0 ? false : true,
        }}
      >
        <div className="mb-6">
          <Dragger {...upload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single file. Accepts .csv .xls .xlsx file type or
              <a
                className="text-blue-600"
                onClick={(e) => e.stopPropagation()}
                download
                href={templateFile}
              >
                {" "}
                Download file sample
              </a>
            </p>
          </Dragger>
        </div>
        <span className="ml-3">Dữ liệu upload: </span>
        <Table
          dataSource={dataImport}
          columns={[
            { dataIndex: "fullName", title: "Tên hiển thị" },
            { dataIndex: "email", title: "Email" },
            { dataIndex: "phone", title: "Số điện thoại" },
          ]}
        />
      </Modal>
    </>
  );
};

export default ModalAddUserBulk;
