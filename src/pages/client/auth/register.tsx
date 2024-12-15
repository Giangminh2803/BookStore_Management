import { LoginAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { useState } from 'react';

type FieldType = {
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
};



const RegisterPage = () => {
    const [isSubmit, setIsSubmit ] = useState<boolean>(false);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        console.log('Success:', values);
        setIsSubmit(false);
        const res = await LoginAPI("admin@gmail.com", "1234561");
        console.log(res);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        
    };
    return (
        <div className='flex justify-center mt-5'>
            <div className='p-8 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 w-1/3'>
                <div className='text-3xl font-semibold'>Register Account</div>
                <hr className='my-5' />

                <Form
                    name="basic"
                    labelCol={{ span: 12 }}
                    layout={"vertical"}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Phone number"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" loading = {isSubmit}>
                            Register
                        </Button>
                        <Divider>Or</Divider>
                        <span className='flex justify-center'>already have an account ?<a href='/login' className='text-blue-500 ml-1'>Login</a></span>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default RegisterPage