import {
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  CalculatorOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  GiftOutlined,
  HomeOutlined,
  MessageOutlined,
  NotificationOutlined,
  PercentageOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  ToolOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { ConfigProvider, Layout, Menu, Row, Col, theme } from 'antd'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import './App.css'

const { Sider, Content } = Layout

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

/** 二级菜单：「小店」模块（对照运营后台截图） */
export const shopSecondaryMenuItems: MenuProps['items'] = [
  { key: 'shop-overview', label: '概览' },
  {
    key: 'shop-points',
    label: '积分运营',
    children: [
      { key: 'shop-points-settings', label: '积分设置' },
      { key: 'shop-points-mall', label: '积分商城' },
      { key: 'shop-points-order', label: '订单管理' },
      { key: 'shop-points-flow', label: '积分流水' },
      { key: 'shop-points-detail', label: '积分明细' },
      { key: 'shop-points-report', label: '积分报表' },
    ],
  },
  {
    key: 'shop-order-group',
    label: '订单管理',
    children: [
      { key: 'shop-order-query', label: '订单查询' },
      { key: 'shop-order-writeoff', label: '订单核销' },
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
      { key: 'shop-mkt-tools-home', label: '营销工具' },
      { key: 'shop-member-card', label: '会员卡' },
      { key: 'shop-coupons', label: '优惠券' },
      { key: 'shop-coupon-center', label: '领券中心' },
      { key: 'shop-flash-sale', label: '秒杀' },
      { key: 'shop-group-buy', label: '拼团' },
      { key: 'shop-distribution', label: '分销' },
    ],
  },
  {
    key: 'shop-interactive',
    label: '互动营销',
    children: [
      { key: 'shop-interactive-home', label: '互动营销' },
      { key: 'shop-lucky-wheel', label: '幸运大转盘' },
      { key: 'shop-scratch', label: '刮刮乐' },
    ],
  },
  {
    key: 'shop-member',
    label: '会员管理',
    children: [
      { key: 'shop-member-list', label: '会员列表' },
      { key: 'shop-member-level', label: '会员等级' },
      { key: 'shop-member-benefit', label: '会员权益' },
    ],
  },
  {
    key: 'shop-decoration',
    label: '店铺装修',
    children: [{ key: 'shop-decoration-home', label: '店铺装修' }],
  },
]

export const shopMenuDefaultOpenKeys = [
  'shop-points',
  'shop-order-group',
  'shop-product-group',
  'shop-mkt-tools',
  'shop-interactive',
  'shop-member',
  'shop-decoration',
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
  shop: 'shop-overview',
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

type ToolItem = {
  key: string
  title: string
  desc: string
  icon: ReactNode
  badge?: 'new' | 'hot'
}

const classicTools: ToolItem[] = [
  {
    key: 'coupon',
    title: '优惠券',
    desc: '满减券、折扣券等多种玩法，提升转化',
    icon: <PercentageOutlined />,
    badge: 'new',
  },
  {
    key: 'full-reduction',
    title: '满减满折',
    desc: '阶梯满减，组合营销更灵活',
    icon: <GiftOutlined />,
  },
  {
    key: 'group',
    title: '拼团',
    desc: '裂变获客，老带新增长利器',
    icon: <TeamOutlined />,
    badge: 'hot',
  },
  {
    key: 'flash',
    title: '限时折扣',
    desc: '营造抢购氛围，加速下单决策',
    icon: <ClockCircleOutlined />,
  },
  {
    key: 'nx',
    title: 'N件N折',
    desc: '多件组合优惠，提高客单价',
    icon: <CalculatorOutlined />,
  },
  {
    key: 'member-price',
    title: '会员价',
    desc: '会员专享折扣，沉淀高价值用户',
    icon: <CrownOutlined />,
  },
]

const giftTools: ToolItem[] = [
  {
    key: 'gift-manage',
    title: '赠品管理',
    desc: '配置赠品规则与库存，配合订单玩法',
    icon: <GiftOutlined />,
  },
]

const otherTools: ToolItem[] = [
  {
    key: 'manual',
    title: '商品手册',
    desc: '图文详情与说明，降低咨询成本',
    icon: <BookOutlined />,
  },
  {
    key: 'lottery',
    title: '大转盘',
    desc: '互动抽奖活动，提升活跃度',
    icon: <TrophyOutlined />,
  },
  {
    key: 'survey',
    title: '问卷',
    desc: '收集用户反馈，优化运营策略',
    icon: <QuestionCircleOutlined />,
  },
  {
    key: 'material',
    title: '素材管理',
    desc: '统一管理图片与文案素材',
    icon: <AppstoreOutlined />,
  },
  {
    key: 'rank',
    title: '排行榜',
    desc: '销量/互动榜单，制造从众效应',
    icon: <BarChartOutlined />,
  },
  {
    key: 'decorate',
    title: '店铺装修',
    desc: '可视化搭建店铺首页与专题页',
    icon: <ShopOutlined />,
  },
]

function ToolCard({ item }: { item: ToolItem }) {
  return (
    <div className="tool-card">
      <div className="tool-card-icon-wrap">
        {item.badge === 'new' && <span className="badge-new">新</span>}
        {item.badge === 'hot' && <span className="badge-hot">热</span>}
        {item.icon}
      </div>
      <div className="tool-card-body">
        <h3 className="tool-card-title">{item.title}</h3>
        <p className="tool-card-desc">{item.desc}</p>
      </div>
      <span className="tool-card-action">
        去使用 <RightOutlined style={{ fontSize: 11 }} />
      </span>
    </div>
  )
}

function ToolSection({ title, items }: { title: string; items: ToolItem[] }) {
  return (
    <section className="tool-section">
      <h2 className="tool-section-title">{title}</h2>
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col key={item.key} xs={24} sm={12} lg={8}>
            <ToolCard item={item} />
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

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
          colorBgLayout: '#f5f5f5',
        },
        components: {
          Menu: {
            itemSelectedBg: '#e6f7ff',
            itemSelectedColor: '#1890ff',
            itemHoverBg: '#f5f5f5',
          },
        },
      }}
    >
      <Layout className="marketing-page" hasSider>
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

        <Sider
          className="sub-sider"
          width={232}
          style={{
            background: '#fff',
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            top: 0,
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

        <Layout style={{ background: '#f5f5f5' }}>
          <Content>
            <div className="main-inner">
              <header className="main-header">
                <span>
                  <a href="#">
                    <CustomerServiceOutlined />
                    客服
                  </a>
                  <span style={{ margin: '0 12px', color: '#f0f0f0' }}>|</span>
                  <a href="#">
                    <QuestionCircleOutlined />
                    帮助
                  </a>
                </span>
              </header>

              {railKey === 'shop' ? (
                <p
                  style={{
                    margin: '0 0 20px',
                    fontSize: 13,
                    color: 'rgba(0,0,0,0.45)',
                  }}
                >
                  小店 ·{' '}
                  <strong style={{ color: 'rgba(0,0,0,0.88)' }}>
                    {getItemLabel(menuItems, secondaryKey) || '概览'}
                  </strong>
                </p>
              ) : null}

              <ToolSection title="经典营销" items={classicTools} />
              <ToolSection title="赠品工具" items={giftTools} />
              <ToolSection title="其它工具" items={otherTools} />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
