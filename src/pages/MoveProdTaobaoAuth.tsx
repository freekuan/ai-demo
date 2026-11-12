import { useState, useMemo } from 'react'
import {
  Alert,
  Badge,
  Button,
  Cascader,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd'
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CopyOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  LockOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import './MoveProdTaobaoAuth.css'

export type DemoViewMode = 'moveProd' | 'taobaoAuth' | 'taobaoOrder' | 'taobaoOAuth'

export interface AuthorizedShopItem {
  xyShopId: number
  shopName: string // 授权店铺昵称
  sellerNick: string // 卖家旺旺昵称
  channel: 1 | 4 // 1: 淘宝, 4: 抖音
  orderSourceDesc: string
  authStatus: 'authorized' | 'expired' | 'revoked'
  authStatusText: string
  authTime: string
  expireTime: string
  isvAppName?: string
  isNewCallback?: boolean
}

export interface MoveGoodsTaskItem {
  id: number
  prodCnt: number
  succCnt: number
  failCnt: number
  channel: 1 | 4
  isvShop: {
    shopId: number
    shopName: string
  }
  moveStatus: 1 | 2 // 1: 执行中, 2: 执行完成
  moveStatusStr: string
  createTime: string
  operator: string
}

export interface MoveGoodsRecordItem {
  id: string
  isvProdId: string
  isvPic: string
  isvProdName: string
  status: 1 | -1 // 1: 成功, -1: 失败
  failReason?: string
  isValidProd: number
  xyProdId: number
}

const INITIAL_SHOPS: AuthorizedShopItem[] = [
  {
    xyShopId: 400101,
    shopName: '星云美妆抖音官方旗舰店',
    sellerNick: 'xy_douyin_official',
    channel: 4,
    orderSourceDesc: '抖店开放平台授权',
    authStatus: 'authorized',
    authStatusText: '已授权',
    authTime: '2026-09-15 10:20:00',
    expireTime: '2027-09-15 10:20:00',
  },
  {
    xyShopId: 400102,
    shopName: '星云个护抖音专营店',
    sellerNick: 'xy_care_dy',
    channel: 4,
    orderSourceDesc: '抖店开放平台授权',
    authStatus: 'authorized',
    authStatusText: '已授权',
    authTime: '2026-10-01 14:00:00',
    expireTime: '2027-10-01 14:00:00',
  },
  {
    xyShopId: 100201,
    shopName: '星云生活家居淘宝企业店',
    sellerNick: 'tb_xingyun_home',
    channel: 1,
    orderSourceDesc: '淘宝第三方ISV授权',
    authStatus: 'authorized',
    authStatusText: '已授权',
    authTime: '2026-10-20 11:30:15',
    expireTime: '2027-10-20 11:30:15',
    isvAppName: '火牛商品互通助手(ISV专享版)',
  },
  {
    xyShopId: 100202,
    shopName: '星云服饰奥莱淘宝老店',
    sellerNick: 'tb_outlet_old',
    channel: 1,
    orderSourceDesc: '淘宝第三方ISV授权',
    authStatus: 'expired',
    authStatusText: '授权已过期',
    authTime: '2025-10-01 09:00:00',
    expireTime: '2026-10-01 09:00:00',
    isvAppName: '火牛商品互通助手(ISV专享版)',
  },
]

const INITIAL_TASKS: MoveGoodsTaskItem[] = [
  {
    id: 10289,
    prodCnt: 25,
    succCnt: 24,
    failCnt: 1,
    channel: 1,
    isvShop: {
      shopId: 100201,
      shopName: '星云生活家居淘宝企业店',
    },
    moveStatus: 2,
    moveStatusStr: '执行完成',
    createTime: '2026-11-05 15:18:42',
    operator: '管理员(周宽)',
  },
  {
    id: 10288,
    prodCnt: 40,
    succCnt: 40,
    failCnt: 0,
    channel: 4,
    isvShop: {
      shopId: 400101,
      shopName: '星云美妆抖音官方旗舰店',
    },
    moveStatus: 2,
    moveStatusStr: '执行完成',
    createTime: '2026-11-04 11:05:19',
    operator: '运营专员(林晓)',
  },
  {
    id: 10285,
    prodCnt: 12,
    succCnt: 6,
    failCnt: 0,
    channel: 4,
    isvShop: {
      shopId: 400102,
      shopName: '星云个护抖音专营店',
    },
    moveStatus: 1,
    moveStatusStr: '执行中',
    createTime: '2026-11-05 16:40:10',
    operator: '管理员(周宽)',
  },
]

const MOCK_RECORDS: MoveGoodsRecordItem[] = [
  {
    id: 'rec-1',
    isvProdId: '738291049581',
    isvPic: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=80',
    isvProdName: '【淘宝爆款】轻奢极简陶瓷马克杯伴手礼盒装350ml',
    status: 1,
    isValidProd: 1,
    xyProdId: 90011,
  },
  {
    id: 'rec-2',
    isvProdId: '738291049582',
    isvPic: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=80',
    isvProdName: '北欧风可折叠桌面收纳篮ins风杂物整理筐',
    status: 1,
    isValidProd: 1,
    xyProdId: 90012,
  },
  {
    id: 'rec-3',
    isvProdId: '738291049589',
    isvPic: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=120&auto=format&fit=crop&q=80',
    isvProdName: '复古太阳镜偏光防紫外线墨镜（含定制特殊规格）',
    status: -1,
    failReason: '第三方ISV接口返回：该淘宝商品存在多级阶梯批发价，暂不支持转换',
    isValidProd: 0,
    xyProdId: 0,
  },
]

const TRANSPORT_OPTIONS = [
  { transportId: 1, transName: '全国包邮运费模板（除偏远地区）' },
  { transportId: 2, transName: '江浙沪皖包邮_其他地区首重8元' },
  { transportId: 3, transName: '大件家居顺丰到付模板' },
]

const TAG_OPTIONS = [
  { id: 101, title: '双11主推爆款组' },
  { id: 102, title: '淘宝搬家待核对商品' },
  { id: 103, title: '会员内购专区' },
  { id: 104, title: '当季新品推荐' },
]

const CATEGORY_OPTIONS = [
  {
    value: 1,
    label: '美妆护肤',
    children: [
      { value: 11, label: '面部护理' },
      { value: 12, label: '彩妆香氛' },
    ],
  },
  {
    value: 2,
    label: '居家日用',
    children: [
      { value: 21, label: '餐饮具/水具' },
      { value: 22, label: '收纳整理' },
    ],
  },
  {
    value: 3,
    label: '服饰鞋包',
    children: [
      { value: 31, label: '潮流女装' },
      { value: 32, label: '时尚配饰' },
    ],
  },
]

const HISTORY_REPEATED_IDS = ['888000111222', '659012345678']

interface MoveProdTaobaoAuthProps {
  defaultView?: DemoViewMode
  onViewChange?: (view: DemoViewMode) => void
}

export default function MoveProdTaobaoAuth({
  defaultView = 'moveProd',
  onViewChange,
}: MoveProdTaobaoAuthProps) {
  const [currentView, setCurrentView] = useState<DemoViewMode>(defaultView)
  const [shops, setShops] = useState<AuthorizedShopItem[]>(INITIAL_SHOPS)
  const [tasks, setTasks] = useState<MoveGoodsTaskItem[]>(INITIAL_TASKS)

  // 页面1 搜索条件 (/dtmall/prod/moveProd)
  const [searchTaskId, setSearchTaskId] = useState('')
  const [searchMoveStatus, setSearchMoveStatus] = useState<number | undefined>(undefined)
  const [searchChannel, setSearchChannel] = useState<number | undefined>(undefined)

  // 页面2 搜索条件 (淘宝授权店铺列表页)
  const [searchShopName, setSearchShopName] = useState('')
  const [searchShopStatus, setSearchShopStatus] = useState<string | undefined>(undefined)

  // 创建搬家任务弹窗状态 (还原 addMoveTask.vue)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [formChannel, setFormChannel] = useState<1 | 4>(1)
  const [formShopId, setFormShopId] = useState<number | undefined>(100201)
  const [formProdInfo, setFormProdInfo] = useState('')
  const [formDeliveryTemplateId, setFormDeliveryTemplateId] = useState<number | undefined>(1)
  const [formTagIds, setFormTagIds] = useState<number[]>([102])
  const [formCategoryId, setFormCategoryId] = useState<number[]>([2, 21])
  const [saveLoading, setSaveLoading] = useState(false)

  // 重复商品ID拦截弹窗 (还原 repeatIdModal.vue)
  const [repeatModalOpen, setRepeatModalOpen] = useState(false)
  const [repeatIds, setRepeatIds] = useState<string[]>([])

  // 商品搬入记录弹窗 (还原 recordModal.vue)
  const [recordModalOpen, setRecordModalOpen] = useState(false)
  const [activeTaskRecord, setActiveTaskRecord] = useState<MoveGoodsTaskItem | null>(null)
  const [recordSearchProdId, setRecordSearchProdId] = useState('')
  const [recordSearchProdName, setRecordSearchProdName] = useState('')
  const [recordSearchStatus, setRecordSearchStatus] = useState<number | undefined>(undefined)

  // 新增淘宝店铺授权（两步式弹窗）状态
  const [addAuthModalOpen, setAddAuthModalOpen] = useState(false)

  // 授权完成跳回后的「授权成功」结果提示弹窗状态（显示店铺ID和店铺昵称）
  const [authSuccessModalInfo, setAuthSuccessModalInfo] = useState<{
    open: boolean
    shopId: number
    shopName: string
  }>({
    open: false,
    shopId: 100208,
    shopName: '星云官方淘宝旗舰店',
  })

  // 淘宝开放平台授权页输入状态
  const [oauthShopIdInput, setOauthShopIdInput] = useState('100208')
  const [oauthShopNickInput, setOauthShopNickInput] = useState('星云官方淘宝旗舰店')
  const [oauthSellerNickInput, setOauthSellerNickInput] = useState('tb_xingyun_flagship')
  const [oauthSubmitting, setOauthSubmitting] = useState(false)

  const switchView = (view: DemoViewMode) => {
    setCurrentView(view)
    onViewChange?.(view)
  }

  // 当前渠道下的可选店铺列表
  const channelShops = useMemo(() => {
    return shops.filter((s) => s.channel === formChannel)
  }, [shops, formChannel])

  // 淘宝渠道的所有授权店铺（用于授权店铺列表页展示）
  const filteredTaobaoShops = useMemo(() => {
    return shops.filter((s) => {
      if (s.channel !== 1) return false
      if (
        searchShopName &&
        !s.sellerNick.includes(searchShopName.trim()) &&
        !s.shopName.includes(searchShopName.trim())
      )
        return false
      if (searchShopStatus && s.authStatus !== searchShopStatus) return false
      return true
    })
  }, [shops, searchShopName, searchShopStatus])

  // 解析多行输入的商品ID
  const prodIds = useMemo(() => {
    return formProdInfo
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  }, [formProdInfo])

  // 过滤搬家任务列表
  const filteredTasks = useMemo(() => {
    return tasks.filter((item) => {
      if (searchTaskId && !String(item.id).includes(searchTaskId.trim())) return false
      if (searchMoveStatus !== undefined && item.moveStatus !== searchMoveStatus) return false
      if (searchChannel !== undefined && item.channel !== searchChannel) return false
      return true
    })
  }, [tasks, searchTaskId, searchMoveStatus, searchChannel])

  // 过滤商品搬入明细
  const filteredRecords = useMemo(() => {
    return MOCK_RECORDS.filter((rec) => {
      if (recordSearchProdId && !rec.isvProdId.includes(recordSearchProdId.trim())) return false
      if (recordSearchProdName && !rec.isvProdName.includes(recordSearchProdName.trim())) return false
      if (recordSearchStatus !== undefined && rec.status !== recordSearchStatus) return false
      return true
    })
  }, [recordSearchProdId, recordSearchProdName, recordSearchStatus])

  // 切换搬出平台
  const handleSelectChannel = (ch: 1 | 4) => {
    setFormChannel(ch)
    const firstValidShop = shops.find((s) => s.channel === ch && s.authStatus === 'authorized')
    setFormShopId(firstValidShop?.xyShopId)
  }

  // 点击“+ 去授权店铺” -> 切换到授权店铺列表页并打开新增授权两步弹窗
  const handleGoAuthShop = () => {
    if (formChannel === 4) {
      message.info('抖音店铺将跳转至：/cdp/cloudOrders/shopList 进行抖店授权')
    } else {
      setAddModalOpen(false)
      switchView('taobaoAuth')
      setAddAuthModalOpen(true)
    }
  }

  // 填充示例商品ID
  const handleFillSampleProdIds = (includeRepeat = false) => {
    const sampleIds =
      formChannel === 1
        ? ['738291049581', '738291049582', '738291049589', '739001122334']
        : ['3619283746501928371', '3619283746501928372', '3619283746501928373']
    if (includeRepeat) {
      sampleIds.push(...HISTORY_REPEATED_IDS)
    }
    setFormProdInfo(sampleIds.join('\n'))
  }

  // 提交创建搬家任务
  const handleSubmitMoveTask = () => {
    if (!formChannel || !formShopId || !formDeliveryTemplateId || prodIds.length === 0) {
      message.warning('请完善必填项后再开始搬家')
      return
    }
    if (prodIds.length > 500) {
      message.error('最多可输入 500 个商品ID')
      return
    }
    const selectedShop = shops.find((s) => s.xyShopId === formShopId)
    if (!selectedShop) {
      message.error('请选择有效的搬出店铺')
      return
    }
    if (selectedShop.authStatus !== 'authorized') {
      message.error(`店铺「${selectedShop.shopName}」授权已过期，请先前往重新授权`)
      return
    }

    const hitRepeat = prodIds.filter((id) => HISTORY_REPEATED_IDS.includes(id))
    if (hitRepeat.length > 0) {
      setRepeatIds(hitRepeat)
      setRepeatModalOpen(true)
      return
    }

    setSaveLoading(true)
    setTimeout(() => {
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
        now.getHours()
      )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

      const newTask: MoveGoodsTaskItem = {
        id: 10290 + tasks.length,
        prodCnt: prodIds.length,
        succCnt: prodIds.length,
        failCnt: 0,
        channel: formChannel,
        isvShop: {
          shopId: selectedShop.xyShopId,
          shopName: selectedShop.shopName,
        },
        moveStatus: 2,
        moveStatusStr: '执行完成',
        createTime: timeStr,
        operator: '管理员(周宽)',
      }

      setTasks([newTask, ...tasks])
      setSaveLoading(false)
      setAddModalOpen(false)
      setFormProdInfo('')
      message.success('任务创建成功，请稍后刷新页面查看')
    }, 500)
  }

  // 一键清除重复商品ID
  const handleClearRepeatIds = () => {
    const cleaned = prodIds.filter((id) => !repeatIds.includes(id))
    setFormProdInfo(cleaned.join('\n'))
    setRepeatModalOpen(false)
    message.success(`已清除 ${repeatIds.length} 个历史重复商品ID，可继续提交`)
  }

  // 第一步：点击订购应用 -> 跳转淘宝服务市场
  const handleGoStep1OrderApp = () => {
    setAddAuthModalOpen(false)
    switchView('taobaoOrder')
    message.loading({ content: '正在跳转至淘宝应用市场 (fuwu.taobao.com)...', duration: 0.7 })
  }

  // 第二步：已订购，去授权 -> 跳转淘宝开放平台卖家账号授权页
  const handleGoStep2OAuth = (prefillId?: number, prefillName?: string, prefillSeller?: string) => {
    if (prefillId) setOauthShopIdInput(String(prefillId))
    if (prefillName) setOauthShopNickInput(prefillName)
    if (prefillSeller) setOauthSellerNickInput(prefillSeller)
    setAddAuthModalOpen(false)
    switchView('taobaoOAuth')
    message.loading({ content: '正在跳转至淘宝开放平台卖家授权页...', duration: 0.7 })
  }

  // 授权完成跳回页面：更新授权店铺列表，并直接弹窗提示授权成功（显示店铺ID和店铺昵称）
  const triggerAuthCallbackSuccessModal = (
    shopIdNum: number,
    shopNick: string,
    sellerNick: string
  ) => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const authTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const expireTime = `${now.getFullYear() + 1}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

    setShops((prev) => {
      const resetPrev = prev.map((s) => ({ ...s, isNewCallback: false }))
      const existingIdx = resetPrev.findIndex(
        (s) => s.channel === 1 && (s.xyShopId === shopIdNum || s.shopName === shopNick)
      )
      if (existingIdx >= 0) {
        resetPrev[existingIdx] = {
          ...resetPrev[existingIdx],
          xyShopId: shopIdNum,
          shopName: shopNick,
          sellerNick,
          authStatus: 'authorized',
          authStatusText: '已授权',
          authTime,
          expireTime,
          isNewCallback: true,
        }
        return [...resetPrev]
      }
      const newShop: AuthorizedShopItem = {
        xyShopId: shopIdNum,
        shopName: shopNick,
        sellerNick,
        channel: 1,
        orderSourceDesc: '淘宝第三方ISV授权',
        authStatus: 'authorized',
        authStatusText: '已授权',
        authTime,
        expireTime,
        isvAppName: '火牛商品互通助手(ISV专享版)',
        isNewCallback: true,
      }
      return [newShop, ...resetPrev]
    })

    setFormChannel(1)
    setFormShopId(shopIdNum)
    switchView('taobaoAuth')

    // 直接弹出「授权成功」提示弹窗，展示店铺ID和店铺昵称
    setAuthSuccessModalInfo({
      open: true,
      shopId: shopIdNum,
      shopName: shopNick,
    })
  }

  // 在淘宝开放平台授权页点击「确认授权并跳回系统」
  const handleCompleteOAuthCallback = () => {
    const idNum = Number(oauthShopIdInput.trim()) || 100208
    const nick = oauthShopNickInput.trim()
    const seller = oauthSellerNickInput.trim() || 'tb_seller_auth'
    if (!nick) {
      message.warning('请输入要授权的淘宝店铺昵称')
      return
    }
    setOauthSubmitting(true)
    setTimeout(() => {
      setOauthSubmitting(false)
      triggerAuthCallbackSuccessModal(idNum, nick, seller)
    }, 600)
  }

  // 从授权页去创建该店铺的搬家任务
  const handleStartMoveWithShop = (shopId: number) => {
    setFormChannel(1)
    setFormShopId(shopId)
    switchView('moveProd')
    setAddModalOpen(true)
  }

  return (
    <div className="move-prod-demo-wrapper">
      {/* 顶部交互演示控制器 */}
      <div className="demo-flow-switcher">
        <div className="demo-flow-left">
          <span className="demo-flow-badge">交互原型演示</span>
          <span className="demo-flow-title">
            淘宝第三方 ISV 两步式授权 &amp; 商品搬家 (`/dtmall/prod/moveProd`)
          </span>
        </div>
        <div className="demo-flow-steps">
          <Radio.Group
            value={currentView}
            onChange={(e) => switchView(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="moveProd">
              页面1：商品搬家 (/dtmall/prod/moveProd)
            </Radio.Button>
            <Radio.Button value="taobaoAuth">
              页面2：授权店铺列表页 (含「新增授权」弹窗)
            </Radio.Button>
            <Radio.Button value="taobaoOrder">
              外链1：淘宝应用市场(订购应用)
            </Radio.Button>
            <Radio.Button value="taobaoOAuth">
              外链2：淘宝开放平台(卖家账号授权)
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>

      {/* =====================================================================
       * 视图 1：/dtmall/prod/moveProd 商品搬家页面
       * ===================================================================== */}
      {currentView === 'moveProd' && (
        <div className="dt-page-card">
          <div className="dt-page-header-bar">
            <div className="dt-page-header-title">
              <span>商品搬家</span>
              <span className="dt-page-route-tag">/dtmall/prod/moveProd</span>
            </div>
            <Space>
              <Button
                icon={<SafetyCertificateOutlined />}
                onClick={() => switchView('taobaoAuth')}
              >
                淘宝授权店铺列表 (
                {shops.filter((s) => s.channel === 1 && s.authStatus === 'authorized').length}
                家已授权)
              </Button>
            </Space>
          </div>

          <div className="dt-search-section">
            <div className="dt-search-inputs">
              <div className="dt-search-item">
                <span className="dt-search-label">任务ID:</span>
                <Input
                  placeholder="请输入"
                  allowClear
                  style={{ width: 200 }}
                  value={searchTaskId}
                  onChange={(e) => setSearchTaskId(e.target.value)}
                />
              </div>
              <div className="dt-search-item">
                <span className="dt-search-label">搬出平台:</span>
                <Select
                  placeholder="请选择"
                  allowClear
                  style={{ width: 160 }}
                  value={searchChannel}
                  onChange={(val) => setSearchChannel(val)}
                  options={[
                    { label: '淘宝', value: 1 },
                    { label: '抖音', value: 4 },
                  ]}
                />
              </div>
              <div className="dt-search-item">
                <span className="dt-search-label">搬家状态:</span>
                <Select
                  placeholder="请选择"
                  allowClear
                  style={{ width: 180 }}
                  value={searchMoveStatus}
                  onChange={(val) => setSearchMoveStatus(val)}
                  options={[
                    { label: '执行中', value: 1 },
                    { label: '执行完成', value: 2 },
                  ]}
                />
              </div>
              <Space>
                <Button type="primary" onClick={() => message.success('已更新列表')}>
                  查询
                </Button>
                <Button
                  onClick={() => {
                    setSearchTaskId('')
                    setSearchMoveStatus(undefined)
                    setSearchChannel(undefined)
                  }}
                >
                  重置
                </Button>
              </Space>
            </div>

            <Button type="primary" onClick={() => setAddModalOpen(true)}>
              创建搬家任务
            </Button>
          </div>

          <div className="dt-table-section">
            <Table
              rowKey="id"
              dataSource={filteredTasks}
              pagination={{
                total: filteredTasks.length,
                pageSize: 10,
                showTotal: (t) => `共 ${t} 条任务`,
                showSizeChanger: true,
              }}
              columns={[
                {
                  title: '任务ID',
                  dataIndex: 'id',
                  key: 'id',
                  width: 110,
                },
                {
                  title: '添加商品数',
                  dataIndex: 'prodCnt',
                  key: 'prodCnt',
                  width: 120,
                },
                {
                  title: '成功数/失败数',
                  key: 'successNum',
                  width: 130,
                  render: (_, record) => `${record.succCnt ?? 0} / ${record.failCnt ?? 0}`,
                },
                {
                  title: '搬出平台',
                  key: 'channel',
                  width: 130,
                  render: (_, record) =>
                    record.channel === 1 ? (
                      <Space size={6}>
                        <span
                          style={{
                            display: 'inline-flex',
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #ff9000 0%, #ff5000 100%)',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 700,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          淘
                        </span>
                        <span>淘宝</span>
                      </Space>
                    ) : (
                      <Space size={6}>
                        <span
                          style={{
                            display: 'inline-flex',
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            background: '#161823',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 700,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          抖
                        </span>
                        <span>抖音</span>
                      </Space>
                    ),
                },
                {
                  title: '搬出店铺',
                  key: 'shopName',
                  render: (_, record) => record.isvShop?.shopName || '-',
                },
                {
                  title: '搬家状态',
                  key: 'moveStatus',
                  width: 120,
                  render: (_, record) =>
                    record.moveStatus === 2 ? (
                      <Tag color="success">{record.moveStatusStr}</Tag>
                    ) : (
                      <Tag color="warning" icon={<SyncOutlined spin />}>
                        {record.moveStatusStr}
                      </Tag>
                    ),
                },
                {
                  title: '操作时间',
                  dataIndex: 'createTime',
                  key: 'createTime',
                  width: 180,
                },
                {
                  title: '操作人',
                  dataIndex: 'operator',
                  key: 'operator',
                  width: 140,
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 100,
                  render: (_, record) =>
                    record.moveStatus !== 2 ? (
                      <span>-</span>
                    ) : (
                      <a
                        onClick={() => {
                          setActiveTaskRecord(record)
                          setRecordModalOpen(true)
                        }}
                      >
                        查看记录
                      </a>
                    ),
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* =====================================================================
       * 视图 2：淘宝授权店铺列表页（页面主体为授权店铺列表 + 「新增授权」按钮弹窗）
       * ===================================================================== */}
      {currentView === 'taobaoAuth' && (
        <div className="dt-page-card">
          <div className="dt-page-header-bar">
            <div className="dt-page-header-title">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => switchView('moveProd')}
                style={{ marginRight: 4 }}
              >
                返回商品搬家
              </Button>
              <Divider type="vertical" />
              <span>淘宝授权店铺管理</span>
            </div>
            <Space>
              <Button
                onClick={() =>
                  triggerAuthCallbackSuccessModal(
                    100208,
                    '星云官方淘宝旗舰店',
                    'tb_xingyun_flagship'
                  )
                }
              >
                演示：模拟授权跳回成功弹窗
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setAddAuthModalOpen(true)}
              >
                新增授权
              </Button>
            </Space>
          </div>

          {/* 筛选与「新增授权」按钮 */}
          <div className="dt-search-section">
            <div className="dt-search-inputs">
              <div className="dt-search-item">
                <span className="dt-search-label">淘宝账号:</span>
                <Input
                  placeholder="请输入淘宝账号"
                  allowClear
                  style={{ width: 220 }}
                  value={searchShopName}
                  onChange={(e) => setSearchShopName(e.target.value)}
                />
              </div>
              <div className="dt-search-item">
                <span className="dt-search-label">授权状态:</span>
                <Select
                  placeholder="请选择"
                  allowClear
                  style={{ width: 160 }}
                  value={searchShopStatus}
                  onChange={(val) => setSearchShopStatus(val)}
                  options={[
                    { label: '已授权', value: 'authorized' },
                    { label: '授权已过期', value: 'expired' },
                  ]}
                />
              </div>
              <Space>
                <Button type="primary" onClick={() => message.success('列表已更新')}>
                  查询
                </Button>
                <Button
                  onClick={() => {
                    setSearchShopName('')
                    setSearchShopStatus(undefined)
                  }}
                >
                  重置
                </Button>
              </Space>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddAuthModalOpen(true)}
            >
              新增授权
            </Button>
          </div>

          {/* 授权店铺列表 */}
          <div className="dt-table-section">
            {filteredTaobaoShops.length === 0 ? (
              <Empty
                description="暂无授权的淘宝店铺，请点击右上角「新增授权」完成应用订购与淘宝店铺授权"
                style={{ padding: '40px 0' }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddAuthModalOpen(true)}
                >
                  新增授权
                </Button>
              </Empty>
            ) : (
              <Table
                rowKey="xyShopId"
                dataSource={filteredTaobaoShops}
                pagination={{
                  total: filteredTaobaoShops.length,
                  pageSize: 10,
                  showTotal: (t) => `共 ${t} 家淘宝店铺`,
                }}
                columns={[
                  {
                    title: '店铺ID',
                    dataIndex: 'xyShopId',
                    key: 'xyShopId',
                    width: 150,
                    render: (val) => <span style={{ fontFamily: 'monospace' }}>{val}</span>,
                  },
                  {
                    title: '淘宝账号',
                    dataIndex: 'sellerNick',
                    key: 'sellerNick',
                    render: (val, record) => (
                      <Space>
                        <ShopOutlined style={{ color: '#ff5000', fontSize: 16 }} />
                        <span style={{ fontWeight: 600, color: '#262626' }}>{val}</span>
                        {record.isNewCallback && <Tag color="volcano">新授权</Tag>}
                      </Space>
                    ),
                  },
                  {
                    title: '授权状态',
                    dataIndex: 'authStatus',
                    key: 'authStatus',
                    width: 150,
                    render: (status, record) => {
                      if (status === 'authorized') {
                        return <Badge status="success" text={<Tag color="success">已授权</Tag>} />
                      }
                      if (status === 'expired') {
                        return (
                          <Badge
                            status="error"
                            text={<Tag color="error">{record.authStatusText}</Tag>}
                          />
                        )
                      }
                      return <Badge status="default" text={<Tag>未授权</Tag>} />
                    },
                  },
                  {
                    title: '授权时间',
                    dataIndex: 'authTime',
                    key: 'authTime',
                    width: 180,
                  },
                  {
                    title: '授权到期时间',
                    dataIndex: 'expireTime',
                    key: 'expireTime',
                    width: 180,
                  },
                  {
                    title: '操作',
                    key: 'action',
                    width: 190,
                    render: (_, record) => (
                      <Space split={<Divider type="vertical" />}>
                        {record.authStatus === 'authorized' ? (
                          <a onClick={() => handleStartMoveWithShop(record.xyShopId)}>去搬家商品</a>
                        ) : (
                          <a
                            style={{ color: '#ff5000', fontWeight: 500 }}
                            onClick={() => setAddAuthModalOpen(true)}
                          >
                            重新授权
                          </a>
                        )}
                        <a onClick={() => setAddAuthModalOpen(true)}>更新授权</a>
                      </Space>
                    ),
                  },
                ]}
              />
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
       * 外链视图 1：淘宝服务市场（第一步：点击订购应用跳转页）
       * ===================================================================== */}
      {currentView === 'taobaoOrder' && (
        <div className="tb-market-container">
          <div className="tb-market-top-nav">
            <div className="tb-market-brand">
              <span className="tb-market-brand-logo">淘宝服务市场</span>
              <span style={{ fontSize: 13, color: '#8c8c8c' }}>
                第一步：完成第三方 ISV 商品搬家应用订购
              </span>
            </div>
            <div className="tb-market-url-bar">
              <LockOutlined style={{ color: '#52c41a' }} />
              <span>https://fuwu.taobao.com/ser/detail.htm?service_code=FW_GOODS_ISV_MOVE</span>
            </div>
            <Button
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                switchView('taobaoAuth')
                setAddAuthModalOpen(true)
              }}
            >
              返回系统授权弹窗
            </Button>
          </div>

          <div className="tb-market-body">
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
              message="第一步：请先在淘宝服务市场完成应用订购"
              description="请使用需要搬出商品的淘宝卖家主账号完成订购。订购完成后，请返回系统弹窗点击第二步「已订购，去授权」完成账号授权。"
            />

            <div className="tb-app-detail-row">
              <div className="tb-app-cover">
                <ShopOutlined style={{ fontSize: 42 }} />
                <div style={{ fontWeight: 700, fontSize: 15 }}>商品互通ISV</div>
                <Tag color="gold" style={{ margin: 0 }}>
                  第一步：订购应用
                </Tag>
              </div>

              <div className="tb-app-info">
                <h2 style={{ margin: 0, fontSize: 20, color: '#262626' }}>
                  火牛商品互通助手（SaaS跨平台商品搬家专享ISV应用）
                </h2>
                <p style={{ color: '#595959', fontSize: 13, marginTop: 8, marginBottom: 20 }}>
                  订购本应用后，即可通过开放接口将您淘宝店铺的商品一键搬家至商城仓库中。
                </p>

                <Form layout="vertical" style={{ maxWidth: 520 }}>
                  <Form.Item label="选择订购周期">
                    <Radio.Group defaultValue="year">
                      <Radio.Button value="quarter">1个季度 (¥0.00 合作专享)</Radio.Button>
                      <Radio.Button value="year">1年期 (¥0.00 合作专享)</Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <Space size={12} style={{ marginTop: 12 }}>
                    <Button
                      className="tb-buy-btn"
                      onClick={() => {
                        message.success('淘宝应用订购成功！接下来请完成第二步：淘宝卖家账号授权')
                        switchView('taobaoAuth')
                        setAddAuthModalOpen(true)
                      }}
                    >
                      立即免费订购（完成后返回点第二步去授权）
                    </Button>
                    <Button
                      size="large"
                      onClick={() => {
                        switchView('taobaoAuth')
                        setAddAuthModalOpen(true)
                      }}
                    >
                      返回系统弹窗
                    </Button>
                  </Space>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
       * 外链视图 2：淘宝开放平台授权页（第二步：已订购，去授权跳转页）
       * ===================================================================== */}
      {currentView === 'taobaoOAuth' && (
        <div className="tb-market-container">
          <div className="tb-market-top-nav">
            <div className="tb-market-brand">
              <span
                className="tb-market-brand-logo"
                style={{ background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)' }}
              >
                淘宝开放平台 OAuth 2.0
              </span>
              <span style={{ fontSize: 13, color: '#8c8c8c' }}>
                第二步：使用淘宝卖家账号登录并确认授权
              </span>
            </div>
            <div className="tb-market-url-bar">
              <LockOutlined style={{ color: '#52c41a' }} />
              <span>https://oauth.taobao.com/authorize?response_type=code&amp;client_id=ISV_880921</span>
            </div>
            <Button
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                switchView('taobaoAuth')
                setAddAuthModalOpen(true)
              }}
            >
              返回系统
            </Button>
          </div>

          <div className="tb-market-body">
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
              message="第二步：请使用已完成应用订购的淘宝卖家账号确认授权"
              description="点击下方「确认授权并跳回系统」后，将自动跳回您的管理后台，并弹窗显示授权成功的店铺ID和店铺昵称。"
            />

            <div className="tb-app-detail-row">
              <div
                className="tb-app-cover"
                style={{
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  boxShadow: '0 6px 16px rgba(24,144,255,0.22)',
                }}
              >
                <SafetyCertificateOutlined style={{ fontSize: 42 }} />
                <div style={{ fontWeight: 700, fontSize: 15 }}>卖家账号授权</div>
                <Tag color="blue" style={{ margin: 0 }}>
                  第二步：去授权
                </Tag>
              </div>

              <div className="tb-app-info">
                <h2 style={{ margin: 0, fontSize: 20, color: '#262626' }}>
                  确认将您的淘宝店铺商品权限授权给「火牛商品互通助手」
                </h2>

                <Form layout="vertical" style={{ marginTop: 20, maxWidth: 520 }}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>淘宝店铺 ID</span>} required>
                    <Input
                      value={oauthShopIdInput}
                      onChange={(e) => setOauthShopIdInput(e.target.value)}
                      placeholder="请输入淘宝店铺ID"
                    />
                  </Form.Item>

                  <Form.Item label={<span style={{ fontWeight: 600 }}>淘宝店铺昵称</span>} required>
                    <Input
                      prefix={<ShopOutlined style={{ color: '#ff5000' }} />}
                      value={oauthShopNickInput}
                      onChange={(e) => setOauthShopNickInput(e.target.value)}
                      placeholder="请输入淘宝店铺昵称"
                    />
                    <div style={{ marginTop: 6, fontSize: 12, color: '#8c8c8c' }}>
                      快速切换测试店铺：
                      <Space size={6} style={{ marginLeft: 4 }}>
                        <a
                          onClick={() => {
                            setOauthShopIdInput('100208')
                            setOauthShopNickInput('星云官方淘宝旗舰店')
                            setOauthSellerNickInput('tb_xingyun_flagship')
                          }}
                        >
                          星云官方淘宝旗舰店(100208)
                        </a>
                        <span>|</span>
                        <a
                          onClick={() => {
                            setOauthShopIdInput('100209')
                            setOauthShopNickInput('极光美妆淘宝自营店')
                            setOauthSellerNickInput('tb_aurora_beauty')
                          }}
                        >
                          极光美妆淘宝自营店(100209)
                        </a>
                        <span>|</span>
                        <a
                          onClick={() => {
                            setOauthShopIdInput('100202')
                            setOauthShopNickInput('星云服饰奥莱淘宝老店')
                            setOauthSellerNickInput('tb_outlet_old')
                          }}
                        >
                          星云服饰奥莱淘宝老店(100202 重授权)
                        </a>
                      </Space>
                    </div>
                  </Form.Item>

                  <Form.Item label="淘宝卖家旺旺账号">
                    <Input
                      value={oauthSellerNickInput}
                      onChange={(e) => setOauthSellerNickInput(e.target.value)}
                    />
                  </Form.Item>

                  <Space size={16} style={{ marginTop: 8 }}>
                    <Button
                      className="tb-buy-btn"
                      loading={oauthSubmitting}
                      onClick={handleCompleteOAuthCallback}
                    >
                      确认授权并跳回系统
                    </Button>
                    <Button size="large" onClick={() => switchView('taobaoAuth')}>
                      取消
                    </Button>
                  </Space>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
       * 弹窗 A：新增淘宝店铺授权（分成两步：1、点击订购应用  2、已订购，去授权）
       * ===================================================================== */}
      <Modal
        width={620}
        title="新增淘宝店铺授权"
        open={addAuthModalOpen}
        onCancel={() => setAddAuthModalOpen(false)}
        footer={
          <Button onClick={() => setAddAuthModalOpen(false)}>关闭</Button>
        }
      >
        <Alert
          type="info"
          showIcon
          message="淘宝店铺商品搬家需通过第三方合作 ISV 应用完成授权，请按以下两步依次操作："
          style={{ marginBottom: 18 }}
        />

        <div className="two-step-auth-list">
          {/* 第一步 */}
          <div className="two-step-auth-card">
            <div className="two-step-card-header">
              <div className="two-step-card-title">
                <span className="two-step-num-circle">1</span>
                <span>第一步：订购淘宝服务市场应用</span>
              </div>
              <Tag color="orange">首次授权必做</Tag>
            </div>
            <div className="two-step-card-desc">
              请先点击下方按钮跳转至淘宝服务市场完成第三方 ISV 应用订购（请使用需要搬出商品的淘宝店铺主账号登录订购；若该店铺已订购且在有效期内，可直接进行第二步）。
            </div>
            <div className="two-step-card-actions">
              <Button
                type="primary"
                icon={<ExportOutlined />}
                style={{
                  background: 'linear-gradient(90deg, #ff9000 0%, #ff5000 100%)',
                  border: 'none',
                }}
                onClick={handleGoStep1OrderApp}
              >
                1、点击订购应用
              </Button>
              <Button
                type="link"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => message.success('已复制淘宝服务市场应用订购链接')}
              >
                复制订购链接
              </Button>
            </div>
          </div>

          {/* 第二步 */}
          <div className="two-step-auth-card">
            <div className="two-step-card-header">
              <div className="two-step-card-title">
                <span className="two-step-num-circle">2</span>
                <span>第二步：淘宝卖家账号确认授权</span>
              </div>
              <Tag color="green">订购后操作</Tag>
            </div>
            <div className="two-step-card-desc">
              应用订购完成后，请点击下方按钮使用同一淘宝卖家账号登录并完成店铺授权。授权完成后将自动跳回本页面并同步店铺信息。
            </div>
            <div className="two-step-card-actions">
              <Button
                type="primary"
                icon={<SafetyCertificateOutlined />}
                onClick={() => handleGoStep2OAuth()}
              >
                2、已订购，去授权
              </Button>
              <Button
                type="link"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => message.success('已复制淘宝卖家店铺授权链接')}
              >
                复制授权链接
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* =====================================================================
       * 弹窗 B：授权完成跳回页面 —— 直接弹窗提示授权成功（显示店铺ID和店铺昵称）
       * ===================================================================== */}
      <Modal
        width={460}
        title="授权结果提示"
        open={authSuccessModalInfo.open}
        onCancel={() =>
          setAuthSuccessModalInfo((prev) => ({ ...prev, open: false }))
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              onClick={() =>
                setAuthSuccessModalInfo((prev) => ({ ...prev, open: false }))
              }
            >
              我知道了
            </Button>
            <Button
              type="primary"
              onClick={() => {
                const targetId = authSuccessModalInfo.shopId
                setAuthSuccessModalInfo((prev) => ({ ...prev, open: false }))
                handleStartMoveWithShop(targetId)
              }}
            >
              去创建搬家任务
            </Button>
          </div>
        }
      >
        <div className="auth-success-modal-content">
          <div className="auth-success-icon-wrap">
            <CheckOutlined />
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#262626' }}>
            淘宝店铺授权成功
          </div>
          <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 4 }}>
            已成功获取该淘宝店铺授权，现在可以拉取店铺商品进行搬家了
          </div>

          <div className="auth-success-info-box">
            <div className="auth-success-kv-row">
              <span style={{ color: '#8c8c8c', fontSize: 13 }}>店铺ID</span>
              <span style={{ color: '#262626', fontWeight: 600, fontFamily: 'monospace' }}>
                {authSuccessModalInfo.shopId}
              </span>
            </div>
            <div className="auth-success-kv-row">
              <span style={{ color: '#8c8c8c', fontSize: 13 }}>店铺昵称</span>
              <span style={{ color: '#262626', fontWeight: 600 }}>
                {authSuccessModalInfo.shopName}
              </span>
            </div>
            <div className="auth-success-kv-row">
              <span style={{ color: '#8c8c8c', fontSize: 13 }}>授权状态</span>
              <Tag color="success" style={{ margin: 0 }}>
                已授权
              </Tag>
            </div>
          </div>
        </div>
      </Modal>

      {/* =====================================================================
       * 弹窗 C：创建搬家任务 (还原 addMoveTask.vue，支持抖音 + 淘宝)
       * ===================================================================== */}
      <Modal
        width={800}
        title="创建搬家任务"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button disabled={saveLoading} onClick={() => setAddModalOpen(false)}>
              取消
            </Button>
            <Button
              type="primary"
              loading={saveLoading}
              disabled={
                !formChannel ||
                !formShopId ||
                !formDeliveryTemplateId ||
                prodIds.length === 0
              }
              onClick={handleSubmitMoveTask}
            >
              开始搬家
            </Button>
          </div>
        }
        destroyOnClose
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}>
          <Alert
            type="info"
            showIcon
            message="商品搬入成功后默认放入「仓库中」，可核对商品价格等关键信息后再进行批量上架"
            style={{ marginBottom: 20 }}
          />

          <Form
            labelCol={{ style: { width: 110, textAlign: 'left' } }}
            wrapperCol={{ style: { flex: 1 } }}
            colon={false}
          >
            <Form.Item label={<span><span style={{ color: '#ff4d4f' }}>* </span>搬出平台</span>}>
              <div className="channel-card-group">
                <div
                  className={`channel-select-card ${formChannel === 4 ? 'active' : ''}`}
                  onClick={() => handleSelectChannel(4)}
                >
                  <div className="channel-icon douyin">抖</div>
                  <div className="channel-name">抖音</div>
                  {formChannel === 4 && (
                    <>
                      <div className="channel-check-corner" />
                      <CheckOutlined className="channel-check-icon" />
                    </>
                  )}
                </div>

                <div
                  className={`channel-select-card ${formChannel === 1 ? 'active' : ''}`}
                  onClick={() => handleSelectChannel(1)}
                >
                  <div className="channel-icon taobao">淘</div>
                  <div className="channel-name">淘宝</div>
                  {formChannel === 1 && (
                    <>
                      <div className="channel-check-corner" />
                      <CheckOutlined className="channel-check-icon" />
                    </>
                  )}
                </div>
              </div>
            </Form.Item>

            <Form.Item
              label={<span><span style={{ color: '#ff4d4f' }}>* </span>搬出店铺</span>}
              extra={
                formChannel === 1 ? (
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 6 }}>
                    淘宝店铺通过第三方淘宝 ISV 应用进行授权，若未看到目标店铺或授权过期，请点击「
                    <a onClick={handleGoAuthShop}>去授权店铺</a>」前往授权列表页新增授权。
                  </div>
                ) : null
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <Select
                  style={{ width: 320 }}
                  placeholder="请选择搬出店铺"
                  value={formShopId}
                  onChange={(val) => setFormShopId(val)}
                  dropdownRender={(menu) => (
                    <div>
                      <div
                        style={{
                          padding: '6px 12px',
                          cursor: 'pointer',
                          color: '#1890ff',
                          borderBottom: '1px solid #f0f0f0',
                          fontWeight: 500,
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleGoAuthShop}
                      >
                        <PlusOutlined style={{ marginRight: 6 }} />
                        去授权店铺
                      </div>
                      {menu}
                    </div>
                  )}
                >
                  {channelShops.map((item) => (
                    <Select.Option
                      key={item.xyShopId}
                      value={item.xyShopId}
                      disabled={item.authStatus !== 'authorized'}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>
                          {item.shopName}（{item.orderSourceDesc}）
                        </span>
                        <Tag
                          color={item.authStatus === 'authorized' ? 'success' : 'error'}
                          style={{ marginLeft: 8, marginRight: 0 }}
                        >
                          {item.authStatusText}
                        </Tag>
                      </div>
                    </Select.Option>
                  ))}
                </Select>

                <div className="form-helper-links">
                  <a onClick={handleGoAuthShop}>
                    {formChannel === 1 ? '去授权淘宝店铺' : '管理授权店铺'}
                  </a>
                  <span className="form-helper-divider">|</span>
                  <a onClick={() => message.success('已刷新授权店铺列表')}>刷新</a>
                </div>
              </div>
            </Form.Item>

            <Form.Item label={<span><span style={{ color: '#ff4d4f' }}>* </span>商品ID</span>}>
              <div className="prod-textarea-box">
                <Input.TextArea
                  rows={8}
                  value={formProdInfo}
                  onChange={(e) => setFormProdInfo(e.target.value)}
                  placeholder={`请输入${
                    formChannel === 1 ? '淘宝' : '抖音'
                  }商品ID，多个请换行输入，最多可输入 500 个`}
                  style={{ paddingBottom: 28, resize: 'none' }}
                />
                <div className="prod-textarea-counter">{prodIds.length}/500</div>
              </div>
              <div style={{ marginTop: 6, fontSize: 12 }}>
                <Space size={12}>
                  <a onClick={() => handleFillSampleProdIds(false)}>
                    填入测试{formChannel === 1 ? '淘宝' : '抖音'}商品ID
                  </a>
                  <a onClick={() => handleFillSampleProdIds(true)} style={{ color: '#fa8c16' }}>
                    填入含历史重复的商品ID (测试重复拦截弹窗)
                  </a>
                </Space>
              </div>
            </Form.Item>

            <Form.Item label={<span><span style={{ color: '#ff4d4f' }}>* </span>运费模板</span>}>
              <Select
                style={{ width: 320 }}
                placeholder="请选择"
                value={formDeliveryTemplateId}
                onChange={(val) => setFormDeliveryTemplateId(val)}
                options={TRANSPORT_OPTIONS.map((t) => ({
                  label: t.transName,
                  value: t.transportId,
                }))}
              />
              <div className="form-helper-links">
                <a onClick={() => message.info('跳转至 /shop-transport 管理运费模板')}>
                  管理运费模板
                </a>
                <span className="form-helper-divider">|</span>
                <a onClick={() => message.success('运费模板已刷新')}>刷新</a>
              </div>
            </Form.Item>

            <Form.Item label="商品分组">
              <Select
                mode="multiple"
                style={{ width: 320 }}
                placeholder="请选择"
                value={formTagIds}
                onChange={(val) => setFormTagIds(val)}
                options={TAG_OPTIONS.map((tag) => ({
                  label: tag.title,
                  value: tag.id,
                }))}
              />
              <div className="form-helper-links">
                <a onClick={() => message.info('跳转至 /prod/prodTag 管理分组')}>管理分组</a>
                <span className="form-helper-divider">|</span>
                <a onClick={() => message.success('商品分组已刷新')}>刷新</a>
              </div>
            </Form.Item>

            <Form.Item label="商品后台类目">
              <Cascader
                style={{ width: 320 }}
                placeholder="请选择"
                options={CATEGORY_OPTIONS}
                value={formCategoryId}
                onChange={(val) => setFormCategoryId(val as number[])}
              />
              <div className="form-helper-links">
                <a onClick={() => message.info('跳转至 /prod/category 管理分类')}>管理分类</a>
                <span className="form-helper-divider">|</span>
                <a onClick={() => message.success('商品分类已刷新')}>刷新</a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* =====================================================================
       * 弹窗 D：搬家提示 - 重复商品ID拦截弹窗
       * ===================================================================== */}
      <Modal
        width={480}
        title="搬家提示"
        open={repeatModalOpen}
        onCancel={() => setRepeatModalOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClearRepeatIds}>一键清除历史商品ID</Button>
          </div>
        }
      >
        <div style={{ fontWeight: 500, color: '#262626', marginBottom: 16 }}>
          以下 {repeatIds.length} 个商品历史已搬入，不可重复搬入，请删除历史商品后继续导入其他商品
        </div>
        <div
          style={{
            padding: 8,
            height: 100,
            overflowY: 'auto',
            background: '#f7f7f7',
            border: '1px solid #d9d9d9',
            borderRadius: 2,
            fontSize: 14,
            lineHeight: '22px',
            color: '#595959',
          }}
        >
          {repeatIds.map((id) => (
            <div key={id}>{id}</div>
          ))}
        </div>
      </Modal>

      {/* =====================================================================
       * 弹窗 E：商品搬入记录
       * ===================================================================== */}
      <Modal
        width={960}
        title={`商品搬入记录${
          activeTaskRecord
            ? `（任务ID: ${activeTaskRecord.id} - ${activeTaskRecord.isvShop.shopName}）`
            : ''
        }`}
        open={recordModalOpen}
        onCancel={() => setRecordModalOpen(false)}
        footer={null}
      >
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 16,
            alignItems: 'center',
          }}
        >
          <Input
            placeholder="请输入商品ID"
            style={{ width: 180 }}
            allowClear
            value={recordSearchProdId}
            onChange={(e) => setRecordSearchProdId(e.target.value)}
          />
          <Input
            placeholder="请输入商品名称"
            style={{ width: 220 }}
            allowClear
            value={recordSearchProdName}
            onChange={(e) => setRecordSearchProdName(e.target.value)}
          />
          <Select
            placeholder="搬入状态"
            style={{ width: 140 }}
            allowClear
            value={recordSearchStatus}
            onChange={(val) => setRecordSearchStatus(val)}
            options={[
              { label: '成功', value: 1 },
              { label: '失败', value: -1 },
            ]}
          />
          <Button
            onClick={() => {
              setRecordSearchProdId('')
              setRecordSearchProdName('')
              setRecordSearchStatus(undefined)
            }}
          >
            重置
          </Button>
        </div>

        <Table
          rowKey="id"
          dataSource={filteredRecords}
          pagination={{
            total: filteredRecords.length,
            pageSize: 10,
            showTotal: (t) => `共 ${t} 件商品`,
          }}
          columns={[
            {
              title: '商品ID',
              dataIndex: 'isvProdId',
              key: 'isvProdId',
              width: 160,
            },
            {
              title: '商品图片',
              key: 'isvPic',
              width: 100,
              render: (_, row) =>
                row.isvPic ? (
                  <Popover
                    content={
                      <img
                        src={row.isvPic}
                        alt=""
                        style={{ width: 240, borderRadius: 4 }}
                      />
                    }
                  >
                    <img
                      src={row.isvPic}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    />
                  </Popover>
                ) : (
                  '-'
                ),
            },
            {
              title: '商品名称',
              dataIndex: 'isvProdName',
              key: 'isvProdName',
            },
            {
              title: '搬入状态',
              key: 'status',
              width: 140,
              render: (_, row) => (
                <Space size={4}>
                  <Tag color={row.status === 1 ? 'success' : 'error'}>
                    {row.status === 1 ? '成功' : '失败'}
                  </Tag>
                  {row.status === -1 && row.failReason && (
                    <Tooltip title={row.failReason}>
                      <InfoCircleOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
                    </Tooltip>
                  )}
                </Space>
              ),
            },
            {
              title: '操作',
              key: 'action',
              width: 110,
              render: (_, row) =>
                row.status === -1 || !row.isValidProd ? (
                  <span>-</span>
                ) : (
                  <a
                    onClick={() =>
                      message.info(
                        `新窗口打开商品编辑页：/dtmall/prod/prodList/prodInfo?prodId=${row.xyProdId}`
                      )
                    }
                  >
                    编辑详情
                  </a>
                ),
            },
          ]}
        />
      </Modal>
    </div>
  )
}
