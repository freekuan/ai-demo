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
  RobotOutlined,
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import SmashGoldenEgg from './pages/SmashGoldenEgg'
import InviteReward from './pages/InviteReward'
import NavigationEditor from './pages/NavigationEditor'
import DecorationTemplateManager from './pages/DecorationTemplateManager'
import PointsGoodsLimit from './pages/PointsGoodsLimit'
import LotteryRulesIntervention from './pages/LotteryRulesIntervention'
import AppsMarket from './pages/AppsMarket'
import GroupBuyPage from './pages/GroupBuyPage'
import OrderConversion from './pages/OrderConversion'
import BossAdminTaobaoSync from './pages/BossAdminTaobaoSync'
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
      { key: 'shop-points-lottery-rules', label: '抽奖概率干预' },
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
      { key: 'shop-order-conversion', label: '订单转积分' },
    ],
  },
  {
    key: 'shop-product-group',
    label: '商品管理',
    children: [
      { key: 'shop-product-list', label: '商品列表' },
      { key: 'shop-product-category', label: '商品分类' },
      { key: 'shop-product-shelf', label: '商品上架' },
      { key: 'shop-virtual-product-prototype', label: <a href="/saas_prototype_v2.html" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>虚拟商品原型(卡密)</a> },
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
      { key: 'shop-invite-reward', label: '邀请有礼' },
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
    children: [
      { key: 'shop-navigation', label: '店铺导航' },
      { key: 'shop-template-manager', label: '装修模板管理' },
    ],
  },
]

export const shopMenuDefaultOpenKeys = [
  'shop-points',
  'shop-order-group',
  'shop-product-group',
  'shop-mkt-tools',
  'shop-other-store',
  'shop-member-group',
  'shop-decoration',
]

const placeholderMenus: Record<PrimaryKey, MenuProps['items']> = {
  home: [
    { key: 'dash-home-overview', label: '数据概览' },
    { key: 'dash-home-shortcut', label: '快捷入口' },
    { key: 'dash-home-excellent-tag', label: <a href="/excellent_tag_prototype.html" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>优秀标签原型</a> },
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
function ToolCard({ item, theme, onClick }: { item: ToolItem; theme: 'orange' | 'blue'; onClick?: () => void }) {
  return (
    <div className={`tool-card card-${theme}`} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
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
  onToolClick,
}: {
  title: string
  items: ToolItem[]
  theme: 'orange' | 'blue'
  onToolClick?: (key: string) => void
}) {
  return (
    <section className="tool-section">
      <h2 className="tool-section-title">{title}</h2>
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col key={item.key} xs={24} sm={12} lg={8}>
            <ToolCard item={item} theme={theme} onClick={() => onToolClick && onToolClick(item.key)} />
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

// Helper to read uploaded files as Base64 for instant preview
const handleLocalImageUpload = (file: any, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      callback(e.target.result as string);
    }
  };
  reader.readAsDataURL(file);
  return false; // Prevent automatic upload by antd
};

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

  // 6. 奖品格子样式设置
  const [customPrizeStyle, setCustomPrizeStyle] = useState<boolean>(false)
  const [prizeBgType, setPrizeBgType] = useState<'color' | 'image'>('color')
  const [prizeBgColor, setPrizeBgColor] = useState<string>('#FFFFFF')
  const [prizeBgImage, setPrizeBgImage] = useState<string>('')
  const [prizeTextColor, setPrizeTextColor] = useState<string>('#333333')

  // 7. 展示选项
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
    // 重置奖品格子属性
    setCustomPrizeStyle(false)
    setPrizeBgType('color')
    setPrizeBgColor('#FFFFFF')
    setPrizeBgImage('')
    setPrizeTextColor('#333333')
  }

  // 模拟的 9 个格子奖品数据
  const mockPrizes = [
    { id: 1, name: '1 积分', icon: <DatabaseOutlined style={{ fontSize: '18px' }} /> },
    { id: 2, name: '1积分', icon: <DatabaseOutlined style={{ fontSize: '18px' }} /> },
    { id: 3, name: '1 积分', icon: <DatabaseOutlined style={{ fontSize: '18px' }} /> },
    { id: 4, name: '谢谢参与', icon: <SmileOutlined style={{ fontSize: '18px' }} /> },
    { id: 5, action: true, name: '立即抽奖' }, // 中间按钮
    { id: 6, name: '谢谢参与', icon: <SmileOutlined style={{ fontSize: '18px' }} /> },
    { id: 7, name: '谢谢参与', icon: <SmileOutlined style={{ fontSize: '18px' }} /> },
    { id: 8, name: '谢谢参与', icon: <SmileOutlined style={{ fontSize: '18px' }} /> },
    { id: 9, name: '谢谢参与', icon: <SmileOutlined style={{ fontSize: '18px' }} /> },
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
                          <div
                            key={idx}
                            className="grid-prize-cell"
                            style={{
                              backgroundColor: customPrizeStyle
                                ? (prizeBgType === 'color' ? prizeBgColor : 'transparent')
                                : '#FFFFFF',
                              backgroundImage: customPrizeStyle && prizeBgType === 'image' && prizeBgImage
                                ? `url(${prizeBgImage})`
                                : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              color: customPrizeStyle ? prizeTextColor : '#333333',
                            }}
                          >
                            {p.icon && (
                              <span className="prize-icon-wrap" style={{ color: customPrizeStyle ? prizeTextColor : '#333333' }}>
                                {p.icon}
                              </span>
                            )}
                            <span className="prize-name" style={{ color: customPrizeStyle ? prizeTextColor : '#333333' }}>{p.name}</span>
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
                        <Upload
                          maxCount={1}
                          showUploadList={false}
                          beforeUpload={(file) => handleLocalImageUpload(file, setBgImage)}
                        >
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
                      <Upload
                        maxCount={1}
                        showUploadList={false}
                        beforeUpload={(file) => handleLocalImageUpload(file, setCustomMachineImage)}
                      >
                        {customMachineImage ? (
                          <img src={customMachineImage} alt="外壳预览" className="uploader-preview-img" style={{ maxHeight: 80, width: 80, objectFit: 'contain', borderRadius: 4 }} />
                        ) : (
                          <div className="uploader-box-placeholder">
                            <PlusOutlined />
                            <div style={{ marginTop: 8, fontSize: 11 }}>上传透明图</div>
                          </div>
                        )}
                      </Upload>
                      <div className="uploader-actions" style={{ marginLeft: 12 }}>
                        {customMachineImage && (
                          <Button size="small" type="text" danger onClick={() => setCustomMachineImage('')}>
                            清除
                          </Button>
                        )}
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
                      {customPedestalImage && (
                        <img src={customPedestalImage} alt="底座预览" className="uploader-preview-img" style={{ maxHeight: 60, width: 60, objectFit: 'contain', marginRight: 12, borderRadius: 4 }} />
                      )}
                      <Upload
                        maxCount={1}
                        showUploadList={false}
                        beforeUpload={(file) => handleLocalImageUpload(file, setCustomPedestalImage)}
                      >
                        <Button size="small" icon={<UploadOutlined />}>上传专属底座图片</Button>
                      </Upload>
                      <div className="uploader-actions" style={{ marginLeft: 12 }}>
                        {customPedestalImage && (
                          <Button size="small" type="text" danger onClick={() => setCustomPedestalImage('')}>
                            清除
                          </Button>
                        )}
                      </div>
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

            {/* 五、奖品格子样式自定义 */}
            <div className="prop-group-card">
              <h3 className="group-title">五、奖品格子样式自定义</h3>

              <div className="prop-row">
                <div className="prop-label">
                  <span>自定义格子样式</span>
                  <Tooltip title="开启后可个性化配置格子背景色、背景图及文字颜色；未开启则保持原有默认样式外观。">
                    <QuestionCircleOutlined className="label-help-icon" />
                  </Tooltip>
                </div>
                <div className="prop-control">
                  <Switch checked={customPrizeStyle} onChange={setCustomPrizeStyle} />
                </div>
              </div>

              {customPrizeStyle && (
                <>
                  <div className="prop-row">
                    <div className="prop-label">
                      <span>奖品格子背景</span>
                      <Tooltip title="配置抽奖机内8个奖品格子的背景底色或背景图案（统一配置）。">
                        <QuestionCircleOutlined className="label-help-icon" />
                      </Tooltip>
                    </div>
                    <div className="prop-control upload-control-group">
                      <Radio.Group
                        value={prizeBgType}
                        onChange={(e) => setPrizeBgType(e.target.value)}
                        style={{ marginBottom: 12, display: 'block' }}
                      >
                        <Radio value="color">纯色底色</Radio>
                        <Radio value="image">图片背景</Radio>
                      </Radio.Group>

                      {prizeBgType === 'color' ? (
                        <div className="color-picker-group">
                          <ColorPicker value={prizeBgColor} onChange={(c) => setPrizeBgColor(c.toHexString())} showText />
                        </div>
                      ) : (
                        <div className="image-uploader-block">
                          {prizeBgImage ? (
                            <img src={prizeBgImage} alt="格子背景预览" className="uploader-preview-img" style={{ maxHeight: 60, width: 60, objectFit: 'cover', borderRadius: 4 }} />
                          ) : (
                            <div className="uploader-box-placeholder" style={{ width: 60, height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed #d9d9d9', borderRadius: 4 }}>
                              <PictureOutlined style={{ fontSize: 16, color: '#bfbfbf' }} />
                              <span style={{ fontSize: 9, color: '#8c8c8c', marginTop: 4 }}>无图片</span>
                            </div>
                          )}
                          <div className="uploader-actions">
                            <Upload
                              maxCount={1}
                              showUploadList={false}
                              beforeUpload={(file) => handleLocalImageUpload(file, setPrizeBgImage)}
                            >
                              <Button size="small" icon={<UploadOutlined />}>上传背景图</Button>
                            </Upload>
                            <Button
                              size="small"
                              type="text"
                              danger
                              onClick={() => setPrizeBgImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80')}
                            >
                              预设图
                            </Button>
                            {prizeBgImage && (
                              <Button
                                size="small"
                                type="text"
                                danger
                                onClick={() => setPrizeBgImage('')}
                              >
                                清除
                              </Button>
                            )}
                            <span className="file-format-spec">支持 PNG / JPG，推荐 1:1 比例的正方形透明/浅色背景图</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="prop-row">
                    <div className="prop-label">
                      <span>奖品文字颜色</span>
                      <Tooltip title="配置格子内奖品名称的字体颜色，建议根据格子底色调整，以保持良好的对比度和易读性。">
                        <QuestionCircleOutlined className="label-help-icon" />
                      </Tooltip>
                    </div>
                    <div className="prop-control color-picker-group">
                      <ColorPicker value={prizeTextColor} onChange={(c) => setPrizeTextColor(c.toHexString())} showText />
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </Col>
      </Row>
    </div>
  )
}

// ==========================================
// 【新组件】KocHub：玩转KOC种草主控制台页面
// ==========================================
interface KocHubProps {
  setActiveSubTab: (tab: 'hub' | 'follow' | 'interactive' | 'audit') => void
  followEnabled: boolean
  aiFollowEnabled: boolean
  aiInteractiveEnabled: boolean
  openAiAuditModal: () => void
}

function KocHub({ setActiveSubTab, followEnabled, aiFollowEnabled, aiInteractiveEnabled, openAiAuditModal }: KocHubProps) {
  const [guideModal, setGuideModal] = useState<string | null>(null)

  return (
    <div className="koc-hub-wrapper">
      {/* 顶部高级感大 banner */}
      <div className="koc-hub-banner">
        <div className="koc-hub-banner-content" style={{ textAlign: 'left' }}>
          <div className="koc-badge-pill">KOC 全域增长流量中心</div>
          <h1 className="koc-hub-title">社交矩阵流量主航道 · 撬动品牌自然增长</h1>
          <p className="koc-hub-subtitle" style={{ marginBottom: 12 }}>
            打通「小红书/抖音/视频号/微博」全域社媒，通过低成本的任务驱动，实现私域快速爆发、爆款内容破圈、及高 ROI 转化闭环。
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button 
              type="primary" 
              icon={<RobotOutlined />} 
              style={{ background: '#52c41a', borderColor: '#52c41a', borderRadius: 4, height: 32, fontSize: 12, fontWeight: 500 }} 
              onClick={openAiAuditModal}
            >
              🤖 配置 AI 自动审核 (限时免费)
            </Button>
          </div>
        </div>
        <div className="koc-hub-banner-graphics">
          <div className="graphics-circle circle-1"></div>
          <div className="graphics-circle circle-2"></div>
          <div className="graphics-card">
            <div className="graphics-card-header">
              <span className="dot text-red">●</span>
              <span className="dot text-yellow">●</span>
              <span className="dot text-green">●</span>
            </div>
            <div className="graphics-card-body" style={{ textAlign: 'left' }}>
              <div className="graphics-line" style={{ color: '#1890ff', background: '#e6f7ff' }}>🔍 搜索官方号...</div>
              <div className="graphics-line" style={{ color: '#52c41a', background: '#f6ffed' }}>👍 点赞并收藏</div>
              <div className="graphics-line" style={{ color: '#722ed1', background: '#f9f0ff' }}>💬 种草词复制</div>
            </div>
          </div>
        </div>
      </div>

      {/* 数据看板 */}
      <div className="koc-hub-stats-row">
        <div className="koc-hub-stat-card">
          <div className="stat-icon-wrap bg-blue-light">
            <TeamOutlined className="stat-icon text-blue" />
          </div>
          <div className="stat-info" style={{ textAlign: 'left' }}>
            <span className="stat-label">累计私域蓄水粉丝</span>
            <div className="stat-value-group">
              <span className="stat-value">42.8 K</span>
              <span className="stat-trend trend-up">较昨日 +1,250</span>
            </div>
          </div>
        </div>
        <div className="koc-hub-stat-card">
          <div className="stat-icon-wrap bg-purple-light">
            <ShareAltOutlined className="stat-icon text-purple" />
          </div>
          <div className="stat-info" style={{ textAlign: 'left' }}>
            <span className="stat-label">平均 KOC 裂变系数</span>
            <div className="stat-value-group">
              <span className="stat-value">3.62x</span>
              <span className="stat-trend trend-up">高于同行 85%</span>
            </div>
          </div>
        </div>
        <div className="koc-hub-stat-card">
          <div className="stat-icon-wrap bg-orange-light">
            <TrophyOutlined className="stat-icon text-orange" />
          </div>
          <div className="stat-info" style={{ textAlign: 'left' }}>
            <span className="stat-label">互动触达转化率</span>
            <div className="stat-value-group">
              <span className="stat-value">24.8%</span>
              <span className="stat-trend trend-up">ROI 提升 38.5%</span>
            </div>
          </div>
        </div>
        <div className="koc-hub-stat-card">
          <div className="stat-icon-wrap bg-green-light">
            <DollarOutlined className="stat-icon text-green" />
          </div>
          <div className="stat-info" style={{ textAlign: 'left' }}>
            <span className="stat-label">获客成本 (CAC)</span>
            <div className="stat-value-group">
              <span className="stat-value">¥1.80</span>
              <span className="stat-trend trend-down">成本降低 65%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 核心增长环流图 */}
      <div className="koc-hub-flow-section" style={{ textAlign: 'left' }}>
        <h3 className="section-title">KOC 全链路社交引流增长闭环</h3>
        <div className="koc-hub-pipeline">
          <div className="pipeline-step">
            <div className="pipeline-number">01</div>
            <div className="pipeline-content">
              <h4>全域引流</h4>
              <p>小红书/抖音/视频号/微博</p>
            </div>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <div className="pipeline-number">02</div>
            <div className="pipeline-content">
              <h4>任务激励</h4>
              <p>加粉/互动任务，积分激发</p>
            </div>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <div className="pipeline-number">03</div>
            <div className="pipeline-content">
              <h4>私域沉淀</h4>
              <p>关注官号、精细运营</p>
            </div>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <div className="pipeline-number">04</div>
            <div className="pipeline-content">
              <h4>口碑复购</h4>
              <p>UGC裂变，实现爆款成交</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4个核心产品子功能入口 */}
      <div className="koc-hub-grid">
        {/* 卡片1: 账号加粉 */}
        <div className="koc-hub-card" style={{ textAlign: 'left' }}>
          <div className={`koc-card-badge ${followEnabled ? 'enabled' : 'coming-soon'}`}>
            <span className="badge-dot">●</span> {followEnabled ? '运行中' : '已停用'}
          </div>
          <h3 className="koc-card-title">账号加粉</h3>
          <p className="koc-card-desc">
            <strong>全域账号裂变蓄水池 · 沉淀品牌私域核心资产</strong><br />
            通过引导C端用户批量关注品牌官方账号矩阵并提交凭证，快速沉淀全网公域流量至私域蓄水池，为品牌二次触达与精准转化沉淀粉丝。
          </p>
          <div className="koc-card-footer" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="koc-card-stat">已配置账号：2 个</span>
              {followEnabled && (
                <div 
                  className={`ai-audit-status-pill ${aiFollowEnabled ? 'active' : 'disabled'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); openAiAuditModal(); }}
                >
                  {aiFollowEnabled ? '🤖 AI自动过审已开启' : '🤖 AI自动过审已禁用'}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" size="small" onClick={() => setActiveSubTab('follow')}>
                去配置
              </Button>
            </div>
          </div>
        </div>

        {/* 卡片2: 内容互动 */}
        <div className="koc-hub-card" style={{ textAlign: 'left' }}>
          <div className="koc-card-badge enabled">
            <span className="badge-dot">●</span> 运行中
          </div>
          <h3 className="koc-card-title">内容互动</h3>
          <p className="koc-card-desc">
            <strong>智能帖子热度催化器 · 撬动社交平台算法推荐</strong><br />
            通过点赞、收藏、评论等指定交互动作的引导与积分机制，激发真实社交裂变，引爆平台热门算法，实现品牌内容大范围出圈。
          </p>
          <div className="koc-card-footer" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="koc-card-stat">进行中任务：1 个</span>
              <div 
                className={`ai-audit-status-pill ${aiInteractiveEnabled ? 'active' : 'disabled'}`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); openAiAuditModal(); }}
              >
                {aiInteractiveEnabled ? '🤖 AI自动过审已开启' : '🤖 AI自动过审已禁用'}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" size="small" onClick={() => setActiveSubTab('interactive')}>
                去配置
              </Button>
            </div>
          </div>
        </div>

        {/* 卡片3: 内容种草 */}
        <div className="koc-hub-card" style={{ textAlign: 'left' }}>
          <div className="koc-card-badge coming-soon">规划中</div>
          <h3 className="koc-card-title">内容种草</h3>
          <p className="koc-card-desc">
            <strong>UGC聚沙成塔裂变系统 · 真实口碑引爆全网声量</strong><br />
            鼓励用户在社区制作和分享内容，让真实的用户反馈产生真实粘性，UGC聚沙成塔引流品牌店铺。
          </p>
          <div className="koc-card-footer">
            <span className="koc-card-stat">推荐大促/拉新期使用</span>
            <Button size="small" onClick={() => setGuideModal('seed')}>
              搭建指南
            </Button>
          </div>
        </div>

        {/* 卡片4: 效果种草 */}
        <div className="koc-hub-card" style={{ textAlign: 'left' }}>
          <div className="koc-card-badge coming-soon">规划中</div>
          <h3 className="koc-card-title">效果种草</h3>
          <p className="koc-card-desc">
            <strong>全链路追踪转化引擎 · KOC效果衡量与销量闭环</strong><br />
            追踪并记录用户从种草到互动的全链路，通过行为和数据激活，通过数据精准赋能KOC表现，实现品效合一。
          </p>
          <div className="koc-card-footer">
            <span className="koc-card-stat">支持全链路销量闭环追踪</span>
            <Button size="small" onClick={() => setGuideModal('effect')}>
              搭建指南
            </Button>
          </div>
        </div>
      </div>

      {/* 为什么选择内容营销 */}
      <div className="koc-hub-why-section" style={{ textAlign: 'left' }}>
        <h3 className="section-title">为什么选择内容营销</h3>
        <div className="koc-hub-why-grid">
          <div className="why-card">
            <h4>精准触达</h4>
            <p>社交媒体平台海量人群精准画像，针对目标客群定向派发任务，确保存量与新增粉丝均为高价值用户。</p>
          </div>
          <div className="why-card">
            <h4>内容联动</h4>
            <p>账号关注与内容互动深度绑定，双管齐下提升社交矩阵热度，与品牌积分、卡券福利深度整合，实现完美留存闭环。</p>
          </div>
          <div className="why-card">
            <h4>信任背书</h4>
            <p>真实的普通人（KOC）完成点赞、发出真实好评，让新客进店无交易顾虑，构筑品牌口碑护城河。</p>
          </div>
          <div className="why-card">
            <h4>低廉成本</h4>
            <p>以极少的积分或积分奖品为杠杆，依靠用户社交裂变获客，获客成本（CAC）仅为传统硬广投放的 1/5。</p>
          </div>
          <div className="why-card">
            <h4>私域筑底</h4>
            <p>关注品牌官方号的用户，将沉淀为品牌可终身免费、多次触达、长效精细化运营的核心数字资产。</p>
          </div>
        </div>
      </div>

      {/* 搭建指南 Modal */}
      {guideModal && (
        <div className="example-modal-overlay">
          <div className="example-modal-content" style={{ width: '380px', padding: '24px' }}>
            <span className="example-modal-close" onClick={() => setGuideModal(null)}>×</span>
            <div className="example-modal-title" style={{ fontSize: '15px' }}>
              {guideModal === 'seed' ? '🍀 内容种草功能搭建指南' : '📈 效果种草功能搭建指南'}
            </div>
            <div className="guide-modal-body" style={{ textAlign: 'left', fontSize: '12px', color: '#595959', lineHeight: '1.6' }}>
              {guideModal === 'seed' ? (
                <>
                  <p><strong>第一步：定义种草任务规则</strong><br />在后台设置小红书发帖或抖音发视频任务，规定必须携带的品牌话题（如 #某某好物）及字数限制。</p>
                  <p style={{ marginTop: '12px' }}><strong>第二步：配置 KOC 奖励机制</strong><br />提供丰厚的奖品（如新品试用装、高额会员积分、无门槛卡券），吸引用户在小红书发表真实体验反馈。</p>
                  <p style={{ marginTop: '12px' }}><strong>第三步：C端发帖并提交链接</strong><br />用户完成发帖后，复制帖子链接并在小程序中提交。商家在后台审核后发放奖励，沉淀UGC内容资产。</p>
                </>
              ) : (
                <>
                  <p><strong>第一步：绑定销售商品或渠道</strong><br />为 KOC 生成专属的带货推广链接、二维码或抖音团购券，追踪用户通过该 KOC 产生的购买路径。</p>
                  <p style={{ marginTop: '12px' }}><strong>第二步：实时追踪转化漏斗</strong><br />统计系统会自动生成报表：包含展示量、点击量、加购量以及最终成交订单（GMV），评估不同渠道 KOC 的带货能力。</p>
                  <p style={{ marginTop: '12px' }}><strong>第三步：CPS佣金与效果结算</strong><br />根据 KOC 实际带来的订单量，自动折算为佣金、积分或现金返现，实现品效合一，实现销量爆发。</p>
                </>
              )}
            </div>
            <Button type="primary" onClick={() => setGuideModal(null)} style={{ marginTop: '20px', width: '100%' }}>
              知道了
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 【新组件】KocFollowEditor：账号加粉编辑器与模拟器
// ==========================================
interface KocFollowEditorProps {
  brandAccounts: any[]
  setBrandAccounts: React.Dispatch<React.SetStateAction<any[]>>
  taskAccounts: any[]
  setTaskAccounts: React.Dispatch<React.SetStateAction<any[]>>
  followPoints: number
  setFollowPoints: React.Dispatch<React.SetStateAction<number>>
  followRules: string
  setFollowRules: React.Dispatch<React.SetStateAction<string>>
  followAllowReSubmit: boolean
  setFollowAllowReSubmit: React.Dispatch<React.SetStateAction<boolean>>
  followEnabled: boolean
  setFollowEnabled: React.Dispatch<React.SetStateAction<boolean>>
  setActiveSubTab: (tab: 'hub' | 'follow' | 'interactive' | 'audit') => void
  aiFollowEnabled: boolean
  openAiAuditModal: () => void
}

function KocFollowEditor({
  brandAccounts,
  setBrandAccounts,
  taskAccounts,
  setTaskAccounts,
  followPoints,
  setFollowPoints,
  followRules,
  setFollowRules,
  followAllowReSubmit,
  setFollowAllowReSubmit,
  followEnabled,
  setFollowEnabled,
  setActiveSubTab,
  aiFollowEnabled,
  openAiAuditModal
}: KocFollowEditorProps) {
  const followBannerImage = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80'
  const followBannerType = 'image'
  const followBannerTitle = '官方账号加粉任务'
  const followBannerSubtitle = '关注指定官方账号并提交关注凭证，即可获得积分奖励！'
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false)

  // Local config inputs
  const [tempEnabled, setTempEnabled] = useState<boolean>(followEnabled)
  const [tempPoints, setTempPoints] = useState<number>(followPoints)
  const [tempRules, setTempRules] = useState<string>(followRules)
  const [tempAllowReSubmit, setTempAllowReSubmit] = useState<boolean>(followAllowReSubmit)
  const [tempTaskAccounts, setTempTaskAccounts] = useState<any[]>(taskAccounts)

  // Modal local state
  const [modalBrandAccounts, setModalBrandAccounts] = useState<any[]>(brandAccounts)

  // Simulator interactions
  const [simulatorUploadedScreenshots, setSimulatorUploadedScreenshots] = useState<Record<string, string>>({})
  const [isCopiedAccounts, setIsCopiedAccounts] = useState<Record<string, boolean>>({})
  const [simulatorExampleImage, setSimulatorExampleImage] = useState<string | null>(null)

  const enterEditMode = () => {
    setTempEnabled(followEnabled)
    setTempPoints(followPoints)
    setTempRules(followRules)
    setTempAllowReSubmit(followAllowReSubmit)
    setTempTaskAccounts([...taskAccounts])
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const saveEdit = () => {
    if (tempTaskAccounts.length === 0) {
      message.warning('请至少配置一个关注官方账号！')
      return
    }
    setFollowEnabled(tempEnabled)
    setFollowPoints(tempPoints)
    setFollowRules(tempRules)
    setFollowAllowReSubmit(tempAllowReSubmit)
    setTaskAccounts(tempTaskAccounts)
    setIsEditing(false)
    message.success('规则配置保存成功！')
  }

  const openAccountModal = () => {
    setModalBrandAccounts(brandAccounts.map(a => ({ ...a })))
    setShowAccountModal(true)
  }

  const saveAccountModal = () => {
    const invalid = modalBrandAccounts.some(a => !a.accountNo.trim() || !a.name.trim())
    if (invalid) {
      message.warning('请填写完整的账号与名称！')
      return
    }
    setBrandAccounts(modalBrandAccounts)
    setShowAccountModal(false)
    message.success('品牌账户列表更新成功！')
  }

  const handleCopyAccount = (id: string, num: string) => {
    try {
      navigator.clipboard.writeText(num)
    } catch (e) {}
    setIsCopiedAccounts(prev => ({ ...prev, [id]: true }))
    message.success(`已复制账号“${num}”到剪贴板，请前往平台搜索关注！`)
    setTimeout(() => {
      setIsCopiedAccounts(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }

  const handleToggleSimulatorUpload = (id: string) => {
    if (simulatorUploadedScreenshots[id]) {
      setSimulatorUploadedScreenshots(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      message.info('已移除关注截图凭证')
    } else {
      const targetAcc = brandAccounts.find(a => a.id === id)
      const mockImg = targetAcc?.exampleImage || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80'
      setSimulatorUploadedScreenshots(prev => ({ ...prev, [id]: mockImg }))
      message.success('关注截图凭证上传成功（已模拟填入关注成功图）')
    }
  }

  const handleSubmitSimulatorTask = () => {
    const activeAccountsCount = isEditing ? tempTaskAccounts.length : taskAccounts.length
    const uploadedCount = Object.keys(simulatorUploadedScreenshots).length
    if (uploadedCount < activeAccountsCount) {
      message.warning('请先完成所有账号的关注截图上传后再提交！')
    } else {
      message.success('您的关注凭证已成功提交！预计24小时内审核完毕发放积分奖励')
    }
  }

  const handleShowExample = (img: string) => {
    setSimulatorExampleImage(img)
  }

  const getAccountInfo = (id: string) => {
    return brandAccounts.find(a => a.id === id) || {
      name: '未知账号',
      accountNo: '',
      platform: 'xhs',
      exampleImage: '',
      logoImage: ''
    }
  }

  return (
    <div className="lottery-editor-wrapper">
      {/* 选项卡头部 */}
      <div className="editor-tab-header">
        <Tabs
          activeKey="task-page"
          items={[
            { key: 'task-page', label: 'C端关注页面预览' },
            { key: 'audit-panel', label: '商户审核列表', disabled: true },
          ]}
        />
      </div>

      <Row gutter={24} style={{ marginTop: 12 }}>
        {/* 左侧：手机预览模拟器 */}
        <Col xs={24} lg={9} xl={8} style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="mobile-phone-frame">
            <div className="phone-top-notch"></div>
            <div className="phone-status-bar" style={{ color: '#000' }}>
              <span className="time">9:41</span>
              <div className="icons">
                <span className="cellular">📶</span>
                <span className="wifi">🔋</span>
              </div>
            </div>

            <div className="phone-screen-content task-detail-preview">
              <div className="phone-page-header" style={{ color: '#333', background: '#fff', borderBottom: '1px solid #f0f0f0', textShadow: 'none' }}>
                <span className="back-arrow"><ArrowLeftOutlined style={{ fontSize: 13 }} /></span>
                <span className="activity-title" style={{ fontWeight: 600 }}>官方账号加粉任务</span>
                <span className="more-menu">•••</span>
              </div>

              <div className="task-scroll-body" style={{ paddingBottom: 60 }}>
                {/* 顶部海报 */}
                {followBannerType === 'image' ? (
                  <div className="task-preview-banner-img-wrap" style={{ height: 110 }}>
                    <img src={followBannerImage} alt="活动海报" className="task-preview-banner-img" />
                  </div>
                ) : (
                  <div className="task-preview-banner" style={{ padding: '16px 12px' }}>
                    <h2 className="banner-main-title">{followBannerTitle}</h2>
                    <p className="banner-sub-title">{followBannerSubtitle}</p>
                  </div>
                )}

                {/* 奖励积分卡片 */}
                <div className="task-reward-card" style={{ padding: '12px 14px', margin: '10px' }}>
                  <div className="reward-left">
                    <span className="reward-label">关注全部账号可获得</span>
                    <div className="reward-value">+{isEditing ? tempPoints : followPoints} <span>积分</span></div>
                  </div>
                  <div className="reward-badge" style={{ fontSize: 9 }}>截图审核通过后发放</div>
                </div>

                {/* 任务速览 */}
                <div className="task-step-card" style={{ margin: '0 10px 10px', padding: '10px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 11, fontWeight: 700, color: '#262626' }}>任务速览</h4>
                  <div className="follow-quick-tour" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: '#595959' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div className="tour-icon" style={{ background: '#e6f7ff', color: '#1890ff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontWeight: 600 }}>1</div>
                      <span>关注指定账号</span>
                    </div>
                    <div style={{ color: '#d9d9d9' }}>➔</div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div className="tour-icon" style={{ background: '#e6f7ff', color: '#1890ff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontWeight: 600 }}>2</div>
                      <span>上传关注截图</span>
                    </div>
                    <div style={{ color: '#d9d9d9' }}>➔</div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div className="tour-icon" style={{ background: '#e6f7ff', color: '#1890ff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontWeight: 600 }}>3</div>
                      <span>审核通过发奖</span>
                    </div>
                  </div>
                </div>

                {/* 关注账号清单 */}
                <div className="task-steps-container" style={{ padding: '0 10px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 11, fontWeight: 700, color: '#262626' }}>关注账号清单</h4>
                  
                  {(isEditing ? tempTaskAccounts : taskAccounts).map((item, idx) => {
                    const accInfo = getAccountInfo(item.accountId)
                    const isUploaded = !!simulatorUploadedScreenshots[item.accountId]
                    const isCopied = !!isCopiedAccounts[item.accountId]
                    const platformLabel = { xhs: '小红书', dy: '抖音', weibo: '微博', wx: '视频号' }[accInfo.platform as 'xhs' | 'dy' | 'weibo' | 'wx']
                    const platformColor = { xhs: '#ff2442', dy: '#000000', weibo: '#f5222d', wx: '#52c41a' }[accInfo.platform as 'xhs' | 'dy' | 'weibo' | 'wx']

                    return (
                      <div key={item.accountId || idx} className="follow-account-list-card" style={{ background: '#fff', borderRadius: 8, padding: 10, marginBottom: 8, border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div className="platform-tag-round" style={{ background: platformColor, color: '#fff', fontSize: 8, width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {platformLabel?.substring(0, 2)}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: '#262626', display: 'flex', gap: 4, alignItems: 'center' }}>
                                {accInfo.name}
                                <span className="copy-icon-btn" onClick={() => handleCopyAccount(accInfo.id, accInfo.accountNo)} style={{ fontSize: 10, cursor: 'pointer', color: '#8c8c8c' }}>
                                  {isCopied ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                                </span>
                              </div>
                              <div style={{ fontSize: 9, color: '#8c8c8c' }}>账号: {accInfo.accountNo}</div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <button 
                              type="button" 
                              className={`action-btn-pill-small ${isUploaded ? 'uploaded' : ''}`}
                              onClick={() => handleToggleSimulatorUpload(accInfo.id)}
                              style={{ 
                                fontSize: 9, 
                                padding: '2px 8px', 
                                borderRadius: 10, 
                                border: isUploaded ? '1px solid #52c41a' : '1px solid #1890ff', 
                                background: isUploaded ? '#f6ffed' : '#e6f7ff', 
                                color: isUploaded ? '#52c41a' : '#1890ff',
                                cursor: 'pointer',
                                fontWeight: 500
                              }}
                            >
                              {isUploaded ? '已传截图 ✓' : '上传截图'}
                            </button>
                            <span 
                              onClick={() => handleShowExample(accInfo.exampleImage)} 
                              style={{ fontSize: 8, color: '#ff4d4f', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              查看截图示例 ＞
                            </span>
                          </div>
                        </div>
                        
                        {/* 引导说明文案 */}
                        <div style={{ fontSize: 9, color: '#595959', background: '#fafafa', borderRadius: 4, padding: '4px 8px', marginTop: 6, borderLeft: '2px solid #d9d9d9', textAlign: 'left' }}>
                          指引: {item.guideText || '关注该官方账号'}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* 规则说明 */}
                <div className="task-step-card" style={{ margin: '10px', padding: '10px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: 11, fontWeight: 700, color: '#262626' }}>规则说明</h4>
                  <div style={{ fontSize: 9, color: '#8c8c8c', whiteSpace: 'pre-line', lineHeight: 1.4, textAlign: 'left' }}>
                    {isEditing ? tempRules : followRules}
                  </div>
                </div>

              </div>

              {/* 底部悬浮提交 */}
              <div className="task-bottom-action-bar">
                <button type="button" className="task-submit-btn-full blue-theme" onClick={handleSubmitSimulatorTask}>
                  提交凭证
                </button>
              </div>

              {/* 截图示例 Modal */}
              {simulatorExampleImage && (
                <div className="example-modal-overlay">
                  <div className="example-modal-content">
                    <span className="example-modal-close" onClick={() => setSimulatorExampleImage(null)}>×</span>
                    <div className="example-modal-title">截图标准参考图</div>
                    <img 
                      src={simulatorExampleImage} 
                      alt="关注截图示例" 
                      className="example-modal-img" 
                    />
                    <div className="example-modal-tip blue-theme">
                      注意：上传的凭证截图需包含清晰的账号名称、ID，并显示“已关注”或“互相关注”状态。
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
            {!isEditing ? (
              // 查看配置状态
              <div className="follow-detail-container" style={{ textAlign: 'left' }}>
                <div className="panel-header-section" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className="title" style={{ fontSize: 16, fontWeight: 600 }}>账号加粉功能</span>
                    <p style={{ margin: 0, fontSize: 12, color: '#8c8c8c', lineHeight: '1.5' }}>
                      打通小红书、抖音、视频号等多平台流量，通过积分/卡券奖励引导C端用户一键关注品牌官方账号矩阵。快速沉淀公域流量至私域蓄水池，为品牌二次触达、直播间引流与精准转化沉淀核心粉丝资产。
                    </p>
                  </div>
                </div>

                <div className="rule-config-card" style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f5f5f5', paddingBottom: 12, marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>规则配置</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button size="small" onClick={() => setActiveSubTab('audit')}>关注凭证</Button>
                      <Button size="small" onClick={openAccountModal}>账号管理</Button>
                      <Button size="small" icon={<RobotOutlined />} onClick={openAiAuditModal}>AI审核配置</Button>
                      <Button size="small" type="primary" onClick={enterEditMode}>修改配置</Button>
                    </div>
                  </div>

                  <div className="detail-rows" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: 100, color: '#8c8c8c', fontSize: 13 }}>场景状态：</span>
                      <span>
                        {followEnabled ? (
                          <span style={{ background: '#f6ffed', border: '1px solid #b7eb8f', color: '#52c41a', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>已开启</span>
                        ) : (
                          <span style={{ background: '#fff0f6', border: '1px solid #ffadd2', color: '#eb2f96', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>已关闭</span>
                        )}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: 100, color: '#8c8c8c', fontSize: 13 }}>AI 自动审核：</span>
                      <span>
                        {aiFollowEnabled ? (
                          <span className="ai-audit-status-pill active" style={{ fontSize: 12, display: 'inline-flex', verticalAlign: 'middle' }}>🤖 已启用 (公测限免)</span>
                        ) : (
                          <span className="ai-audit-status-pill disabled" style={{ fontSize: 12, display: 'inline-flex', verticalAlign: 'middle' }}>🤖 已关闭</span>
                        )}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ width: 100, color: '#8c8c8c', fontSize: 13 }}>关注账号：</span>
                      <div style={{ flex: 1 }}>
                        {taskAccounts.map((item, idx) => {
                          const acc = getAccountInfo(item.accountId)
                          const platformLabel = { xhs: '小红书', dy: '抖音', weibo: '微博', wx: '视频号' }[acc.platform as 'xhs' | 'dy' | 'weibo' | 'wx']
                          return (
                            <div key={item.accountId || idx} style={{ marginBottom: 6, fontSize: 13 }}>
                              <strong>{acc.name} ({platformLabel})</strong> —— 引导语: <span style={{ color: '#1890ff' }}>{item.guideText}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ width: 100, color: '#8c8c8c', fontSize: 13 }}>奖励配置：</span>
                      <div style={{ background: '#fafafa', borderRadius: 6, padding: '10px 14px', border: '1px solid #f0f0f0', width: 220 }}>
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>奖品类型: <span style={{ color: '#262626', fontWeight: 500 }}>积分</span></div>
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>奖品名称: <span style={{ color: '#262626', fontWeight: 500 }}>{followPoints} 积分</span></div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>奖励额度: <span style={{ color: '#262626', fontWeight: 500 }}>{followPoints} 积分</span></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ width: 100, color: '#8c8c8c', fontSize: 13 }}>规则说明：</span>
                      <div style={{ whiteSpace: 'pre-line', fontSize: 13, color: '#595959', lineHeight: 1.5, background: '#fafafa', padding: 12, borderRadius: 6, border: '1px solid #f0f0f0', flex: 1 }}>
                        {followRules}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: 100, color: '#8c8c8c', fontSize: 13 }}>拒绝后提交：</span>
                      <span style={{ fontSize: 13 }}>{followAllowReSubmit ? '已开启' : '已关闭'} (若审核拒绝，用户修改后可再次提交)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 修改配置状态
              <div className="follow-edit-container" style={{ textAlign: 'left' }}>
                <div className="panel-header-section" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 12, marginBottom: 16 }}>
                  <span className="title" style={{ fontSize: 16, fontWeight: 600 }}>修改规则配置</span>
                </div>

                <div className="task-properties-form">
                  <div className="prop-group-card">
                    <h3 className="group-title">一、场景状态与基础设置</h3>
                    <div className="prop-row">
                      <div className="prop-label">
                        <span>场景状态</span>
                        <Tooltip title="关闭后C端用户将无法在小程序参与该关注任务。">
                          <QuestionCircleOutlined className="label-help-icon" />
                        </Tooltip>
                      </div>
                      <div className="prop-control">
                        <Switch checked={tempEnabled} onChange={setTempEnabled} />
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#8c8c8c' }}>启用后，用户可参与活动</span>
                      </div>
                    </div>
                  </div>

                  <div className="prop-group-card">
                    <h3 className="group-title">二、关注账号列表配置</h3>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 12 }}>
                      配置该加粉任务中需要用户关注的社媒账号（最多20个）。您可以点击“账号管理”来新增或修改品牌名下的账号库。
                    </div>

                    {tempTaskAccounts.map((item, index) => {
                      return (
                        <div key={item.accountId || index} className="account-edit-row" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ width: 220 }}>
                            <span style={{ fontSize: 12, color: '#595959', display: 'block', marginBottom: 4 }}>选择品牌账号:</span>
                            <select 
                              value={item.accountId} 
                              onChange={(e) => {
                                const newId = e.target.value
                                setTempTaskAccounts(prev => {
                                  const next = [...prev]
                                  next[index] = { ...next[index], accountId: newId }
                                  return next
                                })
                              }}
                              style={{ width: '100%', height: 32, borderRadius: 4, border: '1px solid #d9d9d9', padding: '0 8px', fontSize: 13 }}
                            >
                              {brandAccounts.map(ba => {
                                const pltName = { xhs: '小红书', dy: '抖音', weibo: '微博', wx: '视频号' }[ba.platform as 'xhs' | 'dy' | 'weibo' | 'wx']
                                return <option key={ba.id} value={ba.id}>{ba.name} ({pltName})</option>
                              })}
                            </select>
                          </div>

                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 12, color: '#595959', display: 'block', marginBottom: 4 }}>关注引导语:</span>
                            <Input 
                              value={item.guideText} 
                              placeholder="引导语，如：关注这个账号" 
                              onChange={(e) => {
                                const val = e.target.value
                                setTempTaskAccounts(prev => {
                                  const next = [...prev]
                                  next[index] = { ...next[index], guideText: val }
                                  return next
                                })
                              }}
                            />
                          </div>

                          <Button 
                            type="text" 
                            danger 
                            onClick={() => {
                              setTempTaskAccounts(prev => prev.filter((_, i) => i !== index))
                            }}
                            style={{ marginTop: 20 }}
                          >
                            删除
                          </Button>
                        </div>
                      )
                    })}

                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <Button 
                        size="small" 
                        icon={<PlusOutlined />} 
                        onClick={() => {
                          if (tempTaskAccounts.length >= 20) {
                            message.warning('最多只支持添加 20 个关注账号')
                            return
                          }
                          const firstAvailable = brandAccounts[0]?.id || ''
                          setTempTaskAccounts(prev => [...prev, { accountId: firstAvailable, guideText: '关注并截图上传' }])
                        }}
                      >
                        添加账号 ({tempTaskAccounts.length}/20)
                      </Button>
                      <Button size="small" onClick={openAccountModal}>账号管理</Button>
                    </div>
                  </div>

                  <div className="prop-group-card">
                    <h3 className="group-title">三、奖励配置</h3>
                    <div className="prop-row">
                      <div className="prop-label">
                        <span>完成奖励</span>
                      </div>
                      <div className="prop-control" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <InputNumber 
                          min={1} 
                          value={tempPoints} 
                          onChange={(val) => val && setTempPoints(val)} 
                          addonAfter="积分" 
                          style={{ width: 140 }}
                        />
                        <Button size="small">挑选奖励</Button>
                      </div>
                    </div>
                  </div>

                  <div className="prop-group-card">
                    <h3 className="group-title">四、规则说明与提交设置</h3>
                    <div className="prop-row">
                      <div className="prop-label">
                        <span>活动规则说明</span>
                      </div>
                      <div className="prop-control">
                        <Input.TextArea 
                          rows={4} 
                          value={tempRules} 
                          onChange={(e) => setTempRules(e.target.value)} 
                          placeholder="请输入活动规则说明，换行排列"
                        />
                      </div>
                    </div>

                    <div className="prop-row" style={{ marginTop: 16 }}>
                      <div className="prop-label">
                        <span>拒绝后再次提交</span>
                        <Tooltip title="如果用户的审核被管理员拒绝，开启后用户可以在前台重新修改截图并提交。">
                          <QuestionCircleOutlined className="label-help-icon" />
                        </Tooltip>
                      </div>
                      <div className="prop-control">
                        <Switch checked={tempAllowReSubmit} onChange={setTempAllowReSubmit} />
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#8c8c8c' }}>开启后，各审核拒绝，用户修改后可再次提交</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                    <Button onClick={cancelEdit}>取消</Button>
                    <Button type="primary" onClick={saveEdit}>保存</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* 账号管理 Modal */}
      {showAccountModal && (
        <div className="example-modal-overlay" style={{ zIndex: 1000 }}>
          <div className="example-modal-content" style={{ width: 720, padding: 24, borderRadius: 8, maxHeight: '85vh', overflow: 'auto' }}>
            <span className="example-modal-close" onClick={() => setShowAccountModal(false)}>×</span>
            <h3 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 600, textAlign: 'left' }}>账号管理</h3>
            <div style={{ marginBottom: 16, textAlign: 'left' }}>
              <span onClick={() => message.info('正在打开平台主页截图标准图介绍...')} style={{ fontSize: 12, color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}>
                查看平台账号主页截图示例图
              </span>
            </div>

            <div className="account-list-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', background: '#fafafa', padding: '8px 12px', fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>
                <div style={{ width: 120 }}>平台</div>
                <div style={{ width: 140 }}>账号 (账号ID)</div>
                <div style={{ width: 150 }}>名称 (商户显示)</div>
                <div style={{ flex: 1 }}>C端关注截图示例图 (用户比对用)</div>
                <div style={{ width: 60 }}>操作</div>
              </div>

              {modalBrandAccounts.map((acc, index) => {
                return (
                  <div key={acc.id || index} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #f5f5f5' }}>
                    {/* 平台选择 */}
                    <div style={{ width: 120 }}>
                      <select 
                        value={acc.platform} 
                        onChange={(e) => {
                          const val = e.target.value
                          setModalBrandAccounts(prev => {
                            const next = [...prev]
                            next[index] = { ...next[index], platform: val }
                            return next
                          })
                        }}
                        style={{ width: '100%', height: 32, borderRadius: 4, border: '1px solid #d9d9d9', fontSize: 12, padding: '0 4px' }}
                      >
                        <option value="xhs">小红书</option>
                        <option value="dy">抖音</option>
                        <option value="weibo">微博</option>
                        <option value="wx">微信视频号</option>
                      </select>
                    </div>

                    {/* 账号 */}
                    <div style={{ width: 140 }}>
                      <Input 
                        value={acc.accountNo} 
                        size="small" 
                        onChange={(e) => {
                          const val = e.target.value
                          setModalBrandAccounts(prev => {
                            const next = [...prev]
                            next[index] = { ...next[index], accountNo: val }
                            return next
                          })
                        }}
                      />
                    </div>

                    {/* 名称 */}
                    <div style={{ width: 150 }}>
                      <Input 
                        value={acc.name} 
                        size="small" 
                        onChange={(e) => {
                          const val = e.target.value
                          setModalBrandAccounts(prev => {
                            const next = [...prev]
                            next[index] = { ...next[index], name: val }
                            return next
                          })
                        }}
                      />
                    </div>

                    {/* C端关注截图示例图 */}
                    <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center', textAlign: 'left' }}>
                      <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 4, overflow: 'hidden', border: '1px solid #d9d9d9', background: '#f5f5f5' }}>
                        {acc.exampleImage ? (
                          <img src={acc.exampleImage} alt="截图" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <PictureOutlined style={{ fontSize: 16, color: '#bfbfbf', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <Upload 
                            showUploadList={false} 
                            beforeUpload={(file) => {
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                if (e.target?.result) {
                                  setModalBrandAccounts(prev => {
                                    const next = [...prev]
                                    next[index] = { ...next[index], exampleImage: e.target!.result as string }
                                    return next
                                  })
                                  message.success('已更新关注成功示例图！')
                                }
                              }
                              reader.readAsDataURL(file)
                              return false
                            }}
                          >
                            <span style={{ fontSize: 11, color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}>
                              上传示例图
                            </span>
                          </Upload>
                          <span 
                            onClick={() => {
                              setModalBrandAccounts(prev => {
                                const next = [...prev]
                                next[index] = { ...next[index], exampleImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80' }
                                return next
                              })
                              message.info('已重置回默认标准关注截图')
                            }} 
                            style={{ fontSize: 11, color: '#ff4d4f', cursor: 'pointer' }}
                          >
                            重置
                          </span>
                        </div>
                        <span style={{ fontSize: 9, color: '#bfbfbf', whiteSpace: 'nowrap' }}>*C端用户看到的主页关注成功标准截图</span>
                      </div>
                    </div>

                    {/* 删除 */}
                    <div style={{ width: 60 }}>
                      <Button 
                        type="text" 
                        danger 
                        size="small" 
                        onClick={() => {
                          if (modalBrandAccounts.length <= 1) {
                            message.warning('必须保留至少一个品牌账户！')
                            return
                          }
                          setModalBrandAccounts(prev => prev.filter((_, i) => i !== index))
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <Button 
                icon={<PlusOutlined />} 
                onClick={() => {
                  if (modalBrandAccounts.length >= 20) {
                    message.warning('最多只能维护 20 个品牌账户')
                    return
                  }
                  setModalBrandAccounts(prev => [...prev, {
                    id: String(prev.length + 1) + '-' + String(Date.now()).substring(8),
                    platform: 'xhs',
                    accountNo: 'new_acc',
                    name: '新社交账号',
                    exampleImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
                    logoImage: ''
                  }])
                }}
              >
                新增账号 ({modalBrandAccounts.length}/20)
              </Button>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button onClick={() => setShowAccountModal(false)}>取消</Button>
                <Button type="primary" onClick={saveAccountModal}>确定</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 【新组件】KocAuditPanel：KOC任务验证审核中心
// ==========================================
interface KocAuditPanelProps {
  submissions: any[]
  setSubmissions: React.Dispatch<React.SetStateAction<any[]>>
  aiFollowEnabled: boolean
  aiInteractiveEnabled: boolean
  openAiAuditModal: () => void
}

function KocAuditPanel({ submissions, setSubmissions, aiFollowEnabled, aiInteractiveEnabled, openAiAuditModal }: KocAuditPanelProps) {
  const [selectedSub, setSelectedSub] = useState<any | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false)
  const [rejectReason, setRejectReason] = useState<string>('')
  const [activeSubId, setActiveSubId] = useState<string | null>(null)

  const handleApprove = (id: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s))
    message.success('审核已通过，奖励积分已发放给用户！')
  }

  const handleRejectClick = (id: string) => {
    setActiveSubId(id)
    setRejectReason('')
    setRejectModalOpen(true)
  }

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      message.warning('请选择或填写拒绝理由！')
      return
    }
    setSubmissions(prev => prev.map(s => s.id === activeSubId ? { ...s, status: 'rejected', reason: rejectReason } : s))
    setRejectModalOpen(false)
    message.info('已拒绝该凭证，状态退回待修改状态')
  }

  const filteredList = submissions.filter(s => {
    if (filterStatus === 'all') return true
    return s.status === filterStatus
  })

  return (
    <div className="audit-panel-wrapper" style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: 20 }}>
      <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>KOC 任务凭证审核大厅</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#8c8c8c' }}>审核C端用户提交的关注截图与点赞/评论/收藏截图，通过后奖励自动到账。</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="audit-stats-summary" style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <div>待审核: <strong style={{ color: '#fa8c16' }}>{submissions.filter(s => s.status === 'pending').length}</strong></div>
            <div>已通过: <strong style={{ color: '#52c41a' }}>{submissions.filter(s => s.status === 'approved').length}</strong></div>
            <div>已拒绝: <strong style={{ color: '#f5222d' }}>{submissions.filter(s => s.status === 'rejected').length}</strong></div>
          </div>
          <Button 
            type="primary" 
            ghost 
            icon={<RobotOutlined />} 
            size="small" 
            style={{ borderRadius: 4, height: 28, fontSize: 12 }}
            onClick={openAiAuditModal}
          >
            AI自动审核配置
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: 16, textAlign: 'left' }}>
        <Radio.Group value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} size="middle">
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="pending">待审核</Radio.Button>
          <Radio.Button value="approved">已通过</Radio.Button>
          <Radio.Button value="rejected">已拒绝</Radio.Button>
        </Radio.Group>
      </div>

      <div className="audit-table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>C端用户</th>
              <th style={{ padding: 12, textAlign: 'left' }}>任务类型</th>
              <th style={{ padding: 12, textAlign: 'left' }}>考核目标</th>
              <th style={{ padding: 12, textAlign: 'center' }}>提交凭证 (点击放大)</th>
              <th style={{ padding: 12, textAlign: 'left' }}>提交时间</th>
              <th style={{ padding: 12, textAlign: 'left' }}>当前状态</th>
              <th style={{ padding: 12, textAlign: 'center', width: 140 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#bfbfbf' }}>暂无相关凭证数据</td>
              </tr>
            ) : (
              filteredList.map(sub => {
                const statusTag = {
                  pending: <span style={{ color: '#fa8c16', background: '#fff7e6', border: '1px solid #ffd591', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>待审核</span>,
                  approved: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                      <span style={{ color: '#52c41a', background: '#f6ffed', border: '1px solid #b7eb8f', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>已通过</span>
                      {((sub.taskType === 'follow' && aiFollowEnabled) || (sub.taskType === 'interactive' && aiInteractiveEnabled)) && (
                        <span style={{ fontSize: 10, color: '#1890ff', background: '#e6f7ff', border: '1px solid #91d5ff', padding: '0px 4px', borderRadius: 2 }}>🤖 AI自动过审</span>
                      )}
                    </div>
                  ),
                  rejected: <span style={{ color: '#f5222d', background: '#fff1f0', border: '1px solid #ffa39e', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>已拒绝</span>,
                }[sub.status as 'pending' | 'approved' | 'rejected']

                return (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: 12, textAlign: 'left' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <img src={sub.avatar} alt="头像" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                        <span>{sub.nickname}</span>
                      </div>
                    </td>
                    <td style={{ padding: 12, fontWeight: 500, textAlign: 'left' }}>
                      {sub.taskType === 'follow' ? '账号加粉' : '内容互动'}
                    </td>
                    <td style={{ padding: 12, color: '#595959', textAlign: 'left' }}>{sub.target}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <div 
                        onClick={() => setSelectedSub(sub.screenshot)} 
                        style={{ cursor: 'pointer', display: 'inline-block', width: 36, height: 50, borderRadius: 4, overflow: 'hidden', border: '1px solid #d9d9d9', background: '#f5f5f5' }}
                      >
                        <img src={sub.screenshot} alt="截图" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ padding: 12, color: '#8c8c8c', textAlign: 'left' }}>{sub.time}</td>
                    <td style={{ padding: 12, textAlign: 'left' }}>
                      {statusTag}
                      {sub.status === 'rejected' && sub.reason && (
                        <div style={{ color: '#f5222d', fontSize: 11, marginTop: 4 }}>理由: {sub.reason}</div>
                      )}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      {sub.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          <Button size="small" type="primary" onClick={() => handleApprove(sub.id)}>通过</Button>
                          <Button size="small" danger onClick={() => handleRejectClick(sub.id)}>拒绝</Button>
                        </div>
                      ) : (
                        <span style={{ color: '#bfbfbf', fontSize: 12 }}>已审核</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 截图放大 Modal */}
      {selectedSub && (
        <div className="example-modal-overlay" style={{ zIndex: 2000 }} onClick={() => setSelectedSub(null)}>
          <div className="example-modal-content" style={{ width: 300, padding: 12 }} onClick={e => e.stopPropagation()}>
            <span className="example-modal-close" onClick={() => setSelectedSub(null)}>×</span>
            <div className="example-modal-title" style={{ marginBottom: 8 }}>凭证原图</div>
            <img src={selectedSub} alt="凭证原图" style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', borderRadius: 4 }} />
          </div>
        </div>
      )}

      {/* 拒绝理由 Modal */}
      {rejectModalOpen && (
        <div className="example-modal-overlay" style={{ zIndex: 2001 }}>
          <div className="example-modal-content" style={{ width: 320, padding: 20 }}>
            <span className="example-modal-close" onClick={() => setRejectModalOpen(false)}>×</span>
            <div className="example-modal-title" style={{ fontSize: 14 }}>填写拒绝理由</div>
            <div style={{ margin: '12px 0', textAlign: 'left' }}>
              <select 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ width: '100%', height: 32, borderRadius: 4, border: '1px solid #d9d9d9', padding: '0 8px', fontSize: 12, marginBottom: 8 }}
              >
                <option value="">-- 选择快捷理由 --</option>
                <option value="未关注该账号">未关注该账号</option>
                <option value="上传的截图非关注成功页面">上传的截图非关注成功页面</option>
                <option value="截图不清晰或非本人账号">截图不清晰或非本人账号</option>
                <option value="重复提交相同截图">重复提交相同截图</option>
              </select>
              <Input.TextArea 
                rows={3} 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="或者输入自定义拒绝理由"
                style={{ fontSize: 12 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
              <Button size="small" onClick={() => setRejectModalOpen(false)}>取消</Button>
              <Button size="small" type="primary" danger onClick={handleRejectConfirm}>确认拒绝</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 【重构主入口】TaskEditor: KOC种草管理多签页控制器
// ==========================================
function TaskEditor() {
  const [activeSubTab, setActiveSubTab] = useState<'hub' | 'follow' | 'interactive' | 'audit'>('hub')

  // AI 自动审核 States
  const [aiFollowEnabled, setAiFollowEnabled] = useState<boolean>(true)
  const [aiInteractiveEnabled, setAiInteractiveEnabled] = useState<boolean>(false)
  const [showAiAuditModal, setShowAiAuditModal] = useState<boolean>(false)

  // 2. 账号加粉 (Follow Task) States
  const [followEnabled, setFollowEnabled] = useState<boolean>(true)
  const [followPoints, setFollowPoints] = useState<number>(100)
  const [followRules, setFollowRules] = useState<string>('1. 必须使用本人的真实社媒账号关注指定品牌账号。\n2. 关注成功后请前往个人中心截图，截图需包含清晰的账号信息与“已关注”状态。\n3. 请勿在获得奖励后立即取消关注，系统会定期复查，违规者将扣回奖励积分并限制后续参与。')
  const [followAllowReSubmit, setFollowAllowReSubmit] = useState<boolean>(true)

  const [brandAccounts, setBrandAccounts] = useState([
    {
      id: '1',
      platform: 'xhs',
      accountNo: '596245456',
      name: '官方小红书账号 (示例红薯)',
      exampleImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
      logoImage: ''
    },
    {
      id: '2',
      platform: 'dy',
      accountNo: 'doy',
      name: '官方抖音号 (示例抖音)',
      exampleImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      logoImage: ''
    }
  ])

  const [taskAccounts, setTaskAccounts] = useState([
    { accountId: '1', guideText: '关注这个' },
    { accountId: '2', guideText: '关注着' }
  ])

  // 3. 审核中心 (Audit List) Mock Data
  const [auditSubmissions, setAuditSubmissions] = useState([
    {
      id: 'sub-1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
      nickname: '微信用户_A2',
      taskType: 'follow',
      target: '账号加粉 (小红书/抖音)',
      screenshot: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
      time: '5分钟前',
      status: 'pending',
      reason: ''
    },
    {
      id: 'sub-2',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
      nickname: 'Momo酱',
      taskType: 'interactive',
      target: '内容互动 (点赞/收藏/评论)',
      screenshot: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
      time: '23分钟前',
      status: 'pending',
      reason: ''
    },
    {
      id: 'sub-3',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=80&q=80',
      nickname: '极客小徐',
      taskType: 'follow',
      target: '账号加粉 (抖音号)',
      screenshot: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      time: '1小时前',
      status: 'approved',
      reason: ''
    }
  ])

  return (
    <div style={{ background: '#f5f7fa', minHeight: 'calc(100vh - 120px)' }}>
      {/* 玩转KOC种草专属头部页签 */}
      <div className="koc-tab-container-bar">
        <div className="koc-tab-list">
          <button 
            className={`koc-tab-btn ${activeSubTab === 'hub' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('hub')}
          >
            玩转KOC种草
          </button>
          <button 
            className={`koc-tab-btn ${activeSubTab === 'follow' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('follow')}
          >
            账号加粉
          </button>
          <button 
            className={`koc-tab-btn ${activeSubTab === 'interactive' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('interactive')}
          >
            内容互动
          </button>
          <button 
            className={`koc-tab-btn ${activeSubTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('audit')}
          >
            内容审核
            {auditSubmissions.filter(s => s.status === 'pending').length > 0 && (
              <span className="koc-tab-badge">
                {auditSubmissions.filter(s => s.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 条件页签内容渲染 */}
      <div style={{ marginTop: 20 }}>
        {activeSubTab === 'hub' && (
          <KocHub 
            setActiveSubTab={setActiveSubTab} 
            followEnabled={followEnabled} 
            aiFollowEnabled={aiFollowEnabled}
            aiInteractiveEnabled={aiInteractiveEnabled}
            openAiAuditModal={() => setShowAiAuditModal(true)}
          />
        )}
        {activeSubTab === 'follow' && (
          <KocFollowEditor 
            brandAccounts={brandAccounts}
            setBrandAccounts={setBrandAccounts}
            taskAccounts={taskAccounts}
            setTaskAccounts={setTaskAccounts}
            followPoints={followPoints}
            setFollowPoints={setFollowPoints}
            followRules={followRules}
            setFollowRules={setFollowRules}
            followAllowReSubmit={followAllowReSubmit}
            setFollowAllowReSubmit={setFollowAllowReSubmit}
            followEnabled={followEnabled}
            setFollowEnabled={setFollowEnabled}
            setActiveSubTab={setActiveSubTab}
            aiFollowEnabled={aiFollowEnabled}
            openAiAuditModal={() => setShowAiAuditModal(true)}
          />
        )}
        <div style={{ display: activeSubTab === 'interactive' ? 'block' : 'none' }}>
          <KocInteractiveEditor 
            aiInteractiveEnabled={aiInteractiveEnabled}
            openAiAuditModal={() => setShowAiAuditModal(true)}
          />
        </div>
        {activeSubTab === 'audit' && (
          <KocAuditPanel 
            submissions={auditSubmissions}
            setSubmissions={setAuditSubmissions}
            aiFollowEnabled={aiFollowEnabled}
            aiInteractiveEnabled={aiInteractiveEnabled}
            openAiAuditModal={() => setShowAiAuditModal(true)}
          />
        )}
      </div>

      {/* 🤖 AI自动审核配置弹出 Modal */}
      {showAiAuditModal && (
        <div className="ai-audit-modal-overlay" onClick={() => setShowAiAuditModal(false)}>
          <div className="ai-audit-modal-content" onClick={e => e.stopPropagation()}>
            <span className="ai-audit-modal-close" onClick={() => setShowAiAuditModal(false)}>×</span>
            
            <div className="ai-audit-header-banner">
              <div className="ai-audit-header-text">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 className="ai-audit-modal-title">🤖 AI 智能截图自动审核配置</h2>
                  <span className="ai-audit-status-badge beta">Beta · 限时免费</span>
                </div>
                <p className="ai-audit-modal-subtitle">
                  利用多模态视觉大模型（Vision LLM）对用户上传的截图执行 OCR 解析与像素比对，7*24小时核实任务合规性并自动发放奖励。
                </p>
              </div>
            </div>

            <div className="ai-audit-modal-body" style={{ padding: '24px 32px' }}>
              
              {/* 风控安全警告 Banner */}
              <div className="ai-audit-risk-warning">
                <div className="warning-icon-wrapper">
                  <span className="warning-icon">⚠️</span>
                </div>
                <div className="warning-content">
                  <h4>风控与资金安全提示</h4>
                  <p>
                    AI 智能审核受截屏分辨率、黑暗模式、手机排版影响，存在一定的识别误差。
                    <strong>如果当前任务发放的单次奖励较高（如大额现金红包、大面值实物赠品等），强烈建议使用“人工审核”以防范恶意作弊，确保资金安全。</strong>
                  </p>
                </div>
              </div>

              {/* 核心配置区域：分别启动 */}
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#262626', marginBottom: 12, textAlign: 'left' }}>场景审核启动状态</h3>
                <div className="ai-audit-switch-grid">
                  {/* 卡片 1: 账号加粉 */}
                  <div className={`ai-audit-switch-card ${aiFollowEnabled ? 'active' : ''}`}>
                    <div className="card-header-row">
                      <div className="card-title-group">
                        <span className="platform-tag follow">场景一</span>
                        <h4 className="card-title">账号加粉任务 AI 审核</h4>
                      </div>
                      <Switch 
                        checked={aiFollowEnabled} 
                        onChange={(checked) => setAiFollowEnabled(checked)} 
                        size="small"
                      />
                    </div>
                    <p className="card-desc">
                      自动对用户提交的小红书、抖音、视频号关注截图进行识别，核实截图是否包含“已关注”、“关注中”及官方账号名称。
                    </p>
                    <div className="card-status-info">
                      状态：{aiFollowEnabled ? <span className="status-dot-on">已启用 (公测免费)</span> : <span className="status-dot-off">已关闭</span>}
                    </div>
                  </div>

                  {/* 卡片 2: 内容互动 */}
                  <div className={`ai-audit-switch-card ${aiInteractiveEnabled ? 'active' : ''}`}>
                    <div className="card-header-row">
                      <div className="card-title-group">
                        <span className="platform-tag interactive">场景二</span>
                        <h4 className="card-title">内容互动任务 AI 审核</h4>
                      </div>
                      <Switch 
                        checked={aiInteractiveEnabled} 
                        onChange={(checked) => setAiInteractiveEnabled(checked)} 
                        size="small"
                      />
                    </div>
                    <p className="card-desc">
                      自动对用户提交的点赞、收藏、评论截图进行多模态及像素比对，自动识别交互合规性。
                    </p>
                    <div className="card-status-info">
                      状态：{aiInteractiveEnabled ? <span className="status-dot-on">已启用 (公测免费)</span> : <span className="status-dot-off">已关闭</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* 三大核心价值 */}
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#262626', marginBottom: 12, textAlign: 'left' }}>核心功能与价值优势</h3>
                <div className="ai-audit-values-grid">
                  <div className="value-item">
                    <div className="value-icon">🔍</div>
                    <div className="value-text">
                      <h5>多模态 OCR 识别与像素对比</h5>
                      <p>提取并匹配图片中的文字（如账号、按钮文案、交互标识），与标准配置参考图深度校验，拦截拼接、篡改等薅羊毛作弊。</p>
                    </div>
                  </div>
                  <div className="value-item">
                    <div className="value-icon">⚡</div>
                    <div className="value-text">
                      <h5>24H不间断自动发奖</h5>
                      <p>用户前台小程序上传凭证后，系统会分钟级自动审核发放奖励，C端体验较好，可以快速激发社交关注。</p>
                    </div>
                  </div>
                  <div className="value-item">
                    <div className="value-icon">📈</div>
                    <div className="value-text">
                      <h5>节省 95% 人工负荷</h5>
                      <p>系统过滤绝大多数常规过审件。仅对模糊、异常、置信度低或涉嫌作弊的上传件标记为“待复审”，只需进行少量抽查即可。</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 增值付费说明 */}
              <div className="ai-audit-pricing-info" style={{ marginTop: 24 }}>
                <span className="pricing-icon">💎</span>
                <div className="pricing-text">
                  <strong>付费说明：</strong>当前功能处于 <span>限时公测期免费</span> 阶段。正式版上线后将升级为增值服务，按判定次数计费，开启扣费前将提前进行通知。
                </div>
              </div>
            </div>

            <div className="ai-audit-modal-footer" style={{ padding: '16px 32px 24px 32px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={() => setShowAiAuditModal(false)}>取消</Button>
              <Button type="primary" onClick={() => {
                setShowAiAuditModal(false)
                message.success('AI 截图自动审核配置已成功保存！')
              }}>保存配置</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
interface KocInteractiveEditorProps {
  aiInteractiveEnabled: boolean
  openAiAuditModal: () => void
}

function KocInteractiveEditor({ aiInteractiveEnabled, openAiAuditModal }: KocInteractiveEditorProps) {
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
            <div className="panel-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="title">互动任务属性配置</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Button
                  size="small"
                  icon={<RobotOutlined />}
                  onClick={openAiAuditModal}
                  style={{ fontSize: 12 }}
                >
                  AI自动审核: {aiInteractiveEnabled ? '已启用 (限免)' : '已禁用'}
                </Button>
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={resetTaskSettings}
                  style={{ color: '#8c8c8c' }}
                >
                  重置
                </Button>
              </div>
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

              {/* 六、AI自动审核设置 */}
              <div className="prop-group-card">
                <h3 className="group-title">六、AI 自动审核设置</h3>
                <div style={{ background: '#fafafa', padding: '14px 18px', borderRadius: 8, border: '1px solid #f0f0f0', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: 13, display: 'block', color: '#262626', marginBottom: 4 }}>内容互动 AI 自动审核</strong>
                    <span style={{ fontSize: 11.5, color: '#8c8c8c' }}>智能判定用户上传的点赞/收藏/评论截图</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    {aiInteractiveEnabled ? (
                      <span className="ai-audit-status-pill active" style={{ fontSize: 11 }}>🤖 自动过审已开启</span>
                    ) : (
                      <span className="ai-audit-status-pill disabled" style={{ fontSize: 11 }}>🤖 自动过审已禁用</span>
                    )}
                    <Button size="small" icon={<RobotOutlined />} onClick={openAiAuditModal}>配置 AI 审核</Button>
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const page = params.get('page')
    if (page === 'group-buy') {
      setRailKey('shop')
      setSecondaryKey('shop-group-buy')
    }
  }, [])

  const params = new URLSearchParams(window.location.search);
  const isBossTaobaoPage = params.get('page') === 'boss-taobao';

  if (isBossTaobaoPage) {
    return <BossAdminTaobaoSync />;
  }

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
  const isPointsLotteryRulesPage = railKey === 'shop' && secondaryKey === 'shop-points-lottery-rules'
  const isPointsTaskPage = railKey === 'shop' && secondaryKey === 'shop-points-task'
  const isInviteRewardPage = railKey === 'shop' && secondaryKey === 'shop-invite-reward'
  const isNavigationPage = railKey === 'shop' && secondaryKey === 'shop-navigation'
  const isTemplateManagerPage = railKey === 'shop' && secondaryKey === 'shop-template-manager'
  const isPointsProdPage = railKey === 'shop' && secondaryKey === 'shop-points-prod'
  const isAppsMarketPage = railKey === 'apps' && secondaryKey === 'dash-apps-market'
  const isGroupBuyPage = railKey === 'shop' && secondaryKey === 'shop-group-buy'
  const isOrderConversionPage = railKey === 'shop' && secondaryKey === 'shop-order-conversion'

  const handleToolClick = useCallback((key: string) => {
    if (key === 'group') {
      setSecondaryKey('shop-group-buy')
    }
  }, [])
  
  // 基础主题色
  const activeTheme = (isPointsMarketingPage || isPointsTaskPage || isNavigationPage || isPointsProdPage || isPointsLotteryRulesPage) ? 'blue' : 'orange'
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
                  <ToolSection title="经典营销" items={orangeClassicTools} theme="orange" onToolClick={handleToolClick} />
                  <ToolSection title="降本工具" items={orangeSourcingTools} theme="orange" onToolClick={handleToolClick} />
                  <ToolSection title="其它工具" items={orangeOtherTools} theme="orange" onToolClick={handleToolClick} />
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
              ) : isPointsLotteryRulesPage ? (
                <LotteryRulesIntervention />
              ) : isPointsTaskPage ? (
                <TaskEditor />
              ) : isInviteRewardPage ? (
                <InviteReward />
              ) : isNavigationPage ? (
                <NavigationEditor />
              ) : isTemplateManagerPage ? (
                <DecorationTemplateManager />
              ) : isPointsProdPage ? (
                <PointsGoodsLimit />
              ) : isAppsMarketPage ? (
                <AppsMarket />
              ) : isGroupBuyPage ? (
                <GroupBuyPage />
              ) : isOrderConversionPage ? (
                <OrderConversion />
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
                        <br />
                        6. <strong>商品管理 -&gt; 虚拟商品原型(卡密)</strong> (点击在新标签页查看)
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
