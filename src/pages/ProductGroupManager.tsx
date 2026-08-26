import React, { useState, useMemo, useEffect } from 'react'
import {
  Table,
  Button,
  Switch,
  Input,
  InputNumber,
  Modal,
  Form,
  Radio,
  Select,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Space,
  Alert,
  Row,
  Col,
  Segmented,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  PictureOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MobileOutlined,
  EditOutlined,
  LeftOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from '@ant-design/icons'
import './ProductGroupManager.css'

// ============================================================================
// 类型定义与数据接口
// ============================================================================

export interface BannerItem {
  id: string
  imageUrl: string
  title: string
  linkType: 'GOODS' | 'GROUP' | 'ACTIVITY' | 'CUSTOM_URL' | 'NONE'
  linkName: string
  targetValue?: string
}

export interface ProductItem {
  id: string
  title: string
  image: string
  price: number
  originPrice: number
  sales: number
  createTime: string
  tag?: string
  tagColor?: string
}

export type ProductSortType = 'DEFAULT' | 'SALES_DESC' | 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC'
export type CartButtonStyleType = 'PLUS_ICON' | 'CART_ICON' | 'SPEC_BTN' | 'BUY_BTN' | 'NONE'

export interface ProductGroupConfig {
  id: string
  name: string
  status: 'NORMAL' | 'DISABLED'
  sort: number // 弱化后的分组自身排序 (越小越靠前)
  // 1. 搜索框配置 (默认圆角胶囊)
  showSearch: boolean
  searchPlaceholder: string
  // 2. 轮播广告配置 (默认3秒平滑轮播)
  banners: BannerItem[]
  // 3. 商品排序配置 (默认使用综合推荐)
  goodsSortRule: ProductSortType
  // 4. 排版样式与购买按钮
  layoutStyle: 'TWO_COLUMNS' | 'ONE_COLUMN' // 一行2个 vs 一行1个 (保留)
  showOriginPrice: boolean
  cartBtnStyle: CartButtonStyleType // 购买按钮多种样式
  backgroundColor: string
  goodsCount?: number
  updatedAt: string
}

// 模拟真实商品数据源
const MOCK_GOODS_LIST: ProductItem[] = [
  {
    id: 'p1',
    title: '【热销爆款】一次过瘾4盒甄选原切肉卷超值组合',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    price: 89.9,
    originPrice: 158.0,
    sales: 3840,
    createTime: '2026-08-20',
    tag: '热销TOP1',
    tagColor: '#ff4d4f',
  },
  {
    id: 'p2',
    title: '【现捞鲜切】脆嫩大刀鲜毛肚 净重250g/份 爽脆多汁',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80',
    price: 58.0,
    originPrice: 88.0,
    sales: 2980,
    createTime: '2026-08-22',
    tag: '镇店招牌',
    tagColor: '#fa8c16',
  },
  {
    id: 'p3',
    title: '【手打纯虾】95%纯虾肉爆汁手打鲜虾滑 200g含籽',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80',
    price: 36.5,
    originPrice: 48.0,
    sales: 2150,
    createTime: '2026-08-26', // 最新
    tag: '新品尝鲜',
    tagColor: '#52c41a',
  },
  {
    id: 'p4',
    title: '【谷饲甄选】M7级澳洲雪花肥牛片 涮烤皆宜 鲜嫩多汁',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
    price: 118.0,
    originPrice: 168.0,
    sales: 1420,
    createTime: '2026-08-24',
    tag: '品质甄选',
    tagColor: '#722ed1',
  },
  {
    id: 'p5',
    title: '【秘熬养生】8小时慢炖原汁鲜菌菇浓汤底包 500ml',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80',
    price: 28.0,
    originPrice: 38.0,
    sales: 4210,
    createTime: '2026-08-15',
    tag: '满减立省',
    tagColor: '#1890ff',
  },
  {
    id: 'p6',
    title: '【拉丝诱惑】手工流心爆浆芝士夹心年糕 300g袋装',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80',
    price: 19.9,
    originPrice: 29.9,
    sales: 1890,
    createTime: '2026-08-25',
    tag: '今日特惠',
    tagColor: '#eb2f96',
  },
]

// 初始默认分组数据
const INITIAL_GROUPS: ProductGroupConfig[] = [
  {
    id: 'grp_001',
    name: '全场热销爆款',
    status: 'NORMAL',
    sort: 10,
    showSearch: true,
    searchPlaceholder: '搜索本组热销好物 / 关键字...',
    banners: [
      {
        id: 'b1',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
        title: '秋日火锅节·4人肉食狂欢套餐立减50元',
        linkType: 'GOODS',
        linkName: '【商品】甄选肉卷套餐',
        targetValue: 'p1',
      },
      {
        id: 'b2',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        title: '领券中心·全场满199减40元神券限量抢',
        linkType: 'ACTIVITY',
        linkName: '【营销活动】限时领券中心',
        targetValue: 'act_coupon_01',
      },
      {
        id: 'b3',
        imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80',
        title: '当季新品首发·手打鲜虾滑尝鲜专场',
        linkType: 'GROUP',
        linkName: '【商品分组】当季新品专区',
        targetValue: 'grp_002',
      },
    ],
    goodsSortRule: 'DEFAULT', // 默认使用综合推荐
    layoutStyle: 'TWO_COLUMNS',
    showOriginPrice: true,
    cartBtnStyle: 'PLUS_ICON', // 加号按钮
    backgroundColor: '#F7F8FA',
    goodsCount: 28,
    updatedAt: '2026-08-26 15:20',
  },
  {
    id: 'grp_002',
    name: '当季新品首发专区',
    status: 'NORMAL',
    sort: 20,
    showSearch: true,
    searchPlaceholder: '输入新品名称快速检索...',
    banners: [
      {
        id: 'b4',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
        title: '本周上新·尝鲜立享88折',
        linkType: 'NONE',
        linkName: '不跳转 (仅展示)',
      },
    ],
    goodsSortRule: 'NEWEST',
    layoutStyle: 'ONE_COLUMN', // 一行1个
    showOriginPrice: true,
    cartBtnStyle: 'SPEC_BTN', // 选规格
    backgroundColor: '#FAF5FF',
    goodsCount: 16,
    updatedAt: '2026-08-25 18:30',
  },
  {
    id: 'grp_003',
    name: '超值特惠与凑单专区',
    status: 'NORMAL',
    sort: 30,
    showSearch: false,
    searchPlaceholder: '搜索特惠商品',
    banners: [
      {
        id: 'b5',
        imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
        title: '低至9.9元·超值小吃与甜品专区',
        linkType: 'CUSTOM_URL',
        linkName: 'https://mall.example.com/activity/lowprice',
      },
    ],
    goodsSortRule: 'PRICE_ASC',
    layoutStyle: 'TWO_COLUMNS',
    showOriginPrice: true,
    cartBtnStyle: 'CART_ICON', // 购物车图标
    backgroundColor: '#FFF8F0',
    goodsCount: 22,
    updatedAt: '2026-08-24 11:15',
  },
]

export const ProductGroupManager: React.FC = () => {
  const [groups, setGroups] = useState<ProductGroupConfig[]>(INITIAL_GROUPS)
  const [activeTopTab, setActiveTopTab] = useState<string>('商品分组')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [versionView, setVersionView] = useState<'NEW_DESIGN' | 'OLD_COMPARE'>('NEW_DESIGN')

  // 表单与编辑中的临时分组数据
  const [form] = Form.useForm()
  const [currentEditing, setCurrentEditing] = useState<ProductGroupConfig>(INITIAL_GROUPS[0])

  // 手机端实时预览的状态
  const [previewActiveBannerIndex, setPreviewActiveBannerIndex] = useState(0)
  const [previewSearchInput, setPreviewSearchInput] = useState('')

  // 轮播图添加/编辑子弹窗
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  const [bannerForm] = Form.useForm()
  const [editingBannerIndex, setEditingBannerIndex] = useState<number | null>(null)

  // 轮播自动切换定时器 (默认3秒)
  useEffect(() => {
    if (!currentEditing.banners || currentEditing.banners.length <= 1) return
    const interval = setInterval(() => {
      setPreviewActiveBannerIndex((prev) =>
        prev + 1 >= currentEditing.banners.length ? 0 : prev + 1,
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [currentEditing.banners])

  // 过滤后的分组列表
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchName = !searchText || g.name.toLowerCase().includes(searchText.toLowerCase())
      const matchStatus = statusFilter === 'ALL' || g.status === statusFilter
      return matchName && matchStatus
    })
  }, [groups, searchText, statusFilter])

  // 打开新增分组弹窗
  const handleOpenAdd = () => {
    const newGroup: ProductGroupConfig = {
      id: `grp_${Date.now()}`,
      name: '',
      status: 'NORMAL',
      sort: 0,
      showSearch: true,
      searchPlaceholder: '搜索本组精选好物...',
      banners: [
        {
          id: `b_${Date.now()}`,
          imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
          title: '限时狂欢·新人专享8折立减券',
          linkType: 'ACTIVITY',
          linkName: '【营销活动】新人立减活动',
          targetValue: 'act_new_user',
        },
      ],
      goodsSortRule: 'DEFAULT', // 默认综合推荐
      layoutStyle: 'TWO_COLUMNS',
      showOriginPrice: true,
      cartBtnStyle: 'PLUS_ICON',
      backgroundColor: '#F7F8FA',
      goodsCount: 18,
      updatedAt: '刚刚',
    }
    setIsEditMode(false)
    setCurrentEditing(newGroup)
    form.setFieldsValue(newGroup)
    setVersionView('NEW_DESIGN')
    setIsModalOpen(true)
  }

  // 打开编辑分组弹窗
  const handleOpenEdit = (group: ProductGroupConfig) => {
    setIsEditMode(true)
    const cloned = JSON.parse(JSON.stringify(group))
    setCurrentEditing(cloned)
    form.setFieldsValue(cloned)
    setPreviewActiveBannerIndex(0)
    setVersionView('NEW_DESIGN')
    setIsModalOpen(true)
  }

  // 表单变更同步至预览
  const handleFormValuesChange = (_: unknown, allValues: Partial<ProductGroupConfig>) => {
    setCurrentEditing((prev) => ({
      ...prev,
      ...allValues,
      banners: prev.banners, // 保持轮播数组
    }))
  }

  // 保存分组配置
  const handleSaveModal = async () => {
    try {
      const values = await form.validateFields()
      const updatedConfig: ProductGroupConfig = {
        ...currentEditing,
        ...values,
        updatedAt: '刚刚',
      }
      if (isEditMode) {
        setGroups((prev) => prev.map((g) => (g.id === updatedConfig.id ? updatedConfig : g)))
        message.success(`商品分组「${updatedConfig.name}」配置已更新并发布！`)
      } else {
        setGroups((prev) => [updatedConfig, ...prev])
        message.success(`成功创建新商品分组「${updatedConfig.name}」！`)
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  // 删除分组
  const handleDeleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id))
    message.success('已删除该商品分组')
  }

  // 快速切换状态
  const handleToggleStatus = (id: string, current: 'NORMAL' | 'DISABLED') => {
    const next = current === 'NORMAL' ? 'DISABLED' : 'NORMAL'
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: next, updatedAt: '刚刚' } : g)),
    )
    message.info(`分组状态已切换为: ${next === 'NORMAL' ? '正常' : '禁用'}`)
  }

  // 轮播图管理操作
  const handleAddOrEditBanner = (index?: number) => {
    if (index !== undefined && index >= 0) {
      setEditingBannerIndex(index)
      bannerForm.setFieldsValue(currentEditing.banners[index])
    } else {
      if (currentEditing.banners.length >= 5) {
        message.warning('最多支持添加 5 张轮播广告图')
        return
      }
      setEditingBannerIndex(null)
      bannerForm.setFieldsValue({
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
        title: '精选活动广告',
        linkType: 'GOODS',
        linkName: '【商品】甄选原切肉卷组合',
        targetValue: 'p1',
      })
    }
    setIsBannerModalOpen(true)
  }

  const handleSaveBanner = async () => {
    try {
      const values = await bannerForm.validateFields()
      const newBannerItem: BannerItem = {
        id: editingBannerIndex !== null ? currentEditing.banners[editingBannerIndex].id : `b_${Date.now()}`,
        imageUrl: values.imageUrl,
        title: values.title,
        linkType: values.linkType,
        linkName:
          values.linkType === 'NONE'
            ? '不跳转 (仅展示)'
            : values.linkName || '已设置跳转',
        targetValue: values.targetValue,
      }

      const updatedBanners = [...currentEditing.banners]
      if (editingBannerIndex !== null) {
        updatedBanners[editingBannerIndex] = newBannerItem
      } else {
        updatedBanners.push(newBannerItem)
      }
      setCurrentEditing((prev) => ({ ...prev, banners: updatedBanners }))
      setIsBannerModalOpen(false)
      message.success('轮播广告配置已更新')
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteBanner = (index: number) => {
    const updated = currentEditing.banners.filter((_, i) => i !== index)
    setCurrentEditing((prev) => ({ ...prev, banners: updated }))
    if (previewActiveBannerIndex >= updated.length) {
      setPreviewActiveBannerIndex(Math.max(0, updated.length - 1))
    }
    message.success('已移除该轮播图')
  }

  const handleMoveBanner = (index: number, direction: 'UP' | 'DOWN') => {
    const updated = [...currentEditing.banners]
    const targetIndex = direction === 'UP' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= updated.length) return
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setCurrentEditing((prev) => ({ ...prev, banners: updated }))
  }

  // 手机端排序与商品联动 (严格按商户后台配置的 goodsSortRule 排序)
  const displayedPreviewGoods = useMemo(() => {
    let list = [...MOCK_GOODS_LIST]
    const sortRule = currentEditing.goodsSortRule

    if (sortRule === 'SALES_DESC') {
      list.sort((a, b) => b.sales - a.sales)
    } else if (sortRule === 'NEWEST') {
      list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
    } else if (sortRule === 'PRICE_ASC') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortRule === 'PRICE_DESC') {
      list.sort((a, b) => b.price - a.price)
    }
    // DEFAULT 模式保持 MOCK 数组初始顺序 (即后台运营权重推荐顺序)

    if (previewSearchInput) {
      list = list.filter((item) => item.title.includes(previewSearchInput))
    }

    return list
  }, [currentEditing.goodsSortRule, previewSearchInput])

  // 表格列定义
  const columns = [
    {
      title: '分组名称',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (text: string, record: ProductGroupConfig) => (
        <div className="group-name-cell">
          <div className="group-title-row">
            <span className="group-title-text">{text}</span>
            {record.showSearch && <Tag color="blue" bordered={false}>头部搜索</Tag>}
            {record.banners.length > 1 && (
              <Tag color="orange" bordered={false}>
                <PictureOutlined /> 轮播x{record.banners.length}
              </Tag>
            )}
            <Tag color="purple" bordered={false}>
              {record.layoutStyle === 'TWO_COLUMNS' ? '一行2个' : '一行1个'}
            </Tag>
          </div>
          <div className="group-sub-info">ID: {record.id} · 更新于 {record.updatedAt}</div>
        </div>
      ),
    },
    {
      title: '广告位/头图',
      key: 'banners',
      width: 170,
      render: (_: unknown, record: ProductGroupConfig) => {
        if (!record.banners || record.banners.length === 0) {
          return <span style={{ color: '#bfbfbf' }}>未设置</span>
        }
        return (
          <div className="banner-preview-cell">
            <img src={record.banners[0].imageUrl} alt="banner" className="banner-thumb" />
            <div className="banner-meta">
              <span className="banner-count-badge">
                {record.banners.length > 1 ? `${record.banners.length}张轮播广告` : '1张静态头图'}
              </span>
              <span className="banner-jump-tag" title={record.banners[0].linkName}>
                <LinkOutlined /> {record.banners[0].linkType === 'NONE' ? '无跳转' : record.banners[0].linkName}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      title: '头部搜索框',
      dataIndex: 'showSearch',
      key: 'showSearch',
      width: 130,
      render: (show: boolean, record: ProductGroupConfig) => (
        show ? (
          <div>
            <Tag color="cyan">已启用</Tag>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              “{record.searchPlaceholder}”
            </div>
          </div>
        ) : (
          <Tag color="default">未显示</Tag>
        )
      ),
    },
    {
      title: '商品排序规则',
      dataIndex: 'goodsSortRule',
      key: 'goodsSortRule',
      width: 160,
      render: (sortRule: ProductSortType) => {
        const map: Record<ProductSortType, { label: string; color: string }> = {
          DEFAULT: { label: '🎯 综合推荐 (默认)', color: 'blue' },
          SALES_DESC: { label: '🔥 销量优先 (降序)', color: 'red' },
          NEWEST: { label: '✨ 新品优先 (上新)', color: 'green' },
          PRICE_ASC: { label: '💰 价格从低到高', color: 'cyan' },
          PRICE_DESC: { label: '💎 价格从高到低', color: 'purple' },
        }
        const item = map[sortRule] || map.DEFAULT
        return <Tag color={item.color}>{item.label}</Tag>
      },
    },
    {
      title: '商品排版',
      dataIndex: 'layoutStyle',
      key: 'layoutStyle',
      width: 110,
      render: (layout: string) => (
        <span style={{ fontSize: 12, color: '#595959', fontWeight: 500 }}>
          {layout === 'TWO_COLUMNS' ? '双列 (一行2个)' : '单列 (一行1个)'}
        </span>
      ),
    },
    {
      title: '商品数量',
      dataIndex: 'goodsCount',
      key: 'goodsCount',
      width: 90,
      render: (count: number) => (
        <a style={{ fontWeight: 600, color: '#1890ff' }}>
          {count || 18} 件
        </a>
      ),
    },
    {
      title: '分组排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      sorter: (a: ProductGroupConfig, b: ProductGroupConfig) => a.sort - b.sort,
      render: (val: number) => <Tag style={{ fontWeight: 600 }}>{val ?? 0}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: 'NORMAL' | 'DISABLED', record: ProductGroupConfig) => (
        <Switch
          checked={status === 'NORMAL'}
          checkedChildren="正常"
          unCheckedChildren="禁用"
          onChange={() => handleToggleStatus(record.id, status)}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 170,
      fixed: 'right' as const,
      render: (_: unknown, record: ProductGroupConfig) => (
        <Space size={12}>
          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => handleOpenEdit(record)}>
            修改
          </Button>
          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => message.info(`正在查看分组「${record.name}」商品列表`)}>
            查看商品
          </Button>
          <Popconfirm
            title="确认删除该商品分组？"
            description="删除后前端关联该分组的导航可能失效。"
            onConfirm={() => handleDeleteGroup(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger size="small" style={{ padding: 0 }}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="product-group-container">
      {/* 顶部主选项卡 (匹配截图顶栏) */}
      <div className="top-tab-navigation">
        {['菜单查询', '商品分组', '规格管理', '菜单评价', '检索报告', '菜单流转'].map((tab) => (
          <div
            key={tab}
            className={`top-nav-tab-item ${activeTopTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTopTab(tab)}
          >
            {tab}
            {tab === '商品分组' && <span className="active-dot" />}
          </div>
        ))}
      </div>

      {/* 业务提示浮条 */}
      <Alert
        className="group-alert-banner"
        message={
          <div className="alert-content">
            <InfoCircleOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: 16 }} />
            <span>
              可快速按商品类型、经营活动等节点自定义创建商品分组，实现商品分类管理，提升商品管理效率。
              <strong>现已升级：支持头部搜索框、轮播广告外链跳转、综合/销量/上新/价格商品排序、一行2个与一行1个排版切换、多种购买按钮样式。</strong>
            </span>
          </div>
        }
        type="info"
        showIcon={false}
      />

      {/* 主工作区卡片 */}
      <div className="group-content-card">
        {/* 筛选与搜索操作栏 */}
        <div className="filter-header-bar">
          <div className="filter-left-group">
            <Input
              placeholder="请输入分组名称"
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 220 }}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              style={{ width: 140 }}
              options={[
                { label: '状态: 全部', value: 'ALL' },
                { label: '状态: 正常', value: 'NORMAL' },
                { label: '状态: 禁用', value: 'DISABLED' },
              ]}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => message.success('筛选完成')}>
              查询
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchText('')
                setStatusFilter('ALL')
              }}
            >
              重置
            </Button>
          </div>

          <div className="filter-right-group">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenAdd}
              style={{ background: '#1890ff', borderColor: '#1890ff' }}
            >
              新增商品分组
            </Button>
          </div>
        </div>

        {/* 分组列表数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredGroups}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          className="product-group-table"
        />
      </div>

      {/* ====================================================================
          重构升级的配置弹窗 (MODAL - 带左右分栏高保真预览)
          ==================================================================== */}
      <Modal
        title={
          <div className="modal-header-title-bar">
            <div className="modal-title-left">
              <span className="modal-main-title">
                {isEditMode ? `修改商品分组「${currentEditing.name || '未命名'}」` : '新增商品分组'}
              </span>
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {versionView === 'NEW_DESIGN' ? '✨ 新版配置体验' : '🔄 旧版设计对比'}
              </Tag>
            </div>
            {/* 新旧版对比切换开关 */}
            <div className="modal-version-switch">
              <span className="switch-label">视图模式：</span>
              <Segmented
                value={versionView}
                onChange={(val) => setVersionView(val as 'NEW_DESIGN' | 'OLD_COMPARE')}
                options={[
                  { label: '✨ 新版设计稿', value: 'NEW_DESIGN' },
                  { label: '⏮️ 旧版配置对比', value: 'OLD_COMPARE' },
                ]}
              />
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveModal}
        width={1080}
        destroyOnClose
        maskClosable={false}
        okText="保存并发布"
        cancelText="取消"
        className="product-group-edit-modal"
      >
        <div className="modal-two-columns-layout">
          {/* =================== 左侧表单配置区 =================== */}
          <div className="modal-form-col">
            {versionView === 'OLD_COMPARE' ? (
              // 旧版样式对照区
              <div className="old-design-wrapper">
                <Alert
                  type="warning"
                  showIcon
                  message="这是调整前的旧版配置项结构："
                  description="存在排序字段太靠前、只有单张静态头图且无跳转链接、没有搜索框配置、缺失商品排序、右侧无商品展示等问题。"
                  style={{ marginBottom: 16 }}
                />
                <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                  <Form.Item label="* 分组名称" required>
                    <Input value={currentEditing.name} placeholder="例如：全场分组" disabled />
                  </Form.Item>
                  <Form.Item label="排序" extra="旧版排序在第2位，抢占核心视线">
                    <Input value={currentEditing.sort} style={{ width: 120 }} disabled />
                  </Form.Item>
                  <Form.Item label="头图" extra="图片宽度为800，高度不限（旧版仅支持单张静态图，无跳转）">
                    <div style={{ width: 80, height: 80, border: '1px dashed #d9d9d9', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                      <PictureOutlined style={{ fontSize: 24, color: '#bfbfbf' }} />
                    </div>
                  </Form.Item>
                  <Form.Item label="背景颜色">
                    <Input value={currentEditing.backgroundColor} style={{ width: 140 }} disabled />
                  </Form.Item>
                  <Form.Item label="状态">
                    <Radio.Group value={currentEditing.status} disabled>
                      <Radio value="NORMAL">正常</Radio>
                      <Radio value="DISABLED">禁用</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </div>
            ) : (
              // 新版结构化配置表单
              <Form
                form={form}
                layout="vertical"
                initialValues={currentEditing}
                onValuesChange={handleFormValuesChange}
                className="redesigned-group-form"
              >
                {/* 模块 1: 核心基础与头部展示 */}
                <div className="form-section-card">
                  <div className="section-card-header">
                    <span className="section-title-badge">1</span>
                    <span className="section-title">基础与头部展示配置</span>
                    <span className="section-desc">分组名称、搜索栏与顶部轮播广告</span>
                  </div>

                  <Form.Item
                    name="name"
                    label="分组名称"
                    rules={[{ required: true, message: '请输入商品分组名称' }]}
                    extra="建议控制在 2-10 个汉字以内，将展示在小程序/H5顶部导航与分组入口"
                  >
                    <Input placeholder="例如：全场热销爆款 / 当季新品首发" maxLength={20} showCount />
                  </Form.Item>

                  {/* 需求 1: 搜索框配置 (默认圆角胶囊) */}
                  <div className="sub-config-box highlight-box">
                    <div className="sub-config-header">
                      <div className="sub-header-left">
                        <SearchOutlined className="sub-icon" />
                        <span className="sub-title">页面搜索框配置</span>
                        <Tag color="cyan">默认圆角胶囊</Tag>
                      </div>
                      <Form.Item name="showSearch" valuePropName="checked" noStyle>
                        <Switch checkedChildren="显示搜索框" unCheckedChildren="隐藏" />
                      </Form.Item>
                    </div>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, cur) => prev.showSearch !== cur.showSearch}
                    >
                      {({ getFieldValue }) =>
                        getFieldValue('showSearch') && (
                          <div className="sub-config-body">
                            <Form.Item
                              name="searchPlaceholder"
                              label="搜索框占位提示语"
                              style={{ marginBottom: 6 }}
                            >
                              <Input placeholder="例如：搜索本组精选好物..." maxLength={20} />
                            </Form.Item>
                            <div className="tip-text">
                              💡 默认采用圆角胶囊样式置顶呈现，买家可快速搜索本组商品。
                            </div>
                          </div>
                        )
                      }
                    </Form.Item>
                  </div>

                  {/* 需求 2: 头图升级到轮播广告 (默认速度无需配置，支持跳转) */}
                  <div className="sub-config-box" style={{ marginTop: 16 }}>
                    <div className="sub-config-header">
                      <div className="sub-header-left">
                        <PictureOutlined className="sub-icon" />
                        <span className="sub-title">顶部轮播广告 (原头图升级)</span>
                        <Tag color="orange">支持跳转链接</Tag>
                      </div>
                      <Button
                        type="dashed"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddOrEditBanner()}
                        disabled={currentEditing.banners.length >= 5}
                      >
                        添加广告图 ({currentEditing.banners.length}/5)
                      </Button>
                    </div>

                    <div className="banner-list-container">
                      {currentEditing.banners.length === 0 ? (
                        <div className="empty-banner-tip">
                          <span>暂未添加轮播广告，前台将直接展示商品列表。</span>
                          <Button type="link" size="small" onClick={() => handleAddOrEditBanner()}>
                            + 立即添加第 1 张轮播图
                          </Button>
                        </div>
                      ) : (
                        <div className="banner-items-list">
                          {currentEditing.banners.map((item, index) => (
                            <div key={item.id} className="banner-config-item">
                              <span className="banner-drag-index">{index + 1}</span>
                              <img src={item.imageUrl} alt="banner" className="item-thumb" />
                              <div className="item-details">
                                <div className="item-title-row">
                                  <span className="item-title">{item.title || `广告位 ${index + 1}`}</span>
                                </div>
                                <div className="item-link-row">
                                  <span className="link-badge">
                                    <LinkOutlined /> {item.linkName || '未设置跳转'}
                                  </span>
                                </div>
                              </div>
                              <div className="item-actions">
                                <Tooltip title="上移">
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<ArrowUpOutlined />}
                                    disabled={index === 0}
                                    onClick={() => handleMoveBanner(index, 'UP')}
                                  />
                                </Tooltip>
                                <Tooltip title="下移">
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<ArrowDownOutlined />}
                                    disabled={index === currentEditing.banners.length - 1}
                                    onClick={() => handleMoveBanner(index, 'DOWN')}
                                  />
                                </Tooltip>
                                <Tooltip title="编辑链接/图片">
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => handleAddOrEditBanner(index)}
                                  />
                                </Tooltip>
                                <Tooltip title="删除">
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteBanner(index)}
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 模块 2: 商品排序与展示规则 (排版保留一行2与一行1) */}
                <div className="form-section-card" style={{ marginTop: 16 }}>
                  <div className="section-card-header">
                    <span className="section-title-badge">2</span>
                    <span className="section-title">商品排序与展示排版</span>
                    <span className="section-desc">排序规则、双列/单列排版与购买按钮</span>
                  </div>

                  {/* 默认商品排序规则 (默认综合推荐) */}
                  <Form.Item
                    name="goodsSortRule"
                    label="默认商品排序规则"
                    rules={[{ required: true }]}
                    extra="默认采用综合推荐（后台运营权重优先）"
                  >
                    <Select
                      options={[
                        { label: '🎯 综合推荐 (默认·后台运营权重优先)', value: 'DEFAULT' },
                        { label: '🔥 销量优先 (从高到低·爆款优先)', value: 'SALES_DESC' },
                        { label: '✨ 新品优先 (上新时间倒序·尝鲜优先)', value: 'NEWEST' },
                        { label: '💰 价格由低到高 (引流促销优先)', value: 'PRICE_ASC' },
                        { label: '💎 价格由高到低 (品质客单价优先)', value: 'PRICE_DESC' },
                      ]}
                    />
                  </Form.Item>

                  {/* 商品排版样式 (保留一行二和一行一) */}
                  <Form.Item
                    name="layoutStyle"
                    label="商品列表排版样式"
                    rules={[{ required: true }]}
                    style={{ marginBottom: 16 }}
                  >
                    <Radio.Group style={{ width: '100%' }}>
                      <Row gutter={12}>
                        <Col span={12}>
                          <Radio.Button value="TWO_COLUMNS" className="layout-radio-btn">
                            <div className="layout-btn-content">
                              <div className="layout-title">
                                <AppstoreOutlined /> 一行 2 个 (双列 1:1 正方形图)
                                <Tag color="green" style={{ marginLeft: 4 }}>推荐</Tag>
                              </div>
                              <div className="layout-desc">主流电商标准，高屏效与视觉兼备</div>
                            </div>
                          </Radio.Button>
                        </Col>
                        <Col span={12}>
                          <Radio.Button value="ONE_COLUMN" className="layout-radio-btn">
                            <div className="layout-btn-content">
                              <div className="layout-title">
                                <BarsOutlined /> 一行 1 个 (单列 1:1 正方形大图)
                              </div>
                              <div className="layout-desc">直接沿用商品主图，无需单独维护长图</div>
                            </div>
                          </Radio.Button>
                        </Col>
                      </Row>
                    </Radio.Group>
                  </Form.Item>

                  {/* 购买按钮多种样式选择 */}
                  <Form.Item
                    name="cartBtnStyle"
                    label="购买按钮样式"
                    rules={[{ required: true }]}
                    extra="自定义商品卡片右下角的操作按钮"
                  >
                    <Radio.Group style={{ width: '100%' }}>
                      <Row gutter={[12, 12]}>
                        <Col span={12}>
                          <Radio.Button value="PLUS_ICON" className="btn-style-radio-card">
                            <div className="btn-style-content">
                              <span className="btn-icon-sample plus-badge">+</span>
                              <div>
                                <div className="style-title">加号图标 (+)</div>
                                <div className="style-desc">极简圆钮，轻量快捷加购</div>
                              </div>
                            </div>
                          </Radio.Button>
                        </Col>
                        <Col span={12}>
                          <Radio.Button value="CART_ICON" className="btn-style-radio-card">
                            <div className="btn-style-content">
                              <span className="btn-icon-sample cart-badge">
                                <ShoppingCartOutlined />
                              </span>
                              <div>
                                <div className="style-title">购物车图标</div>
                                <div className="style-desc">经典超市购物车徽标</div>
                              </div>
                            </div>
                          </Radio.Button>
                        </Col>
                        <Col span={12}>
                          <Radio.Button value="SPEC_BTN" className="btn-style-radio-card">
                            <div className="btn-style-content">
                              <span className="btn-pill-sample spec">选规格</span>
                              <div>
                                <div className="style-title">选规格胶囊按钮</div>
                                <div className="style-desc">引导多规格选配（火锅/生鲜）</div>
                              </div>
                            </div>
                          </Radio.Button>
                        </Col>
                        <Col span={12}>
                          <Radio.Button value="BUY_BTN" className="btn-style-radio-card">
                            <div className="btn-style-content">
                              <span className="btn-pill-sample buy">
                                <ShoppingOutlined style={{ marginRight: 2 }} /> 抢购
                              </span>
                              <div>
                                <div className="style-title">立即购买 / 抢购胶囊</div>
                                <div className="style-desc">强促销感，提升下单转化</div>
                              </div>
                            </div>
                          </Radio.Button>
                        </Col>
                        <Col span={24}>
                          <Radio.Button value="NONE" className="btn-style-radio-card" style={{ height: 38 }}>
                            <div className="btn-style-content" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 13, color: '#8c8c8c' }}>🚫 不显示购买按钮</span>
                              <span style={{ fontSize: 12, color: '#8c8c8c' }}>（纯陈列展示模式）</span>
                            </div>
                          </Radio.Button>
                        </Col>
                      </Row>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item name="showOriginPrice" label="显示划线原价" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Switch checkedChildren="显示划线价" unCheckedChildren="隐藏" />
                  </Form.Item>
                </div>

                {/* 模块 3: 弱化排序字段，下移至高级与属性配置 */}
                <div className="form-section-card secondary-section" style={{ marginTop: 16 }}>
                  <div className="section-card-header">
                    <span className="section-title-badge de-emp">3</span>
                    <span className="section-title">高级属性与页面样式 (已弱化排序)</span>
                    <span className="section-desc">分组权重、背景色及启用状态</span>
                  </div>

                  <Row gutter={16}>
                    <Col span={8}>
                      {/* 弱化排序字段 */}
                      <Form.Item
                        name="sort"
                        label="分组排序 (权重值)"
                        extra="数字越小越靠前，默认 0"
                        tooltip="用于控制该商品分组在店铺前台分组Tab或列表中的显示次序"
                      >
                        <InputNumber min={0} max={9999} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="backgroundColor" label="页面背景色">
                        <Input
                          type="color"
                          style={{ width: '100%', height: 32, padding: 2, cursor: 'pointer' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="status" label="分组启用状态">
                        <Radio.Group>
                          <Radio value="NORMAL">正常展示</Radio>
                          <Radio value="DISABLED">暂停下发</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Form>
            )}
          </div>

          {/* =================== 右侧高保真手机预览区 (双列/单列商品流) =================== */}
          <div className="modal-preview-col">
            <div className="preview-header-bar">
              <div className="preview-title">
                <MobileOutlined /> 移动端前台实时效果预览
              </div>
              <Tag color="processing" bordered={false}>
                iPhone 16 Pro · 375×812
              </Tag>
            </div>

            {/* 手机外壳 */}
            <div className="phone-device-wrapper">
              <div className="phone-notch">
                <div className="dynamic-island" />
              </div>

              {/* 手机内部屏幕 */}
              <div
                className="phone-screen-container"
                style={{ backgroundColor: currentEditing.backgroundColor || '#F7F8FA' }}
              >
                {/* 顶部状态栏 */}
                <div className="phone-status-bar">
                  <span className="phone-time">09:41</span>
                  <div className="phone-signals">
                    <span className="signal-icon">5G</span>
                    <div className="battery-icon">
                      <div className="battery-level" />
                    </div>
                  </div>
                </div>

                {/* 小程序/H5 导航头 */}
                <div className="phone-nav-bar">
                  <LeftOutlined className="nav-back-icon" />
                  <span className="nav-page-title">{currentEditing.name || '商品分组'}</span>
                  <div className="nav-capsule">
                    <span>···</span>
                    <span className="capsule-divider">|</span>
                    <span className="capsule-circle">◎</span>
                  </div>
                </div>

                {/* 手机主体滚动流 */}
                <div className="phone-scroll-body">
                  {/* 需求 1 预览: 顶部默认圆角胶囊搜索框 */}
                  {currentEditing.showSearch && (
                    <div className="phone-search-section style-capsule">
                      <div className="phone-search-box">
                        <SearchOutlined className="search-icon" />
                        <input
                          type="text"
                          className="search-input-mock"
                          placeholder={currentEditing.searchPlaceholder || '搜索本组精选好物...'}
                          value={previewSearchInput}
                          onChange={(e) => setPreviewSearchInput(e.target.value)}
                        />
                        {previewSearchInput && (
                          <span className="clear-search-btn" onClick={() => setPreviewSearchInput('')}>
                            ×
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 需求 2 预览: 顶部轮播广告 (默认平滑轮播与指示点) */}
                  {currentEditing.banners && currentEditing.banners.length > 0 ? (
                    <div className="phone-carousel-section">
                      <div className="carousel-inner-box">
                        <img
                          src={currentEditing.banners[previewActiveBannerIndex]?.imageUrl || currentEditing.banners[0].imageUrl}
                          alt="banner"
                          className="carousel-active-image"
                        />

                        {/* 跳转链接浮标 */}
                        {currentEditing.banners[previewActiveBannerIndex]?.linkType !== 'NONE' && (
                          <div className="banner-jump-hint" onClick={() => message.info(`[演示] 点击将跳转至：${currentEditing.banners[previewActiveBannerIndex]?.linkName}`)}>
                            <LinkOutlined /> {currentEditing.banners[previewActiveBannerIndex]?.linkName} <RightOutlined style={{ fontSize: 10 }} />
                          </div>
                        )}

                        {/* 左右手势切换箭头 (悬停时) */}
                        {currentEditing.banners.length > 1 && (
                          <>
                            <div
                              className="carousel-arrow arrow-left"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewActiveBannerIndex((prev) =>
                                  prev - 1 < 0 ? currentEditing.banners.length - 1 : prev - 1,
                                )
                              }}
                            >
                              ‹
                            </div>
                            <div
                              className="carousel-arrow arrow-right"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewActiveBannerIndex((prev) =>
                                  prev + 1 >= currentEditing.banners.length ? 0 : prev + 1,
                                )
                              }}
                            >
                              ›
                            </div>
                          </>
                        )}

                        {/* 经典圆点指示器 */}
                        {currentEditing.banners.length > 1 && (
                          <div className="carousel-indicators type-dots">
                            {currentEditing.banners.map((_, idx) => (
                              <span
                                key={idx}
                                className={`indicator-dot ${previewActiveBannerIndex === idx ? 'active' : ''}`}
                                onClick={() => setPreviewActiveBannerIndex(idx)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* 商品卡片流 (支持一行2个与一行1个，纯净无销量，严格按后台排序规则展示) */}
                  <div className="phone-goods-section">
                    {currentEditing.layoutStyle === 'TWO_COLUMNS' ? (
                      // 一行 2 个 (双列瀑布流)
                      <div className="goods-grid-two-columns">
                        {displayedPreviewGoods.map((item) => (
                          <div key={item.id} className="goods-card-item">
                            <div className="goods-img-wrapper">
                              <img src={item.image} alt={item.title} className="goods-main-img" />
                              {item.tag && (
                                <span className="goods-corner-tag" style={{ backgroundColor: item.tagColor || '#ff4d4f' }}>
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <div className="goods-info-box">
                              <div className="goods-title-text" title={item.title}>
                                {item.title}
                              </div>
                              <div className="goods-bottom-row">
                                <div className="price-group">
                                  <span className="currency-symbol">¥</span>
                                  <span className="price-num">{item.price.toFixed(2)}</span>
                                  {currentEditing.showOriginPrice && item.originPrice && (
                                    <span className="origin-price-num">¥{item.originPrice.toFixed(2)}</span>
                                  )}
                                </div>

                                {/* 多样化购买按钮 */}
                                {currentEditing.cartBtnStyle === 'PLUS_ICON' && (
                                  <button
                                    className="add-cart-btn-plus"
                                    title="加购"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      message.success(`已添加「${item.title.substring(0, 8)}...」到购物车`)
                                    }}
                                  >
                                    <PlusOutlined />
                                  </button>
                                )}

                                {currentEditing.cartBtnStyle === 'CART_ICON' && (
                                  <button
                                    className="add-cart-btn-icon"
                                    title="购物车"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      message.success(`已加购「${item.title.substring(0, 8)}...」`)
                                    }}
                                  >
                                    <ShoppingCartOutlined />
                                  </button>
                                )}

                                {currentEditing.cartBtnStyle === 'SPEC_BTN' && (
                                  <button
                                    className="add-cart-btn-pill spec"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      message.success(`已打开「${item.title.substring(0, 8)}...」规格选择`)
                                    }}
                                  >
                                    选规格
                                  </button>
                                )}

                                {currentEditing.cartBtnStyle === 'BUY_BTN' && (
                                  <button
                                    className="add-cart-btn-pill buy"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      message.success(`正在抢购「${item.title.substring(0, 8)}...」`)
                                    }}
                                  >
                                    <ShoppingOutlined style={{ marginRight: 2 }} /> 抢购
                                  </button>
                                )}

                                {currentEditing.cartBtnStyle === 'NONE' && null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // 一行 1 个 (单列大图横排)
                      <div className="goods-grid-one-column">
                        {displayedPreviewGoods.map((item) => (
                          <div key={item.id} className="goods-card-one-col-item">
                            <div className="one-col-img-wrapper">
                              <img src={item.image} alt={item.title} className="one-col-main-img" />
                              {item.tag && (
                                <span className="goods-corner-tag" style={{ backgroundColor: item.tagColor || '#ff4d4f' }}>
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <div className="one-col-info-box">
                              <div className="one-col-title-text" title={item.title}>
                                {item.title}
                              </div>
                              <div className="goods-bottom-row" style={{ marginTop: 'auto' }}>
                                <div className="price-group">
                                  <span className="currency-symbol">¥</span>
                                  <span className="price-num" style={{ fontSize: 16 }}>{item.price.toFixed(2)}</span>
                                  {currentEditing.showOriginPrice && item.originPrice && (
                                    <span className="origin-price-num">¥{item.originPrice.toFixed(2)}</span>
                                  )}
                                </div>

                                {currentEditing.cartBtnStyle === 'PLUS_ICON' && (
                                  <button
                                    className="add-cart-btn-plus"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      message.success(`已添加「${item.title.substring(0, 8)}...」到购物车`)
                                    }}
                                  >
                                    <PlusOutlined />
                                  </button>
                                )}

                                {currentEditing.cartBtnStyle === 'CART_ICON' && (
                                  <button
                                    className="add-cart-btn-icon"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      message.success(`已加购「${item.title.substring(0, 8)}...」`)
                                    }}
                                  >
                                    <ShoppingCartOutlined />
                                  </button>
                                )}

                                {currentEditing.cartBtnStyle === 'SPEC_BTN' && (
                                  <button
                                    className="add-cart-btn-pill spec"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      message.success(`已打开「${item.title.substring(0, 8)}...」规格选择`)
                                    }}
                                  >
                                    选规格
                                  </button>
                                )}

                                {currentEditing.cartBtnStyle === 'BUY_BTN' && (
                                  <button
                                    className="add-cart-btn-pill buy"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      message.success(`正在抢购「${item.title.substring(0, 8)}...」`)
                                    }}
                                  >
                                    <ShoppingOutlined style={{ marginRight: 2 }} /> 抢购
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* ====================================================================
          轮播广告单项配置子弹窗 (带跳转选择器)
          ==================================================================== */}
      <Modal
        title={editingBannerIndex !== null ? `编辑第 ${editingBannerIndex + 1} 张轮播广告` : '添加轮播广告'}
        open={isBannerModalOpen}
        onCancel={() => setIsBannerModalOpen(false)}
        onOk={handleSaveBanner}
        width={560}
        destroyOnClose
        okText="确认添加"
        cancelText="取消"
      >
        <Form form={bannerForm} layout="vertical">
          <Form.Item
            name="imageUrl"
            label="广告图片链接 / 上传"
            rules={[{ required: true, message: '请提供图片链接或上传图片' }]}
            extra="建议尺寸：750×320px 或 800×360px，支持 JPG、PNG、GIF"
          >
            <Input placeholder="输入图片 URL 或选择默认海报图" />
          </Form.Item>

          {/* 预设海报图片快捷选择 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>快捷选用高清素材模板：</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: '火锅狂欢节', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80' },
                { label: '领券满减', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80' },
                { label: '鲜脆毛肚', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80' },
              ].map((tpl) => (
                <Button
                  key={tpl.label}
                  size="small"
                  onClick={() => bannerForm.setFieldValue('imageUrl', tpl.url)}
                >
                  {tpl.label}
                </Button>
              ))}
            </div>
          </div>

          <Form.Item name="title" label="广告描述/标题" extra="仅在后台用于管理识别">
            <Input placeholder="例如：限时满减大促海报" />
          </Form.Item>

          <Form.Item
            name="linkType"
            label="点击跳转类型"
            rules={[{ required: true }]}
            initialValue="GOODS"
          >
            <Select
              options={[
                { label: '🛍️ 指定商品详情', value: 'GOODS' },
                { label: '📑 其他商品分组', value: 'GROUP' },
                { label: '🎁 营销活动 / 专题微页面', value: 'ACTIVITY' },
                { label: '🔗 自定义外部链接 (H5/小程序)', value: 'CUSTOM_URL' },
                { label: '🚫 不跳转 (仅海报展示)', value: 'NONE' },
              ]}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.linkType !== cur.linkType}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('linkType')
              if (type === 'GOODS') {
                return (
                  <Form.Item name="linkName" label="选择目标商品" rules={[{ required: true }]}>
                    <Select
                      placeholder="请选择商品"
                      options={[
                        { label: '【热销爆款】一次过瘾4盒甄选原切肉卷超值组合', value: '【商品】4盒肉卷套餐' },
                        { label: '【现捞鲜切】脆嫩大刀鲜毛肚 净重250g', value: '【商品】脆嫩大刀鲜毛肚' },
                        { label: '【手打纯虾】95%纯虾肉爆汁手打鲜虾滑', value: '【商品】手打鲜虾滑' },
                      ]}
                    />
                  </Form.Item>
                )
              }
              if (type === 'GROUP') {
                return (
                  <Form.Item name="linkName" label="选择跳转商品分组" rules={[{ required: true }]}>
                    <Select
                      placeholder="请选择分组"
                      options={[
                        { label: '全场热销爆款', value: '【分组】全场热销爆款' },
                        { label: '当季新品首发专区', value: '【分组】当季新品专区' },
                        { label: '超值特惠与凑单专区', value: '【分组】超值特惠专区' },
                      ]}
                    />
                  </Form.Item>
                )
              }
              if (type === 'ACTIVITY') {
                return (
                  <Form.Item name="linkName" label="选择营销活动" rules={[{ required: true }]}>
                    <Select
                      placeholder="请选择活动或微页面"
                      options={[
                        { label: '【领券中心】全场满199减40元神券限量抢', value: '【活动】限时领券中心' },
                        { label: '【新人特惠】首单立减15元尝鲜', value: '【活动】新人首单特惠' },
                        { label: '【积分商城】积分兑换超值饮品券', value: '【活动】积分商城兑换' },
                      ]}
                    />
                  </Form.Item>
                )
              }
              if (type === 'CUSTOM_URL') {
                return (
                  <Form.Item
                    name="linkName"
                    label="输入自定义链接 (URL)"
                    rules={[{ required: true, message: '请输入有效链接' }]}
                  >
                    <Input placeholder="https://..." />
                  </Form.Item>
                )
              }
              return null
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductGroupManager
