import {
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  CalculatorOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  CustomerServiceOutlined,
  GiftOutlined,
  HomeOutlined,
  PercentageOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { ConfigProvider, Layout, Menu, Row, Col, theme } from 'antd'
import type { ReactNode } from 'react'
import { useState } from 'react'
import './App.css'

const { Sider, Content } = Layout

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

const menuItems: MenuProps['items'] = [
  {
    key: 'order',
    label: '订单管理',
    children: [
      { key: 'order-all', label: '全部订单' },
      { key: 'order-refund', label: '售后管理' },
    ],
  },
  {
    key: 'product',
    label: '商品管理',
    children: [
      { key: 'product-list', label: '商品列表' },
      { key: 'product-category', label: '分类管理' },
    ],
  },
  {
    key: 'marketing',
    label: '营销工具',
    children: [
      { key: 'tool-list', label: '工具列表' },
      { key: 'marketing-activity', label: '活动管理' },
    ],
  },
  {
    key: 'member',
    label: '会员管理',
    children: [
      { key: 'member-list', label: '会员列表' },
      { key: 'member-level', label: '会员等级' },
    ],
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

export default function App() {
  const [railKey, setRailKey] = useState('marketing')

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#fa8c16',
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
        <div className="icon-rail" aria-label="主导航">
          <button
            type="button"
            className={`icon-rail-btn${railKey === 'home' ? ' active' : ''}`}
            onClick={() => setRailKey('home')}
            title="首页"
          >
            <HomeOutlined />
          </button>
          <button
            type="button"
            className={`icon-rail-btn${railKey === 'order' ? ' active' : ''}`}
            onClick={() => setRailKey('order')}
            title="订单"
          >
            <ShoppingCartOutlined />
          </button>
          <button
            type="button"
            className={`icon-rail-btn${railKey === 'product' ? ' active' : ''}`}
            onClick={() => setRailKey('product')}
            title="商品"
          >
            <AppstoreOutlined />
          </button>
          <button
            type="button"
            className={`icon-rail-btn${railKey === 'marketing' ? ' active' : ''}`}
            onClick={() => setRailKey('marketing')}
            title="营销"
          >
            <GiftOutlined />
          </button>
          <button
            type="button"
            className={`icon-rail-btn${railKey === 'member' ? ' active' : ''}`}
            onClick={() => setRailKey('member')}
            title="会员"
          >
            <UserOutlined />
          </button>
        </div>

        <Sider
          className="sub-sider"
          width={216}
          style={{
            background: '#fff',
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            top: 0,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={['tool-list']}
            defaultOpenKeys={['marketing']}
            style={{ borderInlineEnd: 0, paddingTop: 12 }}
            items={menuItems}
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
