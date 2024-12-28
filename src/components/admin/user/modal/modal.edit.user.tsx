
import { updateUserAPI } from '@/services/api/user/user.api';
import { App, Form, Input, Modal } from 'antd';
import { FormProps } from 'antd/lib';
import { useEffect } from 'react';

type FieldType = {
    email: string
    _id: string
    fullName: string
    phone: string
}
type Props = {
    showDetail: boolean,
    setShowDetail: (v: boolean) => void,
    dataDetail: IUser | null,
    setDataDetail: (v: IUser | null) => void,
    reload: () => void
}
const UpdateUser = (props: Props) => {
    const { showDetail, setShowDetail, dataDetail, setDataDetail, reload } = props
    const [form] = Form.useForm()
    const { message, notification } = App.useApp()
    useEffect(() => {
        if (dataDetail) {
            form.setFieldsValue({
                email: dataDetail.email,
                fullName: dataDetail.fullName,
                phone: dataDetail.phone,
                _id: dataDetail._id
            })
        }
    }, [dataDetail])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

        const { _id, fullName, phone } = values
        const res = await updateUserAPI(_id, fullName, phone)
        if (res && res.data) {
            message.success('Sửa thông tin thành công!')
            form.resetFields()
            reload()
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: "Thay đổi thông tin không thành công!"

            })
        }
        setShowDetail(false)
    }

    const onCancel = () => {
        form.resetFields()
        setDataDetail(null)
        setShowDetail(false)
    }

    return (
        <>
            <Modal
                title="Sửa thông tin người dùng"
                open={showDetail}
                onOk={() => { form.submit() }}
                onCancel={() => onCancel()}
                okText="Lưu thay đổi"
                cancelText="Huỷ"
            >
                <Form
                    form={form}
                    className='mt-6'
                    name="basic"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout={'vertical'}
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        initialValue={dataDetail?.email}
                        rules={[{ type: 'email', required: true, message: 'Vui lòng nhập Email!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        hidden
                        name="_id"

                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Tên hiển thị"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập Tên hiển thị!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
}


export default UpdateUser