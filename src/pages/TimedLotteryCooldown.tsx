import { useState, useMemo } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Input,
  InputNumber,
  message,
  Radio,
  Segmented,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  GiftOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import './TimedLotteryCooldown.css'

// 中文数字等级转换（对齐真实 admin-ops getChinesNum）
const CHINESE_NUMS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
function getChineseLevel(level: number): string {
  if (level <= 10) return `${CHINESE_NUMS[level]}等奖`
  return `第${level}等奖`
}

// 数据模型定义
type ManualCheatType = 'DEFAULT' | 'WHITE' | 'BLACK'
type PhaseMode = 'PHASE_1' | 'PHASE_2'
type PrizeLevelMode = 'ALL' | 'SELECTED'

interface CooldownConfig {
  enabled: boolean
  limitDays: number
  // 二期扩展字段：历史中奖奖品等级限制
  prizeLevelMode: PrizeLevelMode
  restrictedLevels: number[]
}

interface PrizeItem {
  id: string
  level: number
  title: string
  prizeType: '赠品' | '优惠券' | '积分' | '微信红包'
  prizeNum: number
}

interface Participant {
  id: string
  nickname: string
  phone: string
  avatarColor: string
  orgWeight: number
  // 模拟真实表字段：参与时若命中冷却则自动写入 cheatType = AUTO_COOLDOWN (或复用 BLACK)；
  // 运营后续可手动修改为 DEFAULT(取消降权恢复原权重) / WHITE(加权) / BLACK(人工拉黑)
  manualOverride: 'NONE' | ManualCheatType
  // 参与本活动时，距离上一次定时开奖中奖已经过了多少天（null 表示参与时无近期中奖记录；-1 表示参与本活动之后才在别的活动中奖）
  winDaysBeforeJoin: number | null
  lastWinLevel: number | null
  lastWinPrizeTitle: string | null
  joinTimeDesc: string
}

type EffectiveStatus =
  | 'NORMAL'
  | 'AUTO_COOLDOWN'
  | 'MANUAL_RECOVERED'
  | 'POST_JOIN_WIN_EXEMPT'
  | 'MANUAL_WHITE'
  | 'MANUAL_BLACK'

interface EvaluatedParticipant extends Participant {
  autoTriggeredOnJoin: boolean
  effectiveStatus: EffectiveStatus
  effectiveWeight: number
  statusReason: string
}

interface DrawSlotResult {
  slotIndex: number
  prizeId: string
  prizeLevel: number
  prizeTitle: string
  prizeType: string
  winner: EvaluatedParticipant | null
  outcome: 'WHITE' | 'NORMAL' | 'RECOVERED' | 'ABORTED_INSUFFICIENT'
  note: string
}

interface DrawSimulationResult {
  executedAt: string
  totalPrizes: number
  whiteCount: number
  normalCount: number
  recoveredCount: number
  cooldownCount: number
  blackCount: number
  effectiveCount: number
  triggeredInsufficient: boolean
  steps: string[]
  slots: DrawSlotResult[]
  issuedCount: number
  abortedCount: number
}

// 预置奖品模板
const DEFAULT_PRIZES: PrizeItem[] = [
  { id: 'p1', level: 1, title: '戴森吹风机 HD15', prizeType: '赠品', prizeNum: 1 },
  { id: 'p2', level: 2, title: '100元无门槛礼券', prizeType: '优惠券', prizeNum: 2 },
  { id: 'p3', level: 3, title: '500 会员积分', prizeType: '积分', prizeNum: 3 },
]

// 预设场景 1：常规人数充足（12人参与，5件奖品）
const PRESET_NORMAL_USERS: Participant[] = [
  { id: 'u1', nickname: '新客小李', phone: '138****1021', avatarColor: '#1890ff', orgWeight: 920, manualOverride: 'NONE', winDaysBeforeJoin: null, lastWinLevel: null, lastWinPrizeTitle: null, joinTimeDesc: '11-10 10:12 参与' },
  { id: 'u2', nickname: '活跃陈姐', phone: '139****3382', avatarColor: '#52c41a', orgWeight: 865, manualOverride: 'NONE', winDaysBeforeJoin: 45, lastWinLevel: 1, lastWinPrizeTitle: '戴森吹风机', joinTimeDesc: '11-10 11:05 参与' },
  { id: 'u3', nickname: '老粉阿强', phone: '136****7741', avatarColor: '#13c2c2', orgWeight: 810, manualOverride: 'NONE', winDaysBeforeJoin: null, lastWinLevel: null, lastWinPrizeTitle: null, joinTimeDesc: '11-10 14:20 参与' },
  { id: 'u4', nickname: '美妆达人', phone: '137****8890', avatarColor: '#eb2f96', orgWeight: 790, manualOverride: 'NONE', winDaysBeforeJoin: 6, lastWinLevel: 1, lastWinPrizeTitle: '苹果耳机', joinTimeDesc: '11-10 15:30 参与' },
  { id: 'u5', nickname: 'VIP小张', phone: '135****9912', avatarColor: '#722ed1', orgWeight: 740, manualOverride: 'WHITE', winDaysBeforeJoin: 12, lastWinLevel: 2, lastWinPrizeTitle: '100元券', joinTimeDesc: '11-10 16:00 参与' },
  { id: 'u6', nickname: '薅羊毛A君', phone: '158****4410', avatarColor: '#fa541c', orgWeight: 950, manualOverride: 'BLACK', winDaysBeforeJoin: 3, lastWinLevel: 2, lastWinPrizeTitle: '100元券', joinTimeDesc: '11-10 16:40 参与' },
  { id: 'u7', nickname: '周六逛逛', phone: '159****2201', avatarColor: '#2f54eb', orgWeight: 720, manualOverride: 'DEFAULT', winDaysBeforeJoin: 18, lastWinLevel: 2, lastWinPrizeTitle: '100元券', joinTimeDesc: '11-10 17:10 参与' },
  { id: 'u8', nickname: '糖果妈妈', phone: '186****6135', avatarColor: '#fa8c16', orgWeight: 695, manualOverride: 'NONE', winDaysBeforeJoin: null, lastWinLevel: null, lastWinPrizeTitle: null, joinTimeDesc: '11-11 09:15 参与' },
  { id: 'u9', nickname: '阳光小林', phone: '188****5098', avatarColor: '#a0d911', orgWeight: 660, manualOverride: 'NONE', winDaysBeforeJoin: 10, lastWinLevel: 3, lastWinPrizeTitle: '500积分', joinTimeDesc: '11-11 10:02 参与' },
  { id: 'u10', nickname: '跨活动粉阿飞', phone: '131****4872', avatarColor: '#08979c', orgWeight: 880, manualOverride: 'NONE', winDaysBeforeJoin: -1, lastWinLevel: 1, lastWinPrizeTitle: '戴森吹风机', joinTimeDesc: '11-08 先参与，11-11 才中他店奖' },
  { id: 'u11', nickname: '奶茶不加冰', phone: '132****1943', avatarColor: '#eb2f96', orgWeight: 590, manualOverride: 'NONE', winDaysBeforeJoin: null, lastWinLevel: null, lastWinPrizeTitle: null, joinTimeDesc: '11-11 12:40 参与' },
  { id: 'u12', nickname: '清风徐来', phone: '133****7029', avatarColor: '#52c41a', orgWeight: 540, manualOverride: 'NONE', winDaysBeforeJoin: 62, lastWinLevel: 2, lastWinPrizeTitle: '100元券', joinTimeDesc: '11-11 14:22 参与' },
]

// 预设场景 2：有效人数小于奖品数边界（10人参与：有效4人 < 6件奖品，不补发流抽）
const PRESET_INSUFFICIENT_USERS: Participant[] = [
  { id: 's1', nickname: 'VIP小张', phone: '135****9912', avatarColor: '#722ed1', orgWeight: 740, manualOverride: 'WHITE', winDaysBeforeJoin: 12, lastWinLevel: 2, lastWinPrizeTitle: '100元券', joinTimeDesc: '11-10 09:00 参与' },
  { id: 's2', nickname: '新客小李', phone: '138****1021', avatarColor: '#1890ff', orgWeight: 920, manualOverride: 'NONE', winDaysBeforeJoin: null, lastWinLevel: null, lastWinPrizeTitle: null, joinTimeDesc: '11-10 10:15 参与' },
  { id: 's3', nickname: '活跃陈姐', phone: '139****3382', avatarColor: '#52c41a', orgWeight: 840, manualOverride: 'NONE', winDaysBeforeJoin: 45, lastWinLevel: 1, lastWinPrizeTitle: '戴森吹风机', joinTimeDesc: '11-10 11:20 参与' },
  { id: 's4', nickname: '老粉阿强', phone: '136****7741', avatarColor: '#13c2c2', orgWeight: 780, manualOverride: 'NONE', winDaysBeforeJoin: null, lastWinLevel: null, lastWinPrizeTitle: null, joinTimeDesc: '11-10 14:00 参与' },
  { id: 's5', nickname: '高频粉小红', phone: '137****5511', avatarColor: '#fa8c16', orgWeight: 960, manualOverride: 'NONE', winDaysBeforeJoin: 25, lastWinLevel: 1, lastWinPrizeTitle: '戴森吹风机', joinTimeDesc: '11-10 15:10 参与' },
  { id: 's6', nickname: '复购老王', phone: '150****6622', avatarColor: '#eb2f96', orgWeight: 890, manualOverride: 'NONE', winDaysBeforeJoin: 18, lastWinLevel: 2, lastWinPrizeTitle: '100元券', joinTimeDesc: '11-10 16:45 参与' },
  { id: 's7', nickname: '早鸟阿明', phone: '151****7733', avatarColor: '#2f54eb', orgWeight: 810, manualOverride: 'NONE', winDaysBeforeJoin: 9, lastWinLevel: 2, lastWinPrizeTitle: '100元券', joinTimeDesc: '11-11 08:30 参与' },
  { id: 's8', nickname: '天天打卡君', phone: '152****8844', avatarColor: '#13c2c2', orgWeight: 760, manualOverride: 'NONE', winDaysBeforeJoin: 4, lastWinLevel: 3, lastWinPrizeTitle: '500积分', joinTimeDesc: '11-11 09:50 参与' },
  { id: 's9', nickname: '幸运星小周', phone: '153****9955', avatarColor: '#52c41a', orgWeight: 700, manualOverride: 'NONE', winDaysBeforeJoin: 2, lastWinLevel: 1, lastWinPrizeTitle: '苹果耳机', joinTimeDesc: '11-11 11:10 参与' },
  { id: 's10', nickname: '羊毛黑号B', phone: '158****4410', avatarColor: '#ff4d4f', orgWeight: 990, manualOverride: 'BLACK', winDaysBeforeJoin: 5, lastWinLevel: 2, lastWinPrizeTitle: '100元券', joinTimeDesc: '11-11 13:05 参与' },
]

export default function TimedLotteryCooldown() {
  // 阶段视角切换：默认一期落地版（仅限制周期），可切换至二期规划预览（含历史奖品等级）
  const [phaseMode, setPhaseMode] = useState<PhaseMode>('PHASE_1')

  // 活动基础信息
  const [activityTitle, setActivityTitle] = useState<string>('宠粉福利第12期 · 定时开好礼')
  const [drawMode, setDrawMode] = useState<1 | 2>(1)

  // 核心：防连中冷却规则配置
  const [config, setConfig] = useState<CooldownConfig>({
    enabled: true,
    limitDays: 30,
    prizeLevelMode: 'ALL',
    restrictedLevels: [1, 2],
  })

  // 本场奖品配置（默认 6 件奖品）
  const [prizes, setPrizes] = useState<PrizeItem[]>(DEFAULT_PRIZES)

  // 参与用户池
  const [participants, setParticipants] = useState<Participant[]>(PRESET_INSUFFICIENT_USERS)

  // 开奖模拟结果
  const [simResult, setSimResult] = useState<DrawSimulationResult | null>(null)
  const [activePreset, setActivePreset] = useState<'normal' | 'insufficient'>('insufficient')

  // 奖品总数量
  const totalPrizeCount = useMemo(
    () => prizes.reduce((sum, p) => sum + (p.prizeNum || 0), 0),
    [prizes]
  )

  // 评估每个用户在“参与时刻触发降权 + 运营后续人工修改”的最终状态
  const evaluatedUsers: EvaluatedParticipant[] = useMemo(() => {
    const effectiveLevelMode: PrizeLevelMode = phaseMode === 'PHASE_1' ? 'ALL' : config.prizeLevelMode

    return participants.map((u) => {
      // 1. 参与时是否自动触发了冷却降权
      let autoTriggeredOnJoin = false
      if (
        config.enabled &&
        u.winDaysBeforeJoin !== null &&
        u.winDaysBeforeJoin >= 0 &&
        u.winDaysBeforeJoin <= config.limitDays
      ) {
        if (effectiveLevelMode === 'ALL') {
          autoTriggeredOnJoin = true
        } else if (u.lastWinLevel !== null && config.restrictedLevels.includes(u.lastWinLevel)) {
          autoTriggeredOnJoin = true
        }
      }

      // 2. 结合运营后续在后台对参与记录的手动修改（manualOverride）
      let effectiveStatus: EffectiveStatus = 'NORMAL'
      let effectiveWeight = u.orgWeight
      let statusReason = '参与时无近期中奖记录，正常按权重参与开奖'

      if (u.manualOverride === 'BLACK') {
        effectiveStatus = 'MANUAL_BLACK'
        effectiveWeight = 0
        statusReason = '人工拉黑，权重置 0，本场不中奖'
      } else if (u.manualOverride === 'WHITE') {
        effectiveStatus = 'MANUAL_WHITE'
        effectiveWeight = u.orgWeight + 1000000
        statusReason = autoTriggeredOnJoin
          ? `参与时已自动降权，后由运营手动改为「加权」，恢复并置顶权重`
          : '人工加权白名单，优先按奖品等级从高到低派奖'
      } else if (u.manualOverride === 'DEFAULT' && autoTriggeredOnJoin) {
        effectiveStatus = 'MANUAL_RECOVERED'
        effectiveWeight = u.orgWeight
        statusReason = `参与时命中近${config.limitDays}天冷却自动降权，后由运营手动改回「不干预」，已恢复原权重 ${u.orgWeight}`
      } else if (autoTriggeredOnJoin) {
        effectiveStatus = 'AUTO_COOLDOWN'
        effectiveWeight = 0
        statusReason = `参与前${u.winDaysBeforeJoin}天中过${getChineseLevel(u.lastWinLevel || 1)}，参与时自动降权（权重置0），支持后台手动恢复`
      } else if (u.winDaysBeforeJoin === -1) {
        effectiveStatus = 'POST_JOIN_WIN_EXEMPT'
        effectiveWeight = u.orgWeight
        statusReason = '参与本活动时尚未中奖；参与后才在其他活动中奖，保留原权重正常参与'
      } else if (u.winDaysBeforeJoin !== null && u.winDaysBeforeJoin > config.limitDays) {
        statusReason = `参与前${u.winDaysBeforeJoin}天中过奖（已超过${config.limitDays}天限制周期，正常参与）`
      } else if (
        phaseMode === 'PHASE_2' &&
        config.enabled &&
        u.winDaysBeforeJoin !== null &&
        u.winDaysBeforeJoin >= 0 &&
        u.winDaysBeforeJoin <= config.limitDays &&
        effectiveLevelMode === 'SELECTED'
      ) {
        statusReason = `参与前${u.winDaysBeforeJoin}天中过历史${getChineseLevel(u.lastWinLevel || 1)}（未在限制等级内，正常参与）`
      }

      return {
        ...u,
        autoTriggeredOnJoin,
        effectiveStatus,
        effectiveWeight,
        statusReason,
      }
    })
  }, [participants, config, phaseMode])

  // 实时统计指标
  const stats = useMemo(() => {
    const white = evaluatedUsers.filter((u) => u.effectiveStatus === 'MANUAL_WHITE').length
    const normal = evaluatedUsers.filter(
      (u) => u.effectiveStatus === 'NORMAL' || u.effectiveStatus === 'POST_JOIN_WIN_EXEMPT'
    ).length
    const recovered = evaluatedUsers.filter((u) => u.effectiveStatus === 'MANUAL_RECOVERED').length
    const cooldown = evaluatedUsers.filter((u) => u.effectiveStatus === 'AUTO_COOLDOWN').length
    const black = evaluatedUsers.filter((u) => u.effectiveStatus === 'MANUAL_BLACK').length
    const effective = white + normal + recovered
    const shortage = Math.max(0, totalPrizeCount - effective)
    return {
      total: evaluatedUsers.length,
      white,
      normal,
      recovered,
      cooldown,
      black,
      effective,
      shortage,
      isInsufficient: totalPrizeCount > 0 && effective < totalPrizeCount,
    }
  }, [evaluatedUsers, totalPrizeCount])

  // 切换预设演示场景
  const applyPreset = (preset: 'normal' | 'insufficient') => {
    setActivePreset(preset)
    setSimResult(null)
    if (preset === 'normal') {
      setPrizes([
        { id: 'p1', level: 1, title: '戴森吹风机 HD15', prizeType: '赠品', prizeNum: 1 },
        { id: 'p2', level: 2, title: '100元无门槛礼券', prizeType: '优惠券', prizeNum: 2 },
        { id: 'p3', level: 3, title: '500 会员积分', prizeType: '积分', prizeNum: 2 },
      ])
      setConfig((prev) => ({
        ...prev,
        enabled: true,
        limitDays: 30,
      }))
      setParticipants(PRESET_NORMAL_USERS)
      message.success('已切换：常规人数充足场景（含1位参与后手动恢复、1位参与后才中他奖）')
    } else {
      setPrizes([
        { id: 'p1', level: 1, title: '戴森吹风机 HD15', prizeType: '赠品', prizeNum: 1 },
        { id: 'p2', level: 2, title: '100元无门槛礼券', prizeType: '优惠券', prizeNum: 2 },
        { id: 'p3', level: 3, title: '500 会员积分', prizeType: '积分', prizeNum: 3 },
      ])
      setConfig((prev) => ({
        ...prev,
        enabled: true,
        limitDays: 30,
      }))
      setParticipants(PRESET_INSUFFICIENT_USERS)
      message.warning('已切换：有效人数不足奖品边界场景（有效4人 < 6件奖品，剩余2件不补发）')
    }
  }

  // 更新单行人工干预状态（允许将自动冷却用户改回“不干预”恢复权重或改为“加权”）
  const handleChangeCheat = (userId: string, val: 'AUTO' | ManualCheatType) => {
    setParticipants((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u
        return { ...u, manualOverride: val === 'AUTO' ? 'NONE' : val }
      })
    )
    setSimResult(null)
  }

  // 添加模拟测试用户
  const handleAddMockUser = (kind: 'normal' | 'cooldown') => {
    const idx = participants.length + 1
    const randomWeight = Math.floor(400 + Math.random() * 550)
    const newUser: Participant =
      kind === 'cooldown'
        ? {
            id: `u_${Date.now()}`,
            nickname: `冷却老客#${idx}`,
            phone: `139****${1000 + idx}`,
            avatarColor: '#fa8c16',
            orgWeight: randomWeight,
            manualOverride: 'NONE',
            winDaysBeforeJoin: Math.floor(3 + Math.random() * 20),
            lastWinLevel: 2,
            lastWinPrizeTitle: '100元无门槛礼券',
            joinTimeDesc: '刚刚参与',
          }
        : {
            id: `u_${Date.now()}`,
            nickname: `新参与用户#${idx}`,
            phone: `138****${2000 + idx}`,
            avatarColor: '#1890ff',
            orgWeight: randomWeight,
            manualOverride: 'NONE',
            winDaysBeforeJoin: null,
            lastWinLevel: null,
            lastWinPrizeTitle: null,
            joinTimeDesc: '刚刚参与',
          }
    setParticipants((prev) => [...prev, newUser])
    setSimResult(null)
  }

  // 修改奖品数量
  const handlePrizeNumChange = (id: string, num: number | null) => {
    setPrizes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, prizeNum: Math.max(0, num || 0) } : p))
    )
    setSimResult(null)
  }

  // 新增奖品等级
  const handleAddPrize = () => {
    const nextLevel = prizes.length + 1
    if (nextLevel > 10) {
      message.warning('演示最多支持添加 10 个等级')
      return
    }
    setPrizes((prev) => [
      ...prev,
      {
        id: `p_${Date.now()}`,
        level: nextLevel,
        title: `${getChineseLevel(nextLevel)}福利礼品`,
        prizeType: '积分',
        prizeNum: 1,
      },
    ])
    setSimResult(null)
  }

  // 删除奖品等级并重排等级序号
  const handleRemovePrize = (id: string) => {
    if (prizes.length <= 1) {
      message.warning('至少保留 1 个奖品')
      return
    }
    setPrizes((prev) =>
      prev
        .filter((p) => p.id !== id)
        .map((p, idx) => ({ ...p, level: idx + 1 }))
    )
    setSimResult(null)
  }

  // 核心：模拟执行定时开奖算奖逻辑（完全复用现有 pageByWeight weightRandom > 0）
  const runDrawSimulation = () => {
    if (totalPrizeCount <= 0) {
      message.warning('请至少配置 1 件奖品数量后再模拟开奖')
      return
    }

    const sortedPrizes = [...prizes].sort((a, b) => a.level - b.level)
    const prizeSlots: { prizeId: string; prizeLevel: number; prizeTitle: string; prizeType: string }[] = []
    sortedPrizes.forEach((p) => {
      for (let i = 0; i < p.prizeNum; i++) {
        prizeSlots.push({
          prizeId: p.id,
          prizeLevel: p.level,
          prizeTitle: p.title,
          prizeType: p.prizeType,
        })
      }
    })

    const whiteQueue = evaluatedUsers
      .filter((u) => u.effectiveStatus === 'MANUAL_WHITE')
      .sort((a, b) => b.effectiveWeight - a.effectiveWeight)

    const normalQueue = evaluatedUsers
      .filter(
        (u) =>
          u.effectiveStatus === 'NORMAL' ||
          u.effectiveStatus === 'MANUAL_RECOVERED' ||
          u.effectiveStatus === 'POST_JOIN_WIN_EXEMPT'
      )
      .sort((a, b) => b.effectiveWeight - a.effectiveWeight)

    const recoveredCount = evaluatedUsers.filter((u) => u.effectiveStatus === 'MANUAL_RECOVERED').length
    const cooldownUsers = evaluatedUsers.filter((u) => u.effectiveStatus === 'AUTO_COOLDOWN')
    const blackUsers = evaluatedUsers.filter((u) => u.effectiveStatus === 'MANUAL_BLACK')

    const primaryQueue = [...whiteQueue, ...normalQueue]
    const triggeredInsufficient = primaryQueue.length < prizeSlots.length

    const levelDesc =
      phaseMode === 'PHASE_2' && config.prizeLevelMode === 'SELECTED'
        ? `历史${config.restrictedLevels.map(getChineseLevel).join('、') || '未选等级'}`
        : '任意定时开奖奖品'

    const steps: string[] = [
      `Step 1：待发奖品共 ${prizeSlots.length} 件，总参与人 ${evaluatedUsers.length} 人。`,
      `Step 2：各用户【参与时】已自动校验「参与时间前 ${config.limitDays} 天内是否中过${levelDesc}」，自动触发降权（存原权重，当前权重置 0）且未被人工恢复共 ${cooldownUsers.length} 人；由运营手动恢复权重 ${recoveredCount} 人。`,
      `Step 3：开奖直接按权重查询（weightRandom > 0）：人工加权 ${whiteQueue.length} 人置顶；其余有效用户 ${normalQueue.length} 人按权重降序；人工拉黑 ${blackUsers.length} 人已置 0 过滤。`,
      triggeredInsufficient
        ? `Step 4 ⚠️：有效人数 (${primaryQueue.length} 人) < 奖品总数 (${prizeSlots.length} 件)，与现行降权规则一致：发完 ${primaryQueue.length} 名有效人后结束开奖，剩余 ${prizeSlots.length - primaryQueue.length} 件不补发（流抽保留库存）。`
        : `Step 4 ✅：有效人数 (${primaryQueue.length} 人) ≥ 奖品总数 (${prizeSlots.length} 件)，全部奖品在有效候选队列中派发完毕。`,
    ]

    const slotsResult: DrawSlotResult[] = []
    let primaryCursor = 0
    let issuedCount = 0
    let abortedCount = 0

    prizeSlots.forEach((slot, idx) => {
      if (primaryCursor < primaryQueue.length) {
        const winner = primaryQueue[primaryCursor++]
        const isWhite = winner.effectiveStatus === 'MANUAL_WHITE'
        const isRecovered = winner.effectiveStatus === 'MANUAL_RECOVERED'
        issuedCount++
        slotsResult.push({
          slotIndex: idx + 1,
          ...slot,
          winner,
          outcome: isWhite ? 'WHITE' : isRecovered ? 'RECOVERED' : 'NORMAL',
          note: isWhite
            ? `人工加权优先派发（权重 ${winner.effectiveWeight}）`
            : isRecovered
              ? `参与时自动降权后由运营手动恢复原权重（权重 ${winner.orgWeight}）`
              : `正常未冷却中奖（权重 ${winner.orgWeight}）`,
        })
      } else {
        abortedCount++
        slotsResult.push({
          slotIndex: idx + 1,
          ...slot,
          winner: null,
          outcome: 'ABORTED_INSUFFICIENT',
          note: '有效人数不足奖品数：与现行降权规则一致，剩余奖品不补发（保留库存）',
        })
      }
    })

    setSimResult({
      executedAt: new Date().toLocaleTimeString(),
      totalPrizes: prizeSlots.length,
      whiteCount: whiteQueue.length,
      normalCount: normalQueue.length - recoveredCount,
      recoveredCount,
      cooldownCount: cooldownUsers.length,
      blackCount: blackUsers.length,
      effectiveCount: primaryQueue.length,
      triggeredInsufficient,
      steps,
      slots: slotsResult,
      issuedCount,
      abortedCount,
    })

    message.success('已完成定时开奖模拟演算，请在右下方查看派奖结果明细')
  }

  // 动态生成 C 端规则文本（温和无感、避免出现“降权/拉黑”等技术词）
  const cEndRuleDescription = useMemo(() => {
    if (!config.enabled) {
      return '本次活动面向所有符合参与条件的用户开放开奖，系统将按公平随机权重派发全部奖品。'
    }
    const levelDesc =
      phaseMode === 'PHASE_2' && config.prizeLevelMode === 'SELECTED'
        ? config.restrictedLevels.length > 0
          ? `曾获得过${config.restrictedLevels.sort((a, b) => a - b).map(getChineseLevel).join('、')}的`
          : '曾中过指定等级奖品的'
        : '已中过奖的'

    return `为让更多小伙伴体验中奖乐趣，若您参与本活动前 ${config.limitDays} 天内已在本店定时开奖活动中${levelDesc}，本次仍可正常参与活动及互动任务，但开奖时将优先把中奖机会留给近期未中奖的小伙伴哦~（若符合条件的有效参与人数少于奖品总数，剩余奖品不予补发）`
  }, [config, phaseMode])

  const availableLevels = useMemo(() => {
    const levels = prizes.map((p) => p.level)
    return Array.from(new Set(levels)).sort((a, b) => a - b)
  }, [prizes])

  const prizeColumns = [
    {
      title: '奖品等级',
      dataIndex: 'level',
      width: 95,
      render: (level: number) => (
        <span className={`tlc-level-badge ${level <= 3 ? `tlc-level-${level}` : 'tlc-level-other'}`}>
          {getChineseLevel(level)}
        </span>
      ),
    },
    {
      title: '奖品名称',
      dataIndex: 'title',
      render: (val: string, record: PrizeItem) => (
        <Space size={6}>
          <span style={{ fontWeight: 500, color: '#1f2937' }}>{val}</span>
          <Tag style={{ fontSize: 11 }}>{record.prizeType}</Tag>
        </Space>
      ),
    },
    {
      title: '奖品数量（件）',
      dataIndex: 'prizeNum',
      width: 140,
      render: (num: number, record: PrizeItem) => (
        <InputNumber
          min={0}
          max={999}
          precision={0}
          size="small"
          value={num}
          onChange={(val) => handlePrizeNumChange(record.id, val)}
          style={{ width: 88 }}
        />
      ),
    },
    {
      title: '操作',
      width: 70,
      render: (_: unknown, record: PrizeItem) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemovePrize(record.id)}
          disabled={prizes.length <= 1}
        />
      ),
    },
  ]

  const participantColumns = [
    {
      title: '参与用户 / 参与时间',
      key: 'user',
      width: 185,
      render: (_: unknown, record: EvaluatedParticipant) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="tlc-user-avatar" style={{ backgroundColor: record.avatarColor }}>
            {record.nickname.slice(0, 1)}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 12.5, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {record.nickname}
            </div>
            <div style={{ fontSize: 11, color: '#8c8c8c' }}>
              原权重: <b>{record.orgWeight}</b> · {record.joinTimeDesc}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '参与前中奖记录',
      key: 'history',
      width: 130,
      render: (_: unknown, record: EvaluatedParticipant) => {
        if (record.winDaysBeforeJoin === null) {
          return <span style={{ fontSize: 12, color: '#9ca3af' }}>从未中奖</span>
        }
        if (record.winDaysBeforeJoin === -1) {
          return (
            <div style={{ fontSize: 11.5, color: '#08979c' }}>
              参与时无记录
              <div style={{ fontSize: 10.5, color: '#6b7280' }}>参与后中过{getChineseLevel(record.lastWinLevel || 1)}</div>
            </div>
          )
        }
        return (
          <div style={{ fontSize: 12, lineHeight: 1.35 }}>
            <div style={{ color: '#374151', fontWeight: 500 }}>
              参与前 {record.winDaysBeforeJoin} 天中过
            </div>
            <div style={{ color: '#6b7280', fontSize: 11 }}>
              {getChineseLevel(record.lastWinLevel || 1)} · {record.lastWinPrizeTitle}
            </div>
          </div>
        )
      },
    },
    {
      title: '当前状态',
      key: 'status',
      render: (_: unknown, record: EvaluatedParticipant) => {
        if (record.effectiveStatus === 'MANUAL_BLACK') {
          return (
            <Tooltip title={record.statusReason}>
              <Tag color="error" icon={<StopOutlined />}>
                人工拉黑
              </Tag>
            </Tooltip>
          )
        }
        if (record.effectiveStatus === 'MANUAL_WHITE') {
          return (
            <Tooltip title={record.statusReason}>
              <div>
                <Tag color="purple" icon={<CrownOutlined />}>
                  人工加权
                </Tag>
                {record.autoTriggeredOnJoin && (
                  <div style={{ fontSize: 10.5, color: '#722ed1', marginTop: 2 }}>
                    手动覆盖自动降权
                  </div>
                )}
              </div>
            </Tooltip>
          )
        }
        if (record.effectiveStatus === 'MANUAL_RECOVERED') {
          return (
            <Tooltip title={record.statusReason}>
              <div>
                <Tag color="blue" icon={<CheckCircleOutlined />}>
                  已手动取消降权
                </Tag>
                <div style={{ fontSize: 10.5, color: '#1890ff', marginTop: 2 }}>
                  恢复原权重 {record.orgWeight}
                </div>
              </div>
            </Tooltip>
          )
        }
        if (record.effectiveStatus === 'AUTO_COOLDOWN') {
          return (
            <Tooltip title={record.statusReason}>
              <div>
                <Tag color="warning" icon={<ClockCircleOutlined />}>
                  冷却自动降权
                </Tag>
                <div style={{ fontSize: 10.5, color: '#d46b08', marginTop: 2 }}>
                  参与时置0 · 可手动改
                </div>
              </div>
            </Tooltip>
          )
        }
        if (record.effectiveStatus === 'POST_JOIN_WIN_EXEMPT') {
          return (
            <Tooltip title={record.statusReason}>
              <div>
                <Tag color="cyan" icon={<InfoCircleOutlined />}>
                  正常参与(参与后中他奖)
                </Tag>
              </div>
            </Tooltip>
          )
        }
        return (
          <Tooltip title={record.statusReason}>
            <Tag color="success" icon={<CheckCircleOutlined />}>
              正常参与
            </Tag>
          </Tooltip>
        )
      },
    },
    {
      title: '人工干预(可修改)',
      key: 'cheat',
      width: 120,
      render: (_: unknown, record: EvaluatedParticipant) => {
        const selectValue =
          record.manualOverride === 'NONE'
            ? record.autoTriggeredOnJoin
              ? 'AUTO'
              : 'DEFAULT'
            : record.manualOverride
        return (
          <Select
            size="small"
            value={selectValue}
            style={{ width: 108 }}
            onChange={(val) => handleChangeCheat(record.id, val as 'AUTO' | ManualCheatType)}
            options={
              record.autoTriggeredOnJoin
                ? [
                    { label: '冷却降权(默认)', value: 'AUTO' },
                    { label: '恢复不干预', value: 'DEFAULT' },
                    { label: '改为加权', value: 'WHITE' },
                    { label: '人工拉黑', value: 'BLACK' },
                  ]
                : [
                    { label: '不干预', value: 'DEFAULT' },
                    { label: '加权', value: 'WHITE' },
                    { label: '拉黑', value: 'BLACK' },
                  ]
            }
          />
        )
      },
    },
  ]

  return (
    <div className="tlc-container">
      {/* 顶部栏 + 阶段切换 + 快速测试用例切换 */}
      <div className="tlc-page-header">
        <div className="tlc-header-left">
          <div className="tlc-title-row">
            <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <h2>定时开奖 · 中奖冷却规则（参与时自动降权）原型</h2>
            <Tag color="blue">参与即校验置0 · 复用现行干预体系</Tag>
            <Tag color="default">人数不足不补发</Tag>
          </div>
          <div className="tlc-subtitle">
            在用户【参与活动时】判断前 N 天内是否中过奖并自动触发降权（保留 orgWeight，权重置 0），兼容按时间/按人数开奖，且支持运营后续在数据列表手动恢复或加权。
          </div>
        </div>

        <div className="tlc-preset-bar">
          <Segmented
            size="small"
            value={phaseMode}
            onChange={(val) => {
              setPhaseMode(val as PhaseMode)
              setSimResult(null)
            }}
            options={[
              { label: '一期落地版（仅限周期）', value: 'PHASE_1' },
              { label: '二期规划预览（+历史奖品等级）', value: 'PHASE_2' },
            ]}
          />
          <Divider type="vertical" />
          <Button
            size="small"
            type={activePreset === 'normal' ? 'primary' : 'default'}
            onClick={() => applyPreset('normal')}
          >
            人数充足 (12人/5奖)
          </Button>
          <Button
            size="small"
            type={activePreset === 'insufficient' ? 'primary' : 'default'}
            onClick={() => applyPreset('insufficient')}
          >
            人数不足边界 (4有效/6奖)
          </Button>
        </div>
      </div>

      {/* 主工作区：左配置 + 右实时监控与沙盒 */}
      <div className="tlc-main-grid">
        {/* ================= 左栏：B端活动配置表单 ================= */}
        <div>
          {/* 卡片1：基础与开奖方式 */}
          <div className="tlc-card">
            <div className="tlc-card-header">
              <span className="tlc-card-title">基础信息与开奖方式</span>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>对应 timing-lottery/details/base-info.vue</span>
            </div>
            <div className="tlc-card-body">
              <div className="tlc-form-row">
                <div className="tlc-form-label">
                  <span className="required-star">*</span>活动名称：
                </div>
                <div className="tlc-form-control">
                  <Input
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    maxLength={20}
                    style={{ maxWidth: 400 }}
                    suffix={`${activityTitle.length}/20`}
                  />
                </div>
              </div>
              <div className="tlc-form-row">
                <div className="tlc-form-label">
                  <span className="required-star">*</span>开奖方式：
                </div>
                <div className="tlc-form-control">
                  <Radio.Group value={drawMode} onChange={(e) => setDrawMode(e.target.value)}>
                    <Radio value={1}>活动结束后自动开奖</Radio>
                    <Radio value={2}>按人数开奖</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>

          {/* 卡片2：核心新增 — 开奖规则与中奖冷却限制 */}
          <div className="tlc-card" style={{ borderColor: '#bae0ff' }}>
            <div className="tlc-card-header" style={{ background: '#f5f9ff' }}>
              <span className="tlc-card-title">
                防重复中奖限制（中奖冷却）
                <Tag color="processing" style={{ fontSize: 11, marginLeft: 4 }}>
                  {phaseMode === 'PHASE_1' ? '一期 MVP' : '二期扩展预览'}
                </Tag>
              </span>
              <span style={{ fontSize: 12, color: '#0958d9' }}>参与时自动降权 · 后续可手动修改</span>
            </div>
            <div className="tlc-card-body">
              <div className="tlc-form-row">
                <div className="tlc-form-label">
                  <span className="required-star">*</span>中奖冷却限制
                  <Tooltip title="为了防止一个用户频繁中奖，让活动更加公平，可启用中奖冷却机制。">
                    <QuestionCircleOutlined style={{ color: '#bfbfbf', marginLeft: 4, cursor: 'pointer' }} />
                  </Tooltip>
                  ：
                </div>
                <div className="tlc-form-control">
                  <Radio.Group
                    value={config.enabled}
                    onChange={(e) => {
                      setConfig((prev) => ({ ...prev, enabled: e.target.value }))
                      setSimResult(null)
                    }}
                  >
                    <Radio value={false}>不限制</Radio>
                    <Radio value={true}>限制（参与时自动降权）</Radio>
                  </Radio.Group>

                  {config.enabled && (
                    <div className="tlc-extends-box">
                      {/* 限制周期设置 */}
                      <div className="tlc-sub-row">
                        <div className="tlc-sub-label">
                          限制周期
                          <Tooltip title="用户参与本活动时，校验其「参与时间 - N 天」至今是否有定时开奖中奖记录">
                            <InfoCircleOutlined style={{ color: '#bfbfbf', marginLeft: 4 }} />
                          </Tooltip>
                          ：
                        </div>
                        <div className="tlc-sub-control">
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                            <span style={{ fontSize: 13 }}>参与前</span>
                            <InputNumber
                              min={1}
                              max={365}
                              precision={0}
                              value={config.limitDays}
                              onChange={(val) => {
                                setConfig((prev) => ({ ...prev, limitDays: val || 1 }))
                                setSimResult(null)
                              }}
                              style={{ width: 84 }}
                            />
                            <span style={{ fontSize: 13 }}>天内已中奖用户，本次参与不予中奖</span>

                            <div className="tlc-quick-days">
                              {[7, 15, 30, 90].map((d) => (
                                <button
                                  key={d}
                                  type="button"
                                  className={`tlc-day-chip ${config.limitDays === d ? 'active' : ''}`}
                                  onClick={() => {
                                    setConfig((prev) => ({ ...prev, limitDays: d }))
                                    setSimResult(null)
                                  }}
                                >
                                  {d}天
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 关键执行逻辑与边界提示条 */}
                      <Alert
                        type="info"
                        showIcon
                        style={{ marginTop: 12 }}
                        message="规则与注意事项"
                        description={
                          <ul style={{ margin: '4px 0 0 0', paddingLeft: 18, fontSize: 12, lineHeight: 1.65, color: '#374151' }}>
                            <li>
                              <b>参与时自动降权：</b>用户参与本活动时，系统校验其「<b>参与前 {config.limitDays} 天内</b>」至今在定时开奖的中奖记录；若已中过奖，用户仍可正常参与活动，但其本次参与记录将被自动降权（开奖时不中奖）。
                            </li>
                            <li>
                              <b>支持人工后续调整：</b>自动降权记录会同步展示在【参与数据】列表中，运营可通过【人工干预】手动改回「不干预」。
                            </li>
                            <li>
                              <b>人数不足奖品时不补发：</b>若排除降权及拉黑用户后，有效可中奖人数少于本场奖品总数，剩余奖品将不再补发。
                            </li>
                          </ul>
                        }
                      />

                      {/* 二期规划区：历史中奖奖品等级过滤 */}
                      {phaseMode === 'PHASE_2' ? (
                        <>
                          <Divider style={{ margin: '14px 0' }} />
                          <div className="tlc-sub-row">
                            <div className="tlc-sub-label">
                              历史中奖等级
                              <Tag color="gold" style={{ fontSize: 10, marginLeft: 4 }}>二期</Tag>
                              ：
                            </div>
                            <div className="tlc-sub-control">
                              <Radio.Group
                                value={config.prizeLevelMode}
                                onChange={(e) => {
                                  setConfig((prev) => ({ ...prev, prizeLevelMode: e.target.value }))
                                  setSimResult(null)
                                }}
                              >
                                <Radio value="ALL">全部历史奖品等级</Radio>
                                <Radio value="SELECTED">指定历史中奖等级</Radio>
                              </Radio.Group>

                              {config.prizeLevelMode === 'SELECTED' && (
                                <div
                                  style={{
                                    marginTop: 10,
                                    padding: '10px 12px',
                                    background: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 6,
                                  }}
                                >
                                  <div style={{ fontSize: 12, color: '#4b5563', marginBottom: 8 }}>
                                    限制<b>历史中奖</b>的奖品等级（参与前 {config.limitDays} 天在定时开奖中获得过以下等级奖品的用户，参与时自动降权）：
                                  </div>
                                  <Checkbox.Group
                                    value={config.restrictedLevels}
                                    onChange={(checked) => {
                                      setConfig((prev) => ({
                                        ...prev,
                                        restrictedLevels: checked as number[],
                                      }))
                                      setSimResult(null)
                                    }}
                                  >
                                    <Space wrap>
                                      {availableLevels.map((lvl) => (
                                        <Checkbox key={lvl} value={lvl}>
                                          历史{getChineseLevel(lvl)}
                                        </Checkbox>
                                      ))}
                                    </Space>
                                  </Checkbox.Group>
                                  <div className="tlc-help-text" style={{ marginTop: 6 }}>
                                    💡 语义说明：此处限制的是<b>历史中奖时的奖品等级</b>（非限制当次奖品）；例如仅勾选一、二等奖，则过去只中过三等奖安慰奖的用户参与时不触发降权。
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div
                          style={{
                            marginTop: 12,
                            padding: '8px 12px',
                            background: '#ffffff',
                            border: '1px dashed #d9d9d9',
                            borderRadius: 6,
                            fontSize: 12,
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                            flexWrap: 'wrap',
                          }}
                        >
                          <span>
                            📌 <b>二期规划预留：</b>按「历史中奖奖品等级」区分冷却（例如仅历史中过一/二等奖触发降权，安慰奖豁免）将在二期支持。
                          </span>
                          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => setPhaseMode('PHASE_2')}>
                            预览二期交互 →
                          </Button>
                        </div>
                      )}

                      {/* 动态规则总结 + C端文案预览 */}
                      <div className="tlc-rule-summary-box">
                        <div className="tlc-rule-summary-title">
                          <SafetyCertificateOutlined /> 当前生效规则摘要
                        </div>
                        <div className="tlc-rule-summary-text">
                          用户参与活动时，若参与前 <b>{config.limitDays} 天</b> 内在定时开奖中过{' '}
                          <b>
                            {phaseMode === 'PHASE_2' && config.prizeLevelMode === 'SELECTED'
                              ? config.restrictedLevels.length > 0
                                ? `历史${config.restrictedLevels.sort((a, b) => a - b).map(getChineseLevel).join('、')}`
                                : '（未选等级）'
                              : '任意奖品'}
                          </b>{' '}
                          ，则自动降权（权重置 0）；后台列表后续可手动取消降权或加权。有效人数不足奖品总数时<b>不补发</b>。
                        </div>
                        <div className="tlc-c-preview-box">
                          <b>C端活动页规则说明建议文案（温和合规，避免“降权/拉黑”等技术词）：</b>
                          <div style={{ marginTop: 4 }}>{cEndRuleDescription}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 卡片3：本场奖品设置 */}
          <div className="tlc-card">
            <div className="tlc-card-header">
              <span className="tlc-card-title">
                本场奖品设置（可实时调数量测试边界）
              </span>
              <Space>
                <span style={{ fontSize: 12.5, color: '#4b5563' }}>
                  共 <b>{prizes.length}</b> 种，总计 <b style={{ color: '#1890ff' }}>{totalPrizeCount}</b> 件奖品
                </span>
                <Button size="small" icon={<PlusOutlined />} onClick={handleAddPrize}>
                  添加等级
                </Button>
              </Space>
            </div>
            <div className="tlc-card-body" style={{ padding: '12px 16px' }}>
              <Table
                size="small"
                pagination={false}
                dataSource={prizes}
                columns={prizeColumns}
                rowKey="id"
              />
            </div>
          </div>
        </div>

        {/* ================= 右栏：实时参与池监控 & 算奖沙盒 ================= */}
        <div>
          {/* 右侧顶部：资格分布监控 & 人工修改调试 */}
          <div className="tlc-card">
            <div className="tlc-card-header">
              <span className="tlc-card-title">参与数据与人工干预（可手动修改自动降权）</span>
              <Space size={6}>
                <Button
                  size="small"
                  icon={<UserAddOutlined />}
                  onClick={() => handleAddMockUser('normal')}
                >
                  +正常人
                </Button>
                <Button
                  size="small"
                  icon={<ClockCircleOutlined />}
                  onClick={() => handleAddMockUser('cooldown')}
                >
                  +冷却人
                </Button>
              </Space>
            </div>

            <div className="tlc-card-body" style={{ padding: '16px' }}>
              {/* 统计指标四宫格 */}
              <div className="tlc-metrics-grid">
                <div className="tlc-metric-box blue">
                  <div className="tlc-metric-num">{stats.total}</div>
                  <div className="tlc-metric-label">总参与人数</div>
                </div>
                <div className="tlc-metric-box green">
                  <div className="tlc-metric-num">{stats.effective}</div>
                  <div className="tlc-metric-label">
                    有效候选(含恢复{stats.recovered})
                  </div>
                </div>
                <div className="tlc-metric-box orange">
                  <div className="tlc-metric-num">{stats.cooldown}</div>
                  <div className="tlc-metric-label">冷却自动降权</div>
                </div>
                <div className="tlc-metric-box red">
                  <div className="tlc-metric-num">{stats.black}</div>
                  <div className="tlc-metric-label">人工拉黑</div>
                </div>
              </div>

              {/* 核心边界提醒：人数 < 奖品 */}
              {stats.isInsufficient ? (
                <Alert
                  type="warning"
                  showIcon
                  icon={<ExclamationCircleOutlined />}
                  style={{ marginBottom: 12 }}
                  message={
                    <span style={{ fontWeight: 600, fontSize: 13 }}>
                      提示：有效候选人数 ({stats.effective} 人) &lt; 本场奖品总数 ({totalPrizeCount} 件)，存在 {stats.shortage} 件缺口
                    </span>
                  }
                  description={
                    <span style={{ fontSize: 12 }}>
                      与当前降权规则一致：仅向 <b>{stats.effective} 名</b> 有效候选人派发奖品，剩余 <b>{stats.shortage} 件</b> 奖品不补发（流抽保留库存）。可在下方将冷却用户手动改回「恢复不干预」体验释放名额。
                    </span>
                  }
                />
              ) : (
                <Alert
                  type="success"
                  showIcon
                  style={{ marginBottom: 12 }}
                  message={
                    <span style={{ fontSize: 12.5 }}>
                      当前有效候选人数 (<b>{stats.effective} 人</b>) ≥ 本场奖品总数 (<b>{totalPrizeCount} 件</b>)，可完全在有效候选队列中发完。
                    </span>
                  }
                />
              )}

              {/* 参与者表格 */}
              <Table
                size="small"
                dataSource={evaluatedUsers}
                columns={participantColumns}
                rowKey="id"
                pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `共 ${t} 人` }}
                scroll={{ x: 540 }}
              />
            </div>
          </div>

          {/* 右侧下方：模拟开奖执行沙盒 */}
          <div className="tlc-draw-result-box">
            <div className="tlc-draw-result-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrophyOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                <span style={{ fontWeight: 600, fontSize: 14.5, color: '#1f2937' }}>
                  定时开奖算奖沙盒（复用现行权重排序）
                </span>
              </div>
              <Button
                type="primary"
                icon={simResult ? <ReloadOutlined /> : <PlayCircleOutlined />}
                onClick={runDrawSimulation}
              >
                {simResult ? '重新模拟开奖' : '模拟立即开奖'}
              </Button>
            </div>

            <div style={{ padding: 16 }}>
              {!simResult ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '28px 16px',
                    color: '#6b7280',
                    background: '#fafafa',
                    borderRadius: 6,
                    border: '1px dashed #d9d9d9',
                  }}
                >
                  <GiftOutlined style={{ fontSize: 28, color: '#93c5fd', marginBottom: 8 }} />
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
                    点击右上角「模拟立即开奖」按钮
                  </div>
                  <div style={{ fontSize: 12 }}>
                    可直观验证「参与时自动降权」「人工手动恢复/加权覆盖」及「人数不足奖品时不补发」的完整开奖结果
                  </div>
                </div>
              ) : (
                <div>
                  <div className="tlc-step-trace">
                    <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>
                        <ThunderboltOutlined style={{ color: '#fa8c16', marginRight: 4 }} />
                        开奖演算执行链路
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 400, color: '#9ca3af' }}>
                        演算时间：{simResult.executedAt}
                      </span>
                    </div>
                    {simResult.steps.map((step, i) => (
                      <div key={i}>{step}</div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    <Tag color="blue">奖品总数：{simResult.totalPrizes} 件</Tag>
                    <Tag color="green">实际派发：{simResult.issuedCount} 件</Tag>
                    {simResult.abortedCount > 0 && (
                      <Tag color="default">人数不足不补发（保留库存）：{simResult.abortedCount} 件</Tag>
                    )}
                  </div>

                  <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
                    {simResult.slots.map((slot) => {
                      const isAborted = slot.winner === null
                      return (
                        <div
                          key={slot.slotIndex}
                          className={`tlc-winner-row ${isAborted ? 'aborted' : ''}`}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                            <span style={{ fontSize: 11.5, color: '#9ca3af', width: 24 }}>
                              #{slot.slotIndex}
                            </span>
                            <span
                              className={`tlc-level-badge ${
                                slot.prizeLevel <= 3 ? `tlc-level-${slot.prizeLevel}` : 'tlc-level-other'
                              }`}
                            >
                              {getChineseLevel(slot.prizeLevel)}
                            </span>
                            <span style={{ fontWeight: 500, color: isAborted ? '#9ca3af' : '#1f2937' }}>
                              {slot.prizeTitle}
                            </span>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                            {slot.winner ? (
                              <div>
                                <Space size={6}>
                                  <span style={{ fontWeight: 600, color: '#1f2937' }}>
                                    {slot.winner.nickname}
                                  </span>
                                  {slot.outcome === 'WHITE' && <Tag color="purple">人工加权</Tag>}
                                  {slot.outcome === 'RECOVERED' && <Tag color="blue">手动恢复中奖</Tag>}
                                  {slot.outcome === 'NORMAL' && <Tag color="success">正常中奖</Tag>}
                                </Space>
                                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                                  {slot.note}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <Tag color="default">不补发 · 流抽保留库存</Tag>
                                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                                  {slot.note}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
