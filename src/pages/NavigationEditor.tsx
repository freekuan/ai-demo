import { useState, useMemo } from 'react'
import {
  SettingOutlined,
  MobileOutlined,
  WarningOutlined,
  UploadOutlined,
  ReloadOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import {
  Row,
  Col,
  Input,
  Select,
  Switch,
  Radio,
  Button,
  message,
  Modal,
  Alert,
  Tooltip
} from 'antd'
import './NavigationEditor.css'

// Built-in Icon SVGs (crisp, beautiful, scalable)
const SVG_ICONS = {
  home_outline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  home_filled: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  shop_outline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  shop_filled: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  category_outline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  category_filled: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8 6h8v-8h-8v8zm2-6h4v4h-4v-4z" />
    </svg>
  ),
  cart_outline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  cart_filled: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  ),
  user_outline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  user_filled: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  // Spark/Star for custom raised icon
  star_outline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  star_filled: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

interface NavItem {
  id: number
  name: string
  link: string
  iconSelected: keyof typeof SVG_ICONS
  iconUnselected: keyof typeof SVG_ICONS
  enabled: boolean
}

// Preset color options
const COLOR_PRESETS = [
  { name: '活力精选橙', bg: '#FFFFFF', selected: '#FF5E29', unselected: '#8C8C8C' },
  { name: '经典商务蓝', bg: '#FFFFFF', selected: '#1890FF', unselected: '#8C8C8C' },
  { name: '少女樱花粉', bg: '#FFF5F6', selected: '#FF4D8F', unselected: '#9C888E' },
  { name: '尊贵黑金风', bg: '#1A1A1A', selected: '#E6A23C', unselected: '#909399' },
  { name: '极简北欧灰', bg: '#F5F5F5', selected: '#333333', unselected: '#888888' },
]

export default function NavigationEditor() {
  // Navigation items state (initialized to system default items)
  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: 1, name: '首页', link: 'home', iconSelected: 'home_filled', iconUnselected: 'home_outline', enabled: true },
    { id: 2, name: '微商店', link: 'shop', iconSelected: 'shop_filled', iconUnselected: 'shop_outline', enabled: true },
    { id: 3, name: '分类', link: 'category', iconSelected: 'category_filled', iconUnselected: 'category_outline', enabled: true },
    { id: 4, name: '购物车', link: 'cart', iconSelected: 'cart_filled', iconUnselected: 'cart_outline', enabled: true },
    { id: 5, name: '我的', link: 'user', iconSelected: 'user_filled', iconUnselected: 'user_outline', enabled: true },
  ])

  // Style customization state
  const [navStyle, setNavStyle] = useState<'default' | 'raised' | 'floating' | 'helm'>('default')
  const [raisedPosition, setRaisedPosition] = useState<'middle' | 'custom'>('middle')
  const [customRaisedIndex, setCustomRaisedIndex] = useState<number>(2) // Index (0-indexed). 2 is the 3rd item "分类"
  const [raisedIconConfig, setRaisedIconConfig] = useState<'follow' | 'custom'>('follow')
  
  // Custom uploaded raised icons (mock files)
  const [customRaisedSelected, setCustomRaisedSelected] = useState<string>('https://images.unsplash.com/photo-1543508282-6319a3e2621d?auto=format&fit=crop&w=80&q=80')
  const [customRaisedUnselected, setCustomRaisedUnselected] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80')

  // Colors state
  const [bgColor, setBgColor] = useState<string>('#FFFFFF')
  const [selectedColor, setSelectedColor] = useState<string>('#FF5E29')
  const [unselectedColor, setUnselectedColor] = useState<string>('#8C8C8C')

  // Phone preview active tab
  const [previewActiveTab, setPreviewActiveTab] = useState<number>(0)

  // Mini-program versions
  const [currentVersion, setCurrentVersion] = useState<string>('3.40.0')
  const requiredVersion = '3.42.0'

  // Modal for version upgrade reminder
  const [versionModalVisible, setVersionModalVisible] = useState<boolean>(false)
  const [pendingStyle, setPendingStyle] = useState<'default' | 'raised' | 'floating' | 'helm' | null>(null)

  // Count active nav items
  const activeNavsCount = useMemo(() => navItems.filter(i => i.enabled).length, [navItems])

  // Get index of the raised item
  const actualRaisedIndex = useMemo(() => {
    if (raisedPosition === 'middle') {
      // Find the middle enabled item
      const enabledIndices = navItems.reduce<number[]>((acc, item, idx) => {
        if (item.enabled) acc.push(idx)
        return acc
      }, [])
      if (enabledIndices.length === 0) return 0
      return enabledIndices[Math.floor(enabledIndices.length / 2)]
    }
    return customRaisedIndex
  }, [raisedPosition, customRaisedIndex, navItems])

  // Handle color preset selection
  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setBgColor(preset.bg)
    setSelectedColor(preset.selected)
    setUnselectedColor(preset.unselected)
    message.success(`已应用配色方案: ${preset.name}`)
  }

  // Handle editing nav items
  const updateNavItem = (id: number, key: keyof NavItem, value: any) => {
    setNavItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [key]: value }
      }
      return item
    }))
  }

  // Handle Switch toggling
  const handleToggleNavItem = (id: number, checked: boolean) => {
    if (!checked && activeNavsCount <= 2) {
      message.warning('为了保证布局完整，请至少保留 2 个开启的导航项')
      return
    }
    updateNavItem(id, 'enabled', checked)
  }

  // Handle click style cards with version restrictions
  const handleSelectStyle = (style: 'default' | 'raised' | 'floating' | 'helm') => {
    if (style === 'default') {
      setNavStyle(style)
      return
    }

    // Version restriction check
    const currentNum = parseFloat(currentVersion.replace(/\./g, ''))
    const requiredNum = parseFloat(requiredVersion.replace(/\./g, ''))

    if (currentNum < requiredNum) {
      // Pop up upgrade warning
      setPendingStyle(style)
      setVersionModalVisible(true)
    } else {
      setNavStyle(style)
    }
  }

  // Confirm using new style despite version gap (allows development setup)
  const confirmUpgradeAndSelect = () => {
    if (pendingStyle) {
      setNavStyle(pendingStyle)
      setPendingStyle(null)
    }
    setVersionModalVisible(false)
  }

  // Upgrade mini program to 3.42.0 (simulated)
  const simulateUpgrade = () => {
    setCurrentVersion('3.42.0')
    message.success('🎉 小程序线上版本已成功模拟升级至 v3.42.0！新导航样式已全部解锁。')
    if (pendingStyle) {
      setNavStyle(pendingStyle)
      setPendingStyle(null)
    }
    setVersionModalVisible(false)
  }

  // Reset to default settings
  const handleReset = () => {
    setNavItems([
      { id: 1, name: '首页', link: 'home', iconSelected: 'home_filled', iconUnselected: 'home_outline', enabled: true },
      { id: 2, name: '微商店', link: 'shop', iconSelected: 'shop_filled', iconUnselected: 'shop_outline', enabled: true },
      { id: 3, name: '分类', link: 'category', iconSelected: 'category_filled', iconUnselected: 'category_outline', enabled: true },
      { id: 4, name: '购物车', link: 'cart', iconSelected: 'cart_filled', iconUnselected: 'cart_outline', enabled: true },
      { id: 5, name: '我的', link: 'user', iconSelected: 'user_filled', iconUnselected: 'user_outline', enabled: true },
    ])
    setNavStyle('default')
    setRaisedPosition('middle')
    setCustomRaisedIndex(2)
    setRaisedIconConfig('follow')
    setBgColor('#FFFFFF')
    setSelectedColor('#FF5E29')
    setUnselectedColor('#8C8C8C')
    setCurrentVersion('3.40.0')
    setPreviewActiveTab(0)
    message.success('已恢复系统导航的初始配置数据')
  }

  // Save configurations
  const handleSave = () => {
    message.loading({ content: '正在同步导航配置...', key: 'save_nav' })
    setTimeout(() => {
      const isCustomStyle = navStyle !== 'default'
      const versionNum = parseFloat(currentVersion.replace(/\./g, ''))
      const reqNum = parseFloat(requiredVersion.replace(/\./g, ''))

      if (isCustomStyle && versionNum < reqNum) {
        message.warning({
          content: '导航配置保存成功，但由于当前小程序线上版本较低，客户端将回退显示默认系统导航样式，请尽快提审或升级版本！',
          key: 'save_nav',
          duration: 5
        })
      } else {
        message.success({
          content: isCustomStyle 
            ? '自定义导航发布成功！已实时热更新到线上小程序，无需审核生效。'
            : '系统导航配置保存成功！请前往“开发管理”提交版本审核发布以生效修改。',
          key: 'save_nav',
          duration: 3
        })
      }
    }, 1000)
  }

  return (
    <div className="navigation-editor-container">
      {/* 顶部动态兼容方案 Banner */}
      <div className="navigation-banner-alert">
        {navStyle === 'default' ? (
          <Alert
            message="当前为系统导航模式"
            description={
              <span>
                系统导航受微信底层机制限制：
                <strong>增加或减少导航数量、开启或关闭导航、修改导航标题</strong>
                这三类修改需<strong>提交小程序发布审核（提审）</strong>才能在线上对顾客生效。
                如需实时生效，请在下方【样式设置】中升级为【凸起】、【悬浮】或【舵式】等自定义导航。
              </span>
            }
            type="warning"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => handleSelectStyle('raised')}>
                一键升级自定义
              </Button>
            }
          />
        ) : (
          <Alert
            message="已启用自定义导航，修改免审核！"
            description={
              <span>
                微信无需提审模式：系统已激活<strong>自定义 Tabbar（热更新技术）</strong>。
                此处对导航名称、开关、链接、自定义图标或配色的所有修改，在点击保存后将<strong>立刻对所有新老版本用户实时生效</strong>，无需任何微信团队人工审核。
              </span>
            }
            type="success"
            showIcon
            action={
              <Button size="small" ghost onClick={() => handleSelectStyle('default')} style={{ color: '#52c41a', borderColor: '#52c41a' }}>
                切换回系统导航
              </Button>
            }
          />
        )}
      </div>

      <Row gutter={24} style={{ marginTop: 16 }}>
        {/* 左侧：表单配置区 */}
        <Col xs={24} lg={15} xl={16}>
          {/* Card 1: 导航项设置 */}
          <div className="editor-card">
            <div className="card-header">
              <span className="card-title"><SettingOutlined /> 导航项设置</span>
              <span className="card-subtitle">配置导航菜单中的具体子项，开启的子项越多，Tabbar 会自动压缩均分。</span>
            </div>
            
            <div className="nav-items-grid">
              {navItems.map((item, index) => {
                const isItemRaised = (navStyle === 'raised' || navStyle === 'helm') && index === actualRaisedIndex
                
                return (
                  <div key={item.id} className={`nav-item-config-box ${item.enabled ? '' : 'disabled'} ${isItemRaised ? 'is-raised-item' : ''}`}>
                    <div className="box-header">
                      <span className="box-number">导航项 {index + 1}</span>
                      <div className="box-controls">
                        {isItemRaised && (
                          <span className="raised-badge">
                            凸起中
                          </span>
                        )}
                        <Switch
                          checked={item.enabled}
                          onChange={(val) => handleToggleNavItem(item.id, val)}
                          size="small"
                        />
                      </div>
                    </div>

                    <div className="box-body">
                      <div className="field-row">
                        <label className="field-label">导航名称</label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateNavItem(item.id, 'name', e.target.value)}
                          maxLength={5}
                          disabled={!item.enabled}
                          size="small"
                        />
                      </div>

                      <div className="field-row">
                        <label className="field-label">跳转链接</label>
                        <Select
                          value={item.link}
                          onChange={(val) => updateNavItem(item.id, 'link', val)}
                          disabled={!item.enabled}
                          size="small"
                          style={{ width: '100%' }}
                          options={[
                            { value: 'home', label: '商城首页 (pages/home)' },
                            { value: 'shop', label: '微商店 (pages/shop)' },
                            { value: 'category', label: '商品分类 (pages/category)' },
                            { value: 'cart', label: '购物车 (pages/cart)' },
                            { value: 'user', label: '个人中心 (pages/user)' },
                            { value: 'custom', label: '自定义链接 (需配置)' },
                          ]}
                        />
                      </div>

                      {/* Display custom link input if selected */}
                      {item.link === 'custom' && (
                        <div className="field-row custom-link-input">
                          <Input
                            placeholder="pages/custom/index"
                            size="small"
                            disabled={!item.enabled}
                          />
                        </div>
                      )}

                      {/* Icon configuration */}
                      {(!isItemRaised || raisedIconConfig === 'follow') ? (
                        <div className="icon-selector-field">
                          <div className="icon-preview-box">
                            <span className="preview-lbl">未选中</span>
                            <div className="icon-thumbnail">
                              {SVG_ICONS[item.iconUnselected]}
                            </div>
                          </div>
                          <div className="icon-preview-box">
                            <span className="preview-lbl">选中态</span>
                            <div className="icon-thumbnail selected">
                              {SVG_ICONS[item.iconSelected]}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="raised-override-hint">
                          已在样式设置中开启【单独配置凸起大图】，原导航项图标已隐藏。
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card 2: 样式及视觉配置 */}
          <div className="editor-card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <span className="card-title"><SettingOutlined /> 样式设置</span>
              <span className="card-subtitle">升级自定义 Tabbar，选择更具张力与引导性的视觉交互布局。</span>
            </div>

            <div className="style-config-body">
              {/* Style selection */}
              <div className="form-item-wrap">
                <span className="form-item-label">导航样式</span>
                <div className="style-cards-row">
                  {[
                    { key: 'default', name: '默认样式', desc: '系统默认扁平Tab', ver: '无限制' },
                    { key: 'raised', name: '凸起样式', desc: '中心项隆起圆弧', ver: 'v3.42.0+' },
                    { key: 'floating', name: '悬浮样式', desc: '浮空圆角卡片感', ver: 'v3.42.0+' },
                    { key: 'helm', name: '舵式样式', desc: '中置圆形大功能', ver: 'v3.42.0+' },
                  ].map((s) => (
                    <div 
                      key={s.key} 
                      className={`style-option-card ${navStyle === s.key ? 'active' : ''}`}
                      onClick={() => handleSelectStyle(s.key as any)}
                    >
                      <div className="style-mini-icon">
                        <div className={`tabbar-stub ${s.key}`}>
                          {s.key === 'default' && <div className="stub-default" />}
                          {s.key === 'raised' && <div className="stub-raised" />}
                          {s.key === 'floating' && <div className="stub-floating" />}
                          {s.key === 'helm' && <div className="stub-helm" />}
                        </div>
                      </div>
                      <span className="style-name">
                        {s.name}
                        {s.key !== 'default' && (
                          <span className={`version-badge ${parseFloat(currentVersion.replace(/\./g, '')) >= 3420 ? 'unlocked' : 'locked'}`}>
                            {s.ver}
                          </span>
                        )}
                      </span>
                      <span className="style-desc">{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special options for Raised / Helm */}
              {(navStyle === 'raised' || navStyle === 'helm') && (
                <div className="raised-options-area animate-fade-in">
                  <div className="form-item-wrap inline">
                    <span className="form-item-label">
                      凸起导航项 
                      <Tooltip title="指定哪一个导航菜单项需要以凸起/舵式大圆圈显示。">
                        <QuestionCircleOutlined className="label-help-icon" />
                      </Tooltip>
                    </span>
                    <div className="form-item-control">
                      <Radio.Group 
                        value={raisedPosition} 
                        onChange={(e) => setRaisedPosition(e.target.value)}
                        size="small"
                      >
                        <Radio.Button value="middle">系统居中项</Radio.Button>
                        <Radio.Button value="custom">指定导航项</Radio.Button>
                      </Radio.Group>
                      
                      {raisedPosition === 'custom' && (
                        <Select
                          value={customRaisedIndex}
                          onChange={setCustomRaisedIndex}
                          size="small"
                          style={{ width: 140, marginLeft: 12 }}
                          options={navItems.filter(i => i.enabled).map((item) => ({
                            value: navItems.indexOf(item),
                            label: `${item.name} (导航 ${navItems.indexOf(item) + 1})`
                          }))}
                        />
                      )}
                    </div>
                  </div>

                  {/* ISSUE 1: Custom Raised Icon Upload Settings */}
                  <div className="form-item-wrap inline">
                    <span className="form-item-label">
                      凸起图标配置
                      <Tooltip title="您可以继续使用本项已配置的普通图标，或者单独为该隆起按钮上传更大尺寸、特殊视觉的设计图。">
                        <QuestionCircleOutlined className="label-help-icon" />
                      </Tooltip>
                    </span>
                    <div className="form-item-control">
                      <Radio.Group 
                        value={raisedIconConfig} 
                        onChange={(e) => setRaisedIconConfig(e.target.value)}
                        size="small"
                      >
                        <Radio.Button value="follow">跟随原导航图标</Radio.Button>
                        <Radio.Button value="custom">单独配置凸起图 (建议)</Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>

                  {raisedIconConfig === 'custom' && (
                    <div className="custom-raised-upload-panel animate-fade-in">
                      <div className="upload-header-tip">
                        <InfoCircleOutlined /> <b>凸起大图上传：</b> 建议使用 80x80px 的 PNG 透明背景图片，能够溢出贴合圆弧，效果更震撼。
                      </div>
                      <div className="upload-fields-row">
                        <div className="upload-field-item">
                          <span className="upload-label">未选中态大图</span>
                          <div className="avatar-uploader-mock">
                            <img src={customRaisedUnselected} alt="unselected custom" />
                            <div className="uploader-overlay">
                              <UploadOutlined /> <span>更换</span>
                            </div>
                          </div>
                        </div>

                        <div className="upload-field-item">
                          <span className="upload-label">选中态大图 (溢出发光)</span>
                          <div className="avatar-uploader-mock glow">
                            <img src={customRaisedSelected} alt="selected custom" />
                            <div className="uploader-overlay">
                              <UploadOutlined /> <span>更换</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="preset-custom-icons">
                          <span className="presets-title">备选精致大图：</span>
                          <div className="preset-icons-row">
                            {[
                              { label: '潮流酷炫星', unselected: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80', selected: 'https://images.unsplash.com/photo-1543508282-6319a3e2621d?auto=format&fit=crop&w=80&q=80' },
                              { label: '惊喜礼包袋', unselected: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=80&q=80', selected: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=80&q=80' },
                              { label: '发布中心加', unselected: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=80&q=80', selected: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=80&q=80' },
                            ].map((preset, pIdx) => (
                              <button
                                key={pIdx}
                                type="button"
                                className="preset-img-btn"
                                onClick={() => {
                                  setCustomRaisedUnselected(preset.unselected)
                                  setCustomRaisedSelected(preset.selected)
                                  message.info(`已应用备选图: ${preset.label}`)
                                }}
                              >
                                <img src={preset.unselected} alt={preset.label} title={preset.label} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Color configurations */}
              <div className="form-item-wrap inline">
                <span className="form-item-label">配色方案</span>
                <div className="colors-picker-row">
                  <div className="color-picker-item">
                    <span>背景颜色</span>
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                    <span className="color-hex">{bgColor.toUpperCase()}</span>
                  </div>

                  <div className="color-picker-item">
                    <span>未选中文字/图标</span>
                    <input type="color" value={unselectedColor} onChange={(e) => setUnselectedColor(e.target.value)} />
                    <span className="color-hex">{unselectedColor.toUpperCase()}</span>
                  </div>

                  <div className="color-picker-item">
                    <span>选中激活态颜色</span>
                    <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
                    <span className="color-hex">{selectedColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Preset quick colors */}
              <div className="form-item-wrap inline">
                <span className="form-item-label">快速预设配色</span>
                <div className="preset-colors-row">
                  {COLOR_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      className="preset-color-pill"
                      onClick={() => applyColorPreset(preset)}
                    >
                      <span className="pill-dot" style={{ backgroundColor: preset.selected }} />
                      <span className="pill-name">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="editor-card" style={{ marginTop: 16, padding: '16px 20px', display: 'flex', gap: 12 }}>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} size="large">
              保存并发布
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset} size="large">
              恢复系统默认配置
            </Button>
          </div>
        </Col>

        {/* 右侧：手机预览模拟器 */}
        <Col xs={24} lg={9} xl={8} className="phone-preview-col">
          <div className="preview-sticky-wrap">
            <div className="mobile-phone-frame dark-shadow">
              {/* Notch */}
              <div className="phone-top-notch" />
              
              {/* Status bar */}
              <div className="phone-status-bar">
                <span className="time">9:41</span>
                <div className="icons">
                  <span className="cellular">📶</span>
                  <span className="wifi">🔋</span>
                </div>
              </div>

              {/* Screen page title */}
              <div className="phone-page-header">
                <span className="back-arrow">〈</span>
                <span className="activity-title">
                  {navItems[previewActiveTab]?.name || '演示商城'}
                </span>
                <span className="more-menu">•••</span>
              </div>

              {/* Live Preview Screen Content */}
              <div className="phone-screen-content" style={{ background: '#f5f7fa' }}>
                {previewActiveTab === 0 && (
                  <div className="mock-page-content home animate-fade-in">
                    <div className="mock-search-bar">🔍 输入商品名称搜索...</div>
                    <div className="mock-banner">
                      <span>限时折上折 ⚡ 盛夏狂欢季</span>
                    </div>
                    <div className="mock-card-row">
                      <div className="mock-grid-card">
                        <div className="img-stub orange" />
                        <span>大额满减神券</span>
                      </div>
                      <div className="mock-grid-card">
                        <div className="img-stub yellow" />
                        <span>全场包邮区</span>
                      </div>
                    </div>
                    <div className="mock-product-item">
                      <div className="product-thumb" />
                      <div className="product-details">
                        <div className="p-title">【新品爆款】时尚智能穿戴设备</div>
                        <div className="p-price">￥299.00</div>
                      </div>
                    </div>
                  </div>
                )}

                {previewActiveTab === 1 && (
                  <div className="mock-page-content shop animate-fade-in">
                    <div className="shop-header">
                      <div className="shop-avatar" />
                      <div className="shop-info">
                        <strong>蓝云官方数码直营店</strong>
                        <span>主营高阶智能数码 | 服务保障 ⭐️⭐️⭐️⭐️⭐️</span>
                      </div>
                    </div>
                    <div className="shop-coupon-card">
                      <div className="coupon-left">
                        <span>￥</span><strong>50</strong>
                      </div>
                      <div className="coupon-right">
                        <span>专享粉丝券</span>
                        <button type="button">点击领取</button>
                      </div>
                    </div>
                    <div className="section-title">热销精品推荐</div>
                    <div className="mock-card-row">
                      <div className="mock-grid-card">
                        <div className="img-stub blue" />
                        <span>骨传导降噪耳机</span>
                      </div>
                      <div className="mock-grid-card">
                        <div className="img-stub purple" />
                        <span>极简无线充电底座</span>
                      </div>
                    </div>
                  </div>
                )}

                {previewActiveTab === 2 && (
                  <div className="mock-page-content category animate-fade-in">
                    <div className="category-layout">
                      <div className="cat-sidebar">
                        <span className="active">数码配件</span>
                        <span>潮流服饰</span>
                        <span>美妆洗护</span>
                        <span>零食速食</span>
                        <span>居家百货</span>
                      </div>
                      <div className="cat-grid">
                        <div className="section-title" style={{ marginTop: 0 }}>爆款数码配件</div>
                        <div className="grid-list">
                          {[1, 2, 3, 4].map(idx => (
                            <div className="grid-item" key={idx}>
                              <div className="thumb-stub" />
                              <span>数码周边 {idx}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {previewActiveTab === 3 && (
                  <div className="mock-page-content cart animate-fade-in">
                    {[1, 2].map(idx => (
                      <div className="cart-item" key={idx}>
                        <input type="checkbox" defaultChecked />
                        <div className="cart-thumb" />
                        <div className="cart-details">
                          <div className="c-title">官方定制极简设计保护壳 - 款式 {idx}</div>
                          <div className="c-price-row">
                            <span className="price">￥49.00</span>
                            <span className="count">x1</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="cart-settlement-bar">
                      <div className="sel-all">
                        <input type="checkbox" defaultChecked />
                        <span>全选</span>
                      </div>
                      <div className="price-info">
                        <span>合计:</span><strong>￥98.00</strong>
                      </div>
                      <button type="button" className="checkout-btn">去结算</button>
                    </div>
                  </div>
                )}

                {previewActiveTab === 4 && (
                  <div className="mock-page-content user animate-fade-in">
                    <div className="user-profile-header">
                      <div className="user-avatar" />
                      <div className="user-meta">
                        <strong>微信VIP尊贵用户</strong>
                        <span className="level-badge">🥇 黄金会员</span>
                      </div>
                    </div>
                    <div className="user-stats-row">
                      <div className="stat-col">
                        <strong>1,280</strong><span>账户积分</span>
                      </div>
                      <div className="stat-col">
                        <strong>3</strong><span>优惠券</span>
                      </div>
                      <div className="stat-col">
                        <strong>￥120.50</strong><span>我的余额</span>
                      </div>
                    </div>
                    <div className="user-menu-list">
                      <div className="menu-item-row">📦 我的订单 <span>查看全部 〉</span></div>
                      <div className="menu-item-row">📍 收货地址管理 <span>〉</span></div>
                      <div className="menu-item-row">🛡️ 安全与客服中心 <span>〉</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Custom Tabbar Mockup */}
              <div 
                className={`phone-tabbar-mock ${navStyle}`}
                style={{ 
                  backgroundColor: bgColor,
                  borderColor: navStyle === 'floating' ? 'transparent' : 'rgba(0,0,0,0.06)'
                }}
              >
                {navItems.map((item, index) => {
                  if (!item.enabled) return null

                  const isSelected = previewActiveTab === index
                  const isRaised = (navStyle === 'raised' || navStyle === 'helm') && index === actualRaisedIndex
                  
                  // Active icon rendering logic
                  let iconElement = SVG_ICONS[isSelected ? item.iconSelected : item.iconUnselected]
                  
                  if (isRaised) {
                    if (navStyle === 'helm') {
                      iconElement = SVG_ICONS.plus
                    } else if (raisedIconConfig === 'custom') {
                      iconElement = (
                        <img 
                          src={isSelected ? customRaisedSelected : customRaisedUnselected} 
                          alt="raised center" 
                          className="preview-raised-img"
                        />
                      )
                    }
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`tabbar-item-btn ${isSelected ? 'active' : ''} ${isRaised ? 'raised-btn' : ''}`}
                      style={{
                        color: isSelected ? selectedColor : unselectedColor
                      }}
                      onClick={() => setPreviewActiveTab(index)}
                    >
                      <div 
                        className="tab-icon-wrapper"
                        style={{
                          backgroundColor: isRaised && navStyle === 'helm' ? selectedColor : 'transparent',
                          color: isRaised && navStyle === 'helm' ? '#FFFFFF' : 'inherit'
                        }}
                      >
                        {iconElement}
                      </div>
                      {(!isRaised || navStyle === 'raised') && (
                        <span className="tab-label-text" style={{ color: isSelected ? selectedColor : unselectedColor }}>
                          {item.name}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Version control debug bar below mockup */}
            <div className="version-debug-card">
              <div className="ver-row">
                <span className="lbl"><MobileOutlined /> 当前小程序基础库线上版本:</span>
                <span className={`val ${parseFloat(currentVersion.replace(/\./g, '')) >= 3420 ? 'valid' : 'invalid'}`}>
                  v{currentVersion}
                </span>
              </div>
              
              {parseFloat(currentVersion.replace(/\./g, '')) < 3420 ? (
                <div className="ver-tip-info animate-pulse">
                  ⚠️ 基础库版本较低，新功能仅默认样式可用，点击下方按钮模拟升级体验新功能。
                </div>
              ) : (
                <div className="ver-tip-info success">
                  ✅ 基础库版本已满足，所有自定义样式已解锁生效。
                </div>
              )}

              <div className="ver-actions">
                <Button 
                  size="small" 
                  onClick={simulateUpgrade}
                  disabled={parseFloat(currentVersion.replace(/\./g, '')) >= 3420}
                >
                  模拟升级基础库 (v3.42.0)
                </Button>
                <Button 
                  size="small" 
                  type="text" 
                  onClick={() => {
                    setCurrentVersion('3.40.0')
                    setNavStyle('default')
                    message.info('基础库版本已重置至 v3.40.0')
                  }}
                  disabled={parseFloat(currentVersion.replace(/\./g, '')) < 3420}
                >
                  重置版本
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* ISSUE 2: Version Upgrade Alert Modal */}
      <Modal
        title={
          <span style={{ color: '#faad14' }}>
            <WarningOutlined /> 小程序版本升级提示
          </span>
        }
        open={versionModalVisible}
        onCancel={() => {
          setVersionModalVisible(false)
          setPendingStyle(null)
        }}
        footer={[
          <Button key="back" onClick={() => {
            setVersionModalVisible(false)
            setPendingStyle(null)
          }}>
            留在低版本 (降级默认导航)
          </Button>,
          <Button key="confirm" type="primary" onClick={confirmUpgradeAndSelect}>
            保存并强制发布
          </Button>,
          <Button key="upgrade" type="primary" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={simulateUpgrade}>
            一键升级小程序版本
          </Button>
        ]}
      >
        <div style={{ padding: '8px 0' }}>
          <p>
            您选择的自定义导航样式需要小程序的客户端基础库版本升级到 
            <strong> v3.42.0 </strong> 或更高版本方可正常解析。
          </p>
          <p>
            当前店铺在线的小程序版本检测为：
            <strong style={{ color: '#ff4d4f' }}> v{currentVersion} </strong>。
          </p>
          <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', padding: '10px 14px', borderRadius: 4, marginTop: 12 }}>
            <strong>💡 注意：</strong> 如果您坚持保存发布，微信老版本客户端在加载时，
            将**自动降级**使用扁平的「默认样式」作为兼容垫片，新版微信客户端将完美呈现新样式。
            建议您点击 <b>一键升级小程序版本</b> 发布最新小程序版本！
          </div>
        </div>
      </Modal>
    </div>
  )
}
