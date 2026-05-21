import {
  AppstoreOutlined,
  BookOutlined,
  CalculatorOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  FileTextOutlined,
  GiftOutlined,
  HomeOutlined,
  MessageOutlined,
  NotificationOutlined,
  PercentageOutlined,
  RightOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  ToolOutlined,
  TrophyOutlined,
  UserOutlined,
  // Additional Ant Design Icons for perfect match
  CalendarOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  PlaySquareOutlined,
  StarOutlined,
  ShareAltOutlined,
  SafetyCertificateOutlined,
  CreditCardOutlined,
  SmileOutlined,
  DollarOutlined,
  OrderedListOutlined,
  MailOutlined,
  ScanOutlined,
  EditOutlined,
  ShoppingOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  // Editor icons
  UploadOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  CopyOutlined,
  LikeOutlined,
  CheckOutlined,
  PictureOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import {
  ConfigProvider,
  Layout,
  Menu,
  Row,
  Col,
  Empty,
  Tabs,
  Radio,
  Slider,
  InputNumber,
  ColorPicker,
  Switch,
  Tooltip,
  Upload,
  Button,
  Checkbox,
  Input,
  message,
} from 'antd'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import SmashGoldenEgg from './pages/SmashGoldenEgg'
import './App.css'

const { Sider, Content } = Layout

// PrimaryKey (Primary Navigation Menu Key)
export type PrimaryKey =
  | 'home'
  | 'customer'
  | 'message'
  | 'marketing'
  | 'shop'
  | 'content'
  | 'ai'
  | 'tools'
  | 'settings'
  | 'apps'

/** 二级菜单树结构：小店模块 (完美匹配截图) */
export const shopSecondaryMenuItems: MenuProps['items'] = [
  {
    key: 'shop-points',
    label: '客群运营',
    children: [
      { key: 'shop-points-lottery', label: '积分抽奖' }, // 触发抽奖装修页面
      { key: 'shop-points-mall', label: '积分商城' },
      { key: 'shop-points-task', label: '积分任务' },
      { key: 'shop-points-mkt', label: '积分营销' }, // 触发蓝色页面
      { key: 'shop-points-prod', label: '积分商品' },
    ],
  },
  {
    key: 'shop-order-group',
    label: '订单管理',
    children: [
      { key: 'shop-order-list', label: '订单列表' },
      { key: 'shop-order-verify', label: '订单核销' },
    ],
  },
  {
    key: 'shop-product-group',
    label: '商品管理',
    children: [
      { key: 'shop-product-list', label: '商品列表' },
      { key: 'shop-product-category', label: '商品分类' },
      { key: 'shop-product-shelf', label: '商品上架' },
    ],
  },
  {
    key: 'shop-mkt-tools',
    label: '营销工具',
    children: [
      { key: 'shop-mkt-tools-home', label: '营销工具' }, // 触发橙色页面
      { key: 'shop-member-mkt', label: '会员营销' },
      { key: 'shop-member-center', label: '会员中心' },
      { key: 'shop-lottery-center', label: '抽奖中心' }, // 触发抽奖装修页面
      { key: 'shop-golden-egg', label: '砸金蛋' },
      { key: 'shop-coupon-list', label: '卡券列表' },
      { key: 'shop-distributor', label: '分销商' },
    ],
  },
  {
    key: 'shop-other-store',
    label: '优选商城',
    children: [
      { key: 'shop-other-goods', label: '优选商品' },
      { key: 'shop-other-config', label: '商城设置' },
    ],
  },
  {
    key: 'shop-member-group',
    label: '会员管理',
    children: [
      { key: 'shop-member-info', label: '会员信息' },
      { key: 'shop-member-level', label: '会员等级' },
      { key: 'shop-member-benefit', label: '会员权益' },
    ],
  },
  {
    key: 'shop-decoration',
    label: '店铺设置',
  },
]

export const shopMenuDefaultOpenKeys = [
  'shop-points',
  'shop-order-group',
  'shop-product-group',
  'shop-mkt-tools',
  'shop-other-store',
  'shop-member-group',
]

const placeholderMenus: Record<PrimaryKey, MenuProps['items']> = {
  home: [
    { key: 'dash-home-overview', label: '数据概览' },
    { key: 'dash-home-shortcut', label: '快捷入口' },
  ],
  customer: [
    { key: 'dash-customer-assets', label: '客户资产' },
    { key: 'dash-customer-group', label: '客群管理' },
  ],
  message: [
    { key: 'dash-msg-inbox', label: '消息中心' },
    { key: 'dash-msg-template', label: '通知模板' },
  ],
  marketing: [
    { key: 'dash-mkt-plan', label: '营销计划' },
    { key: 'dash-mkt-automation', label: '自动化' },
  ],
  shop: shopSecondaryMenuItems,
  content: [
    { key: 'dash-content-lib', label: '内容库' },
    { key: 'dash-content-material', label: '素材中心' },
  ],
  ai: [
    { key: 'dash-ai-chat', label: '智能助手' },
    { key: 'dash-ai-insight', label: '经营洞察' },
  ],
  tools: [
    { key: 'dash-tools-list', label: '工具列表' },
    { key: 'dash-tools-plugin', label: '应用插件' },
  ],
  settings: [
    { key: 'dash-settings-store', label: '店铺设置' },
    { key: 'dash-settings-perm', label: '权限管理' },
  ],
  apps: [
    { key: 'dash-apps-market', label: '应用市场' },
    { key: 'dash-apps-installed', label: '已购应用' },
  ],
}

const defaultSecondaryKey: Record<PrimaryKey, string> = {
  home: 'dash-home-overview',
  customer: 'dash-customer-assets',
  message: 'dash-msg-inbox',
  marketing: 'dash-mkt-plan',
  shop: 'shop-mkt-tools-home', // Default secondary key to orange page
  content: 'dash-content-lib',
  ai: 'dash-ai-chat',
  tools: 'dash-tools-list',
  settings: 'dash-settings-store',
  apps: 'dash-apps-market',
}

const defaultOpenKeysByPrimary: Record<PrimaryKey, string[]> = {
  home: [],
  customer: [],
  message: [],
  marketing: [],
  shop: shopMenuDefaultOpenKeys,
  content: [],
  ai: [],
  tools: [],
  settings: [],
  apps: [],
}

const primaryNavConfig: {
  key: PrimaryKey
  label: string
  icon: ReactNode
}[] = [
  { key: 'home', label: '首页', icon: <HomeOutlined /> },
  { key: 'customer', label: '客户', icon: <UserOutlined /> },
  { key: 'message', label: '消息', icon: <MessageOutlined /> },
  { key: 'marketing', label: '营销', icon: <NotificationOutlined /> },
  { key: 'shop', label: '小店', icon: <ShopOutlined /> },
  { key: 'content', label: '内容', icon: <FileTextOutlined /> },
  { key: 'ai', label: 'AI', icon: <span className="icon-rail-ai">AI</span> },
  { key: 'tools', label: '工具', icon: <ToolOutlined /> },
  { key: 'settings', label: '设置', icon: <SettingOutlined /> },
  { key: 'apps', label: '应用', icon: <AppstoreOutlined /> },
]

export type ToolItem = {
  key: string
  title: string
  desc: string
  icon: ReactNode
  badge?: 'new' | 'hot'
}

// ==========================================
// 页面 1 (营销工具 - 橙色主题) 的数据项定义
// ==========================================
const orangeClassicTools: ToolItem[] = [
  {
    key: 'coupon',
    title: '优惠券',
    desc: '给用户发放店铺优惠券',
    icon: <PercentageOutlined />,
    badge: 'hot',
  },
  {
    key: 'full-reduction',
    title: '满减/折',
    desc: '购买一步全额享受减免',
    icon: <GiftOutlined />,
  },
  {
    key: 'group',
    title: '拼团',
    desc: '多人组团低价购买同一件商品',
    icon: <TeamOutlined />,
  },
  {
    key: 'fission-coupon',
    title: '裂变优惠券',
    desc: '转发邀请好友即可得',
    icon: <ShareAltOutlined />,
  },
  {
    key: 'order-gift',
    title: '下单送礼',
    desc: '购买订单即可获得礼品',
    icon: <GiftOutlined />,
  },
  {
    key: 'vip-discount',
    title: '会员专享',
    desc: '针对不同等级会员专属折扣',
    icon: <CrownOutlined />,
  },
  {
    key: 'points-mall',
    title: '积分商城',
    desc: '针对会员购买产品兑换积分商品',
    icon: <DatabaseOutlined />,
    badge: 'new',
  },
  {
    key: 'n-pieces',
    title: 'N元N件',
    desc: '购买指定件数商品只需一件价格',
    icon: <CalculatorOutlined />,
    badge: 'new',
  },
  {
    key: 'gifts',
    title: '赠品活动',
    desc: '购买满一定金额赠送小礼品',
    icon: <GiftOutlined />,
    badge: 'new',
  },
]

const orangeSourcingTools: ToolItem[] = [
  {
    key: '选品优选',
    title: '选品优选',
    desc: '智能匹配货源以更有性价比的拿货',
    icon: <ShoppingOutlined />,
  },
]

const orangeOtherTools: ToolItem[] = [
  {
    key: 'manual',
    title: '产品说明书',
    desc: '用于管理产品，协助客户使用及解答',
    icon: <BookOutlined />,
  },
  {
    key: 'msg-box',
    title: '消息框',
    desc: '用来做营销、拉新提示，结合卡券使用效果更佳',
    icon: <MessageOutlined />,
  },
  {
    key: 'draft',
    title: '草稿箱',
    desc: '买家尚未支付的订单列表',
    icon: <MailOutlined />,
  },
  {
    key: 'verify',
    title: '核销管理',
    desc: '快速核销已购买的线下体验券',
    icon: <ScanOutlined />,
  },
  {
    key: 'queue',
    title: '排队榜',
    desc: '自动根据消费订单金额，生产排队序列',
    icon: <OrderedListOutlined />,
  },
  {
    key: 'market',
    title: '优惠券市场',
    desc: '安全快捷获得其它优惠券',
    icon: <PercentageOutlined />,
  },
]

// ==========================================
// 页面 2 (积分营销 - 蓝色主题) 的数据项定义
// ==========================================
const blueInteractiveTools: ToolItem[] = [
  {
    key: 'sign-gift',
    title: '签到送礼',
    desc: '持续签到以获得优惠券、积分等福利',
    icon: <CalendarOutlined />,
  },
  {
    key: 'live-lottery',
    title: '直播抽奖',
    desc: '针对指定商品展示抽奖',
    icon: <PlayCircleOutlined />,
  },
  {
    key: 'wishlist',
    title: '心愿单',
    desc: '收集消费者的心愿，进行特定活动',
    icon: <HeartOutlined />,
  },
  {
    key: 'timing-lottery',
    title: '定时开奖',
    desc: '设定开奖时间，用户参与即可在特定时间获得抽奖机会',
    icon: <ClockCircleOutlined />,
  },
  {
    key: 'game',
    title: '互动游戏',
    desc: '自带安全监控，防薅羊毛自动预警',
    icon: <PlaySquareOutlined />,
  },
  {
    key: 'order-lottery',
    title: '下单抽奖',
    desc: '下单后进入抽奖环节，可有效提升复购率',
    icon: <TrophyOutlined />,
  },
  {
    key: 'task-clock',
    title: '打卡任务',
    desc: '设定打卡任务，引导用户参与',
    icon: <CalendarOutlined />,
    badge: 'new',
  },
]

const blueGiftTools: ToolItem[] = [
  {
    key: 'member-gift',
    title: '入会送礼',
    desc: '引导粉丝加入成为新会员，增加新会员人数',
    icon: <CrownOutlined />,
  },
  {
    key: 'order-full-gift',
    title: '订单满额送',
    desc: '单笔消费满额送赠品，提升每笔订单的客单价',
    icon: <ShoppingOutlined />,
  },
  {
    key: 'review-gift',
    title: '评价送礼',
    desc: '完成订单评价奖励积分或优惠券，提升好评率',
    icon: <StarOutlined />,
    badge: 'new',
  },
  {
    key: 'fission-gift',
    title: '裂变送礼',
    desc: '邀请好友绑定关系可获得奖励，低成本拉新',
    icon: <ShareAltOutlined />,
    badge: 'new',
  },
  {
    key: 'first-order',
    title: '首单有礼',
    desc: '针对首笔订单的专享福利，引导新客转化',
    icon: <SafetyCertificateOutlined />,
  },
  {
    key: 'charge-gift',
    title: '充值送礼',
    desc: '新会员首充充值送礼，大幅增加预存金额',
    icon: <CreditCardOutlined />,
  },
  {
    key: 'birthday',
    title: '生日有礼',
    desc: '会员生日赠送专属福利，树立良好的品牌形象',
    icon: <SmileOutlined />,
  },
  {
    key: 'retention',
    title: '留存有礼',
    desc: '完成指定操作，可获得优惠券',
    icon: <BookOutlined />,
    badge: 'new',
  },
  {
    key: 'cashback',
    title: '下单返现',
    desc: '引导消费者在限定时间内，完成指定交易返现',
    icon: <DollarOutlined />,
    badge: 'new',
  },
  {
    key: 'sugar-plan',
    title: '发糖划线计划',
    desc: '引导普通顾客成为金牌会员，提升复购率',
    icon: <StarOutlined />,
    badge: 'new',
  },
]

const blueMaintenanceTools: ToolItem[] = [
  {
    key: 'pts-mall',
    title: '积分商城',
    desc: '以积分兑换优惠券、礼品',
    icon: <DatabaseOutlined />,
    badge: 'new',
  },
  {
    key: 'pts-task',
    title: '积分任务',
    desc: '引导用户做任务以获得积分',
    icon: <BookOutlined />,
  },
  {
    key: 'pts-sign',
    title: '签到有礼',
    desc: '每日签到奖励积分，增加日活',
    icon: <CalendarOutlined />,
  },
  {
    key: 'pts-mkt',
    title: '积分营销',
    desc: '引导消费者在限时优惠，提升活动销量',
    icon: <PercentageOutlined />,
  },
  {
    key: 'pts-line',
    title: '积分划线',
    desc: '购买商品可用积分抵扣，提升转化率',
    icon: <EditOutlined />,
  },
  {
    key: 'pts-charge',
    title: '充值赠送',
    desc: '通过多充多送锁住用户，增加现金流',
    icon: <CreditCardOutlined />,
  },
  {
    key: 'pts-card',
    title: '体验卡',
    desc: '增加新客体验机率，引导消费',
    icon: <SafetyCertificateOutlined />,
  },
  {
    key: 'pts-author',
    title: '作者中心',
    desc: '通过发布内容引导转化',
    icon: <EditOutlined />,
    badge: 'new',
  },
]

// ==========================================
// 辅助子组件
// ==========================================
function ToolCard({ item, theme }: { item: ToolItem; theme: 'orange' | 'blue' }) {
  return (
    <div className={`tool-card card-${theme}`}>
      <div className="tool-card-icon-wrap">
        {item.badge === 'new' && <span className="badge-new">最新</span>}
        {item.badge === 'hot' && <span className="badge-hot">热门</span>}
        {item.icon}
      </div>
      <div className="tool-card-body">
        <h3 className="tool-card-title">{item.title}</h3>
        <p className="tool-card-desc">{item.desc}</p>
      </div>
      <span className="tool-card-action">
        {theme === 'blue' ? '去配置' : '去使用'} <RightOutlined style={{ fontSize: 9 }} />
      </span>
    </div>
  )
}

function ToolSection({
  title,
  items,
  theme,
}: {
  title: string
  items: ToolItem[]
  theme: 'orange' | 'blue'
}) {
  return (
    <section className="tool-section">
      <h2 className="tool-section-title">{title}</h2>
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col key={item.key} xs={24} sm={12} lg={8}>
            <ToolCard item={item} theme={theme} />
          </Col>
        ))}
      </Row>
    </section>
  )
}

function getItemLabel(
  items: MenuProps['items'] | undefined,
  key: string,
): string {
  if (!items) return ''
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') continue
    const it = raw as {
      key?: string
      label?: ReactNode
      children?: MenuProps['items']
    }
    if (it.key === key && typeof it.label === 'string') return it.label
    const nested = getItemLabel(it.children, key)
    if (nested) return nested
  }
  return ''
}

// 帮助获取父级名称，比如“营销工具”或者“客群运营”
function getParentMenuLabel(
  items: MenuProps['items'] | undefined,
  childKey: string,
): string {
  if (!items) return ''
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') continue
    const it = raw as {
      key?: string
      label?: ReactNode
      children?: MenuProps['items']
    }
    if (it.children) {
      for (const sub of it.children) {
        if (sub && typeof sub === 'object' && 'key' in sub && sub.key === childKey) {
          return typeof it.label === 'string' ? it.label : ''
        }
      }
      const nested = getParentMenuLabel(it.children, childKey)
      if (nested) return nested
    }
  }
  return ''
}

// ==========================================
// 【新组件】LotteryEditor：高体验的抽奖页面装修编辑器
// ==========================================
function LotteryEditor() {
  // Tab 状态
  const [activeTab, setActiveTab] = useState<string>('page')

  // 1. 基础布局设置
  const [lotteryType, setLotteryType] = useState<'grid' | 'wheel'>('grid')
  const [lotteryStyle, setLotteryStyle] = useState<string>('style-custom')

  // 2. 皮肤与图片配置
  const [bgType, setBgType] = useState<'color' | 'image'>('image')
  const [bgImage, setBgImage] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')
  const [bgColor, setBgColor] = useState<string>('#E60B30') // 经典中国红底色
  
  // 3. 抽奖机外壳与奖台设置
  const [machineBgType, setMachineBgType] = useState<'default' | 'custom'>('default')
  const [customMachineImage, setCustomMachineImage] = useState<string>('')
  const [showPedestal, setShowPedestal] = useState<boolean>(true)
  const [customPedestalImage, setCustomPedestalImage] = useState<string>('')

  // 4. 【核心 Slider 调节控制参数】
  const [machineY, setMachineY] = useState<number>(140)         // 抽奖机垂直偏移距离 (50 - 350)
  const [machineX, setMachineX] = useState<number>(0)           // 抽奖机水平平移距离 (-40 - 40)
  const [pedestalY, setPedestalY] = useState<number>(390)       // 奖台垂直定位 (200 - 500)
  const [pedestalScale, setPedestalScale] = useState<number>(1.0) // 奖台高度/大小缩放比 (0.6 - 1.6)
  const [gridPadding, setGridPadding] = useState<number>(24)     // 奖品区域上下间距 (10 - 80)

  // 5. 配色设置
  const [btnBgColor, setBtnBgColor] = useState<string>('#FFAE00') // 按钮金黄色
  const [btnTextColor, setBtnTextColor] = useState<string>('#E60B30') // 按钮红色文字

  // 6. 展示选项
  const [showWinnerRecord, setShowWinnerRecord] = useState<boolean>(true)
  const [enableAd, setEnableAd] = useState<boolean>(false)
  const [enableRecharge, setEnableRecharge] = useState<boolean>(true)

  // 默认重置所有属性
  const resetSettings = () => {
    setLotteryType('grid')
    setLotteryStyle('style-custom')
    setBgType('image')
    setBgImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')
    setBgColor('#E60B30')
    setMachineBgType('default')
    setCustomMachineImage('')
    setShowPedestal(true)
    setCustomPedestalImage('')
    setMachineY(140)
    setMachineX(0)
    setPedestalY(390)
    setPedestalScale(1.0)
    setGridPadding(24)
    setBtnBgColor('#FFAE00')
    setBtnTextColor('#E60B30')
    setShowWinnerRecord(true)
    setEnableAd(false)
    setEnableRecharge(true)
  }

  // 模拟的 9 个格子奖品数据
  const mockPrizes = [
    { id: 1, name: '1 积分', icon: <DatabaseOutlined style={{ color: '#FF9C1A' }} /> },
    { id: 2, name: '1积分', icon: <DatabaseOutlined style={{ color: '#FF9C1A' }} /> },
    { id: 3, name: '1 积分', icon: <DatabaseOutlined style={{ color: '#FF9C1A' }} /> },
    { id: 4, name: '谢谢参与', icon: <SmileOutlined style={{ color: '#8c8c8c' }} /> },
    { id: 5, action: true, name: '立即抽奖' }, // 中间按钮
    { id: 6, name: '谢谢参与', icon: <SmileOutlined style={{ color: '#8c8c8c' }} /> },
    { id: 7, name: '谢谢参与', icon: <SmileOutlined style={{ color: '#8c8c8c' }} /> },
    { id: 8, name: '谢谢参与', icon: <SmileOutlined style={{ color: '#8c8c8c' }} /> },
    { id: 9, name: '谢谢参与', icon: <SmileOutlined style={{ color: '#8c8c8c' }} /> },
  ]

  return (
    <div className="lottery-editor-wrapper">
      {/* 选项卡头部 */}
      <div className="editor-tab-header">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'page', label: '抽奖页面' },
            { key: 'poster', label: '分享海报' },
            { key: 'card', label: '分享卡片' },
          ]}
        />
      </div>

      <Row gutter={24} style={{ marginTop: 12 }}>
        {/* 左侧：手机预览模拟器 */}
        <Col xs={24} lg={9} xl={8} style={{ display: 'flex', justifyContent: 'center' }}>
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

            {/* 页面预览内容 */}
            <div
              className="phone-screen-content"
              style={{
                backgroundColor: bgColor,
                backgroundImage: bgType === 'image' ? `url(${bgImage})` : 'none',
              }}
            >
              {/* 返回按钮和活动名称 */}
              <div className="phone-page-header">
                <span className="back-arrow">〈</span>
                <span className="activity-title">特步会员惊喜大抽奖</span>
                <span className="more-menu">•••</span>
              </div>

              {/* 头部大标题装饰 */}
              <div className="lottery-head-banner">
                <div className="main-title">特步会员</div>
                <div className="sub-title">惊喜大抽奖</div>
              </div>

              {/* 【互动层 1】抽奖机主体 */}
              <div
                className="preview-lottery-machine"
                style={{
                  transform: `translate(${machineX}px, ${machineY}px)`,
                  backgroundImage: machineBgType === 'custom' && customMachineImage ? `url(${customMachineImage})` : undefined,
                }}
              >
                {/* 奖品网格区域，其 padding 由 gridPadding 控制 */}
                <div
                  className="preview-grid-container"
                  style={{
                    paddingTop: `${gridPadding}px`,
                    paddingBottom: `${gridPadding}px`,
                  }}
                >
                  {lotteryType === 'grid' ? (
                    <div className="preview-nine-grid">
                      {mockPrizes.map((p, idx) => {
                        if (p.action) {
                          return (
                            <button
                              key={idx}
                              type="button"
                              className="grid-prize-action"
                              style={{
                                backgroundColor: btnBgColor,
                                color: btnTextColor,
                              }}
                            >
                              <div className="btn-label">{p.name}</div>
                              <div className="btn-sub">扣除10积分</div>
                            </button>
                          )
                        }
                        return (
                          <div key={idx} className="grid-prize-cell">
                            {p.icon}
                            <span className="prize-name">{p.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    // 大转盘极简化预览
                    <div className="preview-wheel-container">
                      <div className="preview-wheel-circle" style={{ borderColor: btnBgColor }}>
                        <div className="wheel-segment-line" style={{ transform: 'rotate(45deg)' }}></div>
                        <div className="wheel-segment-line" style={{ transform: 'rotate(90deg)' }}></div>
                        <div className="wheel-segment-line" style={{ transform: 'rotate(135deg)' }}></div>
                        <div className="wheel-segment-line" style={{ transform: 'rotate(180deg)' }}></div>
                        <button
                          type="button"
                          className="wheel-center-pointer"
                          style={{ backgroundColor: btnBgColor, color: btnTextColor }}
                        >
                          抽奖
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 底部副操作按钮 */}
                <div className="preview-machine-footer">
                  <div className="footer-pill-btn">道具商城 ＞</div>
                  <div className="footer-pill-btn color-orange">积分兑换 ＞</div>
                </div>
              </div>

              {/* 【互动层 2】自定义奖台/底座，其位置与大小缩放由 pedestalY & pedestalScale 控制 */}
              {showPedestal && (
                <div
                  className="preview-pedestal-platform"
                  style={{
                    transform: `translate(-50%, ${pedestalY}px) scale(${pedestalScale})`,
                    backgroundImage: customPedestalImage ? `url(${customPedestalImage})` : undefined,
                  }}
                >
                  {/* 小指示按钮模拟 */}
                  {!customPedestalImage && (
                    <div className="pedestal-indicator-lights">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              )}

              {/* 中奖滚动区域 */}
              {showWinnerRecord && (
                <div className="preview-winner-records-bar">
                  <span className="record-item">🎉 微信用户A 刚刚抽中了“100积分”</span>
                </div>
              )}

              {/* 底部奖品详情卡片 */}
              <div className="preview-my-prizes-card">
                <div className="card-header-bar">
                  <span className="title">我的奖品</span>
                  <span className="more">查看全部 ＞</span>
                </div>
                <div className="prize-list-item">
                  <span className="badge">优惠券</span>
                  <div className="info">
                    <div className="name">优惠券</div>
                    <div className="time">有效期至：2026年11月22日</div>
                  </div>
                  <button type="button" className="btn-exchange">兑换</button>
                </div>
                <div className="prize-list-item">
                  <span className="badge color-gray">实物</span>
                  <div className="info">
                    <div className="name">秋冬长袖外套</div>
                    <div className="time">有效期至：2026年12月01日</div>
                  </div>
                  <button type="button" className="btn-exchange outline">提货</button>
                </div>
              </div>

              {/* 广告位 */}
              {enableAd && (
                <div className="preview-ad-banner">
                  <span className="ad-label">广告</span>
                  <div className="ad-text">特步夏季凉鞋新品上新，全场5折起！</div>
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* 右侧：配置属性面板 */}
        <Col xs={24} lg={15} xl={16}>
          <div className="editor-properties-panel">
            
            {/* 顶栏控制组 */}
            <div className="panel-header-section">
              <span className="title">装修属性配置</span>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={resetSettings}
                style={{ color: '#8c8c8c' }}
              >
                重置默认配置
              </Button>
            </div>

            {/* 一、基础布局设置 */}
            <div className="prop-group-card">
              <h3 className="group-title">一、基础设置</h3>
              
              <div className="prop-row">
                <div className="prop-label">
                  <span>抽奖类型</span>
                  <Tooltip title="选择不同的前台展现形式，九宫格更聚人气，大转盘则趣味互动性强。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control">
                  <Radio.Group
                    value={lotteryType}
                    onChange={(e) => setLotteryType(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                  >
                    <Radio.Button value="grid">九宫格</Radio.Button>
                    <Radio.Button value="wheel">大转盘</Radio.Button>
                  </Radio.Group>
                </div>
              </div>

              <div className="prop-row">
                <div className="prop-label">
                  <span>抽奖风格</span>
                  <Tooltip title="使用预置的主题模板风格，也可以使用“自定义”上传您的专属设计外壳。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control">
                  <Radio.Group
                    value={lotteryStyle}
                    onChange={(e) => {
                      setLotteryStyle(e.target.value)
                      if (e.target.value !== 'style-custom') {
                        // 预设主题配色联动
                        if (e.target.value === 'style-gold') {
                          setBgColor('#B32400')
                          setBtnBgColor('#FFE654')
                          setBtnTextColor('#B32400')
                        } else {
                          setBgColor('#E60B30')
                          setBtnBgColor('#FFAE00')
                          setBtnTextColor('#E60B30')
                        }
                      }
                    }}
                    optionType="button"
                  >
                    <Radio.Button value="style-1">风格一</Radio.Button>
                    <Radio.Button value="style-2">风格二</Radio.Button>
                    <Radio.Button value="style-3">风格三</Radio.Button>
                    <Radio.Button value="style-gold">风金黄板</Radio.Button>
                    <Radio.Button value="style-custom">自定义</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            </div>

            {/* 二、布局与空间微调 (Sliders - 重构重点) */}
            <div className="prop-group-card highlight-card">
              <h3 className="group-title">二、抽奖机及奖台定位微调</h3>
              <p className="group-intro-text">
                <InfoCircleOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                为了匹配不同的背景图布局，您可以使用以下滑动条来精细化调节前台位置。
              </p>

              {/* 属性 1：抽奖机垂直高度 */}
              <div className="prop-row slider-row">
                <div className="prop-label">
                  <span>抽奖机垂直高度</span>
                  <Tooltip title="【高度定位】调整抽奖机外框距离页面顶部的距离。如果背景图上部有大幅标题或精美画作，建议向下拉大本参数防止被遮挡。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control slider-control-group">
                  <div className="slider-wrapper">
                    <Slider
                      min={60}
                      max={320}
                      value={machineY}
                      onChange={setMachineY}
                      tooltip={{ formatter: (v) => v !== undefined ? `${v}px` : '' }}
                    />
                  </div>
                  <InputNumber
                    min={60}
                    max={320}
                    value={machineY}
                    onChange={(val) => val !== null && setMachineY(val)}
                    addonAfter="px"
                    style={{ width: 95 }}
                  />
                </div>
                <div className="prop-tip-text">推荐设置：背景图较空时使用 120-150px，大标题设计时使用 180-220px。</div>
              </div>

              {/* 属性 2：抽奖机左右平移 */}
              <div className="prop-row slider-row">
                <div className="prop-label">
                  <span>抽奖机左右平移</span>
                  <Tooltip title="【水平纠偏】微调抽奖机的水平偏心距。当背景图的主体人物或视觉中心偏向一侧时，可以使用此项进行非对称偏心设计，让网格和背景巧妙契合。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control slider-control-group">
                  <div className="slider-wrapper">
                    <Slider
                      min={-40}
                      max={40}
                      value={machineX}
                      onChange={setMachineX}
                      tooltip={{ formatter: (v) => v !== undefined ? `${v}px` : '' }}
                    />
                  </div>
                  <InputNumber
                    min={-40}
                    max={40}
                    value={machineX}
                    onChange={(val) => val !== null && setMachineX(val)}
                    addonAfter="px"
                    style={{ width: 95 }}
                  />
                </div>
                <div className="prop-tip-text">向左为负，向右为正。如非特定非对称背景，建议保持 0px 居中。</div>
              </div>

              {/* 属性 3：底座奖台垂直位置 */}
              <div className="prop-row slider-row">
                <div className="prop-label">
                  <span>底座奖台垂直位置</span>
                  <Tooltip title="【底座定位】调整底座奖台相对页面顶部的垂直定位，从而能精准贴合到抽奖机底端。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control slider-control-group">
                  <div className="slider-wrapper">
                    <Slider
                      min={240}
                      max={460}
                      value={pedestalY}
                      onChange={setPedestalY}
                      tooltip={{ formatter: (v) => v !== undefined ? `${v}px` : '' }}
                    />
                  </div>
                  <InputNumber
                    min={240}
                    max={460}
                    value={pedestalY}
                    onChange={(val) => val !== null && setPedestalY(val)}
                    addonAfter="px"
                    style={{ width: 95 }}
                  />
                </div>
              </div>

              {/* 属性 4：底座奖台尺寸缩放 */}
              <div className="prop-row slider-row">
                <div className="prop-label">
                  <span>底座奖台尺寸缩放</span>
                  <Tooltip title="【底座大小】调整底部装饰奖台的比例缩放。放大可营造出更宏大的托盘视觉效果。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control slider-control-group">
                  <div className="slider-wrapper">
                    <Slider
                      min={0.6}
                      max={1.6}
                      step={0.05}
                      value={pedestalScale}
                      onChange={setPedestalScale}
                      tooltip={{ formatter: (v) => v !== undefined ? `${Math.round(v * 100)}%` : '' }}
                    />
                  </div>
                  <InputNumber
                    min={0.6}
                    max={1.6}
                    step={0.05}
                    value={pedestalScale}
                    onChange={(val) => val !== null && setPedestalScale(val)}
                    style={{ width: 95 }}
                  />
                </div>
              </div>

              {/* 属性 5：奖品区域上下间距 */}
              <div className="prop-row slider-row">
                <div className="prop-label">
                  <span>奖品格子上下间距</span>
                  <Tooltip title="【内部留白】控制九宫格奖品包在抽奖机外壳内部的上下 Padding 间距。增加该间距会压缩网格的纵向分布空间，收缩留白，避免九宫格顶破抽奖机的发光外边框。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control slider-control-group">
                  <div className="slider-wrapper">
                    <Slider
                      min={10}
                      max={80}
                      value={gridPadding}
                      onChange={setGridPadding}
                      tooltip={{ formatter: (v) => v !== undefined ? `${v}px` : '' }}
                    />
                  </div>
                  <InputNumber
                    min={10}
                    max={80}
                    value={gridPadding}
                    onChange={(val) => val !== null && setGridPadding(val)}
                    addonAfter="px"
                    style={{ width: 95 }}
                  />
                </div>
                <div className="prop-tip-text">建议根据自定义抽奖机图片的外框厚度进行自适应微调。</div>
              </div>
            </div>

            {/* 三、背景与装饰图素材上传 */}
            <div className="prop-group-card">
              <h3 className="group-title">三、皮肤与素材上传</h3>

              <div className="prop-row">
                <div className="prop-label">
                  <span>页面背景图</span>
                  <Tooltip title="上传活动整体的页面主背景。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control upload-control-group">
                  <Radio.Group
                    value={bgType}
                    onChange={(e) => setBgType(e.target.value)}
                    style={{ marginBottom: 12, display: 'block' }}
                  >
                    <Radio value="color">纯色底色</Radio>
                    <Radio value="image">图片背景</Radio>
                  </Radio.Group>
                  
                  {bgType === 'image' && (
                    <div className="image-uploader-block">
                      <img src={bgImage} alt="背景缩略图" className="uploader-preview-img" />
                      <div className="uploader-actions">
                        <Upload maxCount={1} showUploadList={false}>
                          <Button size="small" icon={<UploadOutlined />}>上传新背景</Button>
                        </Upload>
                        <Button
                          size="small"
                          type="text"
                          danger
                          onClick={() => setBgImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')}
                        >
                          恢复默认
                        </Button>
                        <span className="file-format-spec">支持 PNG / JPG，推荐尺寸 1125 × 1410 px</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="prop-row">
                <div className="prop-label">
                  <span>自定义抽奖机外壳</span>
                  <Tooltip title="上传您量身定制的抽奖机外部壳图，要求中间部分镂空（或透明），以便露出下层的九宫格奖品。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control">
                  <Radio.Group
                    value={machineBgType}
                    onChange={(e) => setMachineBgType(e.target.value)}
                    style={{ marginBottom: 12, display: 'block' }}
                  >
                    <Radio value="default">官方经典红色机壳</Radio>
                    <Radio value="custom">自定义设计机壳</Radio>
                  </Radio.Group>

                  {machineBgType === 'custom' && (
                    <div className="image-uploader-block">
                      <div className="uploader-box-placeholder">
                        <PlusOutlined />
                        <div style={{ marginTop: 8, fontSize: 11 }}>上传透明图</div>
                      </div>
                      <span className="file-format-spec">必须为带透明通道的 PNG 格式图片，推荐大小小于 800KB。</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="prop-row">
                <div className="prop-label">
                  <span>自定义底座奖台</span>
                </div>
                <div className="prop-control">
                  <Switch
                    checked={showPedestal}
                    onChange={setShowPedestal}
                    checkedChildren="启用奖台"
                    unCheckedChildren="关闭奖台"
                    style={{ marginBottom: 8 }}
                  />
                  {showPedestal && (
                    <div className="image-uploader-block" style={{ marginTop: 8 }}>
                      <Upload maxCount={1} showUploadList={false}>
                        <Button size="small" icon={<UploadOutlined />}>上传专属底座图片</Button>
                      </Upload>
                      <span className="file-format-spec">PNG 格式，让抽奖活动更具仪式感和高品质感。</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 四、配色与交互展示项 */}
            <div className="prop-group-card">
              <h3 className="group-title">四、配色与按钮交互配置</h3>

              <div className="prop-row">
                <div className="prop-label">
                  <span>活动主底色</span>
                  <Tooltip title="控制无背景图时的底色，或者背景图加载失败时的兜底纯色。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control color-picker-group">
                  <ColorPicker value={bgColor} onChange={(c) => setBgColor(c.toHexString())} showText />
                </div>
              </div>

              <div className="prop-row">
                <div className="prop-label">
                  <span>抽奖主按钮背景</span>
                </div>
                <div className="prop-control color-picker-group">
                  <ColorPicker value={btnBgColor} onChange={(c) => setBtnBgColor(c.toHexString())} showText />
                </div>
              </div>

              <div className="prop-row">
                <div className="prop-label">
                  <span>主按钮文本色</span>
                </div>
                <div className="prop-control color-picker-group">
                  <ColorPicker value={btnTextColor} onChange={(c) => setBtnTextColor(c.toHexString())} showText />
                </div>
              </div>

              <div className="prop-row">
                <div className="prop-label">
                  <span>中奖横幅滚动</span>
                </div>
                <div className="prop-control">
                  <Switch checked={showWinnerRecord} onChange={setShowWinnerRecord} />
                  <span className="side-switch-explain">开启后，前台将以弹幕跑马灯形式轮播滚动用户的真实中奖通知。</span>
                </div>
              </div>

              <div className="prop-row">
                <div className="prop-label">
                  <span>底部流量广告位</span>
                </div>
                <div className="prop-control">
                  <Switch checked={enableAd} onChange={setEnableAd} />
                  <span className="side-switch-explain">开启后将在下方嵌入小程序原生流量主广告，推荐大流量店铺开启以赚取收益（仅支持v1.9.22及以上）。</span>
                </div>
              </div>

              <div className="prop-row">
                <div className="prop-label">
                  <span>积分充值引导</span>
                </div>
                <div className="prop-control">
                  <Switch checked={enableRecharge} onChange={setEnableRecharge} />
                  <span className="side-switch-explain">若用户积分余额不足时，引导用户直接跳转至会员卡充值页面。</span>
                </div>
              </div>
            </div>

          </div>
        </Col>
      </Row>
    </div>
  )
}

// ==========================================
// 【新组件】TaskEditor：高画质、多端互动任务的保姆级引导编辑器与模拟器
// ==========================================
function TaskEditor() {
  // 后台配置 State
  const [platform, setPlatform] = useState<'xhs' | 'dy' | 'weibo' | 'wx'>('xhs')
  const [rewardPoints, setRewardPoints] = useState<number>(100)
  const [actions, setActions] = useState<string[]>(['like', 'collect', 'comment'])
  const [commentKeyword, setCommentKeyword] = useState<string>('已种草，想试试')
  const [postLink, setPostLink] = useState<string>('https://www.xiaohongshu.com/discovery/item/65d1a8b1000000000')
  const [coverImage, setCoverImage] = useState<string>('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80')
  const [qrCodeImage, setQrCodeImage] = useState<string>('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.xiaohongshu.com')
  const [customGuideText, setCustomGuideText] = useState<string>('由于微信限制，请选择以下任一方式打开帖子完成任务：')
  
  // 头部海报配置
  const [bannerType, setBannerType] = useState<'gradient' | 'image'>('image')
  const [bannerImage, setBannerImage] = useState<string>('/task_banner_default.png')
  const [bannerTitle, setBannerTitle] = useState<string>('互动宠粉')
  const [bannerSubtitle, setBannerSubtitle] = useState<string>('这波福利直接拉满，完成指定互动即可领奖！')

  // 前台模拟交互 State
  const [uploadedScreenshot, setUploadedScreenshot] = useState<string>('')
  const [showExampleModal, setShowExampleModal] = useState<boolean>(false)
  const [isCopiedLink, setIsCopiedLink] = useState<boolean>(false)
  const [isCopiedKeyword, setIsCopiedKeyword] = useState<boolean>(false)

  // 重置默认属性
  const resetTaskSettings = () => {
    setPlatform('xhs')
    setRewardPoints(100)
    setActions(['like', 'collect', 'comment'])
    setCommentKeyword('已种草，想试试')
    setPostLink('https://www.xiaohongshu.com/discovery/item/65d1a8b1000000000')
    setCoverImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80')
    setQrCodeImage('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.xiaohongshu.com')
    setCustomGuideText('由于微信限制，请选择以下任一方式打开帖子完成任务：')
    
    // 重置海报配置
    setBannerType('image')
    setBannerImage('/task_banner_default.png')
    setBannerTitle('互动宠粉')
    setBannerSubtitle('这波福利直接拉满，完成指定互动即可领奖！')
    
    // 重置交互状态
    setUploadedScreenshot('')
    setShowExampleModal(false)
    setIsCopiedLink(false)
    setIsCopiedKeyword(false)
    message.success('已重置回系统初始模板数据')
  }

  // 模拟操作触发器
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(postLink)
    } catch (e) {
      // 兼容非安全环境
    }
    setIsCopiedLink(true)
    message.success('任务链接已成功复制！请打开浏览器或相应App完成跳转')
    setTimeout(() => setIsCopiedLink(false), 2000)
  }

  const handleCopyKeyword = () => {
    try {
      navigator.clipboard.writeText(commentKeyword)
    } catch (e) {
      // 兼容非安全环境
    }
    setIsCopiedKeyword(true)
    message.success('评论关键词已复制到剪切板，去发表吧！')
    setTimeout(() => setIsCopiedKeyword(false), 2000)
  }

  const handleSaveQR = () => {
    message.success('已模拟将帖子二维码保存至手机相册！')
  }

  const handleToggleUpload = () => {
    if (uploadedScreenshot) {
      setUploadedScreenshot('')
      message.info('已移除上传的截图凭证')
    } else {
      setUploadedScreenshot('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80')
      message.success('截图凭证上传成功（已模拟填入示例图片）')
    }
  }

  const handleSubmitTask = () => {
    if (!uploadedScreenshot) {
      message.warning('请先完成第三步，上传互动截图凭证后方可提交！')
    } else {
      message.success('凭证已提交成功！预计24小时内审核完毕发放积分奖励')
    }
  }

  const platformName = {
    xhs: '小红书',
    dy: '抖音',
    weibo: '微博',
    wx: '微信视频号',
  }[platform]

  const platformColorClass = {
    xhs: 'xhs',
    dy: 'dy',
    weibo: 'weibo',
    wx: 'wx',
  }[platform]

  return (
    <div className="lottery-editor-wrapper">
      {/* 选项卡头部 */}
      <div className="editor-tab-header">
        <Tabs
          activeKey="task-page"
          items={[
            { key: 'task-page', label: 'C端任务页面预览' },
            { key: 'audit-panel', label: '商户审核列表', disabled: true },
          ]}
        />
      </div>

      <Row gutter={24} style={{ marginTop: 12 }}>
        {/* 左侧：手机预览模拟器 */}
        <Col xs={24} lg={9} xl={8} style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="mobile-phone-frame">
            {/* 听筒和镜头 */}
            <div className="phone-top-notch"></div>
            
            {/* 状态栏 */}
            <div className="phone-status-bar" style={{ color: '#000' }}>
              <span className="time">9:41</span>
              <div className="icons">
                <span className="cellular">📶</span>
                <span className="wifi">🔋</span>
              </div>
            </div>

            {/* 页面预览内容 */}
            <div className="phone-screen-content task-detail-preview">
              {/* 页面导航头 */}
              <div className="phone-page-header" style={{ color: '#333', background: '#fff', borderBottom: '1px solid #f0f0f0', textShadow: 'none' }}>
                <span className="back-arrow"><ArrowLeftOutlined style={{ fontSize: 13 }} /></span>
                <span className="activity-title" style={{ fontWeight: 600 }}>任务详情</span>
                <span className="more-menu">•••</span>
              </div>

              {/* 可滚动的主体区域 */}
              <div className="task-scroll-body">
                {/* 顶部海报 Banner */}
              {bannerType === 'image' ? (
                <div className="task-preview-banner-img-wrap">
                  <img src={bannerImage} alt="活动介绍海报" className="task-preview-banner-img" />
                </div>
              ) : (
                <div className="task-preview-banner">
                  <h2 className="banner-main-title">{bannerTitle}</h2>
                  <p className="banner-sub-title">{bannerSubtitle}</p>
                </div>
              )}

              {/* 奖励积分卡片 */}
              <div className="task-reward-card">
                <div className="reward-left">
                  <span className="reward-label">完成任务可得</span>
                  <div className="reward-value">+{rewardPoints} <span>积分</span></div>
                </div>
                <div className="reward-badge">截图审核通过后发放</div>
              </div>

              {/* 步骤引导列表 */}
              <div className="task-steps-container">
                
                {/* 步骤 1：去对应平台找到帖子 */}
                <div className="task-step-card">
                  <div className="step-header">
                    <span className="step-number-badge">1</span>
                    <span className="step-title">第一步：锁定目标帖子</span>
                    <span className="step-desc">对照无误</span>
                  </div>

                  {/* 认准封面视觉区 */}
                  <div className="post-target-visual">
                    <img src={coverImage} alt="帖子封面" className="post-visual-img" />
                    <div className="post-visual-info">
                      <h4 className="post-visual-title">互动宠粉计划！双击点赞收藏，并在评论区分享你的看法。</h4>
                      <div className="post-visual-author">
                        <span className={`post-visual-platform-tag ${platformColorClass}`}>{platformName}</span>
                        <span>官方推荐号</span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 10.5, color: '#595959', margin: '4px 0 10px', lineHeight: 1.4 }}>
                    {customGuideText}
                  </p>

                  <div className="step-actions-row">
                    <button type="button" className="action-btn-pill filled" onClick={handleCopyLink}>
                      {isCopiedLink ? <CheckOutlined /> : <CopyOutlined />} {isCopiedLink ? '复制成功' : '一键复制链接'}
                    </button>
                    <button type="button" className="action-btn-pill" onClick={handleSaveQR}>
                      <DownloadOutlined /> 保存二维码
                    </button>
                  </div>
                  <div className="action-btn-subtip">
                    * 复制后打开【{platformName}】或浏览器访问；或者保存二维码在【{platformName}】扫一扫中打开
                  </div>
                </div>

                {/* 步骤 2：完成互动动作 */}
                <div className="task-step-card">
                  <div className="step-header">
                    <span className="step-number-badge">2</span>
                    <span className="step-title">第二步：完成以下互动操作</span>
                  </div>

                  <div className="step-requirements-wrap">
                    <div className="requirement-check-list">
                      <span className={`requirement-check-item ${actions.includes('like') ? 'active' : ''}`}>
                        {actions.includes('like') ? <><LikeOutlined style={{ marginRight: 2 }} />已要求点赞</> : <span style={{ opacity: 0.5 }}>点赞 (未要求)</span>}
                      </span>
                      <span className={`requirement-check-item ${actions.includes('collect') ? 'active' : ''}`}>
                        {actions.includes('collect') ? <><StarOutlined style={{ marginRight: 2 }} />已要求收藏</> : <span style={{ opacity: 0.5 }}>收藏 (未要求)</span>}
                      </span>
                      <span className={`requirement-check-item ${actions.includes('comment') ? 'active' : ''}`}>
                        {actions.includes('comment') ? <><MessageOutlined style={{ marginRight: 2 }} />已要求评论</> : <span style={{ opacity: 0.5 }}>评论 (未要求)</span>}
                      </span>
                    </div>

                    {actions.includes('comment') && commentKeyword && (
                      <div className="keyword-highlight-box">
                        <div className="keyword-text-area">
                          <span>评论必须包含以下词：</span>
                          <strong>「 {commentKeyword} 」</strong>
                        </div>
                        <span className="keyword-copy-link" onClick={handleCopyKeyword}>
                          {isCopiedKeyword ? <><CheckOutlined /> 已复制</> : '复制评论词'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 步骤 3：上传凭证 */}
                <div className="task-step-card">
                  <div className="step-header">
                    <span className="step-number-badge">3</span>
                    <span className="step-title">第三步：上传截图凭证</span>
                  </div>

                  <div className="screenshot-upload-container">
                    <div className="screenshot-mock-box" onClick={handleToggleUpload}>
                      {uploadedScreenshot ? (
                        <img src={uploadedScreenshot} alt="用户上传的截图" />
                      ) : (
                        <>
                          <PictureOutlined style={{ fontSize: 18 }} />
                          <span style={{ fontSize: 9, marginTop: 4 }}>上传截图</span>
                        </>
                      )}
                    </div>
                    <div className="screenshot-upload-tip">
                      <span className="screenshot-upload-tip-text">
                        请上传你在【{platformName}】完成 {actions.map(a => ({ like: '点赞', collect: '收藏', comment: '评论' }[a] || a)).join('、')} 的详情页截图，需露出当前账号信息。
                      </span>
                      <span className="view-example-trigger" onClick={() => setShowExampleModal(true)}>
                        查看截图标准 ＞
                      </span>
                    </div>
                  </div>
                </div>

              </div> {/* 关闭 task-steps-container */}

              </div> {/* 关闭 task-scroll-body */}

              {/* 底部浮动提交栏 */}
              <div className="task-bottom-action-bar">
                <button type="button" className="task-submit-btn-full" onClick={handleSubmitTask}>
                  提交凭证
                </button>
              </div>

              {/* 示例图 Modal 弹窗 */}
              {showExampleModal && (
                <div className="example-modal-overlay">
                  <div className="example-modal-content">
                    <span className="example-modal-close" onClick={() => setShowExampleModal(false)}>×</span>
                    <div className="example-modal-title">截图审核标准示例</div>
                    <img 
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80" 
                      alt="示例截图" 
                      className="example-modal-img" 
                    />
                    <div className="example-modal-tip">
                      提示：上传的截图需包含清晰的帖子文案、亮起的点赞/收藏标志，以及您发表的含有「{commentKeyword}」的评论。
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </Col>

        {/* 右侧：后台配置属性面板 */}
        <Col xs={24} lg={15} xl={16}>
          <div className="editor-properties-panel">
            {/* 顶栏控制组 */}
            <div className="panel-header-section">
              <span className="title">互动任务属性配置</span>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={resetTaskSettings}
                style={{ color: '#8c8c8c' }}
              >
                重置默认配置
              </Button>
            </div>

            {/* 配置表单 */}
            <div className="task-properties-form">
              
              {/* 一、基础信息设置 */}
              <div className="prop-group-card">
                <h3 className="group-title">一、任务基础设置</h3>
                
                <div className="prop-row">
                  <div className="prop-label">
                    <span>目标社媒平台</span>
                    <Tooltip title="用户需要前往的社交媒体应用。前台会相应地改变文案与标识色。">
                      <QuestionCircleOutlined className="label-help-icon" />
                    </Tooltip>
                  </div>
                  <div className="prop-control">
                    <Radio.Group
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      optionType="button"
                      buttonStyle="solid"
                    >
                      <Radio.Button value="xhs">小红书</Radio.Button>
                      <Radio.Button value="dy">抖音</Radio.Button>
                      <Radio.Button value="weibo">微博</Radio.Button>
                      <Radio.Button value="wx">微信视频号</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>

                <div className="prop-row">
                  <div className="prop-label">
                    <span>任务奖励积分</span>
                    <Tooltip title="审核通过后，C端用户将获得的会员积分额度。">
                      <QuestionCircleOutlined className="label-help-icon" />
                    </Tooltip>
                  </div>
                  <div className="prop-control">
                    <InputNumber
                      min={1}
                      max={10000}
                      value={rewardPoints}
                      onChange={(val) => val !== null && setRewardPoints(val)}
                      addonAfter="积分"
                      style={{ width: 140 }}
                    />
                  </div>
                </div>
              </div>

              {/* 二、头部海报设置 */}
              <div className="prop-group-card">
                <h3 className="group-title">二、头部海报设置</h3>
                
                <div className="prop-row">
                  <div className="prop-label">
                    <span>头部海报类型</span>
                    <Tooltip title="配置手机预览页面头部的海报样式，支持自定义设计大图或者经典的渐变色配标题。">
                      <QuestionCircleOutlined className="label-help-icon" />
                    </Tooltip>
                  </div>
                  <div className="prop-control">
                    <Radio.Group
                      value={bannerType}
                      onChange={(e) => setBannerType(e.target.value)}
                      optionType="button"
                      buttonStyle="solid"
                    >
                      <Radio.Button value="image">图片海报 (推荐)</Radio.Button>
                      <Radio.Button value="gradient">渐变文字海报</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>

                {bannerType === 'image' ? (
                  <div className="prop-row">
                    <div className="prop-label">
                      <span>活动介绍海报图</span>
                      <Tooltip title="用户端小程序顶部的大型活动介绍海报。建议上传宽度: 100% 占比、高度适中的精美设计图（支持 PNG/JPG）。">
                        <QuestionCircleOutlined className="label-help-icon" />
                      </Tooltip>
                    </div>
                    <div className="prop-control">
                      <div className="media-uploader-box">
                        <img src={bannerImage} alt="海报预览" className="media-uploader-preview" style={{ height: 60, objectFit: 'cover' }} />
                        <div className="media-uploader-actions">
                          <div className="btn-row">
                            <Upload maxCount={1} showUploadList={false}>
                              <Button size="small" icon={<UploadOutlined />}>上传新海报</Button>
                            </Upload>
                            <Button 
                              size="small" 
                              type="text" 
                              danger 
                              onClick={() => setBannerImage('/task_banner_default.png')}
                            >
                              恢复默认海报
                            </Button>
                          </div>
                          <span className="format-desc">支持 PNG/JPG，宽屏铺满，避免文字被折叠</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="prop-row">
                      <div className="prop-label">
                        <span>海报主标题</span>
                      </div>
                      <div className="prop-control">
                        <Input
                          value={bannerTitle}
                          onChange={(e) => setBannerTitle(e.target.value)}
                          placeholder="请输入海报主标题"
                          style={{ maxWidth: 300 }}
                        />
                      </div>
                    </div>
                    <div className="prop-row">
                      <div className="prop-label">
                        <span>海报副标题</span>
                      </div>
                      <div className="prop-control">
                        <Input
                          value={bannerSubtitle}
                          onChange={(e) => setBannerSubtitle(e.target.value)}
                          placeholder="请输入海报副标题描述"
                          style={{ maxWidth: 300 }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 三、要求互动动作 */}
              <div className="prop-group-card">
                <h3 className="group-title">三、要求互动动作</h3>
                
                <div className="prop-row">
                  <div className="prop-label">
                    <span>要求动作组合</span>
                    <Tooltip title="勾选C端用户必须在目标帖子下完成的操作动作。">
                      <QuestionCircleOutlined className="label-help-icon" />
                    </Tooltip>
                  </div>
                  <div className="prop-control">
                    <Checkbox.Group
                      options={[
                        { label: '点赞', value: 'like' },
                        { label: '收藏', value: 'collect' },
                        { label: '评论', value: 'comment' },
                      ]}
                      value={actions}
                      onChange={(checked) => setActions(checked as string[])}
                    />
                  </div>
                </div>

                {actions.includes('comment') && (
                  <div className="prop-row">
                    <div className="prop-label">
                      <span>评论关键词</span>
                      <Tooltip title="要求用户评论中必须包含的特定关键词（用于前台引导一键复制）。">
                        <QuestionCircleOutlined className="label-help-icon" />
                      </Tooltip>
                    </div>
                    <div className="prop-control">
                      <Input
                        value={commentKeyword}
                        onChange={(e) => setCommentKeyword(e.target.value)}
                        placeholder="例如：已种草，想试试"
                        style={{ maxWidth: 300 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 四、目标内容资源 */}
              <div className="prop-group-card">
                <h3 className="group-title">四、目标内容资产 (直接呈现给C端)</h3>
                
                <div className="prop-row">
                  <div className="prop-label">
                    <span>目标帖子链接 (Link)</span>
                    <Tooltip title="目标帖子的网络访问地址，用户可在C端一键复制。">
                      <QuestionCircleOutlined className="label-help-icon" />
                    </Tooltip>
                  </div>
                  <div className="prop-control">
                    <Input
                      value={postLink}
                      onChange={(e) => setPostLink(e.target.value)}
                      placeholder="请输入完整的网页链接"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="prop-row">
                  <div className="prop-label">
                    <span>目标帖子封面图 (内容展示图)</span>
                    <Tooltip title="帖子的封面/素材预览图。此图将直接陈列于C端步骤一中，作为“锁定目标”的第一直观指示，用户可在小红书等平台中通过此图快速比对锁定正确内容。">
                      <QuestionCircleOutlined className="label-help-icon" />
                    </Tooltip>
                  </div>
                  <div className="prop-control">
                    <div className="media-uploader-box">
                      <img src={coverImage} alt="封面" className="media-uploader-preview" />
                      <div className="media-uploader-actions">
                        <div className="btn-row">
                          <Upload maxCount={1} showUploadList={false}>
                            <Button size="small" icon={<UploadOutlined />}>上传新封面</Button>
                          </Upload>
                          <Button 
                            size="small" 
                            type="text" 
                            danger 
                            onClick={() => setCoverImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80')}
                          >
                            重置
                          </Button>
                        </div>
                        <span className="format-desc">支持 PNG/JPG，建议比例 3:4，直观呈现给C端用户</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prop-row">
                  <div className="prop-label">
                    <span>帖子二维码 (扫码直达渠道)</span>
                    <Tooltip title="生成或上传该文章/视频的二维码图片，供C端保存并在微信外平台中进行扫一扫直接进入。">
                      <QuestionCircleOutlined className="label-help-icon" />
                    </Tooltip>
                  </div>
                  <div className="prop-control">
                    <div className="media-uploader-box">
                      <img src={qrCodeImage} alt="二维码" className="media-uploader-preview" />
                      <div className="media-uploader-actions">
                        <div className="btn-row">
                          <Upload maxCount={1} showUploadList={false}>
                            <Button size="small" icon={<UploadOutlined />}>上传二维码</Button>
                          </Upload>
                          <Button 
                            size="small" 
                            type="text" 
                            danger 
                            onClick={() => setQrCodeImage('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.xiaohongshu.com')}
                          >
                            重置
                          </Button>
                        </div>
                        <span className="format-desc">可直接用目标App扫码打开，跨越微信壁垒</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 五、文案引导自定义 */}
              <div className="prop-group-card">
                <h3 className="group-title">五、C端用户操作提示与引导语</h3>
                
                <div className="prop-row">
                  <div className="prop-label">
                    <span>跨平台跳转辅助文案</span>
                    <Tooltip title="向C端用户解释为何需要复制链接或保存二维码的辅导文案。">
                      <QuestionCircleOutlined className="label-help-icon" />
                    </Tooltip>
                  </div>
                  <div className="prop-control">
                    <Input.TextArea
                      rows={3}
                      value={customGuideText}
                      onChange={(e) => setCustomGuideText(e.target.value)}
                      placeholder="由于平台规则限制，无法直接从微信跳转至小红书，请选择..."
                      maxLength={150}
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </Col>
      </Row>
    </div>
  )
}

export default function App() {
  const [railKey, setRailKey] = useState<PrimaryKey>('shop')
  const [secondaryKey, setSecondaryKey] = useState<string>(
    defaultSecondaryKey.shop,
  )

  const selectPrimary = useCallback((key: PrimaryKey) => {
    setRailKey(key)
    setSecondaryKey(defaultSecondaryKey[key])
  }, [])

  const menuItems = useMemo(
    () => placeholderMenus[railKey],
    [railKey],
  )

  const menuDefaultOpenKeys = useMemo(
    () => defaultOpenKeysByPrimary[railKey],
    [railKey],
  )

  // 决定当前使用何种色彩主题与面板内容
  const isMarketingToolsPage = railKey === 'shop' && secondaryKey === 'shop-mkt-tools-home'
  const isPointsMarketingPage = railKey === 'shop' && secondaryKey === 'shop-points-mkt'
  const isGoldenEggPage = railKey === 'shop' && secondaryKey === 'shop-golden-egg'
  const isPointsLotteryPage = railKey === 'shop' && (secondaryKey === 'shop-points-lottery' || secondaryKey === 'shop-lottery-center')
  const isPointsTaskPage = railKey === 'shop' && secondaryKey === 'shop-points-task'
  
  // 基础主题色
  const activeTheme = (isPointsMarketingPage || isPointsTaskPage) ? 'blue' : 'orange'
  const brandColor = activeTheme === 'blue' ? '#1890FF' : '#FF5E29'
  const brandSelectedBg = activeTheme === 'blue' ? '#E6F7FF' : '#FFF2EC'

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: brandColor,
          borderRadius: 4,
          colorBgLayout: '#f5f7fa',
        },
        components: {
          Menu: {
            itemSelectedBg: brandSelectedBg,
            itemSelectedColor: brandColor,
            itemHoverBg: '#f5f5f5',
          },
        },
      }}
    >
      <Layout className={`marketing-page theme-${activeTheme}`} hasSider>
        {/* 一级菜单窄栏 (Rail) */}
        <div className="icon-rail" aria-label="一级菜单">
          {primaryNavConfig.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`icon-rail-item${railKey === item.key ? ' active' : ''}`}
              onClick={() => selectPrimary(item.key)}
              title={item.label}
            >
              {item.icon}
              <span className="icon-rail-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* 二级菜单侧边栏 */}
        <Sider
          className="sub-sider"
          width={210}
          style={{
            background: '#fff',
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            top: 0,
            borderRight: '1px solid #ebedf0',
          }}
        >
          <Menu
            key={railKey}
            mode="inline"
            selectedKeys={[secondaryKey]}
            defaultOpenKeys={menuDefaultOpenKeys}
            style={{ borderInlineEnd: 0, paddingTop: 12 }}
            items={menuItems}
            onSelect={({ key }) => setSecondaryKey(key)}
          />
        </Sider>

        {/* 主内容区域 */}
        <Layout style={{ background: '#f5f7fa' }}>
          <Content>
            <div className="main-inner">
              
              {/* 顶部 Header 和 Banner */}
              <header className="main-header">
                {/* 护航服务 Banner 浮条 */}
                <div className="top-banner-bar">
                  <SafetyOutlined className="banner-icon" />
                  <span className="banner-text">
                    护航服务 <span className="banner-separator">|</span> 大促活动请提前报备，获取专人保障。
                  </span>
                  <a href="#" className="banner-link">
                    去申请 <RightOutlined style={{ fontSize: 9 }} />
                  </a>
                </div>
              </header>

              {/* 面包屑 / 页面定位指示 */}
              {railKey === 'shop' ? (
                <div className="breadcrumb-path">
                  <span>小店</span>
                  <span className="path-split">·</span>
                  <span>{getParentMenuLabel(menuItems, secondaryKey) || '概览'}</span>
                  <span className="path-split">·</span>
                  <strong className="path-current">
                    {getItemLabel(menuItems, secondaryKey) || '概览'}
                  </strong>
                </div>
              ) : null}

              {/* 主干内容根据选中的页面动态切换 */}
              {isMarketingToolsPage ? (
                <div className="tools-container">
                  <ToolSection title="经典营销" items={orangeClassicTools} theme="orange" />
                  <ToolSection title="降本工具" items={orangeSourcingTools} theme="orange" />
                  <ToolSection title="其它工具" items={orangeOtherTools} theme="orange" />
                </div>
              ) : isPointsMarketingPage ? (
                <div className="tools-container">
                  <ToolSection title="互动营销" items={blueInteractiveTools} theme="blue" />
                  <ToolSection title="有礼营销" items={blueGiftTools} theme="blue" />
                  <ToolSection title="客群维护" items={blueMaintenanceTools} theme="blue" />
                </div>
              ) : isGoldenEggPage ? (
                <SmashGoldenEgg />
              ) : isPointsLotteryPage ? (
                <LotteryEditor />
              ) : isPointsTaskPage ? (
                <TaskEditor />
              ) : (
                <div style={{ marginTop: 60 }}>
                  <Empty
                    description={
                      <span>
                        当前子功能正在还原中，请点击左侧菜单:
                        <br />
                        1. <strong>营销工具 -&gt; 营销工具</strong> (经典营销面)
                        <br />
                        2. <strong>客群运营 -&gt; 积分营销</strong> (积分营销面)
                        <br />
                        3. <strong>营销工具 -&gt; 砸金蛋</strong> (砸金蛋 Demo)
                        <br />
                        4. <strong>客群运营 -&gt; 积分抽奖</strong> (大抽奖页面装修)
                        <br />
                        5. <strong>客群运营 -&gt; 积分任务</strong> (互动任务页面优化)
                      </span>
                    }
                  />
                </div>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
