import { useState, useMemo } from 'react'
import {
  InputNumber,
  Radio,
  Switch,
  Button,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Table,
  Alert,
  Modal,
  Drawer,
  Input,
  Select,
  Form,
  message,
  Slider
} from 'antd'
import {
  ReloadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  LineChartOutlined,
  ControlOutlined
} from '@ant-design/icons'
import './LotteryRulesIntervention.css'

const { Title, Text, Paragraph } = Typography

// 初始奖品定义
interface Prize {
  id: number
  name: string
  prob: number // 中奖概率 %
  quantity: number
  type: 'real' | 'points' | 'redpacket' | 'none'
  color: string
}

const INITIAL_PRIZES: Prize[] = [
  { id: 1, name: '特步 椰子跑鞋', prob: 1.00, quantity: 5, type: 'real', color: '#ff4d4f' },
  { id: 2, name: '秋冬长袖防风外套', prob: 2.00, quantity: 15, type: 'real', color: '#ff7a45' },
  { id: 3, name: '100 会员积分', prob: 5.00, quantity: 100, type: 'points', color: '#ffc53d' },
  { id: 4, name: '微信 10元红包', prob: 10.00, quantity: 200, type: 'redpacket', color: '#ff85c0' },
  { id: 5, name: '10 会员积分', prob: 15.00, quantity: 1000, type: 'points', color: '#bae637' },
  { id: 6, name: '5 会员积分', prob: 25.00, quantity: 5000, type: 'points', color: '#36cfc9' },
  { id: 7, name: '1 会员积分', prob: 42.00, quantity: 20000, type: 'points', color: '#40a9ff' },
]

// 模拟抽奖活动对象
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
  { key: '4', name: '618狂欢宠粉派发', type: '转盘抽奖', status: 'running', duration: '永久', usersCount: 1, winnersCount: 1, createdAt: '2026-06-15 09:47:22', syncStatus: false, enableIntervention: false },
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
  // C端：沙盒模拟器状态
  // ==========================================
  const [simModalVisible, setSimModalVisible] = useState<boolean>(false)
  const [simConsecutiveLosses, setSimConsecutiveLosses] = useState<number>(0)
  const [simHasWonGrand, setSimHasWonGrand] = useState<boolean>(false)
  const [simAccountType, setSimAccountType] = useState<'test' | 'visitor'>('test')
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [drawResultModalVisible, setDrawResultModalVisible] = useState<boolean>(false)
  const [drawResult, setDrawResult] = useState<{ prize: Prize; 干预类型: 'none' | 'rule1' | 'rule2' } | null>(null)

  // ==========================================
  // 顺位消重与排序计算 (中奖概率相同排序处理)
  // ==========================================
  // 核心逻辑：按概率升序排列。如果概率完全相同，则增加副排序条件 (按 id 升序)
  // 这样每个奖品在数学上和系统处理上都有一个唯一不重合的“概率顺位”
  const sortedPrizes = useMemo(() => {
    return [...prizes].sort((a, b) => {
      if (a.prob !== b.prob) {
        return a.prob - b.prob // 概率低排在前面（即顺位1、2等大奖）
      }
      // 概率相同时，以 id 降序或升序作为明确的第二顺位排序规则
      return a.id - b.id
    })
  }, [prizes])

  // 检测是否存在中奖概率完全一致的奖品
  const hasDuplicateProbabilities = useMemo(() => {
    const probs = prizes.map(p => p.prob)
    const uniqueProbs = new Set(probs)
    return uniqueProbs.size !== probs.length
  }, [prizes])

  // 九宫格的8个奖品排列位置顺序 (外圈顺时针，中间是开始抽奖)
  const gridPrizes = useMemo(() => {
    const totalProb = prizes.reduce((sum, p) => sum + p.prob, 0)
    const noneProb = Math.max(0, 100 - totalProb)
    const nonePrize: Prize = {
      id: 99,
      name: '谢谢参与',
      prob: Number(noneProb.toFixed(2)),
      quantity: 99999,
      type: 'none',
      color: '#bfbfbf'
    }
    const items = [...prizes]
    if (items.length < 8) {
      items.push(nonePrize)
    }
    while (items.length < 8) {
      items.push({
        id: 100 + items.length,
        name: '幸运奖品',
        prob: 0,
        quantity: 0,
        type: 'none',
        color: '#bfbfbf'
      })
    }
    return items
  }, [prizes])

  // 规则一/二关联顺位奖品范围计算
  const rule1TargetPrizes = useMemo(() => sortedPrizes.slice(0, rule1X), [sortedPrizes, rule1X])
  const rule1RewardPrizes = useMemo(() => sortedPrizes.slice(0, rule1Y), [sortedPrizes, rule1Y])
  const rule2TriggerPrizes = useMemo(() => sortedPrizes.slice(0, rule2X), [sortedPrizes, rule2X])
  const rule2BlockPrizes = useMemo(() => sortedPrizes.slice(0, rule2Y), [sortedPrizes, rule2Y])

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
    // 模拟针对不同活动加载不同的概率设置，这里加载默认奖品数据
    setPrizes(INITIAL_PRIZES)
    setDrawerVisible(true)
  }

  // ==========================================
  // 全局干预启用开关与强合规警告弹窗
  // ==========================================
  const handleGlobalSwitchChange = (checked: boolean) => {
    if (checked) {
      // 开启开关时触发强模态弹窗说明
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
              根据中国<strong>《反不正当竞争法》</strong>第十条及<strong>《规范促销行为暂行规定》</strong>第十五条，公开的商业性抽奖活动<strong>明确禁止欺骗性有奖销售</strong>，包括但不限于以下行为：
            </Paragraph>
            <ul style={{ paddingLeft: 18, color: '#ff4d4f', margin: '8px 0' }}>
              <li><strong>人为操纵、内定中奖人员；</strong></li>
              <li><strong>中途故意修改公开宣称的中奖概率；</strong></li>
              <li><strong>恶意屏蔽、剔除已公示的大奖；</strong></li>
            </ul>
            <Paragraph style={{ color: '#595959' }}>
              外部公开的商业活动必须保持纯粹、客观、完全随机抽奖。本系统的概率干预功能仅供内部测试账号在沙盒环境下进行防空车与极限出货测试。开启后请勿将活动直接公开对外！
            </Paragraph>
            <Text type="secondary" style={{ fontSize: 11 }}>
              系统将自动为本活动打上 [内部沙盒内测] 的标签隔离标识，仅对测试白名单账号生效。
            </Text>
          </div>
        ),
        okText: '已悉知法条，确认仅用于内部测试',
        cancelText: '取消开启',
        onOk: () => {
          setGlobalEnableIntervention(true)
          message.success('已开启干预规则配置。当前活动已被标记为 [内部测试沙盒] 模式。')
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

  const handleProbabilityChange = (id: number, val: number | null) => {
    if (val === null) return
    setPrizes(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, prob: val }
      }
      return p
    }))
  }

  const handleSaveDrawerSettings = () => {
    if (totalProbability > 100) {
      message.error(`保存失败：中奖概率之和 (${totalProbability}%) 超过 100%，请调整！`)
      return
    }

    // 更新列表里的活动干预状态
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
      message.success({ content: '保存配置成功！干预配置已被应用至该抽奖活动中。', key: 'save_act_rules', duration: 2.5 })
      setDrawerVisible(false)
    }, 800)
  }

  // ==========================================
  // C端模拟抽奖核心逻辑
  // ==========================================
  const executeMockDraw = () => {
    if (isDrawing) return
    setIsDrawing(true)
    setDrawResult(null)

    let selectedPrize: Prize
    let 干预类型: 'none' | 'rule1' | 'rule2' = 'none'

    const totalProb = prizes.reduce((sum, p) => sum + p.prob, 0)
    const noneProb = Math.max(0, 100 - totalProb)
    const nonePrize: Prize = { id: 99, name: '谢谢参与', prob: noneProb, quantity: 99999, type: 'none', color: '#bfbfbf' }

    // 只有在【内测账号】且全局干预开启时，才执行干预
    const isInterventionApplicable = globalEnableIntervention && simAccountType === 'test'

    // 规则 2 优先级校验：屏蔽前 Y 顺位奖品
    let activePrizePool = [...prizes]
    if (isInterventionApplicable && enableRule2 && simHasWonGrand) {
      const blockedIds = rule2BlockPrizes.map(bp => bp.id)
      activePrizePool = activePrizePool.filter(p => !blockedIds.includes(p.id))
      干预类型 = 'rule2'
    }

    let activeTotalProb = activePrizePool.reduce((sum, p) => sum + p.prob, 0) + (activePrizePool.length === prizes.length ? noneProb : 0)

    // 规则 1 校验：连续 N 次未中，保底发放
    if (isInterventionApplicable && enableRule1 && simConsecutiveLosses >= rule1N) {
      let rewardPool = rule1RewardPrizes.filter(rp => activePrizePool.some(ap => ap.id === rp.id))
      if (rewardPool.length === 0) {
        rewardPool = rule1RewardPrizes
      }

      const poolWeight = rewardPool.reduce((sum, p) => sum + p.prob, 0)
      const rand = Math.random() * poolWeight
      let accumulated = 0
      selectedPrize = rewardPool[rewardPool.length - 1]
      for (const p of rewardPool) {
        accumulated += p.prob
        if (rand <= accumulated) {
          selectedPrize = p
          break
        }
      }
      干预类型 = 'rule1'
    } else {
      // 正常抽奖
      const rand = Math.random() * 100
      let accumulated = 0
      selectedPrize = nonePrize

      for (const p of activePrizePool) {
        accumulated += p.prob
        if (rand <= accumulated) {
          selectedPrize = p
          break
        }
      }

      if (selectedPrize.id === 99 && noneProb === 0 && activeTotalProb > 0) {
        const innerRand = Math.random() * activeTotalProb
        let innerAccum = 0
        for (const p of activePrizePool) {
          innerAccum += p.prob
          if (innerRand <= innerAccum) {
            selectedPrize = p
            break
          }
        }
      }
    }

    const winIdInGrid = gridPrizes.findIndex(gp => gp.id === selectedPrize.id)
    const targetCellIndex = winIdInGrid !== -1 ? winIdInGrid : 7

    let currentSpeed = 60
    let step = 0
    const totalSteps = 24 + targetCellIndex

    const spin = () => {
      setActiveIndex(step % 8)
      step++
      if (step < totalSteps) {
        if (step > totalSteps - 8) {
          currentSpeed += 40
        } else if (currentSpeed > 50) {
          currentSpeed -= 5
        }
        setTimeout(spin, currentSpeed)
      } else {
        setTimeout(() => {
          setIsDrawing(false)
          setDrawResult({ prize: selectedPrize, 干预类型 })
          setDrawResultModalVisible(true)

          const isRule1BigPrize = rule1TargetPrizes.some(rp => rp.id === selectedPrize.id)
          const isRule2BigPrize = rule2TriggerPrizes.some(rp => rp.id === selectedPrize.id)

          if (selectedPrize.type !== 'none') {
            if (isRule1BigPrize) {
              setSimConsecutiveLosses(0)
            } else {
              setSimConsecutiveLosses(prev => prev + 1)
            }

            if (isRule2BigPrize) {
              setSimHasWonGrand(true)
            }
          } else {
            setSimConsecutiveLosses(prev => prev + 1)
          }
        }, 300)
      }
    }

    spin()
  }

  // ==========================================
  // 表格列配置
  // ==========================================
  // 1. 活动列表列
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

  // 2. 顺位对照表列
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
      title: '中奖概率 (%)',
      dataIndex: 'prob',
      key: 'prob',
      width: 130,
      render: (prob: number, record: Prize) => (
        <InputNumber
          min={0.01}
          max={100}
          step={0.1}
          precision={2}
          value={prob}
          onChange={(val) => handleProbabilityChange(record.id, val)}
          addonAfter="%"
          size="small"
          style={{ width: 105 }}
        />
      )
    },
    {
      title: '干预关联状态',
      key: 'status',
      render: (_: any, record: Prize) => {
        const sortedIndex = sortedPrizes.findIndex(sp => sp.id === record.id) + 1
        const inRule1X = sortedIndex <= rule1X
        const inRule1Y = sortedIndex <= rule1Y
        const inRule2X = sortedIndex <= rule2X
        const inRule2Y = sortedIndex <= rule2Y

        return (
          <div className="intervention-assoc-tags">
            {globalEnableIntervention && inRule1X && (
              <Tag color="error" style={{ fontSize: 9 }}>规则1: 兜底大奖</Tag>
            )}
            {globalEnableIntervention && inRule1Y && (
              <Tag color="success" style={{ fontSize: 9 }}>规则1: 保底派发</Tag>
            )}
            {globalEnableIntervention && inRule2X && (
              <Tag color="purple" style={{ fontSize: 9 }}>规则2: 触发大奖</Tag>
            )}
            {globalEnableIntervention && inRule2Y && (
              <Tag color="default" style={{ fontSize: 9 }}>规则2: 屏蔽大奖</Tag>
            )}
            {!globalEnableIntervention && (
              <span style={{ fontSize: 11, color: '#bfbfbf' }}>干预未开启</span>
            )}
          </div>
        )
      }
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

      {/* 一、活动数据看板卡片 (完美对应截图二指标) */}
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

      {/* 四、概率干预配置抽屉 (Drawer - 整合重点) */}
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

        {/* 调试模拟器快捷入口 */}
        {globalEnableIntervention && (
          <div className="sandbox-simulator-trigger-row animate-fade-in">
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              💡 规则已启用！建议打开沙盒调试面板测试您的干预设置。
            </div>
            <Button
              type="primary"
              size="small"
              icon={<SafetyCertificateOutlined />}
              onClick={() => setSimModalVisible(true)}
              style={{ fontSize: 11 }}
            >
              打开沙盒调试模拟器
            </Button>
          </div>
        )}

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

        {/* 概率与顺位对照表 */}
        <div className={`drawer-prizes-section ${!globalEnableIntervention ? 'disabled-section' : ''}`}>
          <div className="flex-align-center-between" style={{ marginBottom: 10 }}>
            <h4 className="section-title">一、奖品概率与干预顺位（由低到高排列）</h4>
            <Tag color={totalProbability === 100 ? 'success' : 'warning'} style={{ margin: 0 }}>
              总中奖率: {totalProbability}%
            </Tag>
          </div>

          <Table
            dataSource={prizes}
            columns={prizeColumns}
            rowKey="id"
            pagination={false}
            size="small"
            className="prize-rank-table"
          />

          {/* 概率一致顺位唯一化消重解析 */}
          {hasDuplicateProbabilities && (
            <div className="probability-duplicate-tip">
              <InfoCircleOutlined className="tip-icon" />
              <span>
                系统监测到<strong>存在概率相同的奖品</strong>。为确保逻辑严密，已自动按 <strong>[奖品价值]</strong> 进行消重与排序以分派唯一顺位，避免机制判定冲突。
              </span>
            </div>
          )}
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
                <strong>💡 连续空车保底规则解析：</strong>
                <div className="explain-desc">
                  测试账号连续未中 <strong>{rule1N}</strong> 次大奖时，自动从小奖池剔除并强制触发保底发奖。
                  <br />
                  其判定的目标大奖范围（前 {rule1X} 顺位）：
                  <div className="prizes-list-tags">
                    {rule1TargetPrizes.map(p => (
                      <span className="p-tag bad" key={p.id}>[{sortedPrizes.findIndex(sp => sp.id === p.id) + 1}顺位] {p.name}</span>
                    ))}
                  </div>
                  触发保底时的强制派奖奖池（前 {rule1Y} 顺位）：
                  <div className="prizes-list-tags">
                    {rule1RewardPrizes.map(p => (
                      <span className="p-tag good" key={p.id}>[{sortedPrizes.findIndex(sp => sp.id === p.id) + 1}顺位] {p.name}</span>
                    ))}
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
                <strong>💡 大奖上限限制规则解析：</strong>
                <div className="explain-desc">
                  当测试账号已获得过以下大奖中任意一个时（前 {rule2X} 顺位）：
                  <div className="prizes-list-tags">
                    {rule2TriggerPrizes.map(p => (
                      <span className="p-tag danger" key={p.id}>[{sortedPrizes.findIndex(sp => sp.id === p.id) + 1}顺位] {p.name}</span>
                    ))}
                  </div>
                  后续再次抽奖，将自动剔除大奖库存，屏蔽以下奖池（前 {rule2Y} 顺位）：
                  <div className="prizes-list-tags">
                    {rule2BlockPrizes.map(p => (
                      <span className="p-tag blocked" key={p.id}>[{sortedPrizes.findIndex(sp => sp.id === p.id) + 1}顺位] {p.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 五、红色库存及物理限制超限降级声明 (新增标红描述 - 满足需求3) */}
        {globalEnableIntervention && (
          <div className="drawer-inventory-fallback-notice">
            <h4 className="notice-title">
              <WarningOutlined style={{ marginRight: 6 }} />
              库存与规则物理限制超限特别提醒
            </h4>
            <p className="notice-text">
              由于实际运营环境复杂，在触发<strong>非酋保底</strong>或<strong>防刷屏蔽</strong>干预逻辑时，若遇到以下情况可能会出现<strong>非预期出货现象</strong>：
            </p>
            <ul className="notice-bullets">
              <li><strong>保底池库存耗尽：</strong>当触发规则一保底派奖时，若派发范围（前 {rule1Y} 顺位）内的所有奖品库存均已全部扣减完毕，系统将触发安全降级保护，<strong>自动降级为普发普通奖池（如积分、谢谢参与）</strong>，并向后台发出库存告警日志。</li>
              <li><strong>干预冲突死锁：</strong>当规则二屏蔽了前 {rule2Y} 顺位奖品后，若剩下的 4 顺位至 8 顺位小奖品在此时恰好无库存，可能导致抽奖死锁。系统会自动以<strong>“谢谢参与”</strong>兜底出货，避免页面崩溃。</li>
              <li><strong>单人频次限制超限：</strong>若高价值奖品在主商品配置中设定了每人仅限兑换/中奖 1 次，在干预强派时如触发此限制，系统同样会静默降级派奖。</li>
            </ul>
            <p className="notice-tip-text">
              建议运营及测试人员：<strong>务必在活动期间监控保底/高顺位奖品的库存额度充裕</strong>，并提前核对单人中奖上限，防止干预机制因物理限制触发默认降级保护。
            </p>
          </div>
        )}
      </Drawer>

      {/* 五、沙盒测试模拟器弹窗 Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold' }}>
            <SafetyCertificateOutlined style={{ color: '#52c41a', fontSize: 18 }} />
            <span>内部沙盒抽奖模拟与规则验证</span>
          </div>
        }
        open={simModalVisible}
        onCancel={() => setSimModalVisible(false)}
        footer={null}
        width={750}
        centered
        destroyOnClose
        className="sandbox-simulator-modal"
      >
        <Row gutter={24} style={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* 左侧手机框 */}
          <Col xs={24} md={11} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="mobile-phone-frame" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div className="phone-top-notch"></div>
              <div className="phone-status-bar" style={{ color: '#000' }}>
                <span className="time">16:40</span>
                <div className="icons">
                  <span className="cellular">📶</span>
                  <span className="wifi">🔋</span>
                </div>
              </div>
              <div className="phone-screen-content">
                <div className="phone-nav-header">
                  <span className="back-arrow"><ArrowLeftOutlined /></span>
                  <span className="nav-title">测试沙盒·大抽奖</span>
                  <span className="more-menu">•••</span>
                </div>
                <div className="preview-scroll-body" style={{ paddingBottom: 20 }}>
                  <div className="simulator-badge internal">
                    ⚠️ 内部沙盒内测
                  </div>
                  <div className="lottery-head-decor">
                    <h2 className="title">幸 运 大 抽 奖</h2>
                    <p className="desc">内测调试 · {currentAct?.name}</p>
                  </div>

                  {/* 九宫格盘 */}
                  <div className="nine-grid-layout">
                    <div className={`grid-cell ${activeIndex === 0 ? 'active' : ''}`}>
                      <span className="name">{gridPrizes[0]?.name.substring(0, 5)}</span>
                      <span className="prob-label">{gridPrizes[0]?.prob}%</span>
                    </div>
                    <div className={`grid-cell ${activeIndex === 1 ? 'active' : ''}`}>
                      <span className="name">{gridPrizes[1]?.name.substring(0, 5)}</span>
                      <span className="prob-label">{gridPrizes[1]?.prob}%</span>
                    </div>
                    <div className={`grid-cell ${activeIndex === 2 ? 'active' : ''}`}>
                      <span className="name">{gridPrizes[2]?.name.substring(0, 5)}</span>
                      <span className="prob-label">{gridPrizes[2]?.prob}%</span>
                    </div>

                    <div className={`grid-cell ${activeIndex === 7 ? 'active' : ''}`}>
                      <span className="name">{gridPrizes[7]?.name.substring(0, 5)}</span>
                      <span className="prob-label">{gridPrizes[7]?.prob}%</span>
                    </div>
                    <button
                      type="button"
                      className={`grid-draw-button ${isDrawing ? 'disabled' : ''}`}
                      onClick={executeMockDraw}
                      disabled={isDrawing}
                    >
                      <div className="btn-title">抽奖</div>
                      <div className="btn-subtext">扣除10积分</div>
                    </button>
                    <div className={`grid-cell ${activeIndex === 3 ? 'active' : ''}`}>
                      <span className="name">{gridPrizes[3]?.name.substring(0, 5)}</span>
                      <span className="prob-label">{gridPrizes[3]?.prob}%</span>
                    </div>

                    <div className={`grid-cell ${activeIndex === 6 ? 'active' : ''}`}>
                      <span className="name">{gridPrizes[6]?.name.substring(0, 5)}</span>
                      <span className="prob-label">{gridPrizes[6]?.prob}%</span>
                    </div>
                    <div className={`grid-cell ${activeIndex === 5 ? 'active' : ''}`}>
                      <span className="name">{gridPrizes[5]?.name.substring(0, 5)}</span>
                      <span className="prob-label">{gridPrizes[5]?.prob}%</span>
                    </div>
                    <div className={`grid-cell ${activeIndex === 4 ? 'active' : ''}`}>
                      <span className="name">{gridPrizes[4]?.name.substring(0, 5)}</span>
                      <span className="prob-label">{gridPrizes[4]?.prob}%</span>
                    </div>
                  </div>

                  {/* 状态看板卡片 */}
                  <div className="simulator-stats-card" style={{ marginTop: 10 }}>
                    <div className="stats-header">👤 模拟账户状态</div>
                    <div className="stats-item">
                      <span className="label">模拟身份:</span>
                      <Tag color={simAccountType === 'test' ? 'blue' : 'gray'}>
                        {simAccountType === 'test' ? '内测账号 (干预有效)' : '普通账户 (不触发)'}
                      </Tag>
                    </div>
                    <div className="stats-item">
                      <span className="label">连空计数:</span>
                      <span className={`value ${simConsecutiveLosses >= rule1N ? 'highlight-red animate-pulse' : ''}`}>
                        <strong>{simConsecutiveLosses}</strong> 次未中大奖
                      </span>
                    </div>
                    <div className="stats-item">
                      <span className="label">中过大奖:</span>
                      <span>{simHasWonGrand ? <Tag color="error">是</Tag> : <Tag color="success">否</Tag>}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* 右侧调试控制板 */}
          <Col xs={24} md={13}>
            <div className="simulator-debug-panel" style={{ width: '100%', minHeight: 320, padding: 20 }}>
              <h4 className="debug-title" style={{ fontSize: 14, fontWeight: 'bold', borderBottom: '1px solid #e8e8e8', paddingBottom: 8, marginBottom: 12 }}>
                👤 沙盒状态控制板
              </h4>
              <p style={{ fontSize: 12, color: '#8c8c8c', lineHeight: 1.4, marginBottom: 16 }}>
                通过滑动下方的调试状态，可以绕过真实的连续抽奖测试，快速让模拟账号符合规则一或规则二判定条件，然后点击左侧【抽奖】即可观察逻辑反馈。
              </p>

              <div className="debug-item-row">
                <span className="debug-label">模拟身份选择：</span>
                <Radio.Group 
                  size="small" 
                  value={simAccountType} 
                  onChange={(e) => setSimAccountType(e.target.value)}
                >
                  <Radio.Button value="test">内测账号</Radio.Button>
                  <Radio.Button value="visitor">外部普通访客</Radio.Button>
                </Radio.Group>
              </div>

              <div className="debug-item-row" style={{ display: 'block', margin: '16px 0' }}>
                <div className="slider-label-row">
                  <span className="debug-label">手动调整未中大奖次数 (M)：</span>
                  <strong className="slider-value" style={{ color: simConsecutiveLosses >= rule1N ? '#ff4d4f' : '#1890ff' }}>
                    {simConsecutiveLosses} 次
                  </strong>
                </div>
                <Slider
                  min={0}
                  max={15}
                  value={simConsecutiveLosses}
                  onChange={setSimConsecutiveLosses}
                  tooltip={{ formatter: (v?: number) => `连续未中大奖 ${v} 次` }}
                />
                <div style={{ fontSize: 10.5, color: '#bfbfbf', marginTop: 4 }}>
                  * 当前保底触发线设为 {rule1N} 次。达到或超过该值时，下一次抽奖将触发「非酋保底」干预。
                </div>
              </div>

              <div className="debug-item-row" style={{ margin: '16px 0' }}>
                <span className="debug-label">模拟已抽中过特等/一等大奖：</span>
                <Switch 
                  checked={simHasWonGrand} 
                  onChange={setSimHasWonGrand}
                  checkedChildren="已中过" 
                  unCheckedChildren="没中过"
                />
              </div>

              <div style={{ marginTop: 24, borderTop: '1px dashed #e8e8e8', paddingTop: 16, display: 'flex', gap: 8 }}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => {
                    setSimConsecutiveLosses(0)
                    setSimHasWonGrand(false)
                    message.success('已清空状态，模拟账户恢复初始值')
                  }}
                  style={{ flex: 1 }}
                >
                  重置模拟状态
                </Button>
                <Button type="primary" onClick={() => setSimModalVisible(false)} style={{ flex: 1 }}>
                  关闭调试器
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Modal>

      {/* 中奖 Modal 弹窗 */}
      <Modal
        open={drawResultModalVisible}
        onCancel={() => setDrawResultModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDrawResultModalVisible(false)}>
            确认收下
          </Button>
        ]}
        centered
        width={350}
        className="draw-result-modal"
      >
        <div className="modal-result-content">
          <div className="win-icon-bounce">🎉</div>
          <div className="win-congrats">恭喜您抽中</div>
          <div className="win-prize-name" style={{ color: drawResult?.prize.color }}>
            {drawResult?.prize.name}
          </div>
          
          {drawResult?.干预类型 === 'rule1' && (
            <div className="intervention-notice-tag pity">
              🤖 已触发「非酋保底」干预：因连空较多自动派发大奖！
            </div>
          )}
          {drawResult?.干预类型 === 'rule2' && (
            <div className="intervention-notice-tag abuse">
              🛡️ 已触发「防刷大奖屏蔽」过滤：已剔除高顺位奖池。
            </div>
          )}
          
          <div className="win-prize-desc">
            {drawResult?.prize.type === 'none' ? '别灰心，内部测试期间可随时重试！' : '系统已自动发奖至您的账户包中。'}
          </div>
        </div>
      </Modal>

    </div>
  )
}
