
import { Avatar, Badge, Descriptions, Drawer } from 'antd';
import { DescriptionsProps } from 'antd/lib';
import dayjs from 'dayjs';
import { FORMATE_DATE } from '@/services/helper';


type Props = {
    showDetail: boolean,
    setShowDetail: (v: boolean) => void,
    dataDetail: IUser | null,
}
const UserDetail = (props: Props) => {
    const { showDetail, setShowDetail, dataDetail } = props
    const avtURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataDetail?.avatar}`

    const showDrawer = () => {
        setShowDetail(true);
    };

    const onClose = () => {
        setShowDetail(false);
    };
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: <span className='text-blue-500'>{dataDetail?._id}</span>,
        },
        {
            key: '2',
            label: 'Email',
            children: dataDetail?.email,
        },
        {
            key: '3',
            label: 'Full name',
            children: dataDetail?.fullName,
        },

        {
            key: '5',
            label: 'Phone Number',
            children: dataDetail?.phone,

        },
        {
            key: '6',
            label: 'Role',
            children: <Badge status="processing" text={dataDetail?.role} />,
            span: 1,
        },
        {
            key: '6',
            label: 'Avatar',
            children: <Avatar src={avtURL} size={40} ></Avatar>,
            span: 1,
        },
        {
            key: '7',
            label: 'Status',
            children: <Badge status={dataDetail?.isActive === true ? "success" : "error"} text={dataDetail?.isActive === true ? "ACTIVATED" : "DEACTIVATED"} />,
        },
        {
            key: '7',
            label: 'Created At',
            children: dayjs(dataDetail?.createdAt).format(FORMATE_DATE)
        },


    ];
    return (
        <>
            <Drawer onClose={onClose} open={showDetail} width={'50%'}>
                <Descriptions title="User Info" bordered items={items} column={2} />
            </Drawer>
        </>
    );
};

export default UserDetail;