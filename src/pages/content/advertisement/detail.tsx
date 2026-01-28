import NewContainer from '@/components/NewContainer';
import WangEditor from '@/components/editor';
import {
  getAdvertisementInfo,
  saveAdvertisement,
} from '@/services/advertisement';
import {
  ProForm,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Card, Col, Row, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';

const AdvertisementDetail: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const [content, setContent] = useState<string>('');

  const initData = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    let id = searchParams.get('id') || 0;
    if (id === 'new') {
      id = 0;
      setDetail({ status: 1 });
    }
    if (id) {
      const res = await getAdvertisementInfo({ id: id });
      setDetail(res?.data || {});
      setContent(res?.data?.content || '');
    }
    setLoaded(true);
  };

  useEffect(() => {
    initData();
  }, []);

  const onSubmit = async (values: any) => {
    const data = { ...detail, ...values, content };
    if (!data.title) {
      message.error('请输入标题');
      return;
    }
    const res = await saveAdvertisement(data);
    if (res.code === 0) {
      message.success(res.msg || '保存成功');
      history.back();
    } else {
      message.error(res.msg || '保存失败');
    }
  };

  return (
    <NewContainer
      title={
        detail.id > 0
          ? '编辑广告'
          : '添加广告'
      }
    >
      <Card>
        {loaded && (
          <ProForm
            formRef={formRef}
            initialValues={detail}
            layout="horizontal"
            onFinish={onSubmit}
          >
            <Row gutter={20}>
              <Col sm={16} xs={24}>
                <ProFormText
                  name="title"
                  label="标题"
                  rules={[{ required: true, message: '请输入标题' }]}
                />
                <ProFormText
                  name="mark"
                  label="标识"
                />
                <ProForm.Item label="内容">
                  <WangEditor
                    className="mb-normal"
                    setContent={async (html) => {
                      setContent(html);
                    }}
                    content={content}
                    field="content"
                    ref={null}
                  />
                </ProForm.Item>
              </Col>
              <Col sm={8} xs={24}>
                <Card
                  className="aside-card"
                  size="small"
                  title="状态"
                >
                  <ProFormRadio.Group
                    name="status"
                    options={[
                      { label: '启用', value: 1 },
                      { label: '禁用', value: 0 },
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </ProForm>
        )}
      </Card>
    </NewContainer>
  );
};

export default AdvertisementDetail;
