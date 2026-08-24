import React, { useState, useRef, useMemo } from 'react'
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
  Drawer,
  Alert,
  Card,
  Row,
  Col,
  Checkbox,
  Divider,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  PictureOutlined,
  AppstoreOutlined,
  LinkOutlined,
  QuestionCircleOutlined,
  ShareAltOutlined,
  InfoCircleOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import './CategoryManager.css'

// ============================================================================
// 类型定义
// ============================================================================

export interface HotspotItem {
  id: string
  x: number // 百分比 0 ~ 100
  y: number
  width: number
  height: number
  linkType: 'GOODS' | 'CATEGORY' | 'MICRO_PAGE' | 'COUPON' | 'CUSTOM'
  linkName: string
  targetId?: string
}

export interface BannerItem {
  id: string
  imageUrl: string
  linkType: string
  linkName: string
}

export interface CategoryNode {
  id: string
  name: string
  level: 1 | 2 | 3
  parentId: string | null
  sort: number
  status: 'SHOW' | 'HIDE'
  remark?: string
  goodsCount?: number // 二级分类直接维护商品数
  // 一级分类专用
  displayType?: 'DEFAULT' | 'HOTSPOT_IMAGE'
  banners?: BannerItem[]
  hotspotConfig?: {
    imageUrl: string
    hotspots: HotspotItem[]
  }
  // 三级分类专用 (仅在多级分类网格模式下生效)
  icon?: string
  linkInfo?: {
    linkType: 'BACKEND_CAT' | 'GOODS_LIST' | 'MICRO_PAGE' | 'ACTIVITY'
    linkName: string
  }
  children?: CategoryNode[]
}

// 模拟商品数据
const MOCK_GOODS = [
  {
    id: 'g1',
    title: '【大口吃肉】一次过瘾4盒肉卷+虾滑超值套餐',
    price: 97.4,
    originPrice: 158.0,
    sales: 1240,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'g2',
    title: '【闭眼入】优质毛肚荤素畅享套餐1套',
    price: 113.4,
    originPrice: 195.0,
    sales: 890,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'g3',
    title: '毛肚自由火锅6人套餐1套 精选鲜毛肚',
    price: 147.0,
    originPrice: 228.0,
    sales: 430,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=80',
  },
]

// 初始类目树数据 (排序严格按同级比较规范化)
const INITIAL_CATEGORIES: CategoryNode[] = [
  {
    id: 'c1',
    name: '美妆护肤',
    level: 1,
    parentId: null,
    sort: 1,
    status: 'SHOW',
    displayType: 'HOTSPOT_IMAGE',
    remark: '当季主推美妆海报热区',
    hotspotConfig: {
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
      hotspots: [
        {
          id: 'sp_1',
          x: 10,
          y: 15,
          width: 80,
          height: 35,
          linkType: 'GOODS',
          linkName: '雅诗兰黛小棕瓶精华 50ml',
          targetId: 'g101',
        },
        {
          id: 'sp_2',
          x: 10,
          y: 55,
          width: 80,
          height: 35,
          linkType: 'CATEGORY',
          linkName: '口红专区 · 热卖色号',
          targetId: 'c2_1',
        },
      ],
    },
    children: [
      {
        id: 'c1_1',
        name: '香水彩妆',
        level: 2,
        parentId: 'c1',
        sort: 1,
        status: 'SHOW',
        goodsCount: 54,
        children: [
          {
            id: 'c1_1_1',
            name: '女士香水',
            level: 3,
            parentId: 'c1_1',
            sort: 1,
            status: 'SHOW',
            icon: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=120&auto=format&fit=crop&q=80',
            linkInfo: {
              linkType: 'BACKEND_CAT',
              linkName: '后台类目: 女士香水',
            },
          },
          {
            id: 'c1_1_2',
            name: '花漾甜心',
            level: 3,
            parentId: 'c1_1',
            sort: 2,
            status: 'SHOW',
            icon: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=120&auto=format&fit=crop&q=80',
            linkInfo: {
              linkType: 'BACKEND_CAT',
              linkName: '后台类目: 限量花香调',
            },
          },
        ],
      },
      {
        id: 'c1_2',
        name: '面部护肤',
        level: 2,
        parentId: 'c1',
        sort: 2,
        status: 'SHOW',
        goodsCount: 38,
        children: [
          {
            id: 'c1_2_1',
            name: '补水乳液',
            level: 3,
            parentId: 'c1_2',
            sort: 1,
            status: 'SHOW',
            icon: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&auto=format&fit=crop&q=80',
            linkInfo: {
              linkType: 'BACKEND_CAT',
              linkName: '后台类目: 基础水乳',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    name: '当季新品',
    level: 1,
    parentId: null,
    sort: 2,
    status: 'SHOW',
    displayType: 'DEFAULT',
    remark: '服装新品多级分类',
    banners: [
      {
        id: 'b1',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
        linkType: 'MICRO_PAGE',
        linkName: '2026早春上新专题页',
      },
    ],
    children: [
      {
        id: 'c2_1',
        name: '25早春新品',
        level: 2,
        parentId: 'c2',
        sort: 1,
        status: 'SHOW',
        goodsCount: 106,
        children: [
          {
            id: 'c2_1_1',
            name: '早春连衣裙',
            level: 3,
            parentId: 'c2_1',
            sort: 1,
            status: 'SHOW',
            icon: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=80',
            linkInfo: {
              linkType: 'BACKEND_CAT',
              linkName: '后台类目: 连衣裙',
            },
          },
          {
            id: 'c2_1_2',
            name: '气质风衣',
            level: 3,
            parentId: 'c2_1',
            sort: 2,
            status: 'SHOW',
            icon: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
            linkInfo: {
              linkType: 'BACKEND_CAT',
              linkName: '后台类目: 风衣外套',
            },
          },
          {
            id: 'c2_1_3',
            name: '针织开衫',
            level: 3,
            parentId: 'c2_1',
            sort: 3,
            status: 'SHOW',
            icon: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&auto=format&fit=crop&q=80',
            linkInfo: {
              linkType: 'BACKEND_CAT',
              linkName: '后台类目: 针织衫',
            },
          },
        ],
      },
      {
        id: 'c2_2',
        name: '经典风格',
        level: 2,
        parentId: 'c2',
        sort: 2,
        status: 'SHOW',
        goodsCount: 22,
        children: [
          {
            id: 'c2_2_1',
            name: '通勤西装',
            level: 3,
            parentId: 'c2_2',
            sort: 1,
            status: 'SHOW',
            icon: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&auto=format&fit=crop&q=80',
            linkInfo: {
              linkType: 'BACKEND_CAT',
              linkName: '后台类目: 西装套装',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'c3',
    name: '热销爆款',
    level: 1,
    parentId: null,
    sort: 3,
    status: 'SHOW',
    displayType: 'DEFAULT',
    remark: '餐饮平铺快购',
    banners: [
      {
        id: 'b3',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
        linkType: 'MICRO_PAGE',
        linkName: '金秋进补·限时大促',
      },
    ],
    children: [
      {
        id: 'c3_1',
        name: '经典套餐',
        level: 2,
        parentId: 'c3',
        sort: 1,
        status: 'SHOW',
        goodsCount: 18,
      },
      {
        id: 'c3_2',
        name: '火锅单品',
        level: 2,
        parentId: 'c3',
        sort: 2,
        status: 'SHOW',
        goodsCount: 30,
      },
    ],
  },
  {
    id: 'c4',
    name: '数码家电',
    level: 1,
    parentId: null,
    sort: 4,
    status: 'SHOW',
    displayType: 'DEFAULT',
    remark: '数码好物',
    banners: [],
    children: [],
  },
]

export default function CategoryManager() {
  // 当前顶层 Tab: 'front' (前台类目) | 'decoration' (分类装修) | 'backend' (后台类目)
  const [activeTab, setActiveTab] = useState<'front' | 'decoration' | 'backend'>('front')

  // 状态数据
  const [categories, setCategories] = useState<CategoryNode[]>(INITIAL_CATEGORIES)
  const [searchText, setSearchText] = useState('')
  const [selectedMobileCatId, setSelectedMobileCatId] = useState<string>('c1')

  // 分类装修全局配置
  const [templateStyle, setTemplateStyle] = useState<'MULTI_GRID' | 'GOODS_FLAT'>('GOODS_FLAT')
  const [showOriginPrice, setShowOriginPrice] = useState(true)
  const [showBuyBtn, setShowBuyBtn] = useState(true)
  const [buyBtnStyle, setBuyBtnStyle] = useState<'cart' | 'plus'>('cart')
  const [shareTitle, setShareTitle] = useState('分类')
  const [shareImgType, setShareImgType] = useState<'auto' | 'custom'>('custom')

  // 弹窗状态
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingNode, setEditingNode] = useState<Partial<CategoryNode> | null>(null)
  const [isAddMode, setIsAddMode] = useState(false)
  const [form] = Form.useForm()

  // 抽屉说明与商品管理抽屉
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isGoodsDrawerVisible, setIsGoodsDrawerVisible] = useState(false)
  const [currentManagingCat, setCurrentManagingCat] = useState<CategoryNode | null>(null)
  const [managingGoodsList, setManagingGoodsList] = useState(MOCK_GOODS)

  // 链接选择弹窗
  const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(false)
  const [activeHotspotIdForLink, setActiveHotspotIdForLink] = useState<string | null>(null)

  // 热区画板交互状态
  const [currentHotspots, setCurrentHotspots] = useState<HotspotItem[]>([])
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // ============================================================================
  // 树数据操作辅助函数
  // ============================================================================

  // 递归查找节点
  const findNode = (nodes: CategoryNode[], id: string): CategoryNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  // 递归更新节点
  const updateNodeInTree = (
    nodes: CategoryNode[],
    id: string,
    updater: (n: CategoryNode) => CategoryNode
  ): CategoryNode[] => {
    return nodes.map((node) => {
      if (node.id === id) {
        return updater(node)
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeInTree(node.children, id, updater),
        }
      }
      return node
    })
  }

  // 递归添加子节点
  const addChildToTree = (
    nodes: CategoryNode[],
    parentId: string,
    newNode: CategoryNode
  ): CategoryNode[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
        }
      }
      if (node.children) {
        return {
          ...node,
          children: addChildToTree(node.children, parentId, newNode),
        }
      }
      return node
    })
  }

  // 递归删除节点
  const deleteNodeFromTree = (nodes: CategoryNode[], id: string): CategoryNode[] => {
    return nodes
      .filter((node) => node.id !== id)
      .map((node) => {
        if (node.children) {
          return {
            ...node,
            children: deleteNodeFromTree(node.children, id),
          }
        }
        return node
      })
  }

  // 获取用于级联下拉的上级分类选项
  const parentCategoryOptions = useMemo(() => {
    const options: { label: string; value: string; level: number }[] = [
      { label: '无（作为一级分类）', value: 'ROOT', level: 0 },
    ]
    categories.forEach((cat1) => {
      options.push({ label: `[一级] ${cat1.name}`, value: cat1.id, level: 1 })
      cat1.children?.forEach((cat2) => {
        options.push({ label: `  └─ [二级] ${cat1.name} / ${cat2.name}`, value: cat2.id, level: 2 })
      })
    })
    return options
  }, [categories])

  // ============================================================================
  // 弹窗与热区交互逻辑
  // ============================================================================

  // 打开新增一级分类弹窗
  const handleAddNewRoot = () => {
    setIsAddMode(true)
    setEditingNode({
      level: 1,
      parentId: null,
      sort: categories.length + 1,
      status: 'SHOW',
      displayType: 'DEFAULT',
      banners: [],
      hotspotConfig: {
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
        hotspots: [],
      },
    })
    setCurrentHotspots([])
    form.setFieldsValue({
      name: '',
      parentId: 'ROOT',
      sort: categories.length + 1,
      displayType: 'DEFAULT',
      status: 'SHOW',
      remark: '',
    })
    setIsModalVisible(true)
  }

  // 行内点击 "+ 添加子分类"（自动锁定当前行为上级）
  const handleAddChild = (parent: CategoryNode) => {
    setIsAddMode(true)
    const newLevel = (parent.level + 1) as 2 | 3
    const newSort = (parent.children?.length || 0) + 1

    setEditingNode({
      level: newLevel,
      parentId: parent.id,
      sort: newSort,
      status: 'SHOW',
      linkInfo: undefined,
    })
    setCurrentHotspots([])
    form.setFieldsValue({
      name: '',
      parentId: parent.id,
      sort: newSort,
      status: 'SHOW',
      remark: '',
      icon: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=120&auto=format&fit=crop&q=80',
    })
    setIsModalVisible(true)
  }

  // 点击“编辑”
  const handleEditNode = (record: CategoryNode) => {
    setIsAddMode(false)
    setEditingNode(record)
    if (record.hotspotConfig?.hotspots) {
      setCurrentHotspots(record.hotspotConfig.hotspots)
    } else {
      setCurrentHotspots([])
    }

    form.setFieldsValue({
      name: record.name,
      parentId: record.parentId || 'ROOT',
      sort: record.sort,
      status: record.status,
      displayType: record.displayType || 'DEFAULT',
      remark: record.remark || '',
      icon: record.icon,
    })
    setIsModalVisible(true)
  }

  // 保存弹窗表单
  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields()
      const parentId = values.parentId === 'ROOT' ? null : values.parentId

      // 确定层级
      let level: 1 | 2 | 3 = 1
      if (parentId) {
        const pNode = findNode(categories, parentId)
        if (pNode) {
          level = (pNode.level + 1) as 2 | 3
        }
      }

      const nodeData: CategoryNode = {
        id: isAddMode ? `c_${Date.now()}` : (editingNode?.id as string),
        name: values.name,
        level,
        parentId,
        sort: values.sort,
        status: values.status,
        remark: values.remark,
        goodsCount: level === 2 ? (editingNode?.goodsCount || 0) : undefined,
        displayType: level === 1 ? values.displayType : undefined,
        banners: level === 1 && values.displayType === 'DEFAULT' ? editingNode?.banners || [
          {
            id: 'b_new',
            imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
            linkType: 'MICRO_PAGE',
            linkName: '精品活动专区',
          }
        ] : undefined,
        hotspotConfig:
          level === 1 && values.displayType === 'HOTSPOT_IMAGE'
            ? {
                imageUrl:
                  editingNode?.hotspotConfig?.imageUrl ||
                  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
                hotspots: currentHotspots,
              }
            : undefined,
        icon: level === 3 ? (values.icon || editingNode?.icon || 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=120&auto=format&fit=crop&q=80') : undefined,
        linkInfo: level === 3 ? (editingNode?.linkInfo || {
          linkType: 'BACKEND_CAT',
          linkName: `后台类目: ${values.name}`,
        }) : undefined,
        children: editingNode?.children || [],
      }

      if (isAddMode) {
        if (!parentId) {
          setCategories([...categories, nodeData])
        } else {
          setCategories(addChildToTree(categories, parentId, nodeData))
        }
        message.success(`成功添加分类「${values.name}」`)
      } else {
        setCategories(
          updateNodeInTree(categories, nodeData.id, (old) => ({
            ...old,
            ...nodeData,
            children: old.children,
          }))
        )
        message.success(`已保存分类「${values.name}」`)
      }

      setIsModalVisible(false)
    } catch (err) {
      console.error(err)
    }
  }

  // 状态即时切换
  const handleToggleStatus = (record: CategoryNode, checked: boolean) => {
    const newStatus = checked ? 'SHOW' : 'HIDE'
    setCategories(
      updateNodeInTree(categories, record.id, (n) => ({
        ...n,
        status: newStatus,
      }))
    )
    message.success(`已${checked ? '显示' : '隐藏'}分类「${record.name}」`)
  }

  // 删除节点
  const handleDeleteNode = (record: CategoryNode) => {
    setCategories(deleteNodeFromTree(categories, record.id))
    message.success(`已删除分类「${record.name}」`)
  }

  // ============================================================================
  // 热区画布拖拽交互
  // ============================================================================

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setIsDrawing(true)
    setDrawStart({ x, y })
  }

  const handleCanvasMouseMove = (_e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return
    // 实时画框交互
  }

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const endX = ((e.clientX - rect.left) / rect.width) * 100
    const endY = ((e.clientY - rect.top) / rect.height) * 100

    const width = Math.abs(endX - drawStart.x)
    const height = Math.abs(endY - drawStart.y)
    const left = Math.min(drawStart.x, endX)
    const top = Math.min(drawStart.y, endY)

    setIsDrawing(false)
    setDrawStart(null)

    // 只有拖拽面积大于 5% 才判定为新建热区
    if (width > 5 && height > 5) {
      const newSpot: HotspotItem = {
        id: `sp_${Date.now()}`,
        x: Math.round(left),
        y: Math.round(top),
        width: Math.round(width),
        height: Math.round(height),
        linkType: 'GOODS',
        linkName: '未设置跳转页面 (点击右侧配置)',
      }
      const updated = [...currentHotspots, newSpot]
      setCurrentHotspots(updated)
      setSelectedHotspotId(newSpot.id)
      message.success(`已创建热区 ${updated.length}，请在右侧配置跳转目标`)
    }
  }

  // 快捷添加默认热区
  const handleAddDefaultHotspot = () => {
    const newSpot: HotspotItem = {
      id: `sp_${Date.now()}`,
      x: 10,
      y: 10 + currentHotspots.length * 20,
      width: 80,
      height: 25,
      linkType: 'GOODS',
      linkName: '选择跳转商品',
    }
    const updated = [...currentHotspots, newSpot]
    setCurrentHotspots(updated)
    setSelectedHotspotId(newSpot.id)
  }

  // 删除热区
  const handleDeleteHotspot = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentHotspots(currentHotspots.filter((s) => s.id !== id))
    if (selectedHotspotId === id) setSelectedHotspotId(null)
  }

  // 打开链接选择器
  const handleOpenLinkPicker = (hotspotId: string) => {
    setActiveHotspotIdForLink(hotspotId)
    setIsLinkPickerVisible(true)
  }

  // 选择链接结果
  const handleSelectLinkResult = (linkName: string, linkType: any) => {
    if (activeHotspotIdForLink) {
      setCurrentHotspots(
        currentHotspots.map((sp) =>
          sp.id === activeHotspotIdForLink ? { ...sp, linkName, linkType } : sp
        )
      )
      message.success(`已绑定跳转：${linkName}`)
    }
    setIsLinkPickerVisible(false)
  }

  // ============================================================================
  // 表格列配置
  // ============================================================================

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (text: string, record: CategoryNode) => (
        <span
          style={{
            fontWeight: record.level === 1 ? 600 : record.level === 2 ? 500 : 400,
            fontSize: record.level === 1 ? 14 : 13,
            color: record.level === 1 ? '#1f1f1f' : '#434343',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '展示类型 / 关联内容',
      key: 'displayMode',
      width: 240,
      render: (_: any, record: CategoryNode) => {
        if (record.level === 1) {
          if (record.displayType === 'HOTSPOT_IMAGE') {
            const spotCount = record.hotspotConfig?.hotspots.length || 0
            return (
              <Space size={6}>
                <Tag color="orange" bordered={false} style={{ margin: 0 }}>大图热区</Tag>
                {spotCount > 0 && <span style={{ color: '#8c8c8c', fontSize: 12 }}>{spotCount}个热区</span>}
              </Space>
            )
          }
          const hasBanner = (record.banners?.length || 0) > 0
          return (
            <Space size={6}>
              <Tag color="blue" bordered={false} style={{ margin: 0 }}>常规分类</Tag>
              {hasBanner && <span style={{ color: '#8c8c8c', fontSize: 12 }}>含Banner</span>}
            </Space>
          )
        }
        if (record.level === 2) {
          return (
            <span style={{ color: '#595959', fontSize: 13 }}>
              {record.goodsCount ? (
                <span>
                  <strong>{record.goodsCount}</strong> 件在售商品
                </span>
              ) : (
                <span style={{ color: '#bfbfbf' }}>暂无关联商品</span>
              )}
            </span>
          )
        }
        // 三级：网格导航 (多级模式生效)
        const cleanName = record.linkInfo?.linkName.replace('后台类目: ', '') || '未配置'
        return (
          <Space size={4}>
            <Tag color="default" bordered={false} style={{ margin: 0, fontSize: 11 }}>网格导航</Tag>
            <span style={{ color: '#595959', fontSize: 12 }}>跳转: {cleanName}</span>
          </Space>
        )
      },
    },
    {
      title: '图片/图标',
      key: 'image',
      width: 90,
      render: (_: any, record: CategoryNode) => {
        if (record.level === 1) {
          if (record.displayType === 'HOTSPOT_IMAGE' && record.hotspotConfig?.imageUrl) {
            return (
              <Tooltip title="点击查看大图">
                <img
                  src={record.hotspotConfig.imageUrl}
                  alt="海报"
                  className="category-thumb-img"
                  onClick={() => window.open(record.hotspotConfig?.imageUrl, '_blank')}
                />
              </Tooltip>
            )
          }
          if (record.banners && record.banners.length > 0) {
            return (
              <img
                src={record.banners[0].imageUrl}
                alt="Banner"
                className="category-thumb-img"
              />
            )
          }
          return <span style={{ color: '#bfbfbf' }}>-</span>
        }
        if (record.level === 3 && record.icon) {
          return (
            <Tooltip title="80×80 图标 (多级样式下生效)">
              <img
                src={record.icon}
                alt="Icon"
                className="category-thumb-img"
                style={{ width: 32, height: 32, borderRadius: 6 }}
              />
            </Tooltip>
          )
        }
        return <span style={{ color: '#bfbfbf' }}>-</span>
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (_: any, record: CategoryNode) => (
        <Switch
          checked={record.status === 'SHOW'}
          onChange={(checked) => handleToggleStatus(record, checked)}
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          size="small"
        />
      ),
    },
    {
      title: (
        <Tooltip title="排序仅在同级兄弟分类之间比较，数字越小越靠前">
          <span>排序 <QuestionCircleOutlined style={{ fontSize: 11, color: '#8c8c8c' }} /></span>
        </Tooltip>
      ),
      dataIndex: 'sort',
      key: 'sort',
      width: 90,
      render: (val: number, record: CategoryNode) => (
        <InputNumber
          size="small"
          min={1}
          max={999}
          value={val}
          style={{ width: 60 }}
          onChange={(newVal) => {
            if (newVal) {
              setCategories(
                updateNodeInTree(categories, record.id, (n) => ({
                  ...n,
                  sort: newVal,
                }))
              )
            }
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: CategoryNode) => (
        <div className="category-row-actions">
          {record.level < 3 && (
            <Button
              type="link"
              size="small"
              onClick={() => handleAddChild(record)}
            >
              添加子分类
            </Button>
          )}
          {record.level === 2 && (
            <Button
              type="link"
              size="small"
              style={{ color: '#1677ff', fontWeight: 500 }}
              onClick={() => {
                setCurrentManagingCat(record)
                setIsGoodsDrawerVisible(true)
              }}
            >
              管理商品
            </Button>
          )}
          <Button
            type="link"
            size="small"
            onClick={() => handleEditNode(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定删除分类「${record.name}」吗？`}
            description={
              record.children && record.children.length > 0
                ? '删除该分类将同时删除其所有子分类！'
                : undefined
            }
            onConfirm={() => handleDeleteNode(record)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger size="small">
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  // 过滤后的分类树
  const filteredCategories = useMemo(() => {
    if (!searchText) return categories
    const filterFn = (nodes: CategoryNode[]): CategoryNode[] => {
      return nodes
        .map((n) => {
          const match = n.name.toLowerCase().includes(searchText.toLowerCase())
          const filteredChildren = n.children ? filterFn(n.children) : []
          if (match || filteredChildren.length > 0) {
            return {
              ...n,
              children: filteredChildren,
            }
          }
          return null
        })
        .filter(Boolean) as CategoryNode[]
    }
    return filterFn(categories)
  }, [categories, searchText])

  // 当前在手机预览中选中的一级分类对象
  const activeMobileCat = useMemo(() => {
    return categories.find((c) => c.id === selectedMobileCatId) || categories[0]
  }, [categories, selectedMobileCatId])

  // ============================================================================
  // 渲染函数
  // ============================================================================

  return (
    <div className="category-manager-container">
      <div className="category-manager-card">
        {/* 顶部主导航 Tab */}
        <div className="category-header-row">
          <div className="category-nav-tabs">
            <div
              className={`category-nav-tab-item ${activeTab === 'backend' ? 'active' : ''}`}
              onClick={() => setActiveTab('backend')}
            >
              后台类目
            </div>
            <div
              className={`category-nav-tab-item ${activeTab === 'front' ? 'active' : ''}`}
              onClick={() => setActiveTab('front')}
            >
              前台类目 (当前优化)
            </div>
            <div
              className={`category-nav-tab-item ${activeTab === 'decoration' ? 'active' : ''}`}
              onClick={() => setActiveTab('decoration')}
            >
              分类装修 (双向联动预览)
            </div>
          </div>

          <div className="category-header-actions">
            <Button
              icon={<QuestionCircleOutlined />}
              type="text"
              onClick={() => setIsDrawerVisible(true)}
            >
              功能说明
            </Button>
            <Button icon={<ShareAltOutlined />} type="primary" ghost>
              推广
            </Button>
          </div>
        </div>

        {/* 提示条 */}
        <div className="category-alert-bar">
          <InfoCircleOutlined />
          <span>
            {activeTab === 'front' && (
              <>
                前台类目用于构建小程序分类页的导航树。支持针对一级分类自定义<strong>大图热区海报</strong>或<strong>标准多级分类/平铺商品</strong>。
                <a onClick={() => setActiveTab('decoration')}>去分类装修预览整体效果 &gt;</a>
              </>
            )}
            {activeTab === 'decoration' && (
              <>
                可设置分类页面在小程序菜单上的展示样式，并且将「分类」菜单放在店铺导航中。
                <a onClick={() => setActiveTab('front')}>去配置前台类目 &gt;</a>
              </>
            )}
            {activeTab === 'backend' && (
              <>
                后台类目是商品的基础物理属性分类，前台类目可灵活挂载后台类目下的商品。
              </>
            )}
          </span>
        </div>

        {/* ==================================================================
            TAB 1: 前台类目管理 (改版核心)
            ================================================================== */}
        {activeTab === 'front' && (
          <div>
            {/* 工具栏 */}
            <div className="category-toolbar">
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNewRoot}>
                  新建一级分类
                </Button>
              </Space>
              <Space>
                <Input
                  placeholder="搜索分类名称..."
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 220 }}
                  allowClear
                />
              </Space>
            </div>

            {/* 树形表格 */}
            <Table
              className="category-tree-table"
              columns={columns}
              dataSource={filteredCategories}
              rowKey="id"
              pagination={false}
              defaultExpandAllRows
            />
          </div>
        )}

        {/* ==================================================================
            TAB 2: 分类装修 (真机模拟器 + 规则配置)
            ================================================================== */}
        {activeTab === 'decoration' && (
          <div className="decoration-tab-layout">
            {/* 左侧：手机外壳真机模拟器 */}
            <div className="phone-simulator-frame">
              <div className="phone-status-bar">
                <span>9:41</span>
                <span>📶 5G 🔋</span>
              </div>
              <div className="phone-nav-bar">
                <span style={{ fontSize: 16 }}>&lt;</span>
                <span className="phone-nav-title">分类</span>
                <span style={{ fontSize: 14 }}>••• ⊙</span>
              </div>
              <div className="phone-search-box">
                <SearchOutlined />
                <span>搜索店铺商品...</span>
              </div>

              {/* 分类页主体双栏结构 */}
              <div className="phone-category-body">
                {/* 左侧一级分类导航 */}
                <div className="phone-left-menu">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`phone-left-menu-item ${
                        cat.id === activeMobileCat?.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedMobileCatId(cat.id)}
                    >
                      {cat.name}
                    </div>
                  ))}
                </div>

                {/* 右侧动态区域 */}
                <div className="phone-right-content">
                  {/* 模式 A: 自定义大图热区 */}
                  {activeMobileCat?.displayType === 'HOTSPOT_IMAGE' && (
                    <div className="phone-hotspot-view">
                      <img
                        src={activeMobileCat.hotspotConfig?.imageUrl}
                        alt="热区大图"
                        className="phone-hotspot-img"
                      />
                      {activeMobileCat.hotspotConfig?.hotspots.map((spot, idx) => (
                        <div
                          key={spot.id}
                          className="phone-hotspot-spot"
                          style={{
                            left: `${spot.x}%`,
                            top: `${spot.y}%`,
                            width: `${spot.width}%`,
                            height: `${spot.height}%`,
                          }}
                          onClick={() => message.info(`[小程序跳转] -> ${spot.linkName}`)}
                        >
                          热区 {idx + 1}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 模式 B: 标准分类/商品模式 */}
                  {activeMobileCat?.displayType !== 'HOTSPOT_IMAGE' && (
                    <>
                      {/* 顶部 Banner */}
                      {activeMobileCat?.banners && activeMobileCat.banners.length > 0 && (
                        <img
                          src={activeMobileCat.banners[0].imageUrl}
                          alt="Banner"
                          className="phone-banner-img"
                        />
                      )}

                      {/* 如果全局选了「多级分类样式」 */}
                      {templateStyle === 'MULTI_GRID' && (
                        <div>
                          {activeMobileCat?.children && activeMobileCat.children.length > 0 ? (
                            activeMobileCat.children.map((subCat) => (
                              <div key={subCat.id} className="phone-sub-group-block">
                                <div className="phone-sub-group-title">
                                  <span>{subCat.name}</span>
                                  <RightOutlined style={{ fontSize: 10, color: '#bfbfbf' }} />
                                </div>
                                <div className="phone-grid-3-col">
                                  {subCat.children?.map((leaf) => (
                                    <div
                                      key={leaf.id}
                                      className="phone-grid-item"
                                      onClick={() => message.info(`点击分类: ${leaf.name}`)}
                                    >
                                      <img
                                        src={leaf.icon}
                                        alt={leaf.name}
                                        className="phone-grid-icon"
                                      />
                                      <span className="phone-grid-text">{leaf.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div style={{ textAlign: 'center', color: '#999', padding: '30px 0', fontSize: 12 }}>
                              暂无子分类数据
                            </div>
                          )}
                        </div>
                      )}

                      {/* 如果全局选了「商品平铺样式」 */}
                      {templateStyle === 'GOODS_FLAT' && (
                        <div>
                          {/* 二级横滑标签 */}
                          {activeMobileCat?.children && activeMobileCat.children.length > 0 && (
                            <div className="phone-sub-tabs-row">
                              <div className="phone-sub-tab-pill active">全部</div>
                              {activeMobileCat.children.map((sub) => (
                                <div key={sub.id} className="phone-sub-tab-pill">
                                  {sub.name}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 商品列表 */}
                          <div style={{ marginTop: 8 }}>
                            {MOCK_GOODS.map((goods) => (
                              <div key={goods.id} className="phone-goods-item">
                                <img
                                  src={goods.image}
                                  alt={goods.title}
                                  className="phone-goods-img"
                                />
                                <div className="phone-goods-info">
                                  <div className="phone-goods-title">{goods.title}</div>
                                  <div className="phone-goods-price-row">
                                    <div>
                                      <span className="phone-goods-price">¥{goods.price}</span>
                                      {showOriginPrice && (
                                        <span className="phone-goods-origin-price">
                                          ¥{goods.originPrice}
                                        </span>
                                      )}
                                    </div>
                                    {showBuyBtn && (
                                      <div
                                        className="phone-buy-btn"
                                        onClick={() => message.success(`已加购: ${goods.title}`)}
                                      >
                                        {buyBtnStyle === 'cart' ? (
                                          <ShoppingCartOutlined />
                                        ) : (
                                          <PlusOutlined />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧：装修规则配置面板 */}
            <div className="decoration-config-panel">
              <div className="config-section-item">
                <div className="config-section-title required">模板样式：</div>
                <Radio.Group
                  value={templateStyle}
                  onChange={(e) => setTemplateStyle(e.target.value)}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  <Radio value="MULTI_GRID">
                    <strong>多级分类样式</strong>
                    <div style={{ color: '#8c8c8c', fontSize: 12, marginLeft: 24 }}>
                      可展示更细化的三级分类网格图标，适用于类目较多的商家
                    </div>
                  </Radio>
                  <Radio value="GOODS_FLAT">
                    <strong>商品平铺样式</strong>
                    <div style={{ color: '#8c8c8c', fontSize: 12, marginLeft: 24 }}>
                      可直接在右侧展示商品列表快速购买，适用于商品直观丰富的商家
                    </div>
                  </Radio>
                </Radio.Group>
              </div>

              {templateStyle === 'GOODS_FLAT' && (
                <div className="config-section-item">
                  <div className="config-section-title">列表元素：</div>
                  <Space direction="vertical" size="middle">
                    <Checkbox
                      checked={showOriginPrice}
                      onChange={(e) => setShowOriginPrice(e.target.checked)}
                    >
                      展示划线价
                    </Checkbox>
                    <div>
                      <Checkbox
                        checked={showBuyBtn}
                        onChange={(e) => setShowBuyBtn(e.target.checked)}
                      >
                        展示购买按钮
                      </Checkbox>
                      {showBuyBtn && (
                        <div style={{ marginLeft: 24, marginTop: 8, display: 'flex', gap: 12 }}>
                          <Button
                            type={buyBtnStyle === 'cart' ? 'primary' : 'default'}
                            icon={<ShoppingCartOutlined />}
                            onClick={() => setBuyBtnStyle('cart')}
                          >
                            购物车图标
                          </Button>
                          <Button
                            type={buyBtnStyle === 'plus' ? 'primary' : 'default'}
                            icon={<PlusOutlined />}
                            onClick={() => setBuyBtnStyle('plus')}
                          >
                            加号图标
                          </Button>
                        </div>
                      )}
                    </div>
                  </Space>
                </div>
              )}

              <div className="config-section-item">
                <div className="config-section-title required">分享标题：</div>
                <Input
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  maxLength={30}
                  showCount
                  style={{ width: 340 }}
                />
              </div>

              <div className="config-section-item">
                <div className="config-section-title required">分享图片：</div>
                <Radio.Group
                  value={shareImgType}
                  onChange={(e) => setShareImgType(e.target.value)}
                >
                  <Radio value="auto">页面截图</Radio>
                  <Radio value="custom">自定义上传</Radio>
                </Radio.Group>
                {shareImgType === 'custom' && (
                  <div style={{ marginTop: 12 }}>
                    <img
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?w=160&auto=format&fit=crop&q=80"
                      alt="分享图"
                      style={{ width: 80, height: 64, borderRadius: 4, objectFit: 'cover' }}
                    />
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                      建议图片比例 5:4，适用于微信小程序分享卡片
                    </div>
                  </div>
                )}
              </div>

              <Divider />
              <Button
                type="primary"
                size="large"
                onClick={() => message.success('分类装修配置已保存并发布上线！')}
              >
                保存并发布
              </Button>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 3: 后台类目
            ================================================================== */}
        {activeTab === 'backend' && (
          <div style={{ padding: '20px 0' }}>
            <Alert
              message="后台物理类目列表"
              description="后台类目属于商品的底层物理属性分类，支持多级维护。前台类目可以自由映射和关联后台类目。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Table
              columns={[
                { title: '后台类目名称', dataIndex: 'name', key: 'name' },
                { title: '类目编码', dataIndex: 'code', key: 'code' },
                { title: '关联在售商品数', dataIndex: 'count', key: 'count' },
                {
                  title: '操作',
                  key: 'act',
                  render: () => <Button type="link">查看商品</Button>,
                },
              ]}
              dataSource={[
                { key: '1', name: '面部护肤 > 精华液', code: 'CAT_1001', count: '124件' },
                { key: '2', name: '彩妆香氛 > 女士香水', code: 'CAT_1002', count: '52件' },
                { key: '3', name: '女装服饰 > 连衣裙', code: 'CAT_2001', count: '89件' },
                { key: '4', name: '火锅生鲜 > 特色牛肉卷', code: 'CAT_3001', count: '38件' },
              ]}
              pagination={false}
            />
          </div>
        )}
      </div>

      {/* ====================================================================
          分层级自适应编辑弹窗 (MODAL)
          ==================================================================== */}
      <Modal
        title={
          isAddMode
            ? `新增前台分类`
            : `修改前台分类「${editingNode?.name || ''}」`
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalSubmit}
        width={720}
        destroyOnClose
        maskClosable={false}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'SHOW', sort: 1 }}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                name="name"
                label="分类名称"
                rules={[{ required: true, message: '请输入分类名称' }]}
                extra="建议控制在 5-6 个字以内"
              >
                <Input placeholder="例如: 美妆护肤 / 当季新品" maxLength={10} showCount />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="sort" label="排序" extra="数字越小越靠前">
                <InputNumber min={1} max={9999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="parentId"
            label="上级分类"
            extra="选择'无'则作为一级分类，选择已有分类则自动识别为子分类"
          >
            <Select
              options={parentCategoryOptions}
              disabled={!isAddMode}
              onChange={(val) => {
                // 动态更新层级
                let lvl: 1 | 2 | 3 = 1
                if (val && val !== 'ROOT') {
                  const p = findNode(categories, val)
                  if (p) lvl = (p.level + 1) as 2 | 3
                }
                setEditingNode((prev) => ({ ...prev, level: lvl, parentId: val === 'ROOT' ? null : val }))
              }}
            />
          </Form.Item>

          {/* -------------------------------------------------------------
              一级分类专属配置：类目属性与展示类型 (消除与分类装修的冲突)
              ------------------------------------------------------------- */}
          {form.getFieldValue('parentId') === 'ROOT' && (
            <div style={{ background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <Form.Item
                name="displayType"
                label="类目属性 / 展示类型"
                rules={[{ required: true }]}
                style={{ marginBottom: 12 }}
                extra={
                  <div style={{ fontSize: 12, color: '#1677ff', marginTop: 4 }}>
                    💡 当前全局分类装修生效模板为：<strong>{templateStyle === 'GOODS_FLAT' ? '商品平铺样式' : '多级分类样式'}</strong>
                  </div>
                }
              >
                <Radio.Group style={{ display: 'flex', gap: 16 }}>
                  <Radio.Button value="DEFAULT" style={{ height: 'auto', padding: '8px 16px' }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AppstoreOutlined /> 常规商品分类 (推荐)
                    </div>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
                      遵循全局分类装修模板展示子类目/商品
                    </div>
                  </Radio.Button>
                  <Radio.Button value="HOTSPOT_IMAGE" style={{ height: 'auto', padding: '8px 16px' }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <PictureOutlined /> 自定义营销专区
                    </div>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
                      右侧完全展示独立大图海报与点击热区
                    </div>
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>

              {/* 模式 1: 常规商品分类下的顶部横幅配置 */}
              <Form.Item
                noStyle
                shouldUpdate={(prev, cur) => prev.displayType !== cur.displayType}
              >
                {({ getFieldValue }) =>
                  getFieldValue('displayType') === 'DEFAULT' ? (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#262626' }}>
                        分类顶部横幅 (Banner，选填)：
                      </div>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#fff', border: '1px solid #e8e8e8', padding: 12, borderRadius: 6 }}>
                        <img
                          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=240&auto=format&fit=crop&q=80"
                          alt="Banner"
                          style={{ width: 120, height: 48, borderRadius: 4, objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: '#1677ff' }}>已绑定跳转: 2026早春上新专题页</div>
                          <div style={{ fontSize: 11, color: '#8c8c8c' }}>建议尺寸 516×180px，支持最多5张轮播，不传则不占位</div>
                        </div>
                        <Button size="small">更换图片</Button>
                      </div>
                    </div>
                  ) : (
                    /* 模式 2: 自定义营销专区配置 (高光画布) */
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: '#262626' }}>
                        营销大图海报与热区绘制：
                      </div>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
                        在左侧海报上<strong>按住鼠标拖拽</strong>即可绘制热区；右侧卡片配置对应的商品或活动链接。
                      </div>

                      <div className="hotspot-editor-wrapper">
                        {/* 画布区 */}
                        <div className="hotspot-canvas-container">
                          <div className="hotspot-canvas-header">
                            <span>海报画板 (宽516px)</span>
                            <Button size="small" type="link" onClick={handleAddDefaultHotspot}>
                              + 添加热区
                            </Button>
                          </div>
                          <div
                            ref={canvasRef}
                            className="hotspot-canvas-board"
                            onMouseDown={handleCanvasMouseDown}
                            onMouseMove={handleCanvasMouseMove}
                            onMouseUp={handleCanvasMouseUp}
                          >
                            <img
                              src={
                                editingNode?.hotspotConfig?.imageUrl ||
                                'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
                              }
                              alt="海报"
                              className="hotspot-bg-image"
                            />

                            {/* 渲染热区矩形 */}
                            {currentHotspots.map((spot, index) => (
                              <div
                                key={spot.id}
                                className={`hotspot-rect-box ${
                                  selectedHotspotId === spot.id ? 'selected' : ''
                                }`}
                                style={{
                                  left: `${spot.x}%`,
                                  top: `${spot.y}%`,
                                  width: `${spot.width}%`,
                                  height: `${spot.height}%`,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedHotspotId(spot.id)
                                }}
                              >
                                <span className="hotspot-rect-badge">[{index + 1}]</span>
                                <div
                                  className="hotspot-rect-delete-btn"
                                  onClick={(e) => handleDeleteHotspot(spot.id, e)}
                                >
                                  ×
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 右侧热区列表配置 */}
                        <div className="hotspot-list-container">
                          <div className="hotspot-list-header">
                            <span style={{ fontWeight: 600, fontSize: 13 }}>
                              已配置热区 ({currentHotspots.length})
                            </span>
                            <Button
                              size="small"
                              type="dashed"
                              icon={<PlusOutlined />}
                              onClick={handleAddDefaultHotspot}
                            >
                              新建热区
                            </Button>
                          </div>

                          <div className="hotspot-card-list">
                            {currentHotspots.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: 12 }}>
                                暂无热区，请在左侧海报上框选绘制
                              </div>
                            ) : (
                              currentHotspots.map((spot, index) => (
                                <div
                                  key={spot.id}
                                  className={`hotspot-item-card ${
                                    selectedHotspotId === spot.id ? 'active' : ''
                                  }`}
                                  onClick={() => setSelectedHotspotId(spot.id)}
                                >
                                  <div className="hotspot-card-top">
                                    <span className="hotspot-tag-title">
                                      <Tag color="blue">热区 {index + 1}</Tag>
                                      <span style={{ fontSize: 11, color: '#8c8c8c' }}>
                                        ({spot.width}% × {spot.height}%)
                                      </span>
                                    </span>
                                    <Button
                                      type="text"
                                      danger
                                      size="small"
                                      icon={<DeleteOutlined />}
                                      onClick={(e) => handleDeleteHotspot(spot.id, e)}
                                    />
                                  </div>

                                  <div
                                    className="link-selector-card"
                                    onClick={() => handleOpenLinkPicker(spot.id)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <LinkOutlined style={{ color: '#1677ff' }} />
                                      <span style={{ fontSize: 12 }}>{spot.linkName}</span>
                                    </div>
                                    <Button type="link" size="small">
                                      修改
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </Form.Item>
            </div>
          )}

          {/* -------------------------------------------------------------
              二级分类专属配置：商品挂载层级提示
              ------------------------------------------------------------- */}
          {editingNode?.level === 2 && (
            <div style={{ background: '#e6f4ff', border: '1px solid #91caff', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#0958d9', fontSize: 13, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <InfoCircleOutlined /> 二级分类为商品归集与管理层级
              </div>
              <div style={{ fontSize: 12, color: '#595959', lineHeight: 1.5 }}>
                前台商品均统一挂载在二级分类下。保存后，可在列表操作列点击<strong>「管理商品」</strong>进行商品添加、排序与上下架。
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              三级分类专属配置：网格图标 + 跳转 (仅在多级分类模式生效)
              ------------------------------------------------------------- */}
          {editingNode?.level === 3 && (
            <div style={{ background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, padding: '8px 12px', marginBottom: 14, fontSize: 12, color: '#d46b08' }}>
                <InfoCircleOutlined style={{ marginRight: 6 }} />
                <strong>三级分类使用须知</strong>：三级分类<strong>不维护商品</strong>，仅在「分类装修」选用<strong>「多级分类样式」</strong>时生效，作为右侧九宫格图标与跳转入口。
              </div>

              <Form.Item
                name="icon"
                label="分类图标 (Icon)"
                extra="用于在小程序多级网格中展示，建议上传 80×80 正方形图标"
                rules={[{ required: true, message: '请上传分类图标' }]}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img
                    src={
                      form.getFieldValue('icon') ||
                      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=120&auto=format&fit=crop&q=80'
                    }
                    alt="图标"
                    style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', border: '1px solid #d9d9d9' }}
                  />
                  <Button icon={<UploadOutlined />} size="small">
                    重新上传
                  </Button>
                </div>
              </Form.Item>

              <Form.Item label="点击跳转内容" required>
                <div className="link-selector-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LinkOutlined style={{ color: '#1677ff' }} />
                    <span>{editingNode?.linkInfo?.linkName || '后台类目: 女士香水'}</span>
                  </div>
                  <Button type="link" size="small" onClick={() => setIsLinkPickerVisible(true)}>
                    修改关联
                  </Button>
                </div>
              </Form.Item>
            </div>
          )}

          {/* -------------------------------------------------------------
              类目状态：竖向排列 + 清晰引导
              ------------------------------------------------------------- */}
          <Form.Item
            name="status"
            label="类目状态"
            rules={[{ required: true }]}
            style={{ marginBottom: 16 }}
          >
            <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Radio value="SHOW">
                <strong>开启显示</strong>
                <span style={{ color: '#8c8c8c', fontSize: 12, marginLeft: 8 }}>
                  在前台小程序分类菜单中正常展示
                </span>
              </Radio>
              <Radio value="HIDE">
                <strong>暂时隐藏</strong>
                <span style={{ color: '#8c8c8c', fontSize: 12, marginLeft: 8 }}>
                  在前台下架此分类（其下子分类也将一同隐藏）
                </span>
              </Radio>
            </Radio.Group>
          </Form.Item>

          {/* -------------------------------------------------------------
              弱化字段：类目备注（移到最底部，做成轻量输入）
              ------------------------------------------------------------- */}
          <Form.Item
            name="remark"
            label={<span style={{ color: '#8c8c8c', fontSize: 12 }}>类目备注 (选填)</span>}
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="内部运营备注，前台不展示..."
              size="small"
              style={{ color: '#595959', fontSize: 12 }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ====================================================================
          通用链接选择弹窗
          ==================================================================== */}
      <Modal
        title="选择跳转页面 / 关联内容"
        open={isLinkPickerVisible}
        onCancel={() => setIsLinkPickerVisible(false)}
        footer={null}
        width={560}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 0' }}>
          <Card size="small" hoverable onClick={() => handleSelectLinkResult('雅诗兰黛小棕瓶精华 50ml', 'GOODS')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Tag color="green">商品详情</Tag>
                <strong>雅诗兰黛小棕瓶精华 50ml</strong>
              </div>
              <Button type="link" size="small">选择</Button>
            </div>
          </Card>

          <Card size="small" hoverable onClick={() => handleSelectLinkResult('后台类目: 女士香水专区', 'CATEGORY')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Tag color="purple">商品类目</Tag>
                <strong>后台类目: 女士香水专区 (共38件商品)</strong>
              </div>
              <Button type="link" size="small">选择</Button>
            </div>
          </Card>

          <Card size="small" hoverable onClick={() => handleSelectLinkResult('2026早春上新专题活动页', 'MICRO_PAGE')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Tag color="blue">微页面 / 活动</Tag>
                <strong>2026早春上新专题活动页</strong>
              </div>
              <Button type="link" size="small">选择</Button>
            </div>
          </Card>

          <Card size="small" hoverable onClick={() => handleSelectLinkResult('全场满200减30优惠券领券页', 'COUPON')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Tag color="orange">营销卡券</Tag>
                <strong>全场满200减30优惠券领券页</strong>
              </div>
              <Button type="link" size="small">选择</Button>
            </div>
          </Card>
        </div>
      </Modal>

      {/* ====================================================================
          二级分类专属：商品管理抽屉
          ==================================================================== */}
      <Drawer
        title={
          <div>
            <span>管理分类商品</span>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {currentManagingCat?.name}
            </Tag>
          </div>
        }
        placement="right"
        onClose={() => setIsGoodsDrawerVisible(false)}
        open={isGoodsDrawerVisible}
        width={680}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => message.success('已打开选品弹窗，添加新商品到该分类')}
          >
            添加商品
          </Button>
        }
      >
        <Alert
          message={`当前分类（${currentManagingCat?.name}）共绑定 ${managingGoodsList.length} 件在售商品`}
          description="小程序端将严格按照下方列表的排序展示商品。您可以在此调整商品排序、上下架或移除商品。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Table
          dataSource={managingGoodsList}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: '商品信息',
              dataIndex: 'title',
              key: 'title',
              render: (title: string, record: any) => (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img
                    src={record.image}
                    alt={title}
                    style={{ width: 44, height: 44, borderRadius: 4, objectFit: 'cover' }}
                  />
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#262626' }}>
                    {title}
                  </div>
                </div>
              ),
            },
            {
              title: '价格',
              dataIndex: 'price',
              key: 'price',
              width: 100,
              render: (val: number, record: any) => (
                <div>
                  <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{val}</div>
                  <div style={{ color: '#bfbfbf', textDecoration: 'line-through', fontSize: 11 }}>
                    ¥{record.originPrice}
                  </div>
                </div>
              ),
            },
            {
              title: '销量',
              dataIndex: 'sales',
              key: 'sales',
              width: 80,
              render: (val: number) => <span style={{ color: '#595959' }}>{val}</span>,
            },
            {
              title: '分类内排序',
              key: 'sort',
              width: 110,
              render: (_: any, __: any, index: number) => (
                <InputNumber
                  size="small"
                  min={1}
                  max={999}
                  defaultValue={index + 1}
                  style={{ width: 60 }}
                />
              ),
            },
            {
              title: '操作',
              key: 'act',
              width: 80,
              render: (_: any, record: any) => (
                <Button
                  type="link"
                  danger
                  size="small"
                  onClick={() => {
                    setManagingGoodsList(managingGoodsList.filter((g) => g.id !== record.id))
                    message.success(`已从「${currentManagingCat?.name}」中移除该商品`)
                  }}
                >
                  移除
                </Button>
              ),
            },
          ]}
        />
      </Drawer>

      {/* ====================================================================
          功能说明抽屉
          ==================================================================== */}
      <Drawer
        title="前台类目体系功能说明"
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        width={420}
      >
        <div style={{ fontSize: 13, lineHeight: 1.8, color: '#595959' }}>
          <h4>1. 什么是前台类目？</h4>
          <p>
            前台类目是面向小程序用户的导购导航体系，可独立于后台商品的物理类目进行自由组合与视觉营销。
          </p>

          <h4 style={{ marginTop: 16 }}>2. 一级分类的两种展示形式</h4>
          <ul>
            <li>
              <strong>常规商品分类</strong>：遵循全局分类装修模板（商品平铺 / 多级网格），可配置顶部 Banner。
            </li>
            <li>
              <strong>自定义营销专区</strong>：右侧完全接管为自定义海报，支持在海报上绘制点击热区跳转商品/活动。
            </li>
          </ul>

          <h4 style={{ marginTop: 16 }}>3. 二级与三级分类职责</h4>
          <ul>
            <li>
              <strong>二级分类</strong>：<strong>商品维护的唯一归集层级</strong>，可在列表页点击「管理商品」进行绑定和排序。
            </li>
            <li>
              <strong>三级分类</strong>：<strong>不维护商品</strong>，仅在「分类装修」设置为「多级分类样式」时生效，作为右侧九宫格图标与跳转入口。
            </li>
          </ul>
        </div>
      </Drawer>
    </div>
  )
}
