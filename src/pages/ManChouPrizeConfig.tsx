import { useState, useMemo } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  Input,
  InputNumber,
  Tag,
  Space,
  Radio,
  Alert,
  message,
  Popconfirm,
  Badge,
  Slider,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  GiftOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ThunderboltOutlined,
  MobileOutlined,
} from '@ant-design/icons'
import './ManChouPrizeConfig.css'

// ─── 抽奖活动库 Mock 数据 ────────────────────────────────────────────────────
interface LotteryActivity {
  id: number
  title: string
  subTitle: string
  imgUrl: string
  status: number // 1: 进行中, 2: 未开始
  statusText: string
  beginTime: string
  endTime: string
  prizesSummary: string
}

const mockLotteryLibrary: LotteryActivity[] = [
  {
    id: 101,
    title: '【618周年庆】狂欢大转盘',
    subTitle: '全场通用，高转化大转盘抽奖',
    imgUrl: 'https://b0.dtminds.com/1/2026/03/09/g8kVWn.png',
    status: 1,
    statusText: '进行中',
    beginTime: '2026-06-01',
    endTime: '2026-06-30',
    prizesSummary: '一等奖iPhone 16 Pro、50元无门槛券、免单红包',
  },
  {
    id: 102,
    title: '【天天有礼】幸运抽盲盒',
    subTitle: '100%中奖惊喜盲盒抽奖',
    imgUrl: 'https://b0.dtminds.com/1/2026/03/03/48d7hQ.png!w1100.webp',
    status: 1,
    statusText: '进行中',
    beginTime: '2026-05-20',
    endTime: '2026-07-20',
    prizesSummary: '戴森吹风机、美妆中样礼包、满减券',
  },
  {
    id: 103,
    title: '【会员尊享】金蛋大狂欢',
    subTitle: '限高价值会员参与的砸金蛋活动',
    imgUrl: 'https://b0.dtminds.com/1/2026/03/03/w7f6aq.png',
    status: 1,
    statusText: '进行中',
    beginTime: '2026-06-10',
    endTime: '2026-06-25',
    prizesSummary: '戴尔外星人主机、扫地机器人、888积分',
  },
  {
    id: 104,
    title: '【免单专场】夏日幸运大翻牌',
    subTitle: '超高爆率免单活动',
    imgUrl: 'https://b0.dtminds.com/1/2026/03/09/nVWl0t.png',
    status: 2,
    statusText: '未开始',
    beginTime: '2026-07-01',
    endTime: '2026-07-31',
    prizesSummary: '最高整单全额免单、海量优惠券',
  },
]

// ─── 奖品门槛梯度数据模型 ─────────────────────────────────────────────────────
export interface PrizeTier {
  id: string // 客户端唯一标识（可用 uuid 或临时字符串）
  lotteryId: number
  lotteryTitle: string
  lotteryPic: string
  prizeCost: number // 兑换门槛（元）
  lotteryTimes: number // 赠送抽奖次数
  guideText?: string // 引导文案
}

// 默认预置数据：正是用户提到的场景（满188送1次，满388送3次，满1888送5次，同一个抽奖活动）
const defaultTiers: PrizeTier[] = [
  {
    id: 'tier_1',
    lotteryId: 101,
    lotteryTitle: '【618周年庆】狂欢大转盘',
    lotteryPic: 'https://b0.dtminds.com/1/2026/03/09/g8kVWn.png',
    prizeCost: 188,
    lotteryTimes: 1,
    guideText: '必中好礼',
  },
  {
    id: 'tier_2',
    lotteryId: 101,
    lotteryTitle: '【618周年庆】狂欢大转盘',
    lotteryPic: 'https://b0.dtminds.com/1/2026/03/09/g8kVWn.png',
    prizeCost: 388,
    lotteryTimes: 3,
    guideText: '抽iPhone大奖',
  },
  {
    id: 'tier_3',
    lotteryId: 101,
    lotteryTitle: '【618周年庆】狂欢大转盘',
    lotteryPic: 'https://b0.dtminds.com/1/2026/03/09/g8kVWn.png',
    prizeCost: 1888,
    lotteryTimes: 5,
    guideText: '超高中奖率',
  },
]

export default function ManChouPrizeConfig() {
  // 活动表单状态
  const [ruleType, setRuleType] = useState<number>(4) // 4: 叠加奖励, 1: N选1
  const [prizes, setPrizes] = useState<PrizeTier[]>(defaultTiers)

  // 弹窗状态
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [editingTiers, setEditingTiers] = useState<PrizeTier[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  // C 端模拟器状态
  const [simulatedAmount, setSimulatedAmount] = useState<number>(500)
  const [exchangedPrizes, setExchangedPrizes] = useState<Record<string, number>>({})
  const [remainingDraws, setRemainingDraws] = useState<number>(0)

  // ─── 弹窗操作方法 ────────────────────────────────────────────────────────────

  // 打开弹窗：深拷贝当前主页面配置好的奖品梯度
  const handleOpenModal = () => {
    setEditingTiers(JSON.parse(JSON.stringify(prizes)))
    setSearchKeyword('')
    setModalVisible(true)
  }

  // 校验当前梯度中是否存在重复门槛
  const duplicateCosts = useMemo(() => {
    const costMap: Record<number, number> = {}
    const duplicates: number[] = []
    editingTiers.forEach((tier) => {
      if (tier.prizeCost !== undefined && tier.prizeCost !== null) {
        costMap[tier.prizeCost] = (costMap[tier.prizeCost] || 0) + 1
      }
    })
    Object.keys(costMap).forEach((costStr) => {
      const cost = Number(costStr)
      if (costMap[cost] > 1) {
        duplicates.push(cost)
      }
    })
    return duplicates
  }, [editingTiers])

  // 添加抽奖活动为奖品（支持对同一个抽奖活动点击多次）
  const handleAddTierFromLottery = (lottery: LotteryActivity) => {
    if (editingTiers.length >= 10) {
      message.warning('最多只能添加 10 个抽奖奖品')
      return
    }

    // 计算建议门槛：如果已有奖品，取最大门槛 + 200，否则 188
    let suggestedCost = 188
    let suggestedTimes = 1
    if (editingTiers.length > 0) {
      const maxCost = Math.max(...editingTiers.map((t) => t.prizeCost || 0))
      suggestedCost = maxCost + 200
      const lastTier = editingTiers[editingTiers.length - 1]
      suggestedTimes = (lastTier.lotteryTimes || 1) + 2
    }

    const newTier: PrizeTier = {
      id: 'tier_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      lotteryId: lottery.id,
      lotteryTitle: lottery.title,
      lotteryPic: lottery.imgUrl,
      prizeCost: suggestedCost,
      lotteryTimes: suggestedTimes,
      guideText: '幸运抽奖',
    }

    setEditingTiers((prev) => [...prev, newTier])
    message.success(`已将「${lottery.title}」选为奖品`)
  }

  // 删除奖品
  const handleRemoveTier = (index: number) => {
    const updated = [...editingTiers]
    updated.splice(index, 1)
    setEditingTiers(updated)
  }

  // 上移/下移
  const handleMoveTier = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === editingTiers.length - 1)
    ) {
      return
    }
    const updated = [...editingTiers]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    setEditingTiers(updated)
  }

  // 按门槛从小到大一键排序
  const handleSortAsc = () => {
    const sorted = [...editingTiers].sort((a, b) => (a.prizeCost || 0) - (b.prizeCost || 0))
    setEditingTiers(sorted)
    message.success('已自动按门槛金额升序排列')
  }

  // 确认保存弹窗配置
  const handleConfirmModal = () => {
    if (editingTiers.length === 0) {
      message.error('请至少添加一个抽奖奖品')
      return
    }

    // 校验每个奖品的合法性
    for (let i = 0; i < editingTiers.length; i++) {
      const tier = editingTiers[i]
      if (!tier.prizeCost || tier.prizeCost <= 0) {
        message.error(`第 ${i + 1} 个奖品的兑换门槛必须大于 0`)
        return
      }
      if (!tier.lotteryTimes || tier.lotteryTimes < 1) {
        message.error(`第 ${i + 1} 个奖品的赠送抽奖次数必须至少为 1 次`)
        return
      }
    }

    if (duplicateCosts.length > 0) {
      message.error(`存在相同的门槛金额（¥${duplicateCosts.join(', ¥')}），门槛不可重复！`)
      return
    }

    setPrizes(editingTiers)
    setModalVisible(false)
    message.success('抽奖活动与奖品配置已更新')
  }

  // 快捷载入指定样例（满188送1次 / 满388送3次 / 满1888送5次）
  const handleLoadUserScenario = () => {
    setPrizes(defaultTiers)
    message.success('已载入测试用例：满188送1次、满388送3次、满1888送5次（同一活动）')
  }

  // ─── 主页面表格列定义 ────────────────────────────────────────────────────────
  const columns = [
    {
      title: '序号',
      width: 70,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <span className="tw-font-bold tw-text-gray-500">#{index + 1}</span>
      ),
    },
    {
      title: '奖品图片',
      dataIndex: 'lotteryPic',
      width: 90,
      render: (pic: string) => (
        <img
          src={pic}
          alt="奖品"
          className="tw-w-[50px] tw-h-[50px] tw-rounded-lg tw-object-cover tw-border tw-border-gray-200"
        />
      ),
    },
    {
      title: '关联抽奖活动',
      dataIndex: 'lotteryTitle',
      render: (title: string, record: PrizeTier) => (
        <div>
          <div className="tw-font-medium tw-text-gray-800">{title}</div>
          <div className="tw-text-xs tw-text-gray-400 tw-mt-0.5">
            活动ID: {record.lotteryId}
            <Tag color="cyan" className="tw-ml-2 !tw-text-[11px]">
              大转盘
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: '兑换门槛 (元)',
      dataIndex: 'prizeCost',
      width: 150,
      render: (cost: number, _: PrizeTier, index: number) => (
        <InputNumber
          min={0.01}
          max={999999}
          precision={2}
          prefix="¥"
          value={cost}
          style={{ width: 110 }}
          onChange={(val) => {
            const updated = [...prizes]
            updated[index].prizeCost = val || 0
            setPrizes(updated)
          }}
        />
      ),
    },
    {
      title: '赠送抽奖次数',
      dataIndex: 'lotteryTimes',
      width: 140,
      render: (times: number, _: PrizeTier, index: number) => (
        <InputNumber
          min={1}
          max={999}
          precision={0}
          addonAfter="次"
          value={times}
          style={{ width: 100 }}
          onChange={(val) => {
            const updated = [...prizes]
            updated[index].lotteryTimes = val || 1
            setPrizes(updated)
          }}
        />
      ),
    },
    {
      title: '引导文案',
      dataIndex: 'guideText',
      width: 180,
      render: (text: string, _: PrizeTier, index: number) => (
        <Input
          maxLength={20}
          placeholder="如: 抽iPhone"
          value={text}
          onChange={(e) => {
            const updated = [...prizes]
            updated[index].guideText = e.target.value
            setPrizes(updated)
          }}
        />
      ),
    },
    {
      title: '操作',
      width: 100,
      render: (_: any, __: PrizeTier, index: number) => (
        <Popconfirm
          title="确定删除此奖品吗？"
          onConfirm={() => {
            const updated = prizes.filter((_, i) => i !== index)
            setPrizes(updated)
            message.info('已删除奖品')
          }}
        >
          <a className="tw-text-red-500">删除</a>
        </Popconfirm>
      ),
    },
  ]

  // ─── 过滤左侧抽奖活动库 ──────────────────────────────────────────────────────
  const filteredLotteries = useMemo(() => {
    if (!searchKeyword.trim()) return mockLotteryLibrary
    return mockLotteryLibrary.filter(
      (l) => l.title.includes(searchKeyword) || l.subTitle.includes(searchKeyword)
    )
  }, [searchKeyword])

  // ─── C端预览数据联动计算 ─────────────────────────────────────────────────────
  // 模拟用户额度消耗
  const spentAmount = useMemo(() => {
    return prizes.reduce((sum, p) => {
      const times = exchangedPrizes[p.id] || 0
      return sum + times * p.prizeCost
    }, 0)
  }, [prizes, exchangedPrizes])

  const userBalance = Math.max(0, simulatedAmount - spentAmount)

  const handleSimulatedExchange = (tier: PrizeTier) => {
    if (userBalance < tier.prizeCost) {
      message.error('完结金额额度不足，无法兑换！')
      return
    }
    if (ruleType === 1 && Object.keys(exchangedPrizes).length > 0) {
      message.warning('阶梯N选一模式下，已兑换过奖品，无法重复兑换！')
      return
    }

    Modal.confirm({
      title: '确认兑换此档位奖品？',
      content: (
        <div>
          <p>
            消耗完结金额额度：<b className="tw-text-red-600">¥{tier.prizeCost}</b>
          </p>
          <p>
            获得奖励：赠送 <b>{tier.lotteryTimes}</b> 次「{tier.lotteryTitle}」抽奖资格
          </p>
          <p className="tw-text-xs tw-text-gray-400">兑换后抽奖机会将自动充入您的账户中。</p>
        </div>
      ),
      okText: '确认兑换',
      cancelText: '取消',
      onOk: () => {
        setExchangedPrizes((prev) => ({
          ...prev,
          [tier.id]: (prev[tier.id] || 0) + 1,
        }))
        setRemainingDraws((prev) => prev + tier.lotteryTimes)
        message.success(
          `兑换成功！已为你发放 ${tier.lotteryTimes} 次抽奖资格，前往转盘即可畅玩！`
        )
      },
    })
  }

  return (
    <div className="manchou-config-container">
      {/* 顶部标题区 */}
      <div className="manchou-page-header">
        <div>
          <div className="tw-flex tw-items-center tw-gap-2">
            <h2 className="tw-text-xl tw-font-bold tw-text-gray-800 tw-m-0">
              订单转换满抽活动配置
            </h2>
            <Tag color="orange">高保真交互 Demo</Tag>
          </div>
          <p className="tw-text-xs tw-text-gray-500 tw-mt-1 tw-mb-0">
            支持针对「同一个抽奖活动」配置多个门槛并选为奖品，分别设置不同门槛赠送的抽奖次数。
          </p>
        </div>

        <Space>
          <Button icon={<ThunderboltOutlined />} onClick={handleLoadUserScenario}>
            重置并载入用例 (满188送1次 / 满388送3次 / 满1888送5次)
          </Button>
          <Button type="primary" onClick={handleOpenModal} icon={<PlusOutlined />}>
            添加 / 配置抽奖奖品
          </Button>
        </Space>
      </div>

      {/* 核心工作区：左侧规则与奖品表格，右侧C端小程序实时预览 */}
      <div className="manchou-layout-grid">
        {/* 左侧配置面板 */}
        <div className="tw-flex tw-flex-col tw-gap-4">
          <Card title="抽奖与规则设置" size="small" bordered={false}>
            <div className="tw-mb-4 tw-flex tw-items-center tw-gap-6">
              <span className="tw-font-medium tw-text-gray-700">奖品领取方式：</span>
              <Radio.Group value={ruleType} onChange={(e) => setRuleType(e.target.value)}>
                <Radio value={4}>
                  <b>奖励叠加</b>
                  <span className="tw-text-xs tw-text-gray-400 tw-ml-1">
                    (每次兑换扣减对应门槛额度，额度足够可重复兑换)
                  </span>
                </Radio>
                <Radio value={1}>
                  <b>奖品N选一</b>
                  <span className="tw-text-xs tw-text-gray-400 tw-ml-1">
                    (满足多个门槛时，用户只能选择其中1件兑换)
                  </span>
                </Radio>
              </Radio.Group>
            </div>

            <Alert
              type="info"
              showIcon
              message={
                <div className="tw-text-xs">
                  当前支持为<b>同一个抽奖活动</b>绑定多个兑换档位（例如：满188送1次、满388送3次、满1888送5次），用户达到相应门槛即可兑换对应数量的抽奖机会。
                </div>
              }
              className="tw-mb-4"
            />

            <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
              <div className="tw-font-medium tw-text-gray-800">
                抽奖奖品列表 ({prizes.length}/10)
              </div>
              <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={handleOpenModal}>
                打开弹窗选为奖品
              </Button>
            </div>

            <Table
              dataSource={prizes}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="middle"
              className="tw-border tw-rounded-lg"
            />
          </Card>

          {/* 规则生成摘要 */}
          <Card title="C端活动前台文案实时生成预览" size="small" bordered={false}>
            <div className="tw-bg-gray-50 tw-p-3 tw-rounded-lg tw-text-xs tw-text-gray-700 tw-space-y-1.5">
              <div className="tw-font-semibold tw-text-gray-900">
                后端动态生成的奖品文案规则（C端小程序展示）：
              </div>
              {prizes.map((p, idx) => (
                <div key={p.id} className="tw-flex tw-items-center tw-gap-2">
                  <Badge status="processing" />
                  <span className="tw-font-medium">奖品 {idx + 1}：</span>
                  <span className="tw-text-red-600 tw-font-bold">
                    满 {p.prizeCost} 元可兑 {p.lotteryTimes} 次抽奖机会
                  </span>
                  <span className="tw-text-gray-400">
                    （绑定抽奖活动：{p.lotteryTitle}，引导文案：{p.guideText || '-'}）
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 右侧：C端小程序高保真手机实时预览 */}
        <div className="mobile-preview-wrapper">
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
            <span className="tw-font-bold tw-text-gray-800 tw-flex tw-items-center tw-gap-1">
              <MobileOutlined /> C端小程序实时效果
            </span>
            <Tag color="green">实时联动</Tag>
          </div>

          {/* 模拟器控制台 */}
          <div className="tw-bg-gray-100 tw-p-2.5 tw-rounded-lg tw-mb-3 tw-text-xs">
            <div className="tw-flex tw-justify-between tw-mb-1">
              <span className="tw-text-gray-600">模拟用户已完结金额:</span>
              <b className="tw-text-red-500">¥ {simulatedAmount}</b>
            </div>
            <Slider
              min={0}
              max={2500}
              step={50}
              value={simulatedAmount}
              onChange={(val) => setSimulatedAmount(val)}
            />
            <div className="tw-flex tw-justify-between tw-text-gray-500 tw-mt-1">
              <span>剩余可用额度: ¥{userBalance}</span>
              <span>获得抽奖机会: {remainingDraws} 次</span>
            </div>
          </div>

          {/* 手机机身 */}
          <div className="phone-shell">
            <div className="phone-screen custom-scroll">
              <div className="phone-notch" />

              {/* 小程序 Header */}
              <div className="tw-bg-gradient-to-r tw-from-orange-500 tw-to-pink-500 tw-p-4 tw-text-white tw-relative">
                <div className="tw-text-xs tw-opacity-80">订单转换满额抽大奖</div>
                <div className="tw-text-lg tw-font-bold tw-mt-1">618 年中狂欢专场</div>
                <div className="tw-mt-3 tw-bg-white/20 tw-backdrop-blur-sm tw-rounded-lg tw-p-2 tw-flex tw-justify-between tw-items-center">
                  <div>
                    <div className="tw-text-[10px] tw-opacity-80">已完结金额 / 可用额度</div>
                    <div className="tw-text-sm tw-font-bold">
                      ¥ {simulatedAmount} / <span className="tw-text-yellow-200">¥{userBalance}</span>
                    </div>
                  </div>
                  <Tag color="gold" className="!tw-m-0">
                    抽奖机会: {remainingDraws}次
                  </Tag>
                </div>
              </div>

              {/* 奖品列表 */}
              <div className="tw-p-3 tw-flex-1">
                <div className="tw-text-xs tw-font-bold tw-text-gray-700 tw-mb-2">活动奖品</div>

                <div className="tw-space-y-2.5">
                  {prizes.map((p) => {
                    const isExchanged = (exchangedPrizes[p.id] || 0) > 0
                    const canExchange = userBalance >= p.prizeCost
                    const progressPercent = Math.min(
                      100,
                      Math.round((userBalance / p.prizeCost) * 100)
                    )

                    return (
                      <div
                        key={p.id}
                        className="tw-bg-white tw-rounded-xl tw-p-2.5 tw-shadow-sm tw-border tw-border-gray-100 tw-flex tw-items-center tw-justify-between"
                      >
                        <img
                          src={p.lotteryPic}
                          className="tw-w-[52px] tw-h-[52px] tw-rounded-lg tw-object-cover tw-mr-2.5"
                          alt="prize"
                        />
                        <div className="tw-flex-1 tw-min-w-0">
                          {/* 标题即为动态生成的文案 */}
                          <div className="tw-text-xs tw-font-bold tw-text-gray-900 tw-truncate">
                            满{p.prizeCost}元可兑{p.lotteryTimes}次抽奖
                          </div>
                          <div className="tw-text-[10px] tw-text-gray-400 tw-mt-0.5">
                            {p.guideText || '好礼不停'}
                          </div>

                          {/* 进度条 */}
                          <div className="tw-w-full tw-bg-gray-100 tw-h-1.5 tw-rounded-full tw-mt-1.5 tw-overflow-hidden">
                            <div
                              className="tw-bg-red-500 tw-h-full"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* 兑换按钮 */}
                        <div className="tw-ml-2">
                          <button
                            onClick={() => handleSimulatedExchange(p)}
                            disabled={!canExchange}
                            className={`tw-text-[11px] tw-font-bold tw-px-2.5 tw-py-1.5 tw-rounded-full tw-transition ${
                              canExchange
                                ? 'tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-shadow'
                                : 'tw-bg-gray-200 tw-text-gray-400 tw-cursor-not-allowed'
                            }`}
                          >
                            {isExchanged && ruleType === 4
                              ? '继续兑换'
                              : isExchanged
                              ? '已兑换'
                              : canExchange
                              ? '去兑换'
                              : '差额'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 底部提示 */}
              <div className="tw-p-2 tw-text-center tw-text-[10px] tw-text-gray-400">
                订单转换且解冻后即可自动充入额度兑奖
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 核心弹窗交互：关联抽奖活动与奖品配置 ────────────────────────── */}
      <Modal
        title={
          <div>
            <div className="tw-text-base tw-font-bold tw-text-gray-800">
              关联抽奖活动与奖品配置
            </div>
            <div className="tw-text-xs tw-text-gray-500 tw-font-normal tw-mt-0.5">
              左侧选择抽奖活动选为奖品（支持同一活动选择多次），右侧灵活配置各奖品的门槛金额与赠送抽奖次数。
            </div>
          </div>
        }
        open={modalVisible}
        width={980}
        onCancel={() => setModalVisible(false)}
        onOk={handleConfirmModal}
        okText="确认并应用"
        cancelText="取消"
        destroyOnClose
      >
        <div className="lottery-modal-container">
          {/* 左侧：抽奖活动库 */}
          <div className="lottery-modal-left">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
              <span className="tw-font-bold tw-text-gray-700 tw-text-sm">
                ① 选择抽奖活动
              </span>
              <span className="tw-text-xs tw-text-gray-400">共 {filteredLotteries.length} 个活动</span>
            </div>

            <Input
              prefix={<SearchOutlined className="tw-text-gray-400" />}
              placeholder="搜索抽奖活动名称..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              allowClear
              size="middle"
            />

            {/* 活动卡片列表 */}
            <div className="lottery-list-scroll custom-scroll">
              {filteredLotteries.map((lottery) => {
                // 统计当前活动在右侧已被添加了多少次
                const addedCount = editingTiers.filter((t) => t.lotteryId === lottery.id).length

                return (
                  <div key={lottery.id} className="lottery-item-card">
                    <img
                      src={lottery.imgUrl}
                      alt={lottery.title}
                      className="tw-w-[48px] tw-h-[48px] tw-rounded-lg tw-object-cover tw-mr-3 tw-border tw-border-gray-200"
                    />

                    <div className="tw-flex-1 tw-min-w-0 tw-mr-2">
                      <div className="tw-flex tw-items-center tw-gap-1.5">
                        <span className="tw-font-bold tw-text-gray-800 tw-text-xs tw-truncate">
                          {lottery.title}
                        </span>
                        <Tag
                          color={lottery.status === 1 ? 'green' : 'default'}
                          className="!tw-text-[10px] !tw-px-1"
                        >
                          {lottery.statusText}
                        </Tag>
                      </div>

                      <div className="tw-text-[11px] tw-text-gray-500 tw-mt-1 tw-truncate">
                        {lottery.prizesSummary}
                      </div>

                      <div className="tw-text-[10px] tw-text-gray-400 tw-mt-0.5">
                        有效时间: {lottery.beginTime} ~ {lottery.endTime}
                      </div>
                    </div>

                    <div className="tw-flex tw-flex-col tw-items-end tw-gap-1">
                      {addedCount > 0 && (
                        <span className="tw-text-[10px] tw-text-blue-600 tw-bg-blue-50 tw-px-1.5 tw-py-0.5 tw-rounded">
                          已选 {addedCount} 次
                        </span>
                      )}
                      <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddTierFromLottery(lottery)}
                      >
                        + 选为奖品
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 右侧：已选奖品配置区 (支持同一活动多次选择 & 次数配置) */}
          <div className="lottery-modal-right">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
              <div className="tw-flex tw-items-center tw-gap-2">
                <span className="tw-font-bold tw-text-gray-700 tw-text-sm">
                  ② 已选奖品列表 ({editingTiers.length}/10)
                </span>
                {duplicateCosts.length > 0 && (
                  <Tag color="error" icon={<ExclamationCircleOutlined />}>
                    门槛重复
                  </Tag>
                )}
              </div>

              <Space size="small">
                <Button size="small" onClick={handleSortAsc}>
                  按门槛金额升序
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => setEditingTiers([])}
                  disabled={editingTiers.length === 0}
                >
                  清空
                </Button>
              </Space>
            </div>

            {/* 重复告警 */}
            {duplicateCosts.length > 0 && (
              <Alert
                type="error"
                showIcon
                message={`门槛金额不能相同：存在重复的 ¥${duplicateCosts.join(
                  ', ¥'
                )}，请调整后再保存！`}
                className="tw-mb-2.5 !tw-py-1"
              />
            )}

            {/* 奖品卡片列表 */}
            <div className="lottery-list-scroll custom-scroll tw-mt-0">
              {editingTiers.length === 0 ? (
                <div className="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-gray-400 tw-py-16">
                  <GiftOutlined className="tw-text-4xl tw-mb-2 tw-text-gray-300" />
                  <div className="tw-text-sm">暂未选择奖品</div>
                  <div className="tw-text-xs tw-mt-1">
                    请从左侧将抽奖活动选为奖品，支持多次选择同一个活动设置不同门槛
                  </div>
                </div>
              ) : (
                editingTiers.map((tier, idx) => {
                  const isDup = duplicateCosts.includes(tier.prizeCost)

                  return (
                    <div
                      key={tier.id}
                      className={`tier-item-card ${isDup ? 'has-error' : ''}`}
                    >
                      {/* 卡片头部 */}
                      <div className="tw-flex tw-justify-between tw-items-center tw-mb-2.5">
                        <div className="tw-flex tw-items-center">
                          <span className="tier-badge">奖品 #{idx + 1}</span>
                          <span className="tw-font-bold tw-text-xs tw-text-gray-800">
                            {tier.lotteryTitle}
                          </span>
                        </div>

                        <Space size="small">
                          <Button
                            type="text"
                            size="small"
                            icon={<ArrowUpOutlined />}
                            disabled={idx === 0}
                            onClick={() => handleMoveTier(idx, 'up')}
                            title="上移"
                          />
                          <Button
                            type="text"
                            size="small"
                            icon={<ArrowDownOutlined />}
                            disabled={idx === editingTiers.length - 1}
                            onClick={() => handleMoveTier(idx, 'down')}
                            title="下移"
                          />
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveTier(idx)}
                            title="删除"
                          />
                        </Space>
                      </div>

                      {/* 卡片表单行：门槛 + 赠送抽奖次数 + 引导文案 */}
                      <div className="tw-grid tw-grid-cols-3 tw-gap-3 tw-items-center">
                        {/* 门槛金额 */}
                        <div>
                          <div className="tw-text-[11px] tw-text-gray-600 tw-mb-1 tw-flex tw-items-center">
                            <span className="tw-text-red-500 tw-mr-0.5">*</span> 兑奖门槛:
                          </div>
                          <InputNumber
                            min={0.01}
                            max={999999}
                            precision={2}
                            prefix="¥"
                            status={isDup ? 'error' : ''}
                            value={tier.prizeCost}
                            className="tw-w-full"
                            placeholder="如 188"
                            onChange={(val) => {
                              const updated = [...editingTiers]
                              updated[idx].prizeCost = val || 0
                              setEditingTiers(updated)
                            }}
                          />
                        </div>

                        {/* 赠送抽奖次数 */}
                        <div>
                          <div className="tw-text-[11px] tw-text-gray-600 tw-mb-1 tw-flex tw-items-center">
                            <span className="tw-text-red-500 tw-mr-0.5">*</span> 赠送抽奖次数:
                          </div>
                          <InputNumber
                            min={1}
                            max={999}
                            precision={0}
                            addonAfter="次"
                            value={tier.lotteryTimes}
                            className="tw-w-full"
                            placeholder="如 1"
                            onChange={(val) => {
                              const updated = [...editingTiers]
                              updated[idx].lotteryTimes = val || 1
                              setEditingTiers(updated)
                            }}
                          />
                        </div>

                        {/* 引导文案 */}
                        <div>
                          <div className="tw-text-[11px] tw-text-gray-600 tw-mb-1">引导文案 (选填):</div>
                          <Input
                            maxLength={20}
                            placeholder="如: 抢iPhone"
                            value={tier.guideText}
                            onChange={(e) => {
                              const updated = [...editingTiers]
                              updated[idx].guideText = e.target.value
                              setEditingTiers(updated)
                            }}
                          />
                        </div>
                      </div>

                      {/* 规则预览脚标 */}
                      <div className="tw-mt-2 tw-pt-1.5 tw-border-t tw-border-gray-100 tw-flex tw-justify-between tw-items-center tw-text-[11px] tw-text-gray-500">
                        <span>
                          生成效果：满{' '}
                          <b className="tw-text-red-500">¥{tier.prizeCost || 0}</b> 送{' '}
                          <b className="tw-text-blue-600">{tier.lotteryTimes || 1}</b> 次抽奖
                        </span>
                        {isDup && (
                          <span className="tw-text-red-500 tw-font-bold">⚠️ 门槛金额与其他奖品重复</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* 底部摘要预览 */}
            <div className="tw-mt-3 tw-pt-2 tw-border-t tw-border-gray-200 tw-flex tw-justify-between tw-items-center tw-text-xs">
              <span className="tw-text-gray-500">
                当前共添加了{' '}
                <b className="tw-text-gray-800">{editingTiers.length}</b> 个奖品，覆盖{' '}
                <b className="tw-text-gray-800">
                  {new Set(editingTiers.map((t) => t.lotteryId)).size}
                </b>{' '}
                个抽奖活动
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
