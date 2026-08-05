/**
 * OrderConversion.tsx
 * 订单转积分高保真交互原型 — C端小程序演示
 *
 * 功能：
 * - B端模拟开关：融合模式 / 仅自动 / 仅手动
 * - 渠道切换 Tab（微信小店 / 抖音 / 小红书 / 有赞 / 京东）
 * - 直播间手动补录订单号 → 积分转换
 * - 店铺自动同步状态展示（单店 / 多店 / 未绑定）
 * - 积分转换历史记录抽屉
 * - 测试用例快速填充控制台
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import './OrderConversion.css'

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = 'hybrid' | 'auto' | 'manual'
type Channel = 'wx' | 'dy' | 'xhs' | 'yz' | 'jd'

interface HistoryItem {
  id: string
  orderId: string
  type: 'auto' | 'manual'
  channel: string
  points: number
  time: string
  status: string
  isNew?: boolean
}

interface ChannelConfig {
  name: string
  multiStore: boolean
  storeName?: string
  stores?: string[]
}

// ─── Config ──────────────────────────────────────────────────────────────────

const channelConfig: Record<Channel, ChannelConfig> = {
  wx:  { name: '微信小店', multiStore: false, storeName: '微信小店 (官方授权)' },
  dy:  { name: '抖音',   multiStore: true,  stores: ['抖音官方旗舰店', '抖音护肤专卖店 (直播间)'] },
  xhs: { name: '小红书', multiStore: false, storeName: '小红书品牌店' },
  yz:  { name: '有赞',   multiStore: false, storeName: '有赞商城' },
  jd:  { name: '京东',   multiStore: false, storeName: '京东旗舰店' },
}

const modeDescMap: Record<Mode, { badge: string; desc: string }> = {
  hybrid: {
    badge: '融合模式',
    desc: '商家同时开启【店铺自动】+【直播间手动】。置顶直播间订单补录输入框，下方显示精简店铺绑定信息卡片（仅展示店铺名称），高效便捷。',
  },
  auto: {
    badge: '纯自动模式',
    desc: '商家仅开启【店铺自动转换】。C端仅显示授权绑定卡片，无需手动输入框。后台周期抓取订单积分。',
  },
  manual: {
    badge: '纯手动模式',
    desc: '商家仅开启【直播间/手动转换】。C端仅显示订单号输入框和转换按钮，引导复制订单号补录。',
  },
}

const initialHistory: HistoryItem[] = [
  {
    id: 'h1',
    orderId: 'LIVE_99880011',
    type: 'manual',
    channel: '微信小店',
    points: 150,
    time: '2026-07-30 14:22:10',
    status: '转换成功',
  },
  {
    id: 'h2',
    orderId: 'WX_AUTO_998231',
    type: 'auto',
    channel: '微信小店',
    points: 320,
    time: '2026-07-30 02:15:00',
    status: '店铺自动抓取',
  },
  {
    id: 'h3',
    orderId: 'WX_AUTO_997102',
    type: 'auto',
    channel: '微信小店',
    points: 88,
    time: '2026-07-29 18:00:12',
    status: '店铺自动抓取',
  },
]

// ─── Toast Hook ───────────────────────────────────────────────────────────────

type ToastType = 'info' | 'success' | 'error' | 'warning'

interface Toast {
  msg: string
  type: ToastType
  visible: boolean
}

function useToast() {
  const [toast, setToast] = useState<Toast>({ msg: '', type: 'info', visible: false })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((msg: string, type: ToastType = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ msg, type, visible: true })
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }))
    }, 2500)
  }, [])

  return { toast, show }
}

function toastIcon(type: ToastType): string {
  switch (type) {
    case 'success': return '✅'
    case 'error':   return '🚫'
    case 'warning': return '⚠️'
    default:        return 'ℹ️'
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nowStr(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

let _idCounter = 100
function nextId(): string {
  return `h${++_idCounter}`
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrderConversion() {
  // 全局状态
  const [mode, setMode] = useState<Mode>('hybrid')
  const [channel, setChannel] = useState<Channel>('wx')
  const [isBound, setIsBound] = useState(true)
  const [orderInput, setOrderInput] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { toast, show: showToast } = useToast()

  // 当前渠道配置
  const cfg = channelConfig[channel]

  // ── 模式切换 ──────────────────────────────────────────────────────────────
  const switchMode = (m: Mode) => {
    setMode(m)
  }

  // ── 渠道切换 ──────────────────────────────────────────────────────────────
  const switchChannel = (ch: Channel) => {
    setChannel(ch)
    showToast(`已切换至【${channelConfig[ch].name}】渠道`)
  }

  // ── 手动转换提交 ───────────────────────────────────────────────────────────
  const submitManualOrder = useCallback(() => {
    const input = orderInput.trim()
    if (!input) {
      showToast('⚠️ 请输入订单号后再试', 'warning')
      return
    }

    if (input.startsWith('AUTO_STORE')) {
      showToast('该订单已通过店铺账号自动转换为积分，无需重复补录', 'info')
    } else if (input.startsWith('SYNCING')) {
      showToast('该店铺订单正在系统同步处理中，请稍后在记录中查看', 'info')
    } else if (input.startsWith('EXPIRED')) {
      showToast('转换失败：订单号不存在或非近3个月内消费订单', 'error')
    } else {
      const newPoints = 120
      const item: HistoryItem = {
        id: nextId(),
        orderId: input,
        type: 'manual',
        channel: cfg.name,
        points: newPoints,
        time: nowStr(),
        status: '转换成功',
        isNew: true,
      }
      setHistory((prev) => [item, ...prev])
      showToast(`🎉 转换成功！获得 +${newPoints} 积分`, 'success')
      setOrderInput('')
    }
  }, [orderInput, cfg.name, showToast])

  // 清除 isNew 标记（防止每次重渲染都高亮）
  useEffect(() => {
    if (history.some((h) => h.isNew)) {
      const timer = setTimeout(() => {
        setHistory((prev) => prev.map((h) => ({ ...h, isNew: false })))
      }, 1600)
      return () => clearTimeout(timer)
    }
  }, [history])

  // ── 授权绑定 ───────────────────────────────────────────────────────────────
  const triggerAuthBind = useCallback(() => {
    showToast('正在进行官方账号授权绑定...', 'info')
    setTimeout(() => {
      setIsBound(true)
      showToast('🎉 店铺账号授权成功！已开启24h自动抓取', 'success')
    }, 800)
  }, [showToast])

  const triggerRebind = useCallback(() => {
    if (window.confirm('确认需要重新授权或更换绑定的店铺账号吗？')) {
      triggerAuthBind()
    }
  }, [triggerAuthBind])

  const toggleBindingState = useCallback(() => {
    setIsBound((prev) => {
      const next = !prev
      showToast(next ? '已模拟：账号已成功绑定' : '已模拟：解绑账号状态')
      return next
    })
  }, [showToast])

  // ── 展示条件 ───────────────────────────────────────────────────────────────
  const showManual = mode === 'hybrid' || mode === 'manual'
  const showAuto   = mode === 'hybrid' || mode === 'auto'

  // 多店铺 / 单店铺 / 未绑定
  const showUnbound  = showAuto && !isBound
  const showMulti    = showAuto && isBound && cfg.multiStore
  const showSingle   = showAuto && isBound && !cfg.multiStore

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="oc-page">
      {/* ── 顶部控制栏 ── */}
      <header className="oc-header">
        <div className="oc-header-brand">
          <div className="oc-header-icon">✨</div>
          <div>
            <p className="oc-header-title">订单转积分高保真交互原型</p>
            <p className="oc-header-sub">店铺自动 + 直播间手动融合方案 C端小程序演示</p>
          </div>
        </div>

        <div className="oc-mode-switcher">
          <span className="oc-mode-label">⚙️ B端模拟开关：</span>
          <button
            className={`oc-mode-btn${mode === 'hybrid' ? ' active' : ''}`}
            onClick={() => switchMode('hybrid')}
          >
            ✨ 融合模式 (自动+手动)
          </button>
          <button
            className={`oc-mode-btn${mode === 'auto' ? ' active' : ''}`}
            onClick={() => switchMode('auto')}
          >
            仅店铺自动
          </button>
          <button
            className={`oc-mode-btn${mode === 'manual' ? ' active' : ''}`}
            onClick={() => switchMode('manual')}
          >
            仅手动转换
          </button>
        </div>
      </header>

      {/* ── 主内容 ── */}
      <main className="oc-main">
        {/* 手机模拟器 */}
        <div className="oc-phone-wrap">
          <div className="oc-phone-frame">
            {/* 刘海 */}
            <div className="oc-phone-notch">
              <div className="oc-phone-notch-bar" />
              <div className="oc-phone-notch-cam" />
            </div>

            {/* 内屏 */}
            <div className="oc-phone-screen">
              {/* 导航栏 */}
              <div className="oc-mp-navbar">
                {/* 状态栏 */}
                <div className="oc-status-bar">
                  <span>09:41</span>
                  <div className="oc-status-icons">
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* 标题行 */}
                <div className="oc-nav-row">
                  <button className="oc-nav-back">‹</button>
                  <span className="oc-nav-title">{cfg.name}订单转换</span>
                  <div className="oc-nav-capsule">
                    <span style={{ fontSize: 11, color: '#64748b' }}>···</span>
                    <div className="oc-nav-capsule-dot" />
                    <span style={{ fontSize: 11, color: '#64748b' }}>◉</span>
                  </div>
                </div>

                {/* 渠道 Tab */}
                <div className="oc-channel-tabs">
                  {(Object.keys(channelConfig) as Channel[]).map((ch) => (
                    <button
                      key={ch}
                      className={`oc-tab-btn${channel === ch ? ' active' : ''}`}
                      onClick={() => switchChannel(ch)}
                    >
                      {channelConfig[ch].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 内容滚动区 */}
              <div className="oc-mp-body">

                {/* 卡片1：手动补录 */}
                {showManual && (
                  <div className="oc-card">
                    <div className="oc-card-manual-header">
                      <div className="oc-card-manual-title">
                        <span className="oc-card-manual-icon">📺</span>
                        <span className="oc-card-manual-name">直播间/无标记订单手动补录</span>
                      </div>
                      <span className="oc-card-manual-badge">补录窗口</span>
                    </div>

                    <div className="oc-input-wrap">
                      <input
                        className="oc-input"
                        type="text"
                        placeholder={`请输入来自${cfg.name}近3个月的订单号`}
                        value={orderInput}
                        onChange={(e) => setOrderInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitManualOrder()}
                      />
                      {orderInput && (
                        <button className="oc-input-clear" onClick={() => setOrderInput('')}>
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="oc-btn-group">
                      <button className="oc-btn-secondary" onClick={() => setDrawerOpen(true)}>
                        转换记录
                      </button>
                      <button className="oc-btn-primary" onClick={submitManualOrder}>
                        一键转换
                      </button>
                    </div>
                  </div>
                )}

                {/* 卡片2：自动同步状态 */}
                {showAuto && (
                  <div className="oc-card">
                    {/* 单店已绑定 */}
                    {showSingle && (
                      <div className="oc-auto-single">
                        <div className="oc-auto-store-row">
                          <div className="oc-auto-store-info">
                            <div className="oc-auto-store-avatar">🏪</div>
                            <div>
                              <div className="oc-auto-store-name">{cfg.storeName}</div>
                              <div className="oc-auto-store-sub">旗下所有店铺订单已自动关联积分</div>
                            </div>
                          </div>
                          <span className="oc-badge-connected">已连通</span>
                        </div>
                        <div className="oc-auto-actions">
                          <button className="oc-link-muted" onClick={triggerRebind}>
                            重新授权
                          </button>
                          <button className="oc-link-rose" onClick={() => setDrawerOpen(true)}>
                            🕐 查看自动同步记录
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 多店铺已绑定 */}
                    {showMulti && (
                      <div className="oc-auto-multi">
                        <div className="oc-multi-header">
                          <div className="oc-multi-title">
                            <span>🗂️</span>
                            已绑定店铺账号
                            <span className="oc-multi-sub">(抖音 OpenID 独立)</span>
                          </div>
                          <span className="oc-multi-count">已绑定 {cfg.stores?.length ?? 0} 个店铺</span>
                        </div>

                        <div className="oc-store-list">
                          {cfg.stores?.map((store) => (
                            <div key={store} className="oc-store-item">
                              <div className="oc-store-item-left">
                                <span className="oc-store-dot" />
                                {store}
                              </div>
                              <span className="oc-badge-auto">自动同步中</span>
                            </div>
                          ))}
                        </div>

                        <button className="oc-btn-add-store" onClick={triggerAuthBind}>
                          ＋ 授权绑定更多{cfg.name}店铺账号
                        </button>
                      </div>
                    )}

                    {/* 未绑定 */}
                    {showUnbound && (
                      <div className="oc-unbound">
                        <div className="oc-unbound-icon-row">
                          <div className="oc-unbound-icon">⚠️</div>
                          <span className="oc-unbound-title">未绑定店铺账号</span>
                        </div>
                        <p className="oc-unbound-desc">绑定店铺账号后，后续订单将全自动转换积分</p>
                        <button className="oc-btn-bind" onClick={triggerAuthBind}>
                          一键授权绑定账号
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 卡片3：帮助说明 */}
                <div className="oc-help-card">
                  <div className="oc-help-header">
                    <span>💡</span>
                    <span>转换规则与帮助指南</span>
                  </div>

                  <ul className="oc-help-list">
                    <li className="oc-help-item">
                      <span className="oc-help-dot" />
                      <span>
                        <strong>店铺订单</strong>：绑定后 24 小时内由系统自动完成积分转换，无需手动重复输入。
                      </span>
                    </li>
                    <li className="oc-help-item">
                      <span className="oc-help-dot" />
                      <span>
                        <strong>直播间订单</strong>：因平台隐私策略，订单无用户标识，请复制订单号粘贴上方手动转换。
                      </span>
                    </li>
                    <li className="oc-help-item">
                      <span className="oc-help-dot" />
                      <span>仅支持消费完成（交易成功）且近 3 个月内的订单转换为积分。</span>
                    </li>
                  </ul>

                  <div className="oc-help-footer">
                    <span>如何查找直播间订单号？</span>
                    <span className="oc-help-footer-link">
                      查看教程 ›
                    </span>
                  </div>
                </div>

              </div>

              {/* Toast */}
              <div className={`oc-toast${toast.visible ? ' visible' : ''}`}>
                <span className="oc-toast-icon">{toastIcon(toast.type)}</span>
                <span>{toast.msg}</span>
              </div>

              {/* 历史记录抽屉 */}
              <div
                className={`oc-drawer-overlay${drawerOpen ? ' open' : ''}`}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setDrawerOpen(false)
                }}
              >
                <div className="oc-drawer-panel">
                  <div className="oc-drawer-header">
                    <div>
                      <p className="oc-drawer-title">积分转换记录</p>
                      <p className="oc-drawer-sub">含店铺自动抓取与直播间手动转换明细</p>
                    </div>
                    <button className="oc-drawer-close" onClick={() => setDrawerOpen(false)}>
                      ✕
                    </button>
                  </div>

                  <div className="oc-drawer-list">
                    {history.length === 0 ? (
                      <div className="oc-history-empty">暂无转换记录</div>
                    ) : (
                      history.map((item) => (
                        <div
                          key={item.id}
                          className={`oc-history-item${item.isNew ? ' new' : ''}`}
                        >
                          <div className="oc-history-left">
                            <div className="oc-history-order-row">
                              <span className="oc-history-order-id">{item.orderId}</span>
                              <span
                                className={
                                  item.type === 'auto'
                                    ? 'oc-badge-auto-tag'
                                    : 'oc-badge-manual-tag'
                                }
                              >
                                {item.type === 'auto' ? '店铺自动' : '直播间手动'}
                              </span>
                            </div>
                            <div className="oc-history-meta">
                              {item.channel} · {item.time}
                            </div>
                          </div>
                          <div className="oc-history-right">
                            <div className="oc-history-points">+{item.points}</div>
                            <div className="oc-history-status">{item.status}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* 底部导航 */}
              <div className="oc-mp-footer">
                <button className="oc-footer-tab active">
                  <span className="oc-footer-tab-icon">🔄</span>
                  <span>订单转换</span>
                </button>
                <button className="oc-footer-tab">
                  <span className="oc-footer-tab-icon">🎁</span>
                  <span>积分商城</span>
                </button>
                <button className="oc-footer-tab">
                  <span className="oc-footer-tab-icon">👤</span>
                  <span>个人中心</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 右侧控制台 ── */}
        <aside className="oc-console">
          <div className="oc-console-header">
            <div className="oc-console-icon">🧪</div>
            <div>
              <p className="oc-console-title">原型测试与演示控制台</p>
              <p className="oc-console-desc">
                用于模拟不同订单号格式提交及后端防重、冲突处理逻辑。
              </p>
            </div>
          </div>

          {/* 测试用例 */}
          <div className="oc-test-cases">
            <label className="oc-test-label">快捷测试用例（点击快速填充）：</label>
            <div className="oc-test-list">
              <TestCase
                orderId="LIVE_99881122"
                desc="未转换过的直播间有效订单 (预计 +120 积分)"
                badge={<span className="oc-test-badge-success">成功例</span>}
                onFill={setOrderInput}
              />
              <TestCase
                orderId="AUTO_STORE_8832"
                desc="已通过店铺自动发分的店铺订单"
                badge={<span className="oc-test-badge-warn">拦截重复</span>}
                onFill={setOrderInput}
              />
              <TestCase
                orderId="SYNCING_ORDER_001"
                desc="正在自动同步队列中的店铺订单"
                badge={<span className="oc-test-badge-info">提示处理中</span>}
                onFill={setOrderInput}
              />
              <TestCase
                orderId="EXPIRED_ORDER_999"
                desc="超过3个月的无效/过期订单"
                badge={<span className="oc-test-badge-error">失败例</span>}
                onFill={setOrderInput}
              />
            </div>
          </div>

          {/* 当前场景信息 */}
          <div className="oc-mode-info">
            <div className="oc-mode-info-row">
              <span>当前激活场景：</span>
              <span className="oc-mode-badge">{modeDescMap[mode].badge}</span>
            </div>
            <p className="oc-mode-text">{modeDescMap[mode].desc}</p>
          </div>

          {/* 绑定状态切换 */}
          <div style={{ paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
            <button className="oc-toggle-bind-btn" onClick={toggleBindingState}>
              🔄 模拟切换：已绑定 / 未绑定 状态
            </button>
          </div>
        </aside>
      </main>
    </div>
  )
}

// ── 测试用例按钮子组件 ─────────────────────────────────────────────────────────

interface TestCaseProps {
  orderId: string
  desc: string
  badge: React.ReactNode
  onFill: (id: string) => void
}

function TestCase({ orderId, desc, badge, onFill }: TestCaseProps) {
  return (
    <button className="oc-test-case" onClick={() => onFill(orderId)}>
      <div>
        <div className="oc-test-case-id">{orderId}</div>
        <div className="oc-test-case-desc">{desc}</div>
      </div>
      {badge}
    </button>
  )
}
