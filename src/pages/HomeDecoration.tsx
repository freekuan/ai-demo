import React, { useState, useRef, useMemo, useCallback } from 'react'
import {
  Modal,
  Dropdown,
  message,
  Input,
  Tag,
  Button
} from 'antd'
import type { MenuProps } from 'antd'
import {
  LeftOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  DownOutlined,
  EyeOutlined,
  SaveOutlined,
  SendOutlined,
  BulbOutlined,
  FireFilled,
  QrcodeOutlined,
  ThunderboltFilled,
  GiftFilled,
  CalendarOutlined,
  FileTextOutlined,
  HeartOutlined,
  SmileOutlined,
  RightOutlined,
  CameraOutlined,
  AudioOutlined,
  DeleteOutlined,
  CloseOutlined,
  HistoryOutlined,
  CompassOutlined
} from '@ant-design/icons'
import './HomeDecoration.css'

interface HomeDecorationProps {
  onBack?: () => void
}

export const HomeDecoration: React.FC<HomeDecorationProps> = ({ onBack }) => {
  // 1. Navigation & Theme Settings
  const [navStyle, setNavStyle] = useState<'follow' | 'custom'>('custom')
  const [navTheme, setNavTheme] = useState<'standard' | 'immersive'>('immersive')

  // 2. Title Settings
  const [titleEnabled, setTitleEnabled] = useState<boolean>(true)
  const [contentType, setContentType] = useState<'text' | 'image'>('text')
  const [titleText, setTitleText] = useState<string>('奈雪的茶')
  const [titlePosition, setTitlePosition] = useState<'center' | 'left'>('left')

  // 3. Search Settings (Core Feature)
  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(true)
  const [searchMode, setSearchMode] = useState<'inline_input' | 'icon_only' | 'full_input'>('inline_input')
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>('搜索心仪商品')
  const [searchShape, setSearchShape] = useState<'pill' | 'round' | 'square'>('pill')
  const [textAlign, setTextAlign] = useState<'left' | 'center'>('left')
  const [searchRightAction, setSearchRightAction] = useState<'none' | 'camera' | 'voice'>('camera')
  const [showBodySearchBlock, setShowBodySearchBlock] = useState<boolean>(false)
  const [hotKeywords, setHotKeywords] = useState<string[]>(['霸气杨梅', '生酪拿铁', '草莓大福', '油柑美式'])
  const [keywordInput, setKeywordInput] = useState<string>('')

  // 4. Color Settings
  const [navBgColor, setNavBgColor] = useState<string>('#FFFFFF')
  const [textMode, setTextMode] = useState<'dark' | 'light'>('dark')

  // 5. Left Component Library Tab
  const [activeComponentTab, setActiveComponentTab] = useState<'basic' | 'advanced'>('basic')

  // 6. Interactive Search Simulation Overlay inside Phone Mockup
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState<boolean>(false)
  const [simulatedSearchQuery, setSimulatedSearchQuery] = useState<string>('')
  const [searchHistory, setSearchHistory] = useState<string[]>(['芝士奶盖', '原味拿铁', '芋泥波波'])

  // 7. Scroll simulator state
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const phoneBodyRef = useRef<HTMLDivElement>(null)

  // 8. Toast simulation
  const [toastMessage, setToastMessage] = useState<string>('')
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 9. Preview Modal
  const [previewModalVisible, setPreviewModalVisible] = useState<boolean>(false)

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastMessage(msg)
    toastTimerRef.current = setTimeout(() => {
      setToastMessage('')
    }, 3000)
  }, [])

  // Check scroll state
  const isScrolledDown = useMemo(() => {
    return scrollOffset > 20
  }, [scrollOffset])

  // Computed text brightness
  const isDarkText = useMemo(() => {
    if (navTheme === 'immersive' && !isScrolledDown) {
      return false // Immersive top banner has dark background -> white text
    }
    return textMode === 'dark'
  }, [navTheme, isScrolledDown, textMode])

  // Dynamic Navigation Header Style
  const navHeaderStyle = useMemo<React.CSSProperties>(() => {
    if (navTheme === 'immersive') {
      if (isScrolledDown) {
        return {
          backgroundColor: navBgColor,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
        }
      } else {
        return {
          backgroundColor: 'transparent'
        }
      }
    } else {
      return {
        backgroundColor: navBgColor,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
      }
    }
  }, [navTheme, isScrolledDown, navBgColor])

  // Dynamic Search Input Container Style (Top Nav)
  const topNavSearchStyle = useMemo<React.CSSProperties>(() => {
    let borderRadius = '9999px'
    if (searchShape === 'round') borderRadius = '8px'
    if (searchShape === 'square') borderRadius = '2px'

    if (navTheme === 'immersive' && !isScrolledDown) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
        borderRadius
      }
    }
    return {
      backgroundColor: '#f1f5f9',
      color: '#334155',
      border: '1px solid #e2e8f0',
      borderRadius
    }
  }, [navTheme, isScrolledDown, searchShape])

  // Handle phone scroll
  const handlePhoneScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollOffset(Math.round(target.scrollTop))
  }

  // Handle slider scroll
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 0
    setScrollOffset(val)
    if (phoneBodyRef.current) {
      phoneBodyRef.current.scrollTop = val
    }
  }

  // Mutually Exclusive Rule Handling
  const handleToggleSearch = (checked: boolean) => {
    setIsSearchEnabled(checked)
    if (checked && searchMode === 'inline_input' && titlePosition === 'center') {
      setTitlePosition('left')
      showToast('开启紧凑搜索框时，标题已自动调整为居左展示')
    }
  }

  const handleSearchModeChange = (mode: 'inline_input' | 'icon_only' | 'full_input') => {
    setSearchMode(mode)
    if (mode === 'inline_input' && titlePosition === 'center') {
      setTitlePosition('left')
      showToast('搜索框模式下，标题已自动调整为居左展示')
    }
  }

  const handleSetTitlePosition = (pos: 'center' | 'left') => {
    if (pos === 'center' && isSearchEnabled && searchMode === 'inline_input') {
      showToast('搜索框模式下，标题不可设为居中（已切换为图标模式）')
      setTitlePosition('center')
      setSearchMode('icon_only')
      return
    }
    setTitlePosition(pos)
  }

  const handleSetNavTheme = (theme: 'standard' | 'immersive') => {
    setNavTheme(theme)
    if (theme === 'immersive') {
      setTextMode('light')
    } else {
      setTextMode('dark')
    }
  }

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return
    if (hotKeywords.includes(keywordInput.trim())) {
      message.warning('该关键词已存在')
      return
    }
    if (hotKeywords.length >= 6) {
      message.warning('最多添加 6 个热搜关键词')
      return
    }
    setHotKeywords([...hotKeywords, keywordInput.trim()])
    setKeywordInput('')
  }

  const handleRemoveKeyword = (kw: string) => {
    setHotKeywords(hotKeywords.filter(k => k !== kw))
  }

  const handleSearchClick = () => {
    setIsSearchOverlayOpen(true)
  }

  const handleExecuteSearch = (term: string) => {
    if (!term.trim()) return
    if (!searchHistory.includes(term)) {
      setSearchHistory([term, ...searchHistory.slice(0, 7)])
    }
    setSimulatedSearchQuery(term)
    message.success(`正在搜索商品: "${term}"`)
  }

  // Publish dropdown menu
  const publishMenuItems: MenuProps['items'] = [
    {
      key: 'direct_publish',
      label: '🚀 直接发布到线上',
      onClick: () => {
        message.loading({ content: '正在同步发布到小程序...', key: 'publish' })
        setTimeout(() => {
          message.success({ content: '🎉 首页装修已成功发布上线！', key: 'publish', duration: 3 })
        }, 600)
      }
    },
    {
      key: 'timed_publish',
      label: '⏰ 定时发布计划',
      onClick: () => {
        message.info('请选择定时发布的生效时间节点')
      }
    },
    {
      key: 'save_as_template',
      label: '📋 保存为新模板',
      onClick: () => {
        message.success('已将当前顶部导航与搜索配置保存至装修模板库')
      }
    }
  ]

  const handleSaveDraft = () => {
    message.loading({ content: '正在保存草稿...', key: 'save_draft' })
    setTimeout(() => {
      message.success({ content: '草稿保存成功！可以在模板库中随时恢复', key: 'save_draft' })
    }, 400)
  }

  return (
    <div className="home-decoration-wrapper">
      {/* 顶部操作导航条 */}
      <header className="home-dec-header">
        <div className="dec-header-left">
          <button className="dec-back-btn" onClick={onBack}>
            <LeftOutlined style={{ fontSize: 13, marginRight: 6 }} /> 返回
          </button>
          <div className="dec-header-divider"></div>
          <h1 className="dec-header-title">店铺首页装修 - 顶部导航配置方案</h1>
          <span className="dec-version-badge">v2.4 (搜索功能增强版)</span>
        </div>

        <div className="dec-header-right">
          <span className="dec-feature-tag">
            <InfoCircleOutlined style={{ marginRight: 6, color: '#d97706' }} />
            右侧已新增「搜索设置」模块
          </span>
          <button className="dec-btn dec-btn-default" onClick={() => setPreviewModalVisible(true)}>
            <EyeOutlined style={{ marginRight: 5 }} /> 预览
          </button>
          <button className="dec-btn dec-btn-default" onClick={handleSaveDraft}>
            <SaveOutlined style={{ marginRight: 5 }} /> 保存草稿
          </button>
          <Dropdown menu={{ items: publishMenuItems }} placement="bottomRight">
            <button className="dec-btn dec-btn-primary">
              <SendOutlined style={{ marginRight: 5 }} /> 页面发布 <DownOutlined style={{ fontSize: 11, marginLeft: 4 }} />
            </button>
          </Dropdown>
        </div>
      </header>

      {/* 主工作区 */}
      <div className="home-dec-body">
        {/* 左侧组件库面板 */}
        <aside className="home-dec-sidebar-left">
          <div className="component-tabs-nav">
            <button
              className={`component-tab-item ${activeComponentTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveComponentTab('basic')}
            >
              基础组件
            </button>
            <button
              className={`component-tab-item ${activeComponentTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setActiveComponentTab('advanced')}
            >
              高阶组件
            </button>
          </div>

          <div className="component-list-container">
            {activeComponentTab === 'basic' ? (
              <>
                <div className="component-group">
                  <div className="group-title">基础组件</div>
                  <div className="component-grid">
                    <div className="component-card" onClick={() => message.info('已选中「标题文字」组件')}>
                      <span className="comp-icon-text">T</span>
                      <span className="comp-name">标题文字</span>
                    </div>
                    <div className="component-card" onClick={() => message.info('已选中「图文广告」组件')}>
                      <span className="comp-icon-box">🖼</span>
                      <span className="comp-name">图文广告</span>
                    </div>
                    <div className="component-card" onClick={() => message.info('已选中「倒计时」组件')}>
                      <span className="comp-icon-box">⏱</span>
                      <span className="comp-name">倒计时</span>
                    </div>
                    {/* Featured Search Component Card */}
                    <div
                      className="component-card active-featured"
                      onClick={() => {
                        setShowBodySearchBlock(!showBodySearchBlock)
                        message.success(showBodySearchBlock ? '已隐藏页面主体搜索框' : '已在页面主体中添加「搜索框组件」！')
                      }}
                      title="点击切换页面主体搜索框"
                    >
                      <span className="new-tag-pill">NEW</span>
                      <SearchOutlined style={{ fontSize: 20, color: '#2563eb' }} />
                      <span className="comp-name u-font-bold u-text-blue-600">搜索框(页面)</span>
                    </div>
                    <div className="component-card" onClick={() => message.info('已选中「公告」组件')}>
                      <span className="comp-icon-box">📢</span>
                      <span className="comp-name">公告</span>
                    </div>
                    <div className="component-card" onClick={() => message.info('已选中「图文导航」组件')}>
                      <span className="comp-icon-box">📑</span>
                      <span className="comp-name">图文导航</span>
                    </div>
                  </div>
                </div>

                <div className="component-group">
                  <div className="group-title">商品组件</div>
                  <div className="component-grid">
                    <div className="component-card" onClick={() => message.info('已选中「商品列表」组件')}>
                      <span className="comp-icon-box">🛍</span>
                      <span className="comp-name">商品列表</span>
                    </div>
                    <div className="component-card" onClick={() => message.info('已选中「积分商品」组件')}>
                      <span className="comp-icon-box">🏪</span>
                      <span className="comp-name">积分商品</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="component-group">
                  <div className="group-title">互动营销</div>
                  <div className="component-grid">
                    <div className="component-card" onClick={() => message.info('已选中「幸运抽奖」组件')}>
                      <GiftFilled style={{ fontSize: 20, color: '#ec4899' }} />
                      <span className="comp-name">幸运抽奖</span>
                    </div>
                    <div className="component-card" onClick={() => message.info('已选中「砸金蛋」组件')}>
                      <ThunderboltFilled style={{ fontSize: 20, color: '#f59e0b' }} />
                      <span className="comp-name">砸金蛋</span>
                    </div>
                    <div className="component-card" onClick={() => message.info('已选中「优惠券包」组件')}>
                      <span className="comp-icon-box">🎟</span>
                      <span className="comp-name">优惠券包</span>
                    </div>
                    <div className="component-card" onClick={() => message.info('已选中「限时秒杀」组件')}>
                      <FireFilled style={{ fontSize: 20, color: '#ef4444' }} />
                      <span className="comp-name">限时秒杀</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* 中间画布预览区 (iPhone 8 / Modern Mobile View) */}
        <main className="home-dec-canvas-area">
          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="canvas-toast-alert">
              <InfoCircleOutlined style={{ color: '#f59e0b', fontSize: 14 }} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Dynamic Tip Bar & Scroll Simulator */}
          <div className="canvas-top-bar">
            <span className="canvas-device-info">
              <InfoCircleOutlined style={{ marginRight: 5, color: '#94a3b8' }} />
              默认预览视图: iPhone 8 (375x667)
            </span>

            {/* Canvas Scroll Simulator Slider */}
            <div className="canvas-scroll-simulator">
              <span className="simulator-label">模拟滚动:</span>
              <input
                type="range"
                min="0"
                max="120"
                value={scrollOffset}
                onChange={handleSliderChange}
                className="simulator-slider"
              />
              <span className="simulator-value u-font-mono">{scrollOffset}px</span>
            </div>
          </div>

          {/* Phone Shell Container */}
          <div className="phone-mockup-frame">
            {/* 微信小程序原生 Header (吸顶/沉浸过渡) */}
            <div className="phone-header-container" style={navHeaderStyle}>
              {/* 手机状态栏 (Status Bar) */}
              <div className={`phone-status-bar ${isDarkText ? 'text-dark' : 'text-light'}`}>
                <span className="status-time">9:41</span>
                <div className="status-icons">
                  <span className="status-signal">●●●●</span>
                  <span className="status-wifi">📶</span>
                  <span className="status-battery">🔋 100%</span>
                </div>
              </div>

              {/* 小程序自定义导航栏组件区域 */}
              <div className="phone-nav-bar">
                {/* 左侧与中部：搜索及标题响应布局 */}
                <div className={`nav-content-box ${titlePosition === 'center' && !isSearchEnabled ? 'justify-center' : ''}`}>
                  {/* 1. Title / Logo Representation */}
                  {titleEnabled && searchMode !== 'full_input' && (
                    <div
                      className={`nav-brand-title u-shrink-0 ${
                        titlePosition === 'center' && !isSearchEnabled ? 'u-mx-auto' : 'u-mr-2'
                      }`}
                    >
                      {contentType === 'text' ? (
                        <span className={`brand-text-display ${isDarkText ? 'u-text-dark' : 'u-text-light'}`}>
                          {titleText || '奈雪的茶'}
                        </span>
                      ) : (
                        <div className="brand-logo-badge">BRAND LOGO</div>
                      )}
                    </div>
                  )}

                  {/* 2. Form A: Icon Only Mode */}
                  {isSearchEnabled && searchMode === 'icon_only' && (
                    <div
                      className={`search-icon-btn ${isDarkText ? 'u-text-dark' : 'u-text-light'}`}
                      onClick={handleSearchClick}
                      title="点击体验小程序搜索"
                    >
                      <SearchOutlined style={{ fontSize: 16 }} />
                    </div>
                  )}

                  {/* 3. Form B: Inline Input Mode / Form C: Full Input Mode */}
                  {isSearchEnabled && (searchMode === 'inline_input' || searchMode === 'full_input') && (
                    <div
                      className={`search-input-pill ${textAlign === 'center' ? 'text-center-align' : ''}`}
                      style={topNavSearchStyle}
                      onClick={handleSearchClick}
                      title="点击体验小程序搜索浮层"
                    >
                      <SearchOutlined className="search-pill-icon" />
                      <span className="search-pill-placeholder u-truncate">
                        {searchPlaceholder || '搜索心仪商品'}
                      </span>
                      {searchRightAction === 'camera' && (
                        <CameraOutlined className="search-pill-action-icon" title="拍照识图" />
                      )}
                      {searchRightAction === 'voice' && (
                        <AudioOutlined className="search-pill-action-icon" title="语音搜商品" />
                      )}
                    </div>
                  )}
                </div>

                {/* 右侧：微信胶囊按钮固定位 (Capsule) */}
                <div className={`phone-capsule-button ${isDarkText ? 'capsule-dark-mode' : 'capsule-light-mode'}`}>
                  <span className="capsule-dots">•••</span>
                  <div className="capsule-line"></div>
                  <span className="capsule-circle">◎</span>
                </div>
              </div>
            </div>

            {/* 手机页面画布可滚动区域 */}
            <div
              className="phone-scroll-body phone-body-scroll"
              onScroll={handlePhoneScroll}
              ref={phoneBodyRef}
            >
              {/* Banner Head Image Area */}
              <div className="mockup-banner-area">
                <div className="banner-tag">参与活动 · 挑战上榜</div>
                <h2 className="banner-title">活动挑战榜</h2>
                <div className="banner-cta-button">
                  立即参与 <RightOutlined style={{ fontSize: 10, marginLeft: 4 }} />
                </div>
              </div>

              {/* In-Page Body Search Component (页面主体搜索框组件) */}
              {showBodySearchBlock && (
                <div className="mockup-body-search-container" onClick={handleSearchClick}>
                  <div className="body-search-card" style={{ borderRadius: searchShape === 'pill' ? '9999px' : searchShape === 'round' ? '8px' : '2px' }}>
                    <SearchOutlined className="body-search-icon" />
                    <span className="body-search-text u-truncate">
                      {searchPlaceholder || '搜索心仪商品'} (页面组件)
                    </span>
                    <button className="body-search-action-btn">
                      搜索
                    </button>
                  </div>
                </div>
              )}

              {/* Grid Nav Icons */}
              <div className="mockup-nav-grid">
                <div className="nav-grid-item">
                  <div className="grid-icon-circle bg-amber-50 text-amber-500">
                    <CalendarOutlined />
                  </div>
                  <span>每日签到</span>
                </div>
                <div className="nav-grid-item">
                  <div className="grid-icon-circle bg-blue-50 text-blue-500">
                    <FileTextOutlined />
                  </div>
                  <span>订单转积分</span>
                </div>
                <div className="nav-grid-item">
                  <div className="grid-icon-circle bg-pink-50 text-pink-500">
                    <GiftFilled />
                  </div>
                  <span>幸运抽奖</span>
                </div>
                <div className="nav-grid-item">
                  <div className="grid-icon-circle bg-purple-50 text-purple-500">
                    <HeartOutlined />
                  </div>
                  <span>心愿单</span>
                </div>
                <div className="nav-grid-item">
                  <div className="grid-icon-circle bg-emerald-50 text-emerald-500">
                    <SmileOutlined />
                  </div>
                  <span>集集乐</span>
                </div>
              </div>

              {/* Hot Keywords Bar */}
              {isSearchEnabled && hotKeywords.length > 0 && (
                <div className="mockup-hot-keywords">
                  <span className="hot-label">
                    <FireFilled style={{ color: '#ef4444', marginRight: 4 }} /> 热搜:
                  </span>
                  <div className="hot-tags-scroll">
                    {hotKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="hot-tag-pill"
                        onClick={() => {
                          handleExecuteSearch(kw)
                          setIsSearchOverlayOpen(true)
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Section Title */}
              <div className="mockup-section-header">
                <span className="section-title-text">
                  <FireFilled style={{ color: '#ef4444', marginRight: 6 }} /> 积分爆款推荐
                </span>
                <span className="section-more-link">
                  更多 <RightOutlined style={{ fontSize: 9 }} />
                </span>
              </div>

              {/* Product Cards */}
              <div className="mockup-products-grid">
                <div className="product-card-item">
                  <div className="product-thumb dark-thumb">
                    <span className="product-badge-hot">HOT</span>
                    <span className="product-thumb-text">剪映VIP-周卡</span>
                  </div>
                  <div className="product-details">
                    <div className="product-name">剪映VIP会员周卡</div>
                    <div className="product-price">
                      1000 <span className="price-unit">积分</span>
                    </div>
                  </div>
                </div>

                <div className="product-card-item">
                  <div className="product-thumb warm-thumb">
                    <span className="product-thumb-text">特惠商品说明</span>
                  </div>
                  <div className="product-details">
                    <div className="product-name">带使用说明的特惠商品</div>
                    <div className="product-price">
                      4 <span className="price-unit">积分</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mockup-footer-indicator">— 已经到底部了 —</div>
            </div>

            {/* Interactive Search Overlay (真机级全真搜索弹层) */}
            {isSearchOverlayOpen && (
              <div className="phone-search-overlay-modal">
                <div className="search-overlay-header">
                  <div className="search-overlay-input-wrap">
                    <SearchOutlined className="overlay-search-icon" />
                    <input
                      type="text"
                      className="overlay-search-input"
                      placeholder={searchPlaceholder || '搜索心仪商品'}
                      value={simulatedSearchQuery}
                      onChange={e => setSimulatedSearchQuery(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleExecuteSearch(simulatedSearchQuery)
                      }}
                      autoFocus
                    />
                    {simulatedSearchQuery && (
                      <CloseOutlined
                        className="overlay-search-clear"
                        onClick={() => setSimulatedSearchQuery('')}
                      />
                    )}
                  </div>
                  <button
                    className="overlay-cancel-btn"
                    onClick={() => {
                      setIsSearchOverlayOpen(false)
                      setSimulatedSearchQuery('')
                    }}
                  >
                    取消
                  </button>
                </div>

                <div className="search-overlay-content">
                  {/* 历史搜索 */}
                  {searchHistory.length > 0 && (
                    <div className="overlay-section">
                      <div className="overlay-section-header">
                        <span className="section-title">
                          <HistoryOutlined style={{ marginRight: 4 }} /> 历史搜索
                        </span>
                        <DeleteOutlined
                          className="section-delete-btn"
                          onClick={() => setSearchHistory([])}
                          title="清空历史"
                        />
                      </div>
                      <div className="overlay-tag-cloud">
                        {searchHistory.map((item, idx) => (
                          <span
                            key={idx}
                            className="overlay-tag-item"
                            onClick={() => handleExecuteSearch(item)}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 热门搜索榜 */}
                  <div className="overlay-section">
                    <div className="overlay-section-header">
                      <span className="section-title">
                        <FireFilled style={{ color: '#ef4444', marginRight: 4 }} /> 全网热搜榜
                      </span>
                    </div>
                    <div className="overlay-hot-rank-list">
                      {hotKeywords.map((kw, idx) => (
                        <div
                          key={idx}
                          className="hot-rank-row"
                          onClick={() => handleExecuteSearch(kw)}
                        >
                          <span className={`rank-number rank-${idx + 1}`}>{idx + 1}</span>
                          <span className="rank-text">{kw}</span>
                          {idx < 2 && <span className="hot-flame-tag">HOT</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 推荐探索 */}
                  <div className="overlay-section">
                    <div className="overlay-section-header">
                      <span className="section-title">
                        <CompassOutlined style={{ color: '#2563eb', marginRight: 4 }} /> 推荐分类
                      </span>
                    </div>
                    <div className="overlay-category-grid">
                      {['人气果茶', '生酪鲜乳', '手作烘焙', '精选咖啡', '周边潮玩', '积分特惠'].map((cat, idx) => (
                        <div
                          key={idx}
                          className="cat-badge-item"
                          onClick={() => handleExecuteSearch(cat)}
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 右侧配置面板 (Matching prototype layout + Full Search Section) */}
        <aside className="home-dec-sidebar-right">
          <div className="right-panel-header">
            <span className="panel-title-text">顶部导航与搜索设置</span>
            <span className="panel-badge-tag">组件配置</span>
          </div>

          <div className="right-panel-content">
            {/* 1. 导航样式 */}
            <div className="config-section">
              <label className="config-label">导航样式</label>
              <div className="choice-btn-grid">
                <button
                  className={`choice-btn ${navStyle === 'follow' ? 'active' : ''}`}
                  onClick={() => setNavStyle('follow')}
                >
                  跟随店铺导航
                </button>
                <button
                  className={`choice-btn ${navStyle === 'custom' ? 'active' : ''}`}
                  onClick={() => setNavStyle('custom')}
                >
                  自定义样式
                </button>
              </div>
            </div>

            {/* 2. 风格选择 */}
            <div className="config-section">
              <label className="config-label">风格选择</label>
              <div className="choice-btn-grid">
                <button
                  className={`choice-btn ${navTheme === 'standard' ? 'active' : ''}`}
                  onClick={() => handleSetNavTheme('standard')}
                >
                  标准
                </button>
                <button
                  className={`choice-btn ${navTheme === 'immersive' ? 'active' : ''}`}
                  onClick={() => handleSetNavTheme('immersive')}
                >
                  沉浸式
                </button>
              </div>
              {navTheme === 'immersive' && (
                <div className="config-tip-box">
                  <BulbOutlined style={{ color: '#2563eb', marginRight: 4 }} />
                  沉浸式会在吸顶前透明化背景，建议配合全屏Banner使用。
                </div>
              )}
            </div>

            <div className="section-divider"></div>

            {/* 3. 标题设置 */}
            <div className="config-section">
              <div className="section-header-toggle">
                <label className="config-label u-mb-0">标题设置</label>
                <button
                  onClick={() => setTitleEnabled(!titleEnabled)}
                  className={`switch-toggle-btn ${titleEnabled ? 'on' : 'off'}`}
                >
                  <div className="switch-toggle-circle"></div>
                </button>
              </div>

              {titleEnabled && (
                <div className="nested-config-box">
                  <div className="config-row-item">
                    <span className="row-item-label">内容形式</span>
                    <div className="segmented-btn-group">
                      <button
                        onClick={() => setContentType('text')}
                        className={`seg-btn ${contentType === 'text' ? 'active' : ''}`}
                      >
                        文字
                      </button>
                      <button
                        onClick={() => setContentType('image')}
                        className={`seg-btn ${contentType === 'image' ? 'active' : ''}`}
                      >
                        图片
                      </button>
                    </div>
                  </div>

                  {contentType === 'text' && (
                    <div className="config-row-vertical">
                      <span className="row-item-label u-mb-1">店铺名称/标题</span>
                      <Input
                        value={titleText}
                        onChange={e => setTitleText(e.target.value)}
                        placeholder="请输入标题内容"
                        maxLength={10}
                        size="small"
                        suffix={<span className="u-text-xs u-text-slate-400">{titleText.length}/10</span>}
                      />
                    </div>
                  )}

                  <div className="config-row-item">
                    <span className="row-item-label">位置选择</span>
                    <div className="segmented-btn-group">
                      <button
                        onClick={() => handleSetTitlePosition('center')}
                        className={`seg-btn ${titlePosition === 'center' ? 'active' : ''}`}
                      >
                        居中
                      </button>
                      <button
                        onClick={() => handleSetTitlePosition('left')}
                        className={`seg-btn ${titlePosition === 'left' ? 'active' : ''}`}
                      >
                        居左
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="section-divider"></div>

            {/* 4. ★ 新增需求：搜索设置 (NEW SEARCH CONFIGURATION) ★ */}
            <div className="config-section featured-search-card">
              <span className="featured-card-badge">核心新增</span>

              <div className="section-header-toggle">
                <label className="config-label u-mb-0 u-flex u-items-center u-font-bold u-text-slate-900">
                  <SearchOutlined style={{ color: '#2563eb', marginRight: 6, fontSize: 14 }} /> 顶部搜索入口设置
                </label>
                <button
                  onClick={() => handleToggleSearch(!isSearchEnabled)}
                  className={`switch-toggle-btn ${isSearchEnabled ? 'on' : 'off'}`}
                >
                  <div className="switch-toggle-circle"></div>
                </button>
              </div>

              {isSearchEnabled && (
                <div className="search-details-config">
                  {/* 展现形态 */}
                  <div className="config-field-block">
                    <label className="config-sub-label">展现形态</label>
                    <div className="radio-options-stack">
                      <label
                        className={`radio-card-option ${searchMode === 'inline_input' ? 'selected' : ''}`}
                        onClick={() => handleSearchModeChange('inline_input')}
                      >
                        <input
                          type="radio"
                          name="searchMode"
                          value="inline_input"
                          checked={searchMode === 'inline_input'}
                          onChange={() => handleSearchModeChange('inline_input')}
                          className="accent-blue-600"
                        />
                        <div className="radio-text-box">
                          <span className="radio-main-text">紧凑搜索框模式</span>
                          <span className="radio-sub-desc">( Logo/标题 + 搜索框并排 )</span>
                        </div>
                      </label>

                      <label
                        className={`radio-card-option ${searchMode === 'icon_only' ? 'selected' : ''}`}
                        onClick={() => handleSearchModeChange('icon_only')}
                      >
                        <input
                          type="radio"
                          name="searchMode"
                          value="icon_only"
                          checked={searchMode === 'icon_only'}
                          onChange={() => handleSearchModeChange('icon_only')}
                          className="accent-blue-600"
                        />
                        <div className="radio-text-box">
                          <span className="radio-main-text">图标模式</span>
                          <span className="radio-sub-desc">( 右侧 🔍 图标精简入口 )</span>
                        </div>
                      </label>

                      <label
                        className={`radio-card-option ${searchMode === 'full_input' ? 'selected' : ''}`}
                        onClick={() => handleSearchModeChange('full_input')}
                      >
                        <input
                          type="radio"
                          name="searchMode"
                          value="full_input"
                          checked={searchMode === 'full_input'}
                          onChange={() => handleSearchModeChange('full_input')}
                          className="accent-blue-600"
                        />
                        <div className="radio-text-box">
                          <span className="radio-main-text">纯搜索框模式</span>
                          <span className="radio-sub-desc">( 隐藏标题，搜索框铺满 )</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* 提示文字 */}
                  {searchMode !== 'icon_only' && (
                    <>
                      <div className="config-field-block">
                        <label className="config-sub-label">占位提示文字 (Placeholder)</label>
                        <input
                          type="text"
                          value={searchPlaceholder}
                          onChange={e => setSearchPlaceholder(e.target.value)}
                          maxLength={15}
                          placeholder="请输入搜索占位词"
                          className="config-text-input"
                        />
                        <span className="input-char-counter">{searchPlaceholder.length}/15 字</span>
                      </div>

                      {/* 框体形状 */}
                      <div className="config-field-block">
                        <label className="config-sub-label">搜索框圆角样式</label>
                        <div className="segmented-btn-group w-full">
                          <button
                            onClick={() => setSearchShape('pill')}
                            className={`seg-btn flex-1 ${searchShape === 'pill' ? 'active' : ''}`}
                          >
                            圆弧 (Pill)
                          </button>
                          <button
                            onClick={() => setSearchShape('round')}
                            className={`seg-btn flex-1 ${searchShape === 'round' ? 'active' : ''}`}
                          >
                            微圆角 (8px)
                          </button>
                          <button
                            onClick={() => setSearchShape('square')}
                            className={`seg-btn flex-1 ${searchShape === 'square' ? 'active' : ''}`}
                          >
                            方角 (2px)
                          </button>
                        </div>
                      </div>

                      {/* 文字对齐 */}
                      <div className="config-field-block">
                        <label className="config-sub-label">文字对齐方式</label>
                        <div className="segmented-btn-group w-full">
                          <button
                            onClick={() => setTextAlign('left')}
                            className={`seg-btn flex-1 ${textAlign === 'left' ? 'active' : ''}`}
                          >
                            居左对齐
                          </button>
                          <button
                            onClick={() => setTextAlign('center')}
                            className={`seg-btn flex-1 ${textAlign === 'center' ? 'active' : ''}`}
                          >
                            居中对齐
                          </button>
                        </div>
                      </div>

                      {/* 右侧辅助图标 */}
                      <div className="config-field-block">
                        <label className="config-sub-label">右侧辅助功能</label>
                        <div className="segmented-btn-group w-full">
                          <button
                            onClick={() => setSearchRightAction('none')}
                            className={`seg-btn flex-1 ${searchRightAction === 'none' ? 'active' : ''}`}
                          >
                            无
                          </button>
                          <button
                            onClick={() => setSearchRightAction('camera')}
                            className={`seg-btn flex-1 ${searchRightAction === 'camera' ? 'active' : ''}`}
                          >
                            📷 扫码识图
                          </button>
                          <button
                            onClick={() => setSearchRightAction('voice')}
                            className={`seg-btn flex-1 ${searchRightAction === 'voice' ? 'active' : ''}`}
                          >
                            🎤 语音输入
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 推荐热搜关键词 */}
                  <div className="config-field-block">
                    <label className="config-sub-label">推荐热搜关键词 (最多6个)</label>
                    <div className="hot-keywords-tags-wrap">
                      {hotKeywords.map(kw => (
                        <Tag
                          key={kw}
                          closable
                          onClose={() => handleRemoveKeyword(kw)}
                          color="blue"
                          style={{ marginBottom: 4 }}
                        >
                          {kw}
                        </Tag>
                      ))}
                    </div>
                    {hotKeywords.length < 6 && (
                      <div className="u-flex u-items-center u-gap-1_5 u-mt-2">
                        <Input
                          size="small"
                          placeholder="添加热搜词"
                          value={keywordInput}
                          onChange={e => setKeywordInput(e.target.value)}
                          onPressEnter={handleAddKeyword}
                          maxLength={8}
                        />
                        <Button size="small" type="primary" onClick={handleAddKeyword}>
                          添加
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="section-divider"></div>

            {/* 5. 颜色设置 */}
            <div className="config-section">
              <label className="config-label">颜色设置</label>

              <div className="config-row-item">
                <span className="row-item-label">背景颜色</span>
                <div className="color-picker-box">
                  <input
                    type="color"
                    value={navBgColor}
                    onChange={e => setNavBgColor(e.target.value)}
                    className="color-input-dot"
                  />
                  <span className="color-hex-text u-font-mono">{navBgColor}</span>
                </div>
              </div>

              {/* Preset swatches */}
              <div className="color-swatches-row">
                {['#FFFFFF', '#F8FAFC', '#1E293B', '#0F172A', '#FEF2F2', '#EFF6FF'].map(c => (
                  <div
                    key={c}
                    className={`color-swatch-dot ${navBgColor.toUpperCase() === c.toUpperCase() ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setNavBgColor(c)}
                    title={c}
                  />
                ))}
              </div>

              <div className="config-row-item u-mt-3">
                <span className="row-item-label">文字/图标模式</span>
                <div className="segmented-btn-group">
                  <button
                    onClick={() => setTextMode('light')}
                    className={`seg-btn ${textMode === 'light' ? 'active' : ''}`}
                  >
                    浅色模式
                  </button>
                  <button
                    onClick={() => setTextMode('dark')}
                    className={`seg-btn ${textMode === 'dark' ? 'active' : ''}`}
                  >
                    深色模式
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 预览 Modal 弹窗 */}
      <Modal
        title="📱 小程序首页效果预览"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="pub"
            type="primary"
            onClick={() => {
              setPreviewModalVisible(false)
              message.success('已确认预览效果并发布上线！')
            }}
          >
            直接发布该配置
          </Button>
        ]}
        width={420}
        centered
      >
        <div className="preview-modal-body">
          <div className="u-text-center u-mb-3">
            <div className="u-inline-block u-p-3 u-bg-white u-border u-border-slate-200 u-rounded-xl u-shadow-sm">
              <QrcodeOutlined style={{ fontSize: 120, color: '#334155' }} />
            </div>
            <p className="u-text-xs u-text-slate-500 u-mt-2">微信扫描二维码在手机上实时体验当前搜索与导航配置</p>
          </div>
          <div className="u-p-3 u-bg-slate-50 u-rounded-lg u-text-xs u-text-slate-600 u-space-y-1">
            <div><strong>导航模式:</strong> {navStyle === 'custom' ? '自定义样式' : '跟随店铺导航'}</div>
            <div><strong>顶部风格:</strong> {navTheme === 'immersive' ? '沉浸式 (随滚动自动吸顶过渡)' : '标准导航'}</div>
            <div><strong>搜索入口:</strong> {isSearchEnabled ? (searchMode === 'inline_input' ? '紧凑搜索框' : searchMode === 'icon_only' ? '右侧图标' : '纯搜索框铺满') : '已关闭'}</div>
            <div><strong>搜索圆角:</strong> {searchShape === 'pill' ? '圆弧 (Pill)' : searchShape === 'round' ? '微圆角 (8px)' : '方角 (2px)'}</div>
            <div><strong>占位词:</strong> {searchPlaceholder}</div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default HomeDecoration
