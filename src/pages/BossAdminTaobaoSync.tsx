import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Tag, message, Tabs, Tooltip, Row, Col, Drawer } from 'antd';
import { SyncOutlined, PlusOutlined, UserOutlined, ShopOutlined, InfoCircleOutlined, LeftOutlined, EllipsisOutlined, EditOutlined, InboxOutlined, RobotOutlined } from '@ant-design/icons';
import './BossAdminTaobaoSync.css';

export default function BossAdminTaobaoSync() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [form] = Form.useForm();
  const shopIdValue = Form.useWatch('shopId', form);
  
  // Mock data for the table
  const [tasks, setTasks] = useState([
    {
      id: 'TASK-20260810-001',
      shopId: '62224542',
      productCount: 12,
      successCount: 12,
      status: 'success',
      createTime: '2026-08-10 09:30:00',
      finishTime: '2026-08-10 09:35:12',
    },
    {
      id: 'TASK-20260810-002',
      shopId: '12345678',
      productCount: 85,
      successCount: 40,
      status: 'syncing',
      createTime: '2026-08-10 10:15:00',
      finishTime: '-',
    },
    {
      id: 'TASK-20260809-001',
      shopId: '98765432',
      productCount: 3,
      successCount: 0,
      status: 'failed',
      createTime: '2026-08-09 16:20:00',
      finishTime: '2026-08-09 16:21:00',
      errorMsg: '第三方接口超时',
    }
  ]);

  const columns = [
    {
      title: '任务编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '店铺信息',
      dataIndex: 'shopId',
      key: 'shopId',
      render: (text: string) => (
        <a href={`https://shop${text}.taobao.com`} target="_blank" rel="noreferrer">
          <ShopOutlined /> {text}
        </a>
      )
    },
    {
      title: '商品数量',
      dataIndex: 'productCount',
      key: 'productCount',
    },
    {
      title: '同步成功数',
      dataIndex: 'successCount',
      key: 'successCount',
      render: (val: number) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{val}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => {
        if (status === 'success') return <Tag color="success">同步成功</Tag>;
        if (status === 'syncing') return <Tag color="processing" icon={<SyncOutlined spin />}>同步中</Tag>;
        if (status === 'failed') return <Tooltip title={record.errorMsg}><Tag color="error">同步失败 <InfoCircleOutlined /></Tag></Tooltip>;
        return <Tag>{status}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => {
            setSelectedTask(record);
            setIsDetailVisible(true);
          }}>
            查看明细
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateTask = () => {
    form.validateFields().then(values => {
      const productIds = values.productIds.split('\n').filter((id: string) => id.trim() !== '');
      
      if (productIds.length > 200) {
        message.error('商品ID一次最多只能填写200个');
        return;
      }
      
      const newTask = {
        id: `TASK-20260810-${String(tasks.length + 1).padStart(3, '0')}`,
        shopId: values.shopId,
        productCount: productIds.length,
        successCount: 0,
        status: 'syncing',
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        finishTime: '-',
      };
      
      setTasks([newTask, ...tasks]);
      message.success(`成功创建任务，共包含 ${productIds.length} 个商品`);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // Mock Tabs for the sub-menu layout
  const subMenuTabs = [
    { key: '1', label: '高级客管' },
    { key: '2', label: '增值模块' },
    { key: '3', label: 'AI电话' },
    { key: '4', label: 'CDP' },
    { key: '5', label: '红包营销' },
    { key: '6', label: '会话存档' },
    { key: '7', label: '样品引流' },
    { key: '8', label: '手机号快速验证' },
    { key: '9', label: '人脸校验验证' },
    { key: '10', label: '电商ERP' },
    { key: '11', label: '通知' },
    { key: '12', label: '触警技术服务费' },
    { key: '13', label: '星云群控' },
    { key: '14', label: '星云AI' },
    { key: '15', label: 'AI兴趣洞察' },
    { key: '16', label: '小店增值服务' },
    { key: '17', label: '淘宝商品同步' },
    { key: '18', label: '第三方系统' },
  ];

  return (
    <div className="boss-admin-layout">
      {/* 顶部客户信息概览 (参考截图) */}
      <div className="boss-header">
        <div className="boss-header-title">
          <LeftOutlined style={{ marginRight: 8, cursor: 'pointer' }} />
          <h2>星云咨询管理</h2>
          <Space style={{ marginLeft: 'auto' }}>
            <Button size="small">红豆余额充值</Button>
            <Button size="small">达仁充值</Button>
            <Button size="small">开通答疑宝</Button>
            <Button size="small">信息反馈</Button>
            <Button size="small" icon={<EllipsisOutlined />} />
          </Space>
        </div>
        <Row className="boss-header-stats">
          <Col span={4}>
            <div className="stat-label">跟进人</div>
            <div className="stat-value"><UserOutlined /> 李四</div>
          </Col>
          <Col span={4}>
            <div className="stat-label">行业</div>
            <div className="stat-value">生鲜达人/全品类 <EditOutlined /></div>
          </Col>
          <Col span={4}>
            <div className="stat-label">用户标签</div>
            <div className="stat-value"><EditOutlined /></div>
          </Col>
          <Col span={8}>
            <div className="stat-label">最近登录时间</div>
            <div className="stat-value">2026-08-10 10:10:59</div>
          </Col>
        </Row>
        <Row className="boss-header-stats" style={{ marginTop: 12 }}>
          <Col span={4}>
            <div className="stat-label">员工数</div>
            <div className="stat-value">40</div>
          </Col>
          <Col span={4}>
            <div className="stat-label">客户数</div>
            <div className="stat-value">152</div>
          </Col>
          <Col span={4}>
            <div className="stat-label">客单均价</div>
            <div className="stat-value">125</div>
          </Col>
        </Row>
      </div>

      <div className="customer-journey-section">
        <h3>客户旅程 <Button size="small" style={{ float: 'right' }}>添加旅程</Button></h3>
        <div className="empty-journey">
          <InboxOutlined style={{ fontSize: 32, color: '#d9d9d9' }} />
          <div>暂无数据</div>
        </div>
      </div>

      {/* 主导航 Tab */}
      <div className="main-tabs-container">
        <Tabs defaultActiveKey="5">
          <Tabs.TabPane tab="基本信息" key="1" />
          <Tabs.TabPane tab="客户记录" key="2" />
          <Tabs.TabPane tab="关联订单" key="3" />
          <Tabs.TabPane tab="关联合同" key="4" />
          <Tabs.TabPane tab="沟通管理" key="5" />
        </Tabs>
        <Button type="link" size="small" className="ai-summary-btn" icon={<RobotOutlined />}>召唤AI为我总结 (BETA)</Button>
      </div>

      {/* 子导航 Tab */}
      <div className="sub-tabs-container">
        <Tabs 
          defaultActiveKey="17" 
          items={subMenuTabs} 
          tabBarGutter={16}
          size="small"
        />
      </div>

      {/* 淘宝商品同步 主要内容 */}
      <div className="taobao-sync-content">
        <div className="sync-header">
          <h3>淘宝商品搬家任务</h3>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            新建同步任务
          </Button>
        </div>
        
        <div className="sync-info-alert">
          <InfoCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          <span>由于接口权限限制，目前商品同步通过第三方数据接口进行。创建任务后系统会在后台异步处理，请耐心等待。</span>
        </div>

        <Table 
          columns={columns} 
          dataSource={tasks} 
          rowKey="id" 
          pagination={{ defaultPageSize: 10, showSizeChanger: true }}
          className="sync-table"
        />
      </div>

      <Modal
        title="新建淘宝商品同步任务"
        open={isModalVisible}
        onOk={handleCreateTask}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="创建任务"
        cancelText="取消"
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="shopId"
            label="目标店铺 ID"
            rules={[{ required: true, message: '请输入店铺ID' }]}
            extra={
              shopIdValue ? (
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <div style={{ color: '#8c8c8c' }}>
                    店铺链接：<a href={`https://shop${shopIdValue}.taobao.com`} target="_blank" rel="noreferrer">https://shop{shopIdValue}.taobao.com</a>
                  </div>
                  <div style={{ color: '#faad14', marginTop: 2, fontSize: 12 }}>
                    * 请点击后核对店铺准确性
                  </div>
                </div>
              ) : null
            }
          >
            <Input placeholder="请输入目标淘宝店铺ID" prefix={<ShopOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />
          </Form.Item>
          
          <Form.Item
            name="productIds"
            label={
              <span>
                淘宝商品 ID 集合 
                <span style={{ color: '#8c8c8c', marginLeft: 8, fontSize: 12, fontWeight: 'normal' }}>
                  (最多200个)
                </span>
              </span>
            }
            rules={[{ required: true, message: '请输入至少一个商品ID' }]}
          >
            <Input.TextArea 
              rows={6} 
              placeholder="请输入淘宝商品ID，支持批量输入。多个ID之间请用换行分隔。"
            />
          </Form.Item>
          
          <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: -12, marginBottom: 16 }}>
            提示：搬家任务创建后，系统将自动抓取商品标题、主图、详情图及SKU信息（可能不包含部分受限字段）。
          </div>
        </Form>
      </Modal>
      <Drawer
        title={`任务明细 - ${selectedTask?.id || ''}`}
        placement="right"
        width={500}
        onClose={() => setIsDetailVisible(false)}
        open={isDetailVisible}
      >
        {selectedTask && (
          <Table
            dataSource={Array.from({ length: selectedTask.productCount }).map((_, i) => ({
              id: i,
              productId: `ITEM-${selectedTask.id.slice(-3)}${String(i).padStart(4, '0')}`,
              status: i < selectedTask.successCount ? 'success' : 'error'
            }))}
            rowKey="id"
            pagination={{ pageSize: 15 }}
            size="small"
            columns={[
              { title: '商品ID', dataIndex: 'productId', key: 'productId' },
              { 
                title: '状态', 
                dataIndex: 'status', 
                key: 'status', 
                render: (status) => status === 'success' ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag> 
              },
              { 
                title: '操作', 
                key: 'action', 
                render: (_, record) => record.status === 'error' ? <Button type="link" size="small">重试</Button> : null 
              }
            ]}
          />
        )}
      </Drawer>
    </div>
  );
}
