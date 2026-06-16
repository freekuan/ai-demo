import { useState, useMemo } from 'react'
import {
  InputNumber,
  Switch,
  Button,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Table,
  Modal,
  Drawer,
  Input,
  Select,
  Form,
  message,
  Alert
} from 'antd'
import {
  SaveOutlined,
  TrophyOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
  SearchOutlined,
  PlusOutlined,
  LineChartOutlined,
  ControlOutlined
} from '@ant-design/icons'
import './LotteryRulesIntervention.css'

const { Title, Text, Paragraph } = Typography

// 奖品定义
interface Prize {
  id: number
  name: string
  prob: number // 中奖概率 %
  quantity: number // 剩余库存
  totalQuantity: number // 总库存
  type: 'real' | 'points' | 'redpacket' | 'none'
  color: string
}

const INITIAL_PRIZES: Prize[] = [
  { id: 1, name: '特步 椰子跑鞋', prob: 1.00, quantity: 10, totalQuantity: 30, type: 'real', color: '#ff4d4f' },
  { id: 2, name: '秋冬长袖防风外套', prob: 2.00, quantity: 15, totalQuantity: 50, type: 'real', color: '#ff7a45' },
  { id: 3, name: '100 会员积分', prob: 5.00, quantity: 100, totalQuantity: 1000, type: 'points', color: '#ffc53d' },
  { id: 4, name: '微信 10元红包', prob: 10.00, quantity: 200, totalQuantity: 5000, type: 'redpacket', color: '#ff85c0' },
  { id: 5, name: '10 会员积分', prob: 15.00, quantity: 1000, totalQuantity: 20000, type: 'points', color: '#bae637' },
  { id: 6, name: '5 会员积分', prob: 25.00, quantity: 5000, totalQuantity: 50000, type: 'points', color: '#36cfc9' },
  { id: 7, name: '1 会员积分', prob: 42.00, quantity: 20000, totalQuantity: 100000, type: 'points', color: '#40a9ff' },
]

// 抽奖活动对象
interface Activity {
  key: string
  name: string
  type: string
  status: 'running' | 'waiting' | 'ended'
  duration: string
  usersCount: number
  winnersCount: number
  createdAt: string
  syncStatus: boolean
  enableIntervention: boolean // 该活动是否已开启概率干预
}

const INITIAL_ACTIVITIES: Activity[] = [
  { key: '1', name: '特步会员惊喜大抽奖', type: '积分抽奖', status: 'running', duration: '永久', usersCount: 3, winnersCount: 1, createdAt: '2026-06-16 10:03:22', syncStatus: true, enableIntervention: false },
  { key: '2', name: '许愿抽抽乐·抢新品跑鞋', type: '转盘抽奖', status: 'running', duration: '永久', usersCount: 1, winnersCount: 1, createdAt: '2026-06-15 18:19:05', syncStatus: false, enableIntervention: true },
  { key: '3', name: '端午答题领红包活动', type: '积分抽奖', status: 'running', duration: '永久', usersCount: 1, winnersCount: 1, createdAt: '2026-06-15 17:20:42', syncStatus: true, enableIntervention: false },
  { key: '4', name: '618狂狂宠粉派发', type: '转盘抽奖', status: 'running', duration: '永久', usersCount: 1, winnersCount: 1, createdAt: '2026-06-15 09:47:22', syncStatus: false, enableIntervention: false },
  { key: '5', name: '常规会员裂变测试抽奖', type: '积分抽奖', status: 'running', duration: '永久', usersCount: 1, winnersCount: 1, createdAt: '2026-06-15 09:40:44', syncStatus: true, enableIntervention: false },
  { key: '6', name: '特步俱乐部线下抽大奖', type: '积分抽奖', status: 'ended', duration: '2026-02-03 至 2026-03-31', usersCount: 1, winnersCount: 1, createdAt: '2026-02-03 15:39:01', syncStatus: true, enableIntervention: false },
]

export default function LotteryRulesIntervention() {
  // ==========================================
  // 活动列表与基础状态
  // ==========================================
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES)
  const [searchName, setSearchName] = useState<string>('')
  const [searchStatus, setSearchStatus] = useState<string>('all')
  const [searchType, setSearchType] = useState<string>('all')

  // 当前编辑的活动及抽屉控制
  const [currentAct, setCurrentAct] = useState<Activity | null>(null)
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)

  // ==========================================
  // B端：干预配置属性状态 (基于当前编辑的活动)
  // ==========================================
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES)
  // 规则启用开关
  const [globalEnableIntervention, setGlobalEnableIntervention] = useState<boolean>(false)
  // 规则一配置 (非酋保底机制)
  const [enableRule1, setEnableRule1] = useState<boolean>(true)
  const [rule1N, setRule1N] = useState<number>(5) // 连续未中 N 次
  const [rule1X, setRule1X] = useState<number>(2) // 未中概率最低的前 X 顺位奖品
  const [rule1Y, setRule1Y] = useState<number>(3) // 强制从前 Y 顺位中随机派发一个

  // 规则二配置 (大奖限制/防刷机制)
  const [enableRule2, setEnableRule2] = useState<boolean>(true)
  const [rule2X, setRule2X] = useState<number>(2) // 已抽中过前 X 顺位奖品
  const [rule2Y, setRule2Y] = useState<number>(3) // 后续屏蔽前 Y 顺位奖品

  // ==========================================
  // 顺位排序计算 (中奖概率相同排序处理)
  // ==========================================
  const sortedPrizes = useMemo(() => {
    return [...prizes].sort((a, b) => {
      if (a.prob !== b.prob) {
        return a.prob - b.prob // 概率低排在前面（即顺位1、2等大奖）
      }
      return a.id - b.id // 概率相同时分配明确的唯一编号，避免规则判定重叠
    })
  }, [prizes])

  const totalProbability = useMemo(() => {
    return prizes.reduce((sum, p) => sum + p.prob, 0)
  }, [prizes])

  // ==========================================
  // 活动列表页逻辑
  // ==========================================
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchName = act.name.toLowerCase().includes(searchName.toLowerCase())
      const matchStatus = searchStatus === 'all' || act.status === searchStatus
      const matchType = searchType === 'all' || act.type === searchType
      return matchName && matchStatus && matchType
    })
  }, [activities, searchName, searchStatus, searchType])

  const handleOpenIntervention = (act: Activity) => {
    setCurrentAct(act)
    setGlobalEnableIntervention(act.enableIntervention)
    setPrizes(INITIAL_PRIZES)
    setDrawerVisible(true)
  }

  // ==========================================
  // 顺位范围文本生成函数（提取大奖名字）
  // ==========================================
  const rule1TargetPrizes = useMemo(() => sortedPrizes.slice(0, rule1X), [sortedPrizes, rule1X])
  const rule1RewardPrizes = useMemo(() => sortedPrizes.slice(0, rule1Y), [sortedPrizes, rule1Y])
  const rule2TriggerPrizes = useMemo(() => sortedPrizes.slice(0, rule2X), [sortedPrizes, rule2X])
  const rule2BlockPrizes = useMemo(() => sortedPrizes.slice(0, rule2Y), [sortedPrizes, rule2Y])

  // ==========================================
  // 全局干预启用开关与强合规警告弹窗
  // ==========================================
  const handleGlobalSwitchChange = (checked: boolean) => {
    if (checked) {
      Modal.confirm({
        title: '⚠️ 法律合规与安全风险提示',
        icon: <WarningOutlined style={{ color: '#ff4d4f', fontSize: 22 }} />,
        width: 520,
        centered: true,
        content: (
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6 }}>
            <p style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 14 }}>
              仅允许在 [内部员工测试] 或 [内测沙盒活动] 中启用概率干预规则！
            </p>
            <Paragraph style={{ color: '#595959' }}>
              根据中国<strong>《反不正当竞争法》</strong>及<strong>《规范促销行为暂行规定》</strong>，公开的商业性抽奖活动<strong>明确禁止欺骗性有奖销售</strong>，包括人为内定中奖、中途修改公开中奖概率、屏蔽大奖等。
            </Paragraph>
            <Paragraph style={{ color: '#595959' }}>
              外部活动必须严谨、透明、客观抽奖。确认仅将此规则应用于内部测试或非公开沙盒活动？
            </Paragraph>
          </div>
        ),
        okText: '确认开启 (仅内部测试可用)',
        cancelText: '取消',
        onOk: () => {
          setGlobalEnableIntervention(true)
          message.success('已开启干预规则配置。本活动已标记为内部测试模式。')
        },
        onCancel: () => {
          setGlobalEnableIntervention(false)
        }
      })
    } else {
      setGlobalEnableIntervention(false)
      message.info('已停用本活动的概率干预，活动恢复纯客观随机率。')
    }
  }

  const handleSaveDrawerSettings = () => {
    if (totalProbability > 100) {
      message.error(`保存失败：中奖概率之和 (${totalProbability}%) 超过 100%，请调整！`)
      return
    }

    if (currentAct) {
      setActivities(prev => prev.map(act => {
        if (act.key === currentAct.key) {
          return { ...act, enableIntervention: globalEnableIntervention }
        }
        return act
      }))
    }

    message.loading({ content: '正在保存概率干预配置...', key: 'save_act_rules' })
    setTimeout(() => {
      message.success({ content: '保存配置成功！', key: 'save_act_rules', duration: 2.5 })
      setDrawerVisible(false)
    }, 800)
  }

  // ==========================================
  // 表格列配置
  // ==========================================
  const activityColumns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Activity) => (
        <Space direction="vertical" size={2}>
          <strong style={{ color: '#262626' }}>{text}</strong>
          {record.enableIntervention && (
            <Tag color="orange" style={{ fontSize: 10, scale: 0.9, transformOrigin: 'left' }}>
              ⚠️ 概率干预已启用 (内部测试模式)
            </Tag>
          )}
        </Space>
      )
    },
    {
      title: '抽奖类型',
      dataIndex: 'type',
      key: 'type',
      width: 110,
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        if (status === 'running') return <Tag color="success">进行中</Tag>
        if (status === 'waiting') return <Tag color="processing">未开始</Tag>
        return <Tag color="default">已结束</Tag>
      }
    },
    {
      title: '活动有效期',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '抽奖人数',
      dataIndex: 'usersCount',
      key: 'usersCount',
      width: 100,
      render: (val: number) => <span className="stat-text-link">{val}</span>
    },
    {
      title: '中奖人数',
      dataIndex: 'winnersCount',
      key: 'winnersCount',
      width: 100,
      render: (val: number) => <span className="stat-text-link">{val}</span>
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: any, record: Activity) => (
        <Space size={12}>
          <a className="act-action-link">编辑</a>
          <a className="act-action-link">数据</a>
          <a className="act-action-link">推广</a>
          <Button
            size="small"
            type={record.enableIntervention ? 'default' : 'primary'}
            ghost={!record.enableIntervention}
            icon={<ControlOutlined />}
            onClick={() => handleOpenIntervention(record)}
            style={{ fontSize: 12, borderRadius: 4 }}
          >
            概率干预
          </Button>
        </Space>
      )
    }
  ]

  const prizeColumns = [
    {
      title: '概率顺位',
      dataIndex: 'rank',
      key: 'rank',
      width: 90,
      render: (_: any, record: Prize) => {
        const sortedIndex = sortedPrizes.findIndex(sp => sp.id === record.id) + 1
        return (
          <div className="rank-badge-cell">
            <span className={`rank-number-badge rank-${sortedIndex}`}>
              {sortedIndex}
            </span>
          </div>
        )
      }
    },
    {
      title: '奖品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Prize) => (
        <Space>
          <span>{text}</span>
          <Tag color={record.type === 'real' ? 'magenta' : record.type === 'points' ? 'orange' : 'volcano'} style={{ fontSize: 9 }}>
            {record.type === 'real' ? '实物' : record.type === 'points' ? '积分' : '红包'}
          </Tag>
        </Space>
      )
    },
    {
      title: '中奖概率',
      dataIndex: 'prob',
      key: 'prob',
      width: 130,
      render: (prob: number) => <span>{prob.toFixed(2)}%</span>
    },
    {
      title: '奖品剩余/库存',
      key: 'stock',
      width: 140,
      render: (_: any, record: Prize) => <span>{record.quantity} / {record.totalQuantity}</span>
    }
  ]

  return (
    <div className="lottery-intervention-container">
      
      {/* 头部导航/运营面包屑 */}
      <div className="intervention-header">
        <Space size={8} align="center">
          <TrophyOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>
            抽奖活动概率干预设置
          </Title>
        </Space>
        <Text type="secondary" className="header-desc">
          在这里可以浏览店铺内的全部抽奖活动。通过配置概率干预规则（保底规则与屏蔽规则），在内部测试和沙盒验证期间调试出奖逻辑。
        </Text>
      </div>

      {/* 一、活动数据看板卡片 */}
      <Row gutter={16} className="metrics-dashboard-row">
        <Col xs={24} md={8}>
          <div className="metric-card">
            <div className="card-info">
              <span className="metric-label">👤 抽奖总人数 (位)</span>
              <h2 className="metric-value">3</h2>
            </div>
            <LineChartOutlined className="metric-icon blue" />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="metric-card">
            <div className="card-info">
              <span className="metric-label">🎮 累计抽奖次数 (次)</span>
              <h2 className="metric-value">5</h2>
            </div>
            <TrophyOutlined className="metric-icon orange" />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="metric-card">
            <div className="card-info">
              <span className="metric-label">💵 实发红包总额 (元)</span>
              <h2 className="metric-value">0.3</h2>
            </div>
            <SafetyCertificateOutlined className="metric-icon red" />
          </div>
        </Col>
      </Row>

      {/* 二、列表过滤条件与查询栏 */}
      <div className="list-search-bar">
        <Form layout="inline" style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Form.Item label="活动名称" style={{ margin: 0 }}>
            <Input
              placeholder="请输入活动名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item label="活动状态" style={{ margin: 0 }}>
            <Select value={searchStatus} onChange={setSearchStatus} style={{ width: 120 }}>
              <Select.Option value="all">选择状态</Select.Option>
              <Select.Option value="running">进行中</Select.Option>
              <Select.Option value="ended">已结束</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="抽奖类型" style={{ margin: 0 }}>
            <Select value={searchType} onChange={setSearchType} style={{ width: 120 }}>
              <Select.Option value="all">选择类型</Select.Option>
              <Select.Option value="积分抽奖">积分抽奖</Select.Option>
              <Select.Option value="转盘抽奖">转盘抽奖</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ margin: 0, marginLeft: 'auto' }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button type="primary" icon={<PlusOutlined />} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                新建抽奖活动
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      {/* 三、活动列表主体 Table */}
      <div className="activities-table-wrapper">
        <Table
          dataSource={filteredActivities}
          columns={activityColumns}
          rowKey="key"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          size="middle"
          className="main-activities-table"
        />
      </div>

      {/* 四、概率干预配置抽屉 */}
      <Drawer
        title={
          <div className="drawer-header-title">
            <ControlOutlined style={{ marginRight: 6, color: '#1890ff' }} />
            <span>概率干预配置与规则控制 ➔ <span style={{ color: '#1890ff' }}>{currentAct?.name}</span></span>
          </div>
        }
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={720}
        destroyOnClose
        className="intervention-config-drawer"
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setDrawerVisible(false)} style={{ marginRight: 8 }}>取消</Button>
            <Button type="primary" onClick={handleSaveDrawerSettings} icon={<SaveOutlined />}>保存规则</Button>
          </div>
        }
      >
        {/* 全局开关启用区域 */}
        <div className="drawer-global-toggle-box">
          <div className="toggle-info">
            <strong className="toggle-title">开启概率干预规则</strong>
            <span className="toggle-desc">开启后规则方可生效，活动将被隔离于内部员工测试及沙盒测试中。</span>
          </div>
          <Switch
            checked={globalEnableIntervention}
            onChange={handleGlobalSwitchChange}
            checkedChildren="已启用"
            unCheckedChildren="已关闭"
            className="global-switch-toggle"
          />
        </div>

        {/* 若未开启全局开关的引导提示 */}
        {!globalEnableIntervention && (
          <Alert
            message="概率干预规则未开启"
            description="请先在上方开关处“开启概率干预规则”，经合规确认后，即可进行规则一和规则二的具体条件参数配置。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 奖品概率与顺位 */}
        <div className={`drawer-prizes-section ${!globalEnableIntervention ? 'disabled-section' : ''}`}>
          <div className="flex-align-center-between" style={{ marginBottom: 10 }}>
            <h4 className="section-title">一、当前奖品概率与顺位（由低到高排列）</h4>
          </div>

          <Table
            dataSource={prizes}
            columns={prizeColumns}
            rowKey="id"
            pagination={false}
            size="small"
            className="prize-rank-table"
          />
        </div>

        {/* 规则一：非酋防连续空车保底机制 */}
        <div className={`drawer-rule-card-wrap ${!globalEnableIntervention ? 'disabled-section' : ''}`}>
          <div className="rule-card-header">
            <div className="title-area">
              <GiftOutlined className="icon-blue" />
              <span className="title-text">二、规则一：非酋防连续空车保底机制</span>
            </div>
            <Switch
              checked={enableRule1}
              onChange={setEnableRule1}
              disabled={!globalEnableIntervention}
              size="small"
            />
          </div>

          {enableRule1 && globalEnableIntervention && (
            <div className="rule-card-body animate-slide-in">
              <div className="sentence-config-row">
                <span>当用户连续</span>
                <InputNumber
                  min={1}
                  max={99}
                  value={rule1N}
                  onChange={(val) => val && setRule1N(val)}
                  size="small"
                  className="inline-number-input"
                />
                <span>次未抽中概率最低的前</span>
                <InputNumber
                  min={1}
                  max={prizes.length}
                  value={rule1X}
                  onChange={(val) => val && setRule1X(val)}
                  size="small"
                  className="inline-number-input"
                />
                <span>顺位奖品时，下一次抽奖强制从前</span>
                <InputNumber
                  min={1}
                  max={prizes.length}
                  value={rule1Y}
                  onChange={(val) => val && setRule1Y(val)}
                  size="small"
                  className="inline-number-input"
                />
                <span>顺位奖品中随机派发一个。</span>
              </div>

              {/* 动态解释 */}
              <div className="explain-box success">
                <strong>💡 规则一简析：</strong>
                <div className="explain-desc">
                  当用户连续 <strong>{rule1N}</strong> 次未中大奖时，下一次抽奖将从保底池中随机必中派发一个。
                  <div style={{ marginTop: 6, fontSize: 11.5 }}>
                    🎯 <strong>判定大奖范围（前 {rule1X} 顺位）：</strong>
                    <span style={{ color: '#cf1322', fontWeight: 600 }}>
                      {rule1TargetPrizes.map(p => p.name).join('、') || '无'}
                    </span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 11.5 }}>
                    🎁 <strong>保底派发池（前 {rule1Y} 顺位）：</strong>
                    <span style={{ color: '#389e0d', fontWeight: 600 }}>
                      {rule1RewardPrizes.map(p => p.name).join('、') || '无'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 规则二：大奖出货上限限制 */}
        <div className={`drawer-rule-card-wrap ${!globalEnableIntervention ? 'disabled-section' : ''}`}>
          <div className="rule-card-header">
            <div className="title-area">
              <WarningOutlined className="icon-orange" />
              <span className="title-text">三、规则二：大奖出货上限限制（防刷/防薅羊毛）</span>
            </div>
            <Switch
              checked={enableRule2}
              onChange={setEnableRule2}
              disabled={!globalEnableIntervention}
              size="small"
            />
          </div>

          {enableRule2 && globalEnableIntervention && (
            <div className="rule-card-body animate-slide-in">
              <div className="sentence-config-row">
                <span>当用户已抽中过前</span>
                <InputNumber
                  min={1}
                  max={prizes.length}
                  value={rule2X}
                  onChange={(val) => val && setRule2X(val)}
                  size="small"
                  className="inline-number-input"
                />
                <span>顺位奖品时，后续抽奖将自动屏蔽并无法抽中前</span>
                <InputNumber
                  min={1}
                  max={prizes.length}
                  value={rule2Y}
                  onChange={(val) => val && setRule2Y(val)}
                  size="small"
                  className="inline-number-input"
                />
                <span>顺位奖品。</span>
              </div>

              {/* 动态解释 */}
              <div className="explain-box error">
                <strong>💡 规则二简析：</strong>
                <div className="explain-desc">
                  当用户抽中过触发大奖时，后续抽奖将自动屏蔽屏蔽池内的大奖，防止重复出货。
                  <div style={{ marginTop: 6, fontSize: 11.5 }}>
                    ⚠️ <strong>触发大奖范围（前 {rule2X} 顺位）：</strong>
                    <span style={{ color: '#d4380d', fontWeight: 600 }}>
                      {rule2TriggerPrizes.map(p => p.name).join('、') || '无'}
                    </span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 11.5 }}>
                    🚫 <strong>后续屏蔽大奖（前 {rule2Y} 顺位）：</strong>
                    <span style={{ color: '#595959', fontWeight: 600, textDecoration: 'line-through' }}>
                      {rule2BlockPrizes.map(p => p.name).join('、') || '无'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 异常与超限降级声明 (通用化描述，增加后续修改影响提醒) */}
        {globalEnableIntervention && (
          <div className="drawer-inventory-fallback-notice">
            <h4 className="notice-title">
              <WarningOutlined style={{ marginRight: 6 }} />
              概率干预规则执行异常提示
            </h4>
            <div className="notice-text">
              <p style={{ margin: '0 0 6px 0' }}>
                1. <strong>库存与客观限制：</strong>由于奖品剩余库存不足、单用户领奖频次受限或并发扣减延迟等客观物理原因，概率干预规则在触发时<strong>并非 100% 能够成功执行</strong>。若保底或非屏蔽池内奖品已全部消耗完毕，系统将自动降级为常规随机派奖或兜底普发奖品。
              </p>
              <p style={{ margin: 0 }}>
                2. <strong>奖品库变更影响：</strong>本干预规则的顺位完全基于当前奖品库的中奖概率升序排列自动分派。<strong>后续若在其他奖品设置页中修改了任意奖品的概率、增删了奖品种类或调整了奖品库存</strong>，均会直接使当前顺位划分发生漂移或覆盖，可能导致干预规则的执行偏离预期。建议每次调整奖品库后，务必重新检查并在此点击保存规则。
              </p>
            </div>
          </div>
        )}
      </Drawer>

    </div>
  )
}
