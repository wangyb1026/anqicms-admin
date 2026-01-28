import NewContainer from '@/components/NewContainer';
import {
  deleteAdvertisement,
  getAdvertisementList,
} from '@/services/advertisement';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl } from '@umijs/max';
import { Button, Modal, Space, Tag, message } from 'antd';
import React, { useRef, useState } from 'react';
import './index.less';
import dayjs from 'dayjs';

const AdvertisementList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [newKey, setNewKey] = useState<string>('');
  const intl = useIntl();

  const onTabChange = (key: string) => {
    setNewKey(key);
  };

  const handleRemove = async (ids: any[]) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'content.delete.confirm' }),
      onOk: async () => {
        const hide = message.loading(
          intl.formatMessage({ id: 'content.delete.deletting' }),
          0,
        );
        try {
          for (const id of ids) {
            await deleteAdvertisement({ id });
          }
          hide();
          message.success(intl.formatMessage({ id: 'content.delete.success' }));
          setSelectedRowKeys([]);
          actionRef.current?.reloadAndRest?.();
          return true;
        } catch (error) {
          hide();
          message.error(intl.formatMessage({ id: 'content.delete.failure' }));
          return true;
        }
      },
    });
  };

  const handleEdit = async (record: any) => {
    history.push('/archive/advertisement/detail?id=' + (record.id || 'new'));
  };

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 180,
    },
    {
      title: '标识',
      dataIndex: 'mark',
      width: 120,
    },
    {
      title: '内容',
      dataIndex: 'content',
      hideInSearch: true,
      width: 300,
      render: (text: any) => (
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          style={{ maxHeight: '100px', overflowY: 'auto' }}
        />
      ),
    },
    {
      title: '创建时间',
      hideInSearch: true,
      width: 160,
      render: (_, record) =>
          dayjs(record.created_time * 1000).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        0: {
          text: '禁用',
          status: 'Error',
        },
        1: {
          text: '启用',
          status: 'Success',
        },
      },
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'setting.action' }),
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      render: (_, record) => (
        <Space size={20}>
          <a
            key="edit"
            onClick={() => {
              handleEdit(record);
            }}
          >
            <FormattedMessage id="setting.action.edit" />
          </a>
          <a
            className="text-red"
            key="delete"
            onClick={() => {
              handleRemove([record.id]);
            }}
          >
            <FormattedMessage id="setting.system.delete" />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <NewContainer onTabChange={onTabChange}>
      <ProTable<any>
        key={newKey}
        headerTitle="广告管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => {
              handleEdit({});
            }}
          >
            <PlusOutlined /> <FormattedMessage id="content.advertisement.add" />
          </Button>,
        ]}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space>
            <Button
              size={'small'}
              onClick={() => {
                handleRemove(selectedRowKeys);
              }}
            >
              <FormattedMessage id="content.option.batch-delete" />
            </Button>
            <Button type="link" size={'small'} onClick={onCleanSelected}>
              <FormattedMessage id="content.option.cancel-select" />
            </Button>
          </Space>
        )}
        request={(params) => {
          return getAdvertisementList(params);
        }}
        columnsState={{
          persistenceKey: 'advertisement-table',
          persistenceType: 'localStorage',
        }}
        columns={columns}
        rowSelection={{
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </NewContainer>
  );
};

export default AdvertisementList;
