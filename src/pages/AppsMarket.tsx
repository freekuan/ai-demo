import { useState } from 'react'
import { Modal, Tabs, DatePicker, Button, Table, Select, message, Typography, Badge } from 'antd'
import {
  ShopOutlined,
  CloudServerOutlined,
  ShoppingOutlined,
  RocketOutlined,
  AppstoreAddOutlined,
  CarOutlined,
  MessageOutlined,
  GiftOutlined,
  ToolOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import './AppsMarket.css'

const { RangePicker } = DatePicker
const { TabPane } = Tabs
const { Link } = Typography

export default function AppsMarket() {
  const [pushOrderVisible, setPushOrderVisible] = useState(false)
  const [syncInventoryVisible, setSyncInventoryVisible] = useState(false)
  
  const [pushOrderTab, setPushOrderTab] = useState('create')
  const [syncInventoryTab, setSyncInventoryTab] = useState('create')

  // 推送订单处理
  const handlePushOrderSave = () => {
    message.success({ content: '推送任务已创建', key: 'push_order' })
    setPushOrderTab('history')
  }

  // 同步库存处理
  const handleSyncInventorySave = () => {
    message.success({ content: '同步库存任务已创建', key: 'sync_inv' })
    setSyncInventoryTab('history')
  }

  // 推送订单表格列
  const pushOrderColumns = [
    { title: '任务ID', dataIndex: 'id', key: 'id' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
    { title: '同步状态', dataIndex: 'status', key: 'status' },
    { title: '失败原因', dataIndex: 'reason', key: 'reason' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ]

  // 同步库存表格列
  const syncInventoryColumns = [
    { title: '任务ID', dataIndex: 'id', key: 'id' },
    { title: '目标仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '同步状态', dataIndex: 'status', key: 'status' },
    { title: '失败原因', dataIndex: 'reason', key: 'reason' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ]

  return (
    <div className="apps-market-page">
      {/* 电商服务 */}
      <div className="apps-market-section">
        <div className="apps-market-section-title">电商服务</div>
        <div className="apps-grid">
          {/* 聚水潭 ERP */}
          <div className="app-card">
            <div className="app-card-badge">已开通</div>
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><CloudServerOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">聚水潭ERP</div>
                <div className="app-card-desc">小程序对接聚水潭ERP，实现订单履约</div>
              </div>
            </div>
            <div className="app-card-actions">
              <Button className="app-card-btn">功能设置</Button>
              <Link className="app-card-link" onClick={() => setPushOrderVisible(true)}>推送订单到ERP</Link>
              <Link className="app-card-link" onClick={() => setSyncInventoryVisible(true)}>同步商品库存</Link>
              <Link className="app-card-link">使用说明</Link>
            </div>
          </div>

          {/* 旺店通ERP */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><ShopOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">旺店通ERP</div>
                <div className="app-card-desc">小程序对接旺店通ERP，实现订单履约</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">联系客服</Button>
              <Link className="app-card-link">使用说明</Link>
            </div>
          </div>

          {/* 旺店通极速版 */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><RocketOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">旺店通极速版</div>
                <div className="app-card-desc">小程序对接旺店通极速版，实现订单履约</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">联系客服</Button>
              <Link className="app-card-link">使用说明</Link>
            </div>
          </div>

          {/* 吉客云ERP */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><CloudServerOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">吉客云ERP</div>
                <div className="app-card-desc">小程序对接吉客云ERP，实现订单履约</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">联系客服</Button>
              <Link className="app-card-link">使用说明</Link>
            </div>
          </div>

          {/* 网店管家ERP */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><ShoppingOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">网店管家ERP</div>
                <div className="app-card-desc">小程序对接网店管家ERP，实现订单履约</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">联系客服</Button>
              <Link className="app-card-link">使用说明</Link>
            </div>
          </div>

          {/* 快麦ERP */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo orange-bg"><RocketOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">快麦ERP</div>
                <div className="app-card-desc">小程序对接快麦ERP，实现订单履约</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">联系客服</Button>
              <Link className="app-card-link">使用说明</Link>
            </div>
          </div>

          {/* 管易ERP */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><CloudServerOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">管易ERP</div>
                <div className="app-card-desc">小程序对接管易ERP，实现订单履约</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">联系客服</Button>
              <Link className="app-card-link">使用说明</Link>
            </div>
          </div>

          {/* 万里牛ERP */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><ShopOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">万里牛ERP</div>
                <div className="app-card-desc">小程序对接万里牛ERP，实现订单履约</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">联系客服</Button>
              <Link className="app-card-link">使用说明</Link>
            </div>
          </div>

          {/* 权益商品供应链 */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><GiftOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">权益商品供应链</div>
                <div className="app-card-desc">聚合海量权益商品供商家使用，可作为积分兑换、抽奖等奖品</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">去使用</Button>
            </div>
          </div>

          {/* 物流查询 */}
          <div className="app-card">
            <div className="app-card-badge beta">未开启</div>
            <div className="app-card-header">
              <div className="app-card-logo cyan-bg"><CarOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">物流查询</div>
                <div className="app-card-desc">对接快递鸟实现订单物流轨迹查询</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">立即开启</Button>
            </div>
          </div>

          {/* 飞鹅订单助手 */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><MessageOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">飞鹅订单助手 <Badge count="限时免费" style={{ backgroundColor: '#f5222d', fontSize: '10px' }} /></div>
                <div className="app-card-desc">对接飞鹅小票打印机，实现自动接单打印功能</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">立即开通</Button>
            </div>
          </div>
          
          {/* 商家管家 */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo pink-bg"><ShoppingOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">商家管家</div>
                <div className="app-card-desc">支持商家第三方商品导入，快速开通小程序卖货</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">去使用</Button>
            </div>
          </div>

          {/* 上门取件 */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo blue-bg"><CarOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">上门取件</div>
                <div className="app-card-desc">用户在线退货，快递员上门收取包裹寄回商家</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">去使用</Button>
            </div>
          </div>

          {/* AI兴趣洞察 */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo orange-bg"><RobotOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">AI兴趣洞察</div>
                <div className="app-card-desc">新能力，无需训练，即刻拥有专属AI客服</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">去使用</Button>
            </div>
          </div>
        </div>
      </div>

      {/* 线下服务 */}
      <div className="apps-market-section">
        <div className="apps-market-section-title">线下服务</div>
        <div className="apps-grid">
          {/* 丽晶软件 */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo green-bg" style={{ backgroundColor: '#52c41a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}><ToolOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">丽晶软件</div>
                <div className="app-card-desc">线下服务类ERP软件，同步商品门店库存</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">配置信息</Button>
              <Link className="app-card-link">关联配置</Link>
            </div>
          </div>

          {/* 伯俊软件 */}
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-logo dark-bg"><AppstoreAddOutlined /></div>
              <div className="app-card-info">
                <div className="app-card-title">伯俊软件</div>
                <div className="app-card-desc">线下服务类ERP软件，同步商品门店库存</div>
              </div>
            </div>
            <div className="app-card-actions center">
              <Button className="app-card-btn">配置信息</Button>
              <Link className="app-card-link">关联配置</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 推送订单到ERP 弹窗 */}
      <Modal
        title="推送订单到ERP"
        open={pushOrderVisible}
        onCancel={() => setPushOrderVisible(false)}
        width={800}
        footer={null}
        destroyOnClose
        className="sync-modal-tabs"
      >
        <Tabs tabPosition="left" activeKey={pushOrderTab} onChange={setPushOrderTab}>
          <TabPane tab="创建任务" key="create">
            <div className="create-task-form">
              <div className="create-task-row">
                <div className="create-task-label">时间范围：</div>
                <div className="create-task-content">
                  <RangePicker showTime />
                </div>
              </div>
              <Button type="primary" onClick={handlePushOrderSave}>保存</Button>
            </div>
          </TabPane>
          <TabPane tab="历史任务" key="history">
            <Table
              className="history-task-table"
              columns={pushOrderColumns}
              dataSource={[]}
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: '暂无数据' }}
              rowKey="id"
            />
          </TabPane>
        </Tabs>
      </Modal>

      {/* 同步商品库存 弹窗 */}
      <Modal
        title="同步商品库存"
        open={syncInventoryVisible}
        onCancel={() => setSyncInventoryVisible(false)}
        width={800}
        footer={null}
        destroyOnClose
        className="sync-modal-tabs"
      >
        <Tabs tabPosition="left" activeKey={syncInventoryTab} onChange={setSyncInventoryTab}>
          <TabPane tab="创建任务" key="create">
            <div className="create-task-form">
              <div className="create-task-row">
                <div className="create-task-label">选择仓库：</div>
                <div className="create-task-content">
                  <Select
                    style={{ width: 200 }}
                    placeholder="请选择目标仓库"
                    options={[
                      { value: 'shanghai', label: '上海总仓' },
                      { value: 'beijing', label: '北京分仓' },
                      { value: 'guangzhou', label: '广州大仓' },
                    ]}
                  />
                  <div className="create-task-note">说明：仅同步该仓库的库存，保存后会进行全量同步，稍后可在历史任务中查看同步状态。</div>
                </div>
              </div>
              <Button type="primary" onClick={handleSyncInventorySave}>保存</Button>
            </div>
          </TabPane>
          <TabPane tab="历史任务" key="history">
            <Table
              className="history-task-table"
              columns={syncInventoryColumns}
              dataSource={[]}
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: '暂无数据' }}
              rowKey="id"
            />
          </TabPane>
        </Tabs>
      </Modal>

    </div>
  )
}
