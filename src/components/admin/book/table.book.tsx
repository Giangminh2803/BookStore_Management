import { deleteBooksAPI, getBooksAPI } from '@/services/api/book/book.api';
import { FORMATE_DATE } from '@/services/helper';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';


const TableBook = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0
  })

  const { message, notification } = App.useApp()

  const reloadTable = () => {
    actionRef.current?.reload()
  }
  const confirmDeleteBook = async (id: string) => {
    const res = await deleteBooksAPI(id)
    if (res.data) {
      message.success('Xoá sách thành công!')
      reloadTable()
    } else {
      notification.error({
        message: 'Có lỗi xảy ra!',
        description: res.error
      })
    }
  }
  const columns: ProColumns<IBookTable>[] = [

    {
      title: 'Id',
      dataIndex: '_id',
      ellipsis: true,
      search: false,
      render(_dom, entity) {
        return (
          <span className='text-blue-500 cursor-pointer'>{entity._id}</span>
        )
      },
    },
    {
      title: 'Tên sách',
      dataIndex: 'mainText',
      filters: true,
      onFilter: true,
      ellipsis: true,
      sorter: true
    },
    {

      title: 'Thể loại',
      dataIndex: 'category',
      hideInSearch: true


    },
    {
      title: 'Tác giả',
      key: 'author',
      dataIndex: 'author',

    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      hideInSearch: true,
      sorter: true,
      render(_dom, entity) {
        return (
          <span>{entity.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " đ̲"}</span>
        )
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'createdAt',
      key: 'option',
      sorter: true,
      hideInSearch: true,
      render(_dom, entity) {
        return (
          <span>
            {dayjs(entity.createdAt).format(FORMATE_DATE)}
          </span>
        )
      },
    },

    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      render: (_dom, entity) => <div className='flex gap-3 cursor-pointer'>
        <span >
          <EditOutlined style={{ color: 'orange' }} />


        </span>
        <span>
          <Popconfirm
            title="Xoá người dùng"
            description="Bạn có chắc chắn muốn xoá sách này không?"
            onConfirm={() => confirmDeleteBook(entity._id)}
            //  onCancel={cancel}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <DeleteOutlined style={{ color: 'red' }} />
          </Popconfirm>

        </span>

      </div>

    },
  ];
  return (
    <ProTable<IBookTable>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {

        console.log(sort, filter, params);
        let query = `current=${params.current}&pageSize=${params.pageSize}`

        if (params.mainText) {
          query += `&mainText=/${params.mainText}/i`
        }
        if (params.author) {
          query += `&author=/${params.author}/i`
        }
        if(sort.mainText){
          query += `&sort=${sort.mainText === 'ascend' ? "mainText" : "-mainText" }`
        }
        if(sort.price){
          query += `&sort=${sort.price === 'ascend' ? "price" : "-price" }`
        }
        if(sort.createdAt){
          query += `&sort=${sort.createdAt === 'ascend' ? "createdAt" : "-createdAt" }`
        }
        const res = await getBooksAPI(query)
        if (res.data) {
          setMeta(res.data.meta)
          // setDataCurrentTable(res.data.result)
        }
        
        return {
          data: res.data?.result,
          page: 1,
          success: true,
          total: res.data?.meta.total
        }

      }}

      rowKey="_id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}

      pagination={{
        current: meta.current,
        pageSize: meta.pageSize,
        showSizeChanger: true,
        total: meta.total,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total}</div>) }
      }}
      dateFormatter="string"
      headerTitle="Table Book"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          Thêm mới
        </Button>,
        // <Dropdown
        //   key="menu"
        //   menu={{
        //     items: [
        //       {
        //         label: '1st item',
        //         key: '1',
        //       },
        //       {
        //         label: '2nd item',
        //         key: '2',
        //       },
        //       {
        //         label: '3rd item',
        //         key: '3',
        //       },
        //     ],
        //   }}
        // >
        //   <Button>
        //     <EllipsisOutlined />
        //   </Button>
        // </Dropdown>,
      ]}
    />
  );
};

export default TableBook