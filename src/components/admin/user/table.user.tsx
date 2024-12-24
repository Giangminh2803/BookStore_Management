import { getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import UserDetail from './detail.user';

type TSearch = {
    fullName: string
    email: string
    createdAt: string
    createdAtRange: string
}



const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const [openDetail, setOpenDetail] = useState<boolean>(false)
    const [dataDetail, setDataDetail] = useState<IUser|null>(null)

    const handleOpenDetail = (dataUser: IUser) => {
        setOpenDetail(true)
        setDataDetail(dataUser)
        console.log(dataDetail)
    }
    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '_id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <a onClick={() => handleOpenDetail(entity)} className='cursor-pointer text-blue-600'>
                        {entity._id}
                    </a>
                )
            }
    
        },
        {
            title: 'Fullname',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
            
        },
        {
            title: 'Created At',
            hideInTable: true,
            valueType: 'dateRange',
            dataIndex: 'createdAtRange'
        },
        {
            title: 'Created At',
            hideInSearch: true,
            dataIndex: 'createdAt',
            sorter: true,
            render(dom, entity) {
                return (
                    <span >
                        {dayjs(entity.createdAt).format('DD-MM-YYYY')}
                    </span>
                )
            }
        },
        {
            hideInSearch: true,
            title: 'Action',
            render: () => <div className='flex gap-3 cursor-pointer'>
                <span><EditOutlined style={{ color: 'orange' }} /></span>
                <span><DeleteOutlined style={{ color: 'red' }} /></span>
    
            </div>
        },
    
    
    ];
    return (
        <>
        <UserDetail
        showDetail = {openDetail}
        setShowDetail={setOpenDetail}
        dataDetail={dataDetail}
        
        />
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered

                request={async (params, sort, filter) => {
                    console.log(params, sort)
                    let query = `current=${params.current}&pageSize=${params.pageSize}`
                    if (params.fullName) {
                        query += `&fullName=/${params.fullName}/i`
                    }
                    if (params.email) {
                        query += `&email=/${params.email}/i`
                    }
                    if(sort && sort.createdAt){
                        
                        query +=`&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    }

                    const date = dateRangeValidate(params.createdAtRange);
                    if (date) {
                        query += `&createdAt>=${date[0]}&createdAt<=${date[1]}`
                    }

                    const res = await getUsersAPI(query);
                    
                    if (res.data) {
                        setMeta(res.data.meta)
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}

                rowKey="_id"
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        pageSizeOptions: ['5', '10', '20', '50', '100'],
                        showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total}</div>) }
                    }
                }
                search={{
                    labelWidth: 'auto',
                }}
                options={{
                    setting: {
                        listsHeight: 400,
                    },
                }}
                form={{

                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}

                dateFormatter="string"
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    );
};

export default TableUser;