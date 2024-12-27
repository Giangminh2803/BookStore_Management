import { createUserAPI } from '@/services/api'
import { App, Form, Input, Modal } from 'antd'
import { FormProps } from 'antd/lib'

type Props = {
    show: boolean,
    setShow: (v: boolean) => void,
    reload: () => void,
}

type FieldType = {
    email: string
    password: string
    fullName: string
    phone: string
}

const ModalUser = (props: Props) => {
    const { show, setShow, reload } = props
    const [form] = Form.useForm()
    const { message, notification } = App.useApp()
    

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values)
        const { email, password, fullName, phone } = values
        const user = await createUserAPI(email, password, fullName, phone)
        if (user && user.data) {
            message.success('Tạo mới user thành công!')
            form.resetFields()
            reload()

        } else {
            notification.error({
                message: "Đã có lỗi!",
                description: user.message
            })
        }
        setShow(false)
    }

    const onCancel = () => {
        form.resetFields()
        setShow(false)
    }

    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={show}
                onOk={() => { form.submit() }}
                onCancel={() => onCancel()}
                okText="Tạo mới"
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
                        rules={[{ type: 'email', required: true, message: 'Vui lòng nhập Email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password />
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

export default ModalUser