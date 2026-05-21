import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  UserAddOutlined,
  TrophyOutlined,
  FileTextOutlined,
  CrownOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Switch,
  Button,
  Slider,
  Select,
  Modal,
  message,
  Tabs,
  Typography,
  Row,
  Col
} from 'antd'
import { useState, useMemo } from 'react'
import './InviteReward.css'

const { Title, Text } = Typography

type Milestone = {
  target: number
  rewardType: 'points' | 'coupon' | 'gift'
  rewardValue: string | number
  rewardLabel: string
}

const DEFAULT_MILESTONES: Milestone[] = [
  { target: 3, rewardType: 'points', rewardValue: 50, rewardLabel: '50 积分' },
  { target: 5, rewardType: 'coupon', rewardValue: '20元满减券', rewardLabel: '20元券' },
  { target: 10, rewardType: 'gift', rewardValue: '精美手提保温杯', rewardLabel: '保温杯' },
]

export default function InviteReward() {

  // 1. 活动基本信息
  const [activityTitle, setActivityTitle] = useState('邀请好友享好礼')
  const [activitySubtitle, setActivitySubtitle] = useState('每邀请1人注册/下单均可得基础奖励，累计达标更能开大奖！')
  const [theme, setTheme] = useState<'red' | 'gold' | 'blue' | 'purple'>('red')

  // 2. 基础邀请奖励
  const [enableRegisterReward, setEnableRegisterReward] = useState(true)
  const [registerRewardType, setRegisterRewardType] = useState<'points' | 'coupon' | 'balance'>('points')
  const [registerRewardValue, setRegisterRewardValue] = useState<string | number>(10)
  
  const [enableOrderReward, setEnableOrderReward] = useState(true)
  const [orderRewardType, setOrderRewardType] = useState<'points' | 'coupon' | 'balance'>('coupon')
  const [orderRewardValue, setOrderRewardValue] = useState<string | number>('10元无门槛通用券')

  // 3. 阶梯里程碑
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES)

  // 4. 规则列表
  const [rules, setRules] = useState([
    '分享您的专属邀请二维码或海报给好友。',
    '好友扫码进入小程序并成功绑定手机号注册，您即可获得邀请注册奖励。',
    '好友在小程序内支付完成首笔订单（无退款），您即可获得邀请下单奖励。',
    '累计成功邀请人数达到3人、5人、10人时，可分别解锁解锁对应的超级达标盲盒。',
    '活动最终解释权归本店铺所有，任何违规刷单行为将取消获奖资格。'
  ])

  // 5. C端模拟器交互状态
  const [simulatedInvites, setSimulatedInvites] = useState(2) // 默认模拟邀请了 2 人
  const [activeConfigTab, setActiveConfigTab] = useState('basic')

  // 重置配置为默认数据
  const handleReset = () => {
    setActivityTitle('邀请好友享好礼')
    setActivitySubtitle('每邀请1人注册/下单均可得基础奖励，累计达标更能开大奖！')
    setTheme('red')
    setEnableRegisterReward(true)
    setRegisterRewardType('points')
    setRegisterRewardValue(10)
    setEnableOrderReward(true)
    setOrderRewardType('coupon')
    setOrderRewardValue('10元无门槛通用券')
    setMilestones([...DEFAULT_MILESTONES])
    setRules([
      '分享您的专属邀请二维码或海报给好友。',
      '好友扫码进入小程序并成功绑定手机号注册，您即可获得邀请注册奖励。',
      '好友在小程序内支付完成首笔订单（无退款），您即可获得邀请下单奖励。',
      '累计成功邀请人数达到3人、5人、10人时，可分别解锁解锁对应的超级达标盲盒。',
      '活动最终解释权归本店铺所有，任何违规刷单行为将取消获奖资格。'
    ])
    setSimulatedInvites(2)
    message.success('已恢复系统预置的邀请方案模板')
  }

  // 模拟保存
  const handleSave = () => {
    message.loading({ content: '正在同步并部署方案到小程序...', key: 'save_loading' })
    setTimeout(() => {
      message.success({ content: '方案部署成功！线上小程序已实时生效。', key: 'save_loading', duration: 2.5 })
    }, 1000)
  }

  // 移除阶梯
  const removeMilestone = (index: number) => {
    const next = [...milestones]
    next.splice(index, 1)
    setMilestones(next)
    message.info('已移除该档阶梯')
  }

  // 添加阶梯
  const addMilestone = () => {
    if (milestones.length >= 5) {
      message.warning('为了保证手机端界面美观，建议最多设置5个阶梯里程碑')
      return
    }
    const maxTarget = milestones.reduce((max, m) => (m.target > max ? m.target : max), 0)
    const next = [
      ...milestones,
      {
        target: maxTarget + 3,
        rewardType: 'points' as const,
        rewardValue: 100,
        rewardLabel: '100 积分'
      }
    ]
    // 升序排列
    next.sort((a, b) => a.target - b.target)
    setMilestones(next)
    message.success('已新增一档阶梯奖品，请在右侧编辑详细规则')
  }

  // 修改阶梯参数
  const updateMilestone = (index: number, key: keyof Milestone, val: any) => {
    const next = [...milestones]
    next[index] = { ...next[index], [key]: val }
    
    // 如果修改了奖励值，则自动同步简短标签
    if (key === 'rewardValue' || key === 'rewardType') {
      const type = next[index].rewardType
      const v = next[index].rewardValue
      if (type === 'points') {
        next[index].rewardLabel = `${v} 积分`
      } else if (type === 'coupon') {
        next[index].rewardLabel = typeof v === 'string' && v.includes('券') ? v.substring(0, 5) : `${v}元券`
      } else {
        next[index].rewardLabel = typeof v === 'string' ? v.substring(0, 4) : '实物礼品'
      }
    }
    
    // 按人数排序
    if (key === 'target') {
      next.sort((a, b) => a.target - b.target)
    }

    setMilestones(next)
  }

  // 计算进度条渲染数据
  const maxTarget = useMemo(() => {
    if (milestones.length === 0) return 10
    return Math.max(...milestones.map((m) => m.target))
  }, [milestones])

  const progressPercent = useMemo(() => {
    if (simulatedInvites === 0) return 0
    if (simulatedInvites >= maxTarget) return 100
    // 按比例计算
    return (simulatedInvites / maxTarget) * 100
  }, [simulatedInvites, maxTarget])

  // 模拟点击手机预览中的宝箱
  const handleChestClick = (milestone: Milestone) => {
    if (simulatedInvites >= milestone.target) {
      Modal.success({
        title: '解锁达标大礼包 🎉',
        content: (
          <div style={{ marginTop: 12 }}>
            <p>您已达成累计邀请 <strong>{milestone.target}</strong> 人要求！</p>
            <p>恭喜获得：<span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{milestone.rewardValue}</span></p>
            <p style={{ color: '#8c8c8c', fontSize: 12 }}>（系统已自动发放到您的微信会员中心，实物礼品请联系客服核销）</p>
          </div>
        ),
        okText: '开心收下',
        centered: true
      })
    } else {
      Modal.info({
        title: '宝箱未解锁 🔒',
        content: (
          <div style={{ marginTop: 12 }}>
            <p>该宝箱需要累计成功邀请 <strong>{milestone.target}</strong> 人。</p>
            <p>您目前已邀请 <strong>{simulatedInvites}</strong> 人，还差 <strong style={{ color: '#ff4d4f' }}>{milestone.target - simulatedInvites}</strong> 人即可解锁。</p>
            <p>解锁后可得：<strong>{milestone.rewardValue}</strong></p>
          </div>
        ),
        okText: '继续努力',
        centered: true
      })
    }
  }

  // 模拟分享
  const handleShareSimulate = () => {
    Modal.info({
      title: '模拟分享海报 📱',
      content: (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ 
            width: 180, 
            height: 280, 
            background: 'linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%)', 
            borderRadius: 8, 
            margin: '0 auto 12px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 12,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: 14 }}>{activityTitle}</div>
            <div style={{ fontSize: 10, opacity: 0.9 }}>{activitySubtitle}</div>
            <div style={{ background: '#fff', padding: 8, borderRadius: 4, width: 80, height: 80, margin: '0 auto' }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=invite" style={{ width: '100%', height: '100%' }} alt="qr" />
            </div>
            <div style={{ fontSize: 9 }}>扫码助力，我正在赢取 {milestones[milestones.length - 1]?.rewardLabel || '大礼'}</div>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>在真实小程序中，点击此按钮将弹出微信分享菜单，或直接生成精美海报保存到相册。</Text>
        </div>
      ),
      okText: '确认',
      centered: true
    })
  }

  return (
    <div className="invite-reward-wrapper">
      <div className="invite-editor-header">
        <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CrownOutlined style={{ color: '#ff8800' }} />
          邀请有礼活动配置与发布
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          通过单人注册/下单基础奖励以及累计邀请人数的阶梯奖励，形成裂变闭环，大幅度提升小程序拉新及转化率。
        </Text>
      </div>

      <Row gutter={24}>
        {/* 左侧：手机预览模拟器 */}
        <Col xs={24} lg={9} xl={8} className="invite-mobile-preview">
          <div>
            <div className="mobile-phone-frame">
              {/* 听筒和镜头 */}
              <div className="phone-top-notch"></div>
              
              {/* 状态栏 */}
              <div className="phone-status-bar">
                <span className="time">9:41</span>
                <div className="icons">
                  <span className="cellular">📶</span>
                  <span className="wifi">🔋</span>
                </div>
              </div>

              {/* 手机内部屏幕 */}
              <div className="phone-screen-content" style={{ background: '#f7f8fa' }}>
                <div className="invite-phone-screen">
                  {/* 微信页头 */}
                  <div className="phone-page-header" style={{ background: '#fff', color: '#000', borderBottom: '1px solid #eee' }}>
                    <span className="back-arrow" style={{ color: '#000' }}>〈</span>
                    <span className="activity-title" style={{ color: '#000', fontWeight: 'bold' }}>
                      {activityTitle || '邀请有礼'}
                    </span>
                    <span className="more-menu" style={{ color: '#000' }}>•••</span>
                  </div>

                  {/* C端主海报 */}
                  <div className={`invite-preview-banner theme-${theme}`}>
                    <div className="invite-banner-title">{activityTitle || '邀请好友得好礼'}</div>
                    <div className="invite-banner-subtitle">{activitySubtitle || '多邀多得，好礼不停'}</div>
                  </div>

                  {/* C端主体区域 */}
                  <div className="invite-preview-body">
                    
                    {/* 1. 基础奖励项预览 */}
                    {(enableRegisterReward || enableOrderReward) && (
                      <div className="invite-preview-card">
                        <div className="invite-preview-card-title" style={{ color: theme === 'red' ? '#ff4d4f' : theme === 'gold' ? '#fa8c16' : theme === 'blue' ? '#1890ff' : '#722ed1' }}>
                          每邀一人得基础礼
                        </div>
                        <div className="invite-basic-grid">
                          {enableRegisterReward && (
                            <div className="invite-basic-item">
                              <div className="invite-basic-item-label">好友成功注册</div>
                              <div className="invite-basic-item-value" style={{ color: theme === 'red' ? '#ff4d4f' : theme === 'gold' ? '#fa8c16' : theme === 'blue' ? '#1890ff' : '#722ed1' }}>
                                <span>+</span>
                                {registerRewardType === 'points' && `${registerRewardValue}积分`}
                                {registerRewardType === 'coupon' && (typeof registerRewardValue === 'number' ? `${registerRewardValue}元券` : registerRewardValue)}
                                {registerRewardType === 'balance' && `${registerRewardValue}元余额`}
                              </div>
                            </div>
                          )}
                          {enableOrderReward && (
                            <div className="invite-basic-item">
                              <div className="invite-basic-item-label">好友成功下单</div>
                              <div className="invite-basic-item-value" style={{ color: theme === 'red' ? '#ff4d4f' : theme === 'gold' ? '#fa8c16' : theme === 'blue' ? '#1890ff' : '#722ed1' }}>
                                <span>+</span>
                                {orderRewardType === 'points' && `${orderRewardValue}积分`}
                                {orderRewardType === 'coupon' && (typeof orderRewardValue === 'number' ? `${orderRewardValue}元券` : orderRewardValue)}
                                {orderRewardType === 'balance' && `${orderRewardValue}元余额`}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 2. 阶梯奖励进度条预览 */}
                    {milestones.length > 0 && (
                      <div className="invite-preview-card">
                        <div className="invite-preview-card-title" style={{ color: theme === 'red' ? '#ff4d4f' : theme === 'gold' ? '#fa8c16' : theme === 'blue' ? '#1890ff' : '#722ed1' }}>
                          累计达标解锁盲盒
                        </div>
                        
                        <div className="invite-milestone-hint">
                          您当前已累计邀请 <strong>{simulatedInvites}</strong> 人
                        </div>

                        <div className="invite-milestone-section">
                          <div className="invite-progress-container">
                            {/* 填充进度条 */}
                            <div 
                              className="invite-progress-bar"
                              style={{ 
                                width: `${progressPercent}%`,
                                background: theme === 'red' 
                                  ? 'linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%)' 
                                  : theme === 'gold'
                                  ? 'linear-gradient(90deg, #fa8c16 0%, #ffc069 100%)'
                                  : theme === 'blue'
                                  ? 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)'
                                  : 'linear-gradient(90deg, #722ed1 0%, #b37feb 100%)'
                              }}
                            />
                            
                            {/* 渲染各段阶梯节点 */}
                            {milestones.map((m, idx) => {
                              const nodePercent = (m.target / maxTarget) * 100
                              const isUnlocked = simulatedInvites >= m.target
                              
                              return (
                                <div 
                                  key={idx}
                                  className={`invite-milestone-node${isUnlocked ? ' unlocked' : ''}`}
                                  style={{ left: `${nodePercent}%` }}
                                  onClick={() => handleChestClick(m)}
                                >
                                  {/* 宝箱浮动展示 */}
                                  <div className="invite-chest-wrapper">
                                    <span className="invite-chest-bubble" style={{ 
                                      background: isUnlocked ? '#52c41a' : '#bfbfbf', 
                                      boxShadow: isUnlocked ? '0 2px 4px rgba(82, 196, 26, 0.2)' : 'none' 
                                    }}>
                                      {isUnlocked ? '可领取' : `${m.target}人`}
                                    </span>
                                    <span className="invite-chest-emoji">
                                      {isUnlocked ? '🎁' : '🔒'}
                                    </span>
                                  </div>
                                  <div className="invite-milestone-dot" />
                                  <span className="invite-milestone-target">{m.rewardLabel}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. 邀请行动按钮 */}
                    <div className="invite-action-container">
                      <button 
                        type="button"
                        className="invite-btn-primary invite-btn-pulse" 
                        style={{ 
                          background: theme === 'red' 
                            ? 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)' 
                            : theme === 'gold'
                            ? 'linear-gradient(135deg, #fa8c16 0%, #ffc069 100%)'
                            : theme === 'blue'
                            ? 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)'
                            : 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)'
                        }}
                        onClick={handleShareSimulate}
                      >
                        立即邀请好友领好礼
                      </button>
                      <span className="invite-action-hint">好友注册并完成首单即算邀请成功</span>
                    </div>

                    {/* 4. 邀请动态记录 */}
                    <div className="invite-preview-card">
                      <div className="invite-preview-card-title">最近成功邀请记录</div>
                      <div className="invite-list-container">
                        <div className="invite-list-row">
                          <div className="invite-list-user">
                            <span className="invite-list-avatar">👤</span>
                            <span>微信用户*5582</span>
                          </div>
                          <span>已注册成功</span>
                          <span className="invite-list-reward">
                            +{registerRewardType === 'points' ? `${registerRewardValue}积分` : '礼包'}
                          </span>
                        </div>
                        <div className="invite-list-row">
                          <div className="invite-list-user">
                            <span className="invite-list-avatar">👤</span>
                            <span>微信用户*0192</span>
                          </div>
                          <span>首单交易成功</span>
                          <span className="invite-list-reward">
                            +{orderRewardType === 'points' ? `${orderRewardValue}积分` : '专享券'}
                          </span>
                        </div>
                        {simulatedInvites >= 3 && (
                          <div className="invite-list-row">
                            <div className="invite-list-user">
                              <span className="invite-list-avatar">🎉</span>
                              <span>恭喜您</span>
                            </div>
                            <span>达成累计3人邀请</span>
                            <span className="invite-list-reward" style={{ color: '#52c41a' }}>已锁宝箱①</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 5. 活动规则卡片 */}
                    <div className="invite-preview-card" style={{ marginBottom: 12 }}>
                      <div className="invite-preview-card-title">活动细则</div>
                      <ol className="invite-rules-list">
                        {rules.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ol>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            {/* 模拟器控制栏 */}
            <div style={{ width: 320, marginTop: 12, background: '#f5f5f5', padding: '12px 16px', borderRadius: 8, border: '1px solid #e8e8e8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 'bold' }}>📱 C端数据模拟滑块：</span>
                <span style={{ background: '#e6f7ff', color: '#1890ff', padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 'bold' }}>
                  已邀 {simulatedInvites} 人
                </span>
              </div>
              <Slider 
                min={0} 
                max={12} 
                value={simulatedInvites} 
                onChange={setSimulatedInvites}
                tooltip={{ formatter: (v) => `模拟邀请了 ${v} 人` }}
              />
              <div style={{ fontSize: 9, color: '#8c8c8c', lineHeight: 1.3 }}>
                *拖动滑块模拟不同数量的邀请达标数，可在手机屏幕中看到宝箱解锁、亮起及气泡状态的动态变化。
              </div>
            </div>
          </div>
        </Col>

        {/* 右侧：B端表单配置面板 */}
        <Col xs={24} lg={15} xl={16}>
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
            <Tabs
              activeKey={activeConfigTab}
              onChange={setActiveConfigTab}
              items={[
                {
                  key: 'basic',
                  label: (
                    <span>
                      <SettingOutlined />
                      活动基础信息
                    </span>
                  ),
                  children: (
                    <div style={{ paddingTop: 12 }}>
                      <div className="invite-form-card">
                        <div className="invite-form-card-title">第一步：配置分享海报与色调</div>
                        <Form layout="vertical">
                          <Form.Item label="活动名称/标题" required tooltip="显示在小程序页头及海报首行">
                            <Input 
                              value={activityTitle} 
                              onChange={(e) => setActivityTitle(e.target.value)} 
                              maxLength={20}
                              placeholder="例如：邀请好友享好礼"
                              showCount
                            />
                          </Form.Item>
                          <Form.Item label="副标题/宣传标语" required tooltip="描述活动的裂变噱头">
                            <Input.TextArea 
                              value={activitySubtitle} 
                              onChange={(e) => setActivitySubtitle(e.target.value)} 
                              maxLength={60}
                              placeholder="例如：每邀请1人注册/下单均可得基础奖励，累计达标更能开大奖！"
                              rows={2}
                              showCount
                            />
                          </Form.Item>
                          <Form.Item label="小程序视觉主题颜色" required>
                            <div className="invite-theme-selector">
                              {[
                                { key: 'red', name: '喜庆红' },
                                { key: 'gold', name: '尊贵金' },
                                { key: 'blue', name: '科技蓝' },
                                { key: 'purple', name: '典雅紫' }
                              ].map((t) => (
                                <div 
                                  key={t.key}
                                  className={`invite-theme-option theme-${t.key}${theme === t.key ? ' active' : ''}`}
                                  onClick={() => setTheme(t.key as any)}
                                >
                                  {t.name}
                                </div>
                              ))}
                            </div>
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'reward',
                  label: (
                    <span>
                      <UserAddOutlined />
                      基础邀请奖励 (单人)
                    </span>
                  ),
                  children: (
                    <div style={{ paddingTop: 12 }}>
                      {/* 注册奖励配置 */}
                      <div className="invite-form-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <span className="invite-form-card-title" style={{ margin: 0 }}>基础奖励①：邀请注册成功</span>
                          <Switch checked={enableRegisterReward} onChange={setEnableRegisterReward} />
                        </div>
                        {enableRegisterReward && (
                          <Form layout="vertical">
                            <Form.Item label="奖励发放形式" required>
                              <Radio.Group 
                                value={registerRewardType} 
                                onChange={(e) => setRegisterRewardType(e.target.value)}
                              >
                                <Radio.Button value="points">赠送积分</Radio.Button>
                                <Radio.Button value="coupon">发放优惠券</Radio.Button>
                                <Radio.Button value="balance">赠送余额</Radio.Button>
                              </Radio.Group>
                            </Form.Item>
                            
                            {registerRewardType === 'points' && (
                              <Form.Item label="赠送积分分值" required>
                                <InputNumber 
                                  min={1} 
                                  max={10000} 
                                  value={registerRewardValue as number} 
                                  onChange={(val) => setRegisterRewardValue(val || 1)} 
                                  style={{ width: '100%' }}
                                  addonAfter="积分"
                                />
                              </Form.Item>
                            )}

                            {registerRewardType === 'coupon' && (
                              <Form.Item label="选择关联的优惠券" required>
                                <Select 
                                  value={registerRewardValue as string} 
                                  onChange={setRegisterRewardValue}
                                  options={[
                                    { value: '5元无门槛通用券', label: '【拉新专属】5元无门槛通用券' },
                                    { value: '10元满50减免券', label: '【新客大礼包】10元满50减免券' },
                                    { value: '9折超级折扣券', label: '【拉新折上折】9折超级折扣券' }
                                  ]}
                                />
                              </Form.Item>
                            )}

                            {registerRewardType === 'balance' && (
                              <Form.Item label="赠送余额金额" required>
                                <InputNumber 
                                  min={0.1} 
                                  max={500} 
                                  precision={2} 
                                  value={registerRewardValue as number} 
                                  onChange={(val) => setRegisterRewardValue(val || 0.1)} 
                                  style={{ width: '100%' }}
                                  addonAfter="元"
                                />
                              </Form.Item>
                            )}
                          </Form>
                        )}
                        {!enableRegisterReward && (
                          <div style={{ color: '#8c8c8c', fontSize: 12, padding: '10px 0' }}>
                            <InfoCircleOutlined /> 已关闭注册成功奖励。关闭后，被邀请人成功注册时，邀请人将不会收到直接的个人奖励。
                          </div>
                        )}
                      </div>

                      {/* 下单奖励配置 */}
                      <div className="invite-form-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <span className="invite-form-card-title" style={{ margin: 0 }}>基础奖励②：邀请下单交易成功</span>
                          <Switch checked={enableOrderReward} onChange={setEnableOrderReward} />
                        </div>
                        {enableOrderReward && (
                          <Form layout="vertical">
                            <Form.Item label="奖励发放形式" required>
                              <Radio.Group 
                                value={orderRewardType} 
                                onChange={(e) => setOrderRewardType(e.target.value)}
                              >
                                <Radio.Button value="points">赠送积分</Radio.Button>
                                <Radio.Button value="coupon">发放优惠券</Radio.Button>
                                <Radio.Button value="balance">赠送余额</Radio.Button>
                              </Radio.Group>
                            </Form.Item>
                            
                            {orderRewardType === 'points' && (
                              <Form.Item label="赠送积分分值" required>
                                <InputNumber 
                                  min={1} 
                                  max={10000} 
                                  value={orderRewardValue as number} 
                                  onChange={(val) => setOrderRewardValue(val || 1)} 
                                  style={{ width: '100%' }}
                                  addonAfter="积分"
                                />
                              </Form.Item>
                            )}

                            {orderRewardType === 'coupon' && (
                              <Form.Item label="选择关联的优惠券" required>
                                <Select 
                                  value={orderRewardValue as string} 
                                  onChange={setOrderRewardValue}
                                  options={[
                                    { value: '10元无门槛通用券', label: '【首单拉新奖励】10元无门槛通用券' },
                                    { value: '20元满100减免券', label: '【复购提升券】20元满100减免券' },
                                    { value: '8.5折满150打折券', label: '【大额满减折扣】8.5折满150打折券' }
                                  ]}
                                />
                              </Form.Item>
                            )}

                            {orderRewardType === 'balance' && (
                              <Form.Item label="赠送余额金额" required>
                                <InputNumber 
                                  min={0.1} 
                                  max={500} 
                                  precision={2} 
                                  value={orderRewardValue as number} 
                                  onChange={(val) => setOrderRewardValue(val || 0.1)} 
                                  style={{ width: '100%' }}
                                  addonAfter="元"
                                />
                              </Form.Item>
                            )}
                          </Form>
                        )}
                        {!enableOrderReward && (
                          <div style={{ color: '#8c8c8c', fontSize: 12, padding: '10px 0' }}>
                            <InfoCircleOutlined /> 已关闭下单成功奖励。关闭后，被邀请人下单，邀请人将不会收到直接的下单分成奖励。
                          </div>
                        )}
                      </div>
                    </div>
                  )
                },
                {
                  key: 'milestone',
                  label: (
                    <span>
                      <TrophyOutlined />
                      阶梯里程碑配置 (多段)
                    </span>
                  ),
                  children: (
                    <div style={{ paddingTop: 12 }}>
                      <div className="invite-form-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <div>
                            <span className="invite-form-card-title" style={{ margin: 0 }}>累计达标阶梯里程碑</span>
                            <div style={{ color: '#8c8c8c', fontSize: 11, marginTop: 4 }}>
                              当邀请人累计成功邀请人数（成功下单）达到设定的阶梯数时，可额外解锁该段对应的宝箱好礼。
                            </div>
                          </div>
                          <Button 
                            type="primary" 
                            size="small" 
                            icon={<PlusOutlined />} 
                            onClick={addMilestone}
                          >
                            添加新阶梯
                          </Button>
                        </div>

                        {milestones.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '32px 0', background: '#fff', border: '1px dashed #d9d9d9', borderRadius: 6 }}>
                            <Text type="secondary">暂无任何阶梯奖励，点击右上角「添加新阶梯」开始配置</Text>
                          </div>
                        ) : (
                          milestones.map((milestone, idx) => (
                            <div key={idx} className="invite-stage-form-item">
                              {/* 删除按钮 */}
                              <Button 
                                type="text"
                                danger
                                shape="circle"
                                size="small"
                                className="invite-stage-delete-btn"
                                icon={<DeleteOutlined />}
                                onClick={() => removeMilestone(idx)}
                              />
                              
                              <Row gutter={16}>
                                <Col span={8}>
                                  <Form.Item label={`阶梯目标 (第 ${idx + 1} 档)`} required>
                                    <InputNumber 
                                      min={1} 
                                      max={500} 
                                      value={milestone.target} 
                                      onChange={(val) => updateMilestone(idx, 'target', val || 1)} 
                                      style={{ width: '100%' }}
                                      addonAfter="人"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item label="奖励形式" required>
                                    <Select 
                                      value={milestone.rewardType} 
                                      onChange={(val) => updateMilestone(idx, 'rewardType', val)}
                                      options={[
                                        { value: 'points', label: '额外赠送积分' },
                                        { value: 'coupon', label: '发放额外优惠券' },
                                        { value: 'gift', label: '赠送实物赠品' }
                                      ]}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  {milestone.rewardType === 'points' && (
                                    <Form.Item label="赠送积分值" required>
                                      <InputNumber 
                                        min={1} 
                                        value={milestone.rewardValue as number}
                                        onChange={(val) => updateMilestone(idx, 'rewardValue', val || 1)} 
                                        style={{ width: '100%' }}
                                      />
                                    </Form.Item>
                                  )}
                                  {milestone.rewardType === 'coupon' && (
                                    <Form.Item label="选择关联优惠券" required>
                                      <Select 
                                        value={milestone.rewardValue as string}
                                        onChange={(val) => updateMilestone(idx, 'rewardValue', val)}
                                        options={[
                                          { value: '20元满减券', label: '【里程碑专属】20元满100减免券' },
                                          { value: '50元立减红包', label: '【里程碑大礼】50元满200无门槛现金券' },
                                          { value: '8折无门槛打折券', label: '【里程碑白金礼】8折超级券' }
                                        ]}
                                      />
                                    </Form.Item>
                                  )}
                                  {milestone.rewardType === 'gift' && (
                                    <Form.Item label="输入实物赠品名称" required>
                                      <Input 
                                        value={milestone.rewardValue as string}
                                        onChange={(e) => updateMilestone(idx, 'rewardValue', e.target.value)}
                                        maxLength={16}
                                        placeholder="如：精美手提保温杯"
                                      />
                                    </Form.Item>
                                  )}
                                </Col>
                              </Row>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )
                },
                {
                  key: 'rules',
                  label: (
                    <span>
                      <FileTextOutlined />
                      活动细则与风控
                    </span>
                  ),
                  children: (
                    <div style={{ paddingTop: 12 }}>
                      <div className="invite-form-card">
                        <div className="invite-form-card-title">活动细则说明（由商家定制）</div>
                        <Form layout="vertical">
                          {rules.map((rule, idx) => (
                            <Form.Item 
                              key={idx} 
                              label={`规则条款 ${idx + 1}`} 
                              required={idx < 3}
                              style={{ marginBottom: 12 }}
                            >
                              <div style={{ display: 'flex', gap: 8 }}>
                                <Input 
                                  value={rule} 
                                  onChange={(e) => {
                                    const next = [...rules]
                                    next[idx] = e.target.value
                                    setRules(next)
                                  }} 
                                  placeholder="请输入该条活动细则描述"
                                />
                                {rules.length > 3 && (
                                  <Button 
                                    danger 
                                    type="text" 
                                    icon={<DeleteOutlined />} 
                                    onClick={() => {
                                      const next = [...rules]
                                      next.splice(idx, 1)
                                      setRules(next)
                                    }} 
                                  />
                                )}
                              </div>
                            </Form.Item>
                          ))}
                          {rules.length < 8 && (
                            <Button 
                              type="dashed" 
                              onClick={() => setRules([...rules, ''])} 
                              icon={<PlusOutlined />}
                              style={{ width: '100%', marginTop: 8 }}
                            >
                              添加新规则条款
                            </Button>
                          )}
                        </Form>
                      </div>
                    </div>
                  )
                }
              ]}
            />

            {/* 表单底栏动作 */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                恢复默认
              </Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                保存并发布活动
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
