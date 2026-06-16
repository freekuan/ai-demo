import { useState, useMemo } from 'react'
import {
  InputNumber,
  Radio,
  Switch,
  Button,
  Slider,
  message,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Table,
  Alert,
  Modal
} from 'antd'
import {
  ReloadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  GiftOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import './LotteryRulesIntervention.css'

const { Title, Text } = Typography

// 初始奖品定义 (包含名字、默认概率、图标)
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

export default function LotteryRulesIntervention() {
  // ==========================================
  // B端：整体属性状态
  // ==========================================
  // 活动发布性质: 'internal' (内部测试) | 'public' (外部公开商业)
  const [activityType, setActivityType] = useState<'internal' | 'public'>('internal')
  const [showLegalConfirm, setShowLegalConfirm] = useState<boolean>(false)
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES)

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
  // C端：模拟器用户状态
  // ==========================================
  const [simConsecutiveLosses, setSimConsecutiveLosses] = useState<number>(0) // 连续未中大奖次数
  const [simHasWonGrand, setSimHasWonGrand] = useState<boolean>(false)       // 是否已抽中过大奖
  const [simAccountType, setSimAccountType] = useState<'test' | 'visitor'>('test') // 用户身份 (测试账号/普通账号)

  // 模拟抽奖动画状态
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(0) // 当前高亮的九宫格索引
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [drawResult, setDrawResult] = useState<{ prize: Prize;干预类型: 'none' | 'rule1' | 'rule2' } | null>(null)

  // ==========================================
  // 动态数据计算 (中奖概率顺位排序)
  // ==========================================
  // 按照概率升序排列，生成顺位 (概率相同按ID排，保证顺序唯一)
  const sortedPrizes = useMemo(() => {
    return [...prizes].sort((a, b) => {
      if (a.prob !== b.prob) {
        return a.prob - b.prob // 升序
      }
      return a.id - b.id
    })
  }, [prizes])

  // 九宫格的8个奖品排列位置顺序 (外圈顺时针，中间是开始抽奖)
  // 格子序号对应：0 1 2, 7 Start 3, 6 5 4
  // 我们的奖品只有7个，为了铺满8个格子加一个“谢谢参与”（概率0%或补差额，此处设为差额或0%）
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
    // 排列8个格子
    const items = [...prizes]
    if (items.length < 8) {
      items.push(nonePrize)
    }
    // 补齐 8 个奖品以放入九宫格边缘
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

  // 规则一：概率最低的前 X 顺位奖品列表
  const rule1TargetPrizes = useMemo(() => {
    return sortedPrizes.slice(0, rule1X)
  }, [sortedPrizes, rule1X])

  // 规则一：强制派发的前 Y 顺位奖品列表
  const rule1RewardPrizes = useMemo(() => {
    return sortedPrizes.slice(0, rule1Y)
  }, [sortedPrizes, rule1Y])

  // 规则二：触发限制的前 X 顺位奖品列表
  const rule2TriggerPrizes = useMemo(() => {
    return sortedPrizes.slice(0, rule2X)
  }, [sortedPrizes, rule2X])

  // 规则二：被屏蔽的前 Y 顺位奖品列表
  const rule2BlockPrizes = useMemo(() => {
    return sortedPrizes.slice(0, rule2Y)
  }, [sortedPrizes, rule2Y])

  // 合规控制：如果是公开活动，强行关闭并屏蔽规则
  const finalEnableRule1 = activityType === 'internal' && enableRule1
  const finalEnableRule2 = activityType === 'internal' && enableRule2

  // 联动概率检查
  const totalProbability = useMemo(() => {
    return prizes.reduce((sum, p) => sum + p.prob, 0)
  }, [prizes])

  // ==========================================
  // B端交互逻辑
  // ==========================================
  const handleProbabilityChange = (id: number, val: number | null) => {
    if (val === null) return
    setPrizes(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, prob: val }
      }
      return p
    }))
  }

  const handleResetSettings = () => {
    setPrizes(INITIAL_PRIZES)
    setActivityType('internal')
    setEnableRule1(true)
    setRule1N(5)
    setRule1X(2)
    setRule1Y(3)
    setEnableRule2(true)
    setRule2X(2)
    setRule2Y(3)
    message.success('配置已重置为初始状态')
  }

  const handleSaveSettings = () => {
    if (totalProbability > 100) {
      message.error(`保存失败：中奖概率之和 (${totalProbability}%) 超过 100%，请调整各奖品概率！`)
      return
    }

    if (activityType === 'public') {
      message.success('保存成功：外部公开活动发布成功，规则干预已处于锁定停用状态。')
    } else {
      setShowLegalConfirm(true)
    }
  }

  const handleConfirmInternalSave = () => {
    setShowLegalConfirm(false)
    message.loading({ content: '正在保存内部概率干预规则...', key: 'save_rules' })
    setTimeout(() => {
      message.success({ content: '内部规则保存成功！干预配置仅在“内部测试”账户或“沙盒”环境下生效。', key: 'save_rules', duration: 3 })
    }, 1000)
  }

  // ==========================================
  // C端模拟抽奖核心干预逻辑
  // ==========================================
  const executeMockDraw = () => {
    if (isDrawing) return
    
    // 如果中奖率之和大于 100%
    if (totalProbability > 100) {
      message.error('抽奖盘配置异常：概率之和超过 100%')
      return
    }

    setIsDrawing(true)
    setDrawResult(null)

    // 执行后台抽奖算法并进行概率干预
    let selectedPrize: Prize
    let 干预类型: 'none' | 'rule1' | 'rule2' = 'none'

    // 默认备选池包含谢谢参与
    const totalProb = prizes.reduce((sum, p) => sum + p.prob, 0)
    const noneProb = Math.max(0, 100 - totalProb)
    const nonePrize: Prize = { id: 99, name: '谢谢参与', prob: noneProb, quantity: 99999, type: 'none', color: '#bfbfbf' }
    
    // 只有在【内部测试账号】或当前环境为【内部测试】且规则启用时，才进行干预
    const isInterventionApplicable = activityType === 'internal' && simAccountType === 'test'

    // 规则 2 优先级校验：屏蔽前 Y 顺位奖品
    let activePrizePool = [...prizes]
    if (isInterventionApplicable && enableRule2 && simHasWonGrand) {
      // 找到被屏蔽的前 Y 顺位 ID
      const blockedIds = rule2BlockPrizes.map(bp => bp.id)
      activePrizePool = activePrizePool.filter(p => !blockedIds.includes(p.id))
      干预类型 = 'rule2'
    }

    // 计算当前奖池的总权重与各个区段
    let activeTotalProb = activePrizePool.reduce((sum, p) => sum + p.prob, 0) + (activePrizePool.length === prizes.length ? noneProb : 0)
    
    // 规则 1 校验：连续 N 次未抽中概率最低的前 X 顺位奖品，强制从前 Y 顺位中派发一个
    if (isInterventionApplicable && enableRule1 && simConsecutiveLosses >= rule1N) {
      // 强制从前 Y 顺位 (rule1RewardPrizes) 中派发
      // 必须确保 Y 顺位里包含当前可得的奖品（如果由于规则2已被屏蔽，则取交集，若无交集，取规则1的派发池）
      let rewardPool = rule1RewardPrizes.filter(rp => activePrizePool.some(ap => ap.id === rp.id))
      if (rewardPool.length === 0) {
        rewardPool = rule1RewardPrizes // 兜底
      }

      // 在保底池中按权重比例随机抽取一个
      const poolWeight = rewardPool.reduce((sum, p) => sum + p.prob, 0)
      const rand = Math.random() * poolWeight
      let accumulated = 0
      selectedPrize = rewardPool[rewardPool.length - 1] // 默认最后一个
      for (const p of rewardPool) {
        accumulated += p.prob
        if (rand <= accumulated) {
          selectedPrize = p
          break
        }
      }
      干预类型 = 'rule1'
    } else {
      // 正常抽奖逻辑 (或者规则2干预后的奖池)
      const rand = Math.random() * 100
      let accumulated = 0
      selectedPrize = nonePrize // 默认谢谢参与

      // 把 activePrizePool 按当前概率比例放大到 100 权重，或者剩余部分归谢谢参与
      for (const p of activePrizePool) {
        accumulated += p.prob
        if (rand <= accumulated) {
          selectedPrize = p
          break
        }
      }
      
      // 如果没有在 activePrizePool 中抽中，且原先有谢谢参与概率
      if (selectedPrize.id === 99 && noneProb === 0 && activeTotalProb > 0) {
        // 由于屏蔽导致的溢出重新分配
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

    // 模拟九宫格顺时针旋转动画
    // 对应的外圈格子索引排布：0, 1, 2, 3, 4, 5, 6, 7
    // 我们的 gridPrizes 存有 8 个奖品，对应索引就是旋转定位
    const winIdInGrid = gridPrizes.findIndex(gp => gp.id === selectedPrize.id)
    const targetCellIndex = winIdInGrid !== -1 ? winIdInGrid : 7 // 兜底谢谢参与

    let currentSpeed = 60
    let step = 0
    const totalSteps = 24 + targetCellIndex // 旋转3圈多再停下

    const spin = () => {
      setActiveIndex(step % 8)
      step++
      if (step < totalSteps) {
        // 慢起 -> 快 -> 慢落
        if (step > totalSteps - 8) {
          currentSpeed += 40
        } else if (currentSpeed > 50) {
          currentSpeed -= 5
        }
        setTimeout(spin, currentSpeed)
      } else {
        // 动画结束，展示中奖结果并更新 C 端用户状态
        setTimeout(() => {
          setIsDrawing(false)
          setDrawResult({ prize: selectedPrize, 干预类型 })
          setModalVisible(true)

          // 更新模拟统计值
          // 判定抽中的是否是规则一/二的大奖范围 (X 顺位)
          const isRule1BigPrize = rule1TargetPrizes.some(rp => rp.id === selectedPrize.id)
          const isRule2BigPrize = rule2TriggerPrizes.some(rp => rp.id === selectedPrize.id)

          if (selectedPrize.type !== 'none') {
            if (isRule1BigPrize) {
              setSimConsecutiveLosses(0) // 中了大奖，清空连续未中计数
            } else {
              setSimConsecutiveLosses(prev => prev + 1) // 未中大奖，计数 +1
            }

            if (isRule2BigPrize) {
              setSimHasWonGrand(true) // 中了大奖，触发防刷机制标识
            }
          } else {
            setSimConsecutiveLosses(prev => prev + 1) // 谢谢参与，计数 +1
          }
        }, 300)
      }
    }

    spin()
  }

  // ==========================================
  // 表单顺位列定义
  // ==========================================
  const columns = [
    {
      title: '概率顺位',
      dataIndex: 'rank',
      key: 'rank',
      width: 85,
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
      render: (text: string, record: Prize) => {
        let tagColor = 'blue'
        if (record.type === 'real') tagColor = 'magenta'
        if (record.type === 'redpacket') tagColor = 'volcano'
        if (record.type === 'points') tagColor = 'orange'
        
        return (
          <Space>
            <span>{text}</span>
            <Tag color={tagColor} style={{ fontSize: 10, scale: 0.9 }}>
              {record.type === 'real' ? '实物' : record.type === 'points' ? '积分' : '红包'}
            </Tag>
          </Space>
        )
      }
    },
    {
      title: '中奖概率 (%)',
      dataIndex: 'prob',
      key: 'prob',
      width: 140,
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
          style={{ width: 110 }}
        />
      )
    },
    {
      title: '奖品状态与干预关联',
      key: 'status',
      render: (_: any, record: Prize) => {
        const sortedIndex = sortedPrizes.findIndex(sp => sp.id === record.id) + 1
        const inRule1X = sortedIndex <= rule1X
        const inRule1Y = sortedIndex <= rule1Y
        const inRule2X = sortedIndex <= rule2X
        const inRule2Y = sortedIndex <= rule2Y

        return (
          <div className="intervention-assoc-tags">
            {finalEnableRule1 && inRule1X && (
              <Tag color="error" style={{ fontSize: 10 }}>规则1: 兜底大奖</Tag>
            )}
            {finalEnableRule1 && inRule1Y && (
              <Tag color="success" style={{ fontSize: 10 }}>规则1: 保底发放</Tag>
            )}
            {finalEnableRule2 && inRule2X && (
              <Tag color="purple" style={{ fontSize: 10 }}>规则2: 触发大奖</Tag>
            )}
            {finalEnableRule2 && inRule2Y && (
              <Tag color="default" style={{ fontSize: 10 }}>规则2: 后续屏蔽</Tag>
            )}
            {!finalEnableRule1 && !finalEnableRule2 && (
              <span style={{ fontSize: 11, color: '#bfbfbf' }}>未绑定干预</span>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <div className="lottery-intervention-container">
      {/* 头部说明 */}
      <div className="intervention-header">
        <Space size={8} align="center">
          <TrophyOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>
            抽奖概率干预及内部控制面板
          </Title>
        </Space>
        <Text type="secondary" className="header-desc">
          为内部员工测试、沙盒活动设计。支持配置非酋兜底、大奖限制等高级干预规则，可动态调节概率顺位及干预区间。
        </Text>
      </div>

      {/* 合规警示横幅 (直接贴在头部，确保一眼看出是非公开) */}
      <div className="sandbox-notice-banner">
        <div className="banner-content">
          <SafetyCertificateOutlined className="notice-icon animate-pulse" />
          <div className="notice-text">
            <strong>内部沙盒测试模式生效中：</strong>根据《反不正当竞争法》和《规范促销行为暂行规定》，商业性公开有奖销售严禁操纵或人为修改中奖概率。
            本面板的概率干预功能<strong>仅在 [内部测试] 或 [非公开内测] 状态下可用。</strong>
          </div>
        </div>
      </div>

      <Row gutter={24}>
        {/* 左侧：手机预览模拟器 */}
        <Col xs={24} lg={9} xl={8} className="mobile-preview-container">
          <div className="preview-sticky-wrap">
            <div className="mobile-phone-frame">
              {/* 听筒和镜头 */}
              <div className="phone-top-notch"></div>
              
              {/* 状态栏 */}
              <div className="phone-status-bar" style={{ color: '#000' }}>
                <span className="time">16:00</span>
                <div className="icons">
                  <span className="cellular">📶</span>
                  <span className="wifi">🔋</span>
                </div>
              </div>

              {/* 手机内部屏幕 */}
              <div className="phone-screen-content">
                <div className="phone-nav-header">
                  <span className="back-arrow"><ArrowLeftOutlined /></span>
                  <span className="nav-title">内部测试·抽奖沙盒</span>
                  <span className="more-menu">•••</span>
                </div>

                <div className="preview-scroll-body">
                  {/* 活动性质角标 */}
                  <div className={`simulator-badge ${activityType}`}>
                    {activityType === 'internal' ? '⚠️ 内部测试沙盒' : '🌐 外部商业抽奖'}
                  </div>

                  {/* 头部装饰 */}
                  <div className="lottery-head-decor">
                    <h2 className="title">幸 运 大 抽 奖</h2>
                    <p className="desc">特步会员尊享 · 内部调试沙盒</p>
                  </div>

                  {/* 九宫格盘 */}
                  <div className="nine-grid-layout">
                    {/* 下面手动排列九宫格，以确保正确的视觉表现 */}
                    {/* 第一排 */}
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

                    {/* 第二排 */}
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
                      <div className="btn-title">立即抽奖</div>
                      <div className="btn-subtext">消耗10积分</div>
                    </button>
                    <div className={`grid-cell ${activeIndex === 3 ? 'active' : ''}`}>
                      <span className="name">{gridPrizes[3]?.name.substring(0, 5)}</span>
                      <span className="prob-label">{gridPrizes[3]?.prob}%</span>
                    </div>

                    {/* 第三排 */}
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
                  <div className="simulator-stats-card">
                    <div className="stats-header">👤 当前模拟账户状态</div>
                    <div className="stats-item">
                      <span className="label">模拟身份:</span>
                      <Tag color={simAccountType === 'test' ? 'blue' : 'gray'}>
                        {simAccountType === 'test' ? '内部测试账号 (干预生效)' : '外部普通账户 (不触发干预)'}
                      </Tag>
                    </div>
                    <div className="stats-item">
                      <span className="label">连续未中大奖:</span>
                      <span className={`value ${simConsecutiveLosses >= rule1N ? 'highlight-red animate-pulse' : ''}`}>
                        <strong>{simConsecutiveLosses}</strong> 次
                        {activityType === 'internal' && enableRule1 && simConsecutiveLosses >= rule1N && (
                          <span className="small-alert-tag">已达保底线</span>
                        )}
                      </span>
                    </div>
                    <div className="stats-item">
                      <span className="label">已中过特等/一等大奖:</span>
                      <span className="value">
                        {simHasWonGrand ? (
                          <Tag color="error">是 (后续屏蔽大奖)</Tag>
                        ) : (
                          <Tag color="success">否</Tag>
                        )}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 模拟器专属：C端用户属性调试控制板 */}
            <div className="simulator-debug-panel">
              <div className="panel-title-row">
                <span className="panel-title">👤 C端登录账户属性模拟器</span>
                <span className="panel-subtitle">用于调试和测试概率干预规则的判定</span>
              </div>

              <div className="debug-item-row">
                <span className="debug-label">模拟身份类型:</span>
                <Radio.Group 
                  size="small" 
                  value={simAccountType} 
                  onChange={(e) => setSimAccountType(e.target.value)}
                >
                  <Radio.Button value="test">内测账号</Radio.Button>
                  <Radio.Button value="visitor">外部访客</Radio.Button>
                </Radio.Group>
              </div>

              <div className="debug-item-row" style={{ display: 'block' }}>
                <div className="slider-label-row">
                  <span className="debug-label">未中大奖次数 (M):</span>
                  <strong className="slider-value">{simConsecutiveLosses} 次</strong>
                </div>
                <Slider
                  min={0}
                  max={15}
                  value={simConsecutiveLosses}
                  onChange={setSimConsecutiveLosses}
                  tooltip={{ formatter: (v) => `已连续未中大奖 ${v} 次` }}
                />
              </div>

              <div className="debug-item-row">
                <span className="debug-label">已抽中过大奖:</span>
                <Switch 
                  checked={simHasWonGrand} 
                  onChange={setSimHasWonGrand}
                  checkedChildren="已抽中" 
                  unCheckedChildren="未抽中"
                />
              </div>

              <div className="debug-actions-row">
                <Button 
                  size="small" 
                  icon={<ReloadOutlined />} 
                  onClick={() => {
                    setSimConsecutiveLosses(0)
                    setSimHasWonGrand(false)
                    message.success('已清空当前用户的模拟状态数据')
                  }}
                  style={{ width: '100%', fontSize: 11 }}
                >
                  重置模拟状态
                </Button>
              </div>
            </div>
          </div>
        </Col>

        {/* 右侧：配置属性面板 */}
        <Col xs={24} lg={15} xl={16}>
          <div className="editor-properties-panel">
            
            {/* 顶栏控制组 */}
            <div className="panel-header-section">
              <span className="title">干预规则配置表单</span>
              <div className="action-buttons">
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={handleResetSettings}
                  style={{ color: '#8c8c8c' }}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveSettings}
                  style={{ borderRadius: 6 }}
                >
                  发布活动并生效
                </Button>
              </div>
            </div>

            {/* 活动公开状态及法务隔离区 */}
            <div className="prop-group-card legal-isolation-card">
              <h3 className="group-title" style={{ borderLeftColor: '#d46b08' }}>活动发布性质与合规限制</h3>
              <div className="prop-row">
                <div className="prop-label">发布类型：</div>
                <div className="prop-control">
                  <Radio.Group
                    value={activityType}
                    onChange={(e) => {
                      const type = e.target.value
                      if (type === 'public') {
                        // 提示法律警告
                        Modal.confirm({
                          title: '⚠️ 法律合规风险提示',
                          icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
                          content: (
                            <div>
                              <p>如果将本抽奖活动设为<strong>【外部公开商业抽奖】</strong>，系统会强制禁用并锁定一切概率干预算法。</p>
                              <p>《反不正当竞争法》和《规范促销行为暂行规定》明确禁止欺骗性有奖销售（包括人为内定中奖、中途修改公开中奖概率、屏蔽大奖等）。外部活动必须严谨、透明、客观抽奖。</p>
                              <strong style={{ color: '#ff4d4f' }}>是否确认切换并锁定干预配置？</strong>
                            </div>
                          ),
                          onOk: () => {
                            setActivityType('public')
                            message.warning('已切换为外部公开商业活动。概率干预功能已锁定停用。')
                          }
                        })
                      } else {
                        setActivityType('internal')
                        message.success('已切换为内部员工内测/沙盒测试模式。干预功能已恢复可配置。')
                      }
                    }}
                    optionType="button"
                    buttonStyle="solid"
                  >
                    <Radio.Button value="internal">⚠️ 内部员工测试 / 沙盒内测活动</Radio.Button>
                    <Radio.Button value="public">🌐 外部公开商业活动（强制公平/禁用干预）</Radio.Button>
                  </Radio.Group>
                </div>
              </div>

              {activityType === 'public' ? (
                <Alert
                  message="概率干预规则已被锁定"
                  description="因当前设定为【外部公开商业活动】，为了满足消费公平和合规经营要求，已强制停用保底机制与防刷大奖屏蔽机制。当前仅接受基于奖品池中奖概率之和的传统客观随机精算。"
                  type="warning"
                  showIcon
                  icon={<LockOutlined />}
                  className="legal-alert"
                />
              ) : (
                <Alert
                  message="已启用内部沙盒调试环境"
                  description="干预机制已开启。本配置仅对配置为“内测账户/测试身份”的登录用户生效，外部自然用户访问将默认降级为无干预的常规真实概率模式，保证隔离安全。"
                  type="info"
                  showIcon
                  icon={<SafetyCertificateOutlined />}
                  className="legal-alert info"
                />
              )}
            </div>

            {/* 概率顺位表 */}
            <div className="prop-group-card">
              <div className="flex-align-center-between" style={{ marginBottom: 12 }}>
                <h3 className="group-title" style={{ margin: 0 }}>一、当前奖品概率顺位（排序自低至高）</h3>
                <span className={`prob-sum-badge ${totalProbability === 100 ? 'success' : 'warning'}`}>
                  中奖率总和: {totalProbability}%
                  {totalProbability !== 100 && (
                    <span style={{ fontSize: 10.5, marginLeft: 6 }}>
                      (差额 {Math.max(0, 100 - totalProbability).toFixed(2)}% 自动归入“谢谢参与”)
                    </span>
                  )}
                </span>
              </div>
              <Table
                dataSource={prizes}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
                className="prize-rank-table"
              />
              <div className="table-intro-text">
                <InfoCircleOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                中奖率在表格中支持即时微调，系统会自动按概率重新划定升序顺位（1顺位表示中奖概率最低的大奖，顺位越大表示中奖概率越高）。
              </div>
            </div>

            {/* 规则一：非酋兜底/保底规则卡片 */}
            <div className={`prop-group-card rule-card ${activityType === 'public' ? 'locked' : ''}`}>
              <div className="rule-header">
                <div className="title-area">
                  <GiftOutlined className="rule-icon" />
                  <span className="rule-title">二、规则一：非酋防连续空车保底机制</span>
                </div>
                <Switch 
                  checked={enableRule1} 
                  onChange={setEnableRule1}
                  disabled={activityType === 'public'}
                  checkedChildren="启用"
                  unCheckedChildren="关闭"
                />
              </div>

              {enableRule1 && (
                <div className="rule-content-body animate-slide-in">
                  <div className="sentence-config-row">
                    <span>当用户连续</span>
                    <InputNumber
                      min={1}
                      max={99}
                      value={rule1N}
                      onChange={(val) => val && setRule1N(val)}
                      disabled={activityType === 'public'}
                      size="small"
                      className="inline-number-input"
                    />
                    <span>次未抽中概率最低的前</span>
                    <InputNumber
                      min={1}
                      max={prizes.length}
                      value={rule1X}
                      onChange={(val) => val && setRule1X(val)}
                      disabled={activityType === 'public'}
                      size="small"
                      className="inline-number-input"
                    />
                    <span>顺位奖品时，系统将在下一次抽奖时，强制从前</span>
                    <InputNumber
                      min={1}
                      max={prizes.length}
                      value={rule1Y}
                      onChange={(val) => val && setRule1Y(val)}
                      disabled={activityType === 'public'}
                      size="small"
                      className="inline-number-input"
                    />
                    <span>顺位奖品中随机派发一个。</span>
                  </div>

                  {/* 关联解析说明 */}
                  <div className="explain-box success">
                    <strong>💡 当前规则一解析：</strong>
                    <div className="explain-desc">
                      对连续空车达到 <strong>{rule1N}</strong> 次的测试账号，如果他之前一直没抽到：
                      <div className="prizes-list-tags">
                        {rule1TargetPrizes.map((p) => (
                          <span className="p-tag bad" key={p.id}>[{sortedPrizes.findIndex(sp => sp.id === p.id) + 1}顺位] {p.name} ({p.prob}%)</span>
                        ))}
                      </div>
                      则下一次必定会从以下奖池中随机必中派发一个：
                      <div className="prizes-list-tags">
                        {rule1RewardPrizes.map((p) => (
                          <span className="p-tag good" key={p.id}>[{sortedPrizes.findIndex(sp => sp.id === p.id) + 1}顺位] {p.name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 规则二：大奖限制/防刷屏蔽规则卡片 */}
            <div className={`prop-group-card rule-card ${activityType === 'public' ? 'locked' : ''}`}>
              <div className="rule-header">
                <div className="title-area">
                  <WarningOutlined className="rule-icon danger" />
                  <span className="rule-title">三、规则二：大奖出货上限限制（防刷/防薅羊毛）</span>
                </div>
                <Switch 
                  checked={enableRule2} 
                  onChange={setEnableRule2}
                  disabled={activityType === 'public'}
                  checkedChildren="启用"
                  unCheckedChildren="关闭"
                />
              </div>

              {enableRule2 && (
                <div className="rule-content-body animate-slide-in">
                  <div className="sentence-config-row">
                    <span>当用户在活动中已抽中过前</span>
                    <InputNumber
                      min={1}
                      max={prizes.length}
                      value={rule2X}
                      onChange={(val) => val && setRule2X(val)}
                      disabled={activityType === 'public'}
                      size="small"
                      className="inline-number-input"
                    />
                    <span>顺位奖品时，后续抽奖将自动屏蔽并无法抽中前</span>
                    <InputNumber
                      min={1}
                      max={prizes.length}
                      value={rule2Y}
                      onChange={(val) => val && setRule2Y(val)}
                      disabled={activityType === 'public'}
                      size="small"
                      className="inline-number-input"
                    />
                    <span>顺位奖品。</span>
                  </div>

                  {/* 关联解析说明 */}
                  <div className="explain-box error">
                    <strong>💡 当前规则二解析：</strong>
                    <div className="explain-desc">
                      只要用户在本次活动中曾经抽中过以下大奖：
                      <div className="prizes-list-tags">
                        {rule2TriggerPrizes.map((p) => (
                          <span className="p-tag danger" key={p.id}>[{sortedPrizes.findIndex(sp => sp.id === p.id) + 1}顺位] {p.name}</span>
                        ))}
                      </div>
                      在后续的抽奖过程中，他将永远无法再次抽到以下受限奖池（概率将被强制置 0）：
                      <div className="prizes-list-tags">
                        {rule2BlockPrizes.map((p) => (
                          <span className="p-tag blocked" key={p.id}>[{sortedPrizes.findIndex(sp => sp.id === p.id) + 1}顺位] {p.name} (屏蔽)</span>
                        ))}
                      </div>
                      <i>(该规则常用于对高价值奖品防刷、防单账号多次出特等大奖，以保障奖池资金安全。)</i>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </Col>
      </Row>

      {/* 中奖 Modal 弹窗 */}
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
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

      {/* 内部测试保存提示 Modal */}
      <Modal
        visible={showLegalConfirm}
        title="💾 内部规则保存安全提示"
        onCancel={() => setShowLegalConfirm(false)}
        onOk={handleConfirmInternalSave}
        okText="确认发布 (仅内测账户生效)"
        cancelText="取消"
        centered
      >
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold' }}>
            <SafetyCertificateOutlined style={{ color: '#52c41a', fontSize: 18 }} />
            您当前保存的概率干预规则属于【内部沙盒/非公开测试】设定。
          </p>
          <Alert
            message="安全保障激活"
            description="本规则保存后，仅会对系统数据库中配置了 [Test_Account] 标签的内测白名单成员生效；外部访客在点击抽奖时，系统将自动使用原版真实概率，以保障平台促销公平性及法律合规性。"
            type="success"
            showIcon
            style={{ marginTop: 12 }}
          />
        </div>
      </Modal>
    </div>
  )
}
