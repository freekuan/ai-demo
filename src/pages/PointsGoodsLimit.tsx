import { useState, useMemo } from 'react'
import {
  InputNumber,
  Radio,
  Checkbox,
  Switch,
  Button,
  Select,
  DatePicker,
  Tooltip,
  Slider,
  message,
  Badge,
  Tag,
  Typography,
  Space,
  Row,
  Col
} from 'antd'
import {
  QuestionCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  ShoppingOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import './PointsGoodsLimit.css'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

// 预定义创作者等级选项
const CREATOR_LEVELS = [
  '等级1', '等级2', '等级3', '等级4',
  '等级5', '等级6', '等级7', '等级8'
]

export default function PointsGoodsLimit() {
  // ==========================================
  // B端：商品兑换限制配置状态
  // ==========================================
  const [limitQuantity, setLimitQuantity] = useState<boolean>(true)
  const [quantityLimit, setQuantityLimit] = useState<number>(1)
  const [limitExchangeType, setLimitExchangeType] = useState<string>('creator') // 默认选中 'creator'，突出创作者兑换
  
  // 创作者子配置选项
  const [limitLevel, setLimitLevel] = useState<boolean>(true)
  const [creatorLevels, setCreatorLevels] = useState<string[]>(['等级3', '等级4'])
  
  // 新增条件：指定时间范围内的有效作品数
  const [limitWorks, setLimitWorks] = useState<boolean>(true)
  const [timeRangeType, setTimeRangeType] = useState<string>('30') // '7' | '30' | '90' | 'custom'
  const [customTimeRange, setCustomTimeRange] = useState<any>(null)
  const [worksCountLimit, setWorksCountLimit] = useState<number>(5)

  // 基础商品设置项
  const [sortWeight, setSortWeight] = useState<number>(0)
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const [deliveryType, setDeliveryType] = useState<string[]>(['merchant'])
  const [shippingType, setShippingType] = useState<string>('free') // 'free' | 'custom'
  const [shippingFee, setShippingFee] = useState<number>(6)

  // ==========================================
  // C端：模拟器数据状态 (右侧配置改变或左侧模拟属性改变时联动)
  // ==========================================
  const [mockIsCreator, setMockIsCreator] = useState<boolean>(true)
  const [mockLevel, setMockLevel] = useState<string>('等级3')
  const [mockWorksCount, setMockWorksCount] = useState<number>(3) // 默认3篇，右侧限制5篇，从而默认呈现“未满足”状态

  // ==========================================
  // B端交互逻辑
  // ==========================================
  // 重置配置
  const handleReset = () => {
    setLimitQuantity(true)
    setQuantityLimit(1)
    setLimitExchangeType('creator')
    setLimitLevel(true)
    setCreatorLevels(['等级3', '等级4'])
    setLimitWorks(true)
    setTimeRangeType('30')
    setCustomTimeRange(null)
    setWorksCountLimit(5)
    setSortWeight(0)
    setIsHidden(false)
    setDeliveryType(['merchant'])
    setShippingType('free')
    setShippingFee(6)
    
    // 模拟数据重置
    setMockIsCreator(true)
    setMockLevel('等级3')
    setMockWorksCount(3)
    
    message.success('配置已恢复为默认初始状态')
  }

  // 保存配置模拟
  const handleSave = () => {
    if (limitExchangeType === 'creator' && !limitLevel && !limitWorks) {
      message.warning('请至少勾选一种创作者限制条件（指定等级或作品数要求）！')
      return
    }
    if (limitExchangeType === 'creator' && limitLevel && creatorLevels.length === 0) {
      message.warning('请选择至少一个指定的创作者等级！')
      return
    }

    message.loading({ content: '正在保存商品销售与兑换限制规则...', key: 'save_limit' })
    setTimeout(() => {
      message.success({ content: '兑换限制规则保存成功，已同步发布到积分商城！', key: 'save_limit', duration: 2.5 })
    }, 1000)
  }

  // ==========================================
  // C端资格校验核心逻辑 (联动计算)
  // ==========================================
  const checkResults = useMemo(() => {
    let levelPassed = true
    let worksPassed = true
    let creatorPassed = true

    // 1. 创作者角色校验
    if (limitExchangeType === 'creator') {
      if (!mockIsCreator) {
        creatorPassed = false
        levelPassed = false
        worksPassed = false
      } else {
        // 2. 等级要求校验
        if (limitLevel && creatorLevels.length > 0) {
          levelPassed = creatorLevels.includes(mockLevel)
        }
        // 3. 作品数量校验
        if (limitWorks) {
          worksPassed = mockWorksCount >= worksCountLimit
        }
      }
    }

    const isAllPassed = levelPassed && worksPassed && creatorPassed

    return {
      creatorPassed,
      levelPassed,
      worksPassed,
      isAllPassed
    }
  }, [limitExchangeType, limitLevel, creatorLevels, limitWorks, worksCountLimit, mockIsCreator, mockLevel, mockWorksCount])

  // 时间范围描述文本
  const timeRangeLabel = useMemo(() => {
    if (timeRangeType === '7') return '最近7天内'
    if (timeRangeType === '30') return '最近30天内'
    if (timeRangeType === '90') return '最近90天内'
    if (timeRangeType === 'custom' && customTimeRange && customTimeRange.length === 2) {
      const start = dayjs(customTimeRange[0]).format('YYYY-MM-DD')
      const end = dayjs(customTimeRange[1]).format('YYYY-MM-DD')
      return `${start} 至 ${end} 期间`
    }
    return '指定时间范围内'
  }, [timeRangeType, customTimeRange])

  return (
    <div className="points-goods-limit-wrapper">
      {/* 头部导航/说明 */}
      <div className="limit-editor-header">
        <Space size={8} align="center">
          <ShoppingOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>
            积分商品销售与兑换规则配置
          </Title>
        </Space>
        <Text type="secondary" className="header-desc">
          在这里可以设置商品的兑换数量限制、用户人群限制（如普通会员、指定用户、指定创作者等条件）以及物流与排序属性。
        </Text>
      </div>

      <Row gutter={24}>
        {/* 左侧：手机预览模拟器 */}
        <Col xs={24} lg={9} xl={8} className="mobile-preview-container">
          <div className="preview-sticky-wrap">
            <div className="mobile-phone-frame">
              {/* 听筒和镜头 */}
              <div className="phone-top-notch"></div>
              
              {/* 状态栏 */}
              <div className="phone-status-bar" style={{ color: '#000' }}>
                <span className="time">13:52</span>
                <div className="icons">
                  <span className="cellular">📶</span>
                  <span className="wifi">🔋</span>
                </div>
              </div>

              {/* 手机内部屏幕 */}
              <div className="phone-screen-content">
                <div className="phone-nav-header">
                  <span className="back-arrow"><ArrowLeftOutlined /></span>
                  <span className="nav-title">商品详情</span>
                  <span className="more-menu">•••</span>
                </div>

                {/* 商品详情展示区 */}
                <div className="preview-scroll-body">
                  {/* 商品图片 */}
                  <div className="goods-img-box">
                    <img 
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" 
                      alt="商品主图" 
                      className="goods-main-image"
                    />
                    {limitExchangeType === 'creator' && (
                      <div className="creator-exclusive-badge">
                        <CrownOutlined style={{ marginRight: 4 }} />
                        创作者专享
                      </div>
                    )}
                  </div>

                  {/* 商品核心信息卡片 */}
                  <div className="goods-info-card">
                    <div className="goods-price-row">
                      <span className="price-points">3,000 <span className="points-unit">积分</span></span>
                      <span className="original-price">¥1,299</span>
                      <Tag color="red" className="hot-deal-tag">HOT</Tag>
                    </div>
                    <div className="goods-title">
                      【创作者专享】专业级多轴防抖云台稳定器
                    </div>
                    <div className="goods-sub-title">
                      专为高品质视频创作而生，提供超强三轴增稳，支持原生相机控制。
                    </div>
                  </div>

                  {/* 兑换限制说明卡片 (根据右侧配置动态显示) */}
                  <div className="eligibility-check-card">
                    <div className="card-header-bar">
                      <span className="card-title-text">兑换资格核验</span>
                      {checkResults.isAllPassed ? (
                        <span className="status-badge passed">✅ 已符合</span>
                      ) : (
                        <span className="status-badge failed">❌ 不符合</span>
                      )}
                    </div>

                    <div className="check-list-content">
                      {/* 1. 兑换数量限制说明 */}
                      {limitQuantity && (
                        <div className="check-item-row">
                          <CheckCircleOutlined className="check-icon-ok" />
                          <span className="item-text">限制：每人最多可兑换 {quantityLimit} 件</span>
                        </div>
                      )}

                      {/* 2. 限制兑换条件 */}
                      {limitExchangeType === 'all' && (
                        <div className="check-item-row">
                          <CheckCircleOutlined className="check-icon-ok" />
                          <span className="item-text">范围：面向所有小店会员开放兑换</span>
                        </div>
                      )}

                      {limitExchangeType === 'user' && (
                        <div className="check-item-row">
                          <CloseCircleOutlined className="check-icon-err" />
                          <span className="item-text">范围：仅限系统内测名单用户兑换 (您不在名单中)</span>
                        </div>
                      )}

                      {limitExchangeType === 'creator' && (
                        <>
                          {/* 创作者角色判断 */}
                          <div className="check-item-row">
                            {mockIsCreator ? (
                              <CheckCircleOutlined className="check-icon-ok" />
                            ) : (
                              <CloseCircleOutlined className="check-icon-err" />
                            )}
                            <span className="item-text">
                              身份：需为创作者 {mockIsCreator ? ' (是)' : ' (否)'}
                            </span>
                          </div>

                          {/* 创作者等级校验 */}
                          {limitLevel && creatorLevels.length > 0 && (
                            <div className="check-item-row">
                              {checkResults.levelPassed ? (
                                <CheckCircleOutlined className="check-icon-ok" />
                              ) : (
                                <CloseCircleOutlined className="check-icon-err" />
                              )}
                              <span className="item-text">
                                等级：需为 [{creatorLevels.join('/')}]
                                <span className="user-detail-val">（您的当前等级：{mockIsCreator ? mockLevel : '无'}）</span>
                              </span>
                            </div>
                          )}

                          {/* 有效作品数校验 */}
                          {limitWorks && (
                            <div className="check-item-row">
                              {checkResults.worksPassed ? (
                                <CheckCircleOutlined className="check-icon-ok" />
                              ) : (
                                <CloseCircleOutlined className="check-icon-err" />
                              )}
                              <span className="item-text">
                                作品：{timeRangeLabel} 有效作品需达 {worksCountLimit} 篇
                                <span className="user-detail-val">
                                  （您的发表篇数：{mockIsCreator ? mockWorksCount : 0} 篇）
                                </span>
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* 结论性横幅 */}
                    <div className={`eligibility-verdict-banner ${checkResults.isAllPassed ? 'success' : 'warning'}`}>
                      {checkResults.isAllPassed ? (
                        <>🎉 恭喜！您已符合当前商品的全部兑换条件。</>
                      ) : (
                        <>⚠️ 抱歉，您当前不满足兑换条件，请参照上述列表调整或积攒作品。</>
                      )}
                    </div>
                  </div>

                  {/* 基础详情说明图 */}
                  <div className="goods-detail-placeholder">
                    <span className="divider-line">商品图文详情</span>
                    <div className="placeholder-block">
                      <FileTextOutlined style={{ fontSize: 24, color: '#bfbfbf', marginBottom: 8 }} />
                      <p>这里是商品详情的 HTML 富文本内容区域...</p>
                    </div>
                  </div>
                </div>

                {/* 底部兑换操作栏 */}
                <div className="phone-bottom-action-bar">
                  <div className="cost-preview">
                    <span className="num">3,000</span>
                    <span className="unit">积分</span>
                  </div>
                  {checkResults.isAllPassed ? (
                    <button type="button" className="btn-action-primary" onClick={() => message.success('模拟兑换成功！')}>
                      立即兑换
                    </button>
                  ) : (
                    <button type="button" className="btn-action-primary disabled" disabled>
                      不符合兑换条件
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 模拟器专属：C端用户属性调试控制板 */}
            <div className="simulator-debug-panel">
              <div className="panel-title-row">
                <span className="panel-title">👤 C端登录用户属性模拟器</span>
                <span className="panel-subtitle">调试左侧C端页面的资格判定</span>
              </div>

              <div className="debug-item-row">
                <span className="debug-label">是否是创作者:</span>
                <Switch 
                  checked={mockIsCreator} 
                  onChange={(checked) => {
                    setMockIsCreator(checked)
                    if (!checked) {
                      setMockWorksCount(0)
                    }
                  }} 
                  checkedChildren="是" 
                  unCheckedChildren="否"
                />
              </div>

              {mockIsCreator && (
                <>
                  <div className="debug-item-row">
                    <span className="debug-label">模拟当前等级:</span>
                    <Radio.Group 
                      size="small" 
                      value={mockLevel} 
                      onChange={(e) => setMockLevel(e.target.value)}
                    >
                      <Radio.Button value="等级2">等级2</Radio.Button>
                      <Radio.Button value="等级3">等级3</Radio.Button>
                      <Radio.Button value="等级4">等级4</Radio.Button>
                      <Radio.Button value="等级5">等级5</Radio.Button>
                    </Radio.Group>
                  </div>

                  <div className="debug-item-row" style={{ display: 'block' }}>
                    <div className="slider-label-row">
                      <span className="debug-label">模拟发表有效作品数:</span>
                      <strong className="slider-value">{mockWorksCount} 篇</strong>
                    </div>
                    <Slider
                      min={0}
                      max={15}
                      value={mockWorksCount}
                      onChange={setMockWorksCount}
                      tooltip={{ formatter: (v) => `已发表 ${v} 篇作品` }}
                    />
                  </div>
                </>
              )}
              <div className="debug-tip-bar">
                * 修改调试板的参数，左侧手机界面会通过响应式计算得出核验状态，非常适合进行兑换限制条件的演示。
              </div>
            </div>
          </div>
        </Col>

        {/* 右侧：B端配置属性面板 */}
        <Col xs={24} lg={15} xl={16}>
          <div className="editor-properties-panel">
            {/* 顶栏控制组 */}
            <div className="panel-header-section">
              <span className="title">销售与限制条件配置表单</span>
              <div className="action-buttons">
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  style={{ color: '#8c8c8c' }}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  style={{ borderRadius: 6 }}
                >
                  发布并生效
                </Button>
              </div>
            </div>

            {/* 配置表单 */}
            <div className="limit-properties-form">
              {/* 一、销售限制配置卡片 */}
              <div className="prop-group-card">
                <h3 className="group-title">一、商品销售及限兑设置</h3>
                
                {/* 兑换数量限制 */}
                <div className="prop-row">
                  <div className="prop-label">
                    <span>兑换数量：</span>
                  </div>
                  <div className="prop-control vertical-controls">
                    <Checkbox
                      checked={limitQuantity}
                      onChange={(e) => setLimitQuantity(e.target.checked)}
                    >
                      限制每人可兑换数量
                    </Checkbox>
                    {limitQuantity && (
                      <div className="nested-input-row">
                        <span className="nested-label">每人最多可兑换</span>
                        <InputNumber
                          min={1}
                          max={9999}
                          value={quantityLimit}
                          onChange={(val) => val !== null && setQuantityLimit(val)}
                          style={{ width: 100, margin: '0 8px' }}
                        />
                        <span>件</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 限制兑换 */}
                <div className="prop-row" style={{ alignItems: 'flex-start' }}>
                  <div className="prop-label" style={{ paddingTop: 6 }}>
                    <span>限制兑换：</span>
                  </div>
                  <div className="prop-control vertical-controls">
                    <Radio.Group
                      value={limitExchangeType}
                      onChange={(e) => setLimitExchangeType(e.target.value)}
                      style={{ marginBottom: 12 }}
                    >
                      <Radio value="all">所有用户可兑换</Radio>
                      <Radio value="user">指定用户可兑换</Radio>
                      <Radio value="creator">指定创作者可兑换</Radio>
                    </Radio.Group>

                    {/* 创作者兑换的高级配置面板 */}
                    {limitExchangeType === 'creator' && (
                      <div className="creator-limit-subpanel animate-slide-in">
                        
                        {/* 1. 指定创作者等级 */}
                        <div className="subpanel-row">
                          <Checkbox
                            checked={limitLevel}
                            onChange={(e) => setLimitLevel(e.target.checked)}
                            className="subpanel-checkbox"
                          >
                            指定创作者等级
                          </Checkbox>
                          
                          {limitLevel && (
                            <div className="subpanel-content animate-fade-in">
                              <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%', maxWidth: 450 }}
                                placeholder="选择允许兑换的等级"
                                value={creatorLevels}
                                onChange={setCreatorLevels}
                                options={CREATOR_LEVELS.map(level => ({ label: level, value: level }))}
                                maxTagCount="responsive"
                              />
                            </div>
                          )}
                        </div>

                        {/* 2. 新增条件：指定时间范围内的有效作品数 */}
                        <div className="subpanel-row" style={{ borderTop: '1px dashed #f0f0f0', paddingTop: 14 }}>
                          <div className="flex-align-center-between" style={{ width: '100%' }}>
                            <Checkbox
                              checked={limitWorks}
                              onChange={(e) => setLimitWorks(e.target.checked)}
                              className="subpanel-checkbox"
                            >
                              指定时间范围内的有效作品数
                              <Tooltip title="只有在所选时间范围内，发表的有效作品（指已过审发布的原创作品）数量达到要求才可以兑换。此功能非常适合作为平台做大促、爆品激励创作者的内容生产手段。">
                                <QuestionCircleOutlined className="label-help-icon" />
                              </Tooltip>
                            </Checkbox>
                            <Badge status={limitWorks ? 'processing' : 'default'} text={limitWorks ? '已启用新条件' : '未启用'} />
                          </div>

                          {limitWorks && (
                            <div className="subpanel-content animate-fade-in" style={{ marginTop: 10 }}>
                              {/* 2.1 选择时间范围 */}
                              <div className="form-item-inner">
                                <div className="inner-label">选择时间范围：</div>
                                <div className="inner-control">
                                  <Radio.Group
                                    value={timeRangeType}
                                    onChange={(e) => {
                                      setTimeRangeType(e.target.value)
                                      if (e.target.value !== 'custom') {
                                        setCustomTimeRange(null)
                                      }
                                    }}
                                    buttonStyle="solid"
                                    size="small"
                                    style={{ marginBottom: 8 }}
                                  >
                                    <Radio.Button value="7">最近7天</Radio.Button>
                                    <Radio.Button value="30">最近30天</Radio.Button>
                                    <Radio.Button value="90">最近90天</Radio.Button>
                                    <Radio.Button value="custom">自定义时间段</Radio.Button>
                                  </Radio.Group>
                                  
                                  {timeRangeType === 'custom' && (
                                    <div className="custom-datepicker-row animate-fade-in">
                                      <RangePicker 
                                        style={{ width: '100%', maxWidth: 350 }}
                                        value={customTimeRange}
                                        onChange={setCustomTimeRange}
                                        placeholder={['开始日期', '结束日期']}
                                      />
                                      <div className="custom-picker-tip">
                                        系统将自动抓取该指定日期范围内的所有已审核、已发表作品数进行计算判定。
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* 2.2 填入作品数量 */}
                              <div className="form-item-inner" style={{ marginTop: 14 }}>
                                <div className="inner-label">有效作品数需达：</div>
                                <div className="inner-control flex-align-center">
                                  <InputNumber
                                    min={1}
                                    max={999}
                                    value={worksCountLimit}
                                    onChange={(val) => val !== null && setWorksCountLimit(val)}
                                    style={{ width: 120, marginRight: 8 }}
                                    addonAfter="篇作品"
                                  />
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    (填入大于0的整数，未达标创作者无法兑换)
                                  </Text>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 二、商品辅助配置卡片 */}
              <div className="prop-group-card">
                <h3 className="group-title">二、商品其它基础设置</h3>
                
                {/* 商品排序 */}
                <div className="prop-row">
                  <div className="prop-label">
                    <span>商品排序：</span>
                  </div>
                  <div className="prop-control">
                    <InputNumber
                      min={0}
                      max={99999}
                      value={sortWeight}
                      onChange={(val) => val !== null && setSortWeight(val)}
                      style={{ width: 120, marginRight: 10 }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      数字越大，排序越靠前。商品列表默认以排序号及上架时间进行展示。
                    </Text>
                  </div>
                </div>

                {/* 商品隐藏 */}
                <div className="prop-row">
                  <div className="prop-label">
                    <span>商品隐藏：</span>
                  </div>
                  <div className="prop-control vertical-controls">
                    <Switch
                      checked={isHidden}
                      onChange={setIsHidden}
                      checkedChildren="是"
                      unCheckedChildren="否"
                    />
                    <div className="help-text-block">
                      若开启商品隐藏，则商品在商城列表隐藏，但用户可通过商品链接直接访问。适用于给特定人群定向推送的专享商品。
                    </div>
                  </div>
                </div>

                {/* 配送方式 */}
                <div className="prop-row">
                  <div className="prop-label">
                    <span>配送方式：</span>
                  </div>
                  <div className="prop-control">
                    <Checkbox.Group
                      options={[{ label: '商家配送', value: 'merchant' }]}
                      value={deliveryType}
                      disabled
                    />
                  </div>
                </div>

                {/* 运费设置 */}
                <div className="prop-row">
                  <div className="prop-label">
                    <span>运费设置：</span>
                  </div>
                  <div className="prop-control vertical-controls">
                    <Radio.Group
                      value={shippingType}
                      onChange={(e) => setShippingType(e.target.value)}
                      style={{ marginBottom: 8 }}
                    >
                      <Radio value="free">全国包邮</Radio>
                      <Radio value="custom">自定义运费</Radio>
                    </Radio.Group>
                    
                    {shippingType === 'custom' && (
                      <div className="nested-input-row animate-fade-in">
                        <span className="nested-label">运费金额</span>
                        <InputNumber
                          min={0.01}
                          max={500}
                          precision={2}
                          value={shippingFee}
                          onChange={(val) => val !== null && setShippingFee(val)}
                          style={{ width: 100, margin: '0 8px' }}
                          addonAfter="元"
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          (将会在C端兑换支付页面提示并扣除)
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 三、设计说明 & AI 规则小助手卡片 */}
              <div className="prop-group-card alert-info-card">
                <div className="alert-header">
                  <ThunderboltOutlined className="icon-alert" />
                  <span className="alert-title">运营建议 & 场景应用</span>
                </div>
                <ul className="alert-list-desc">
                  <li>
                    <strong>内容大促裂变：</strong>在双十一、品牌日等大促节点，可将爆品限量上架，并设置“最近7天发文数 ≥ 2”的限制条件，可以强力激活静默创作者，在短时间内产出大量带有品牌词的优质发文。
                  </li>
                  <li>
                    <strong>粉丝激励机制：</strong>创作者等级代表在平台的粉丝积攒与发文活跃，限定“等级3以上”可防低质小号与羊毛党，将真正的积分权益赋予中腰部以上、具有传播力的核心创作者。
                  </li>
                  <li>
                    <strong>物流联动：</strong>当选中“自定义运费”时，前台将根据商户的物流系统自动从兑换者的绑定微信钱包中完成支付抵扣。
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
