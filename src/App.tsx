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
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { ConfigProvider, Layout, Menu, Row, Col, theme, Empty } from 'antd'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
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
      { key: 'shop-points-lottery', label: '积分抽奖' },
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
      { key: 'shop-lottery-center', label: '抽奖中心' },
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
    key: '選品優選',
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
// 组件定义
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
  const activeTheme = isPointsMarketingPage ? 'blue' : 'orange'

  // 主题色配置对象
  const brandColor = activeTheme === 'blue' ? '#1890FF' : '#FF5E29'
  const brandSelectedBg = activeTheme === 'blue' ? '#E6F7FF' : '#FFF2EC'

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
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
