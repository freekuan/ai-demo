import React, { useState } from 'react';
import './DecorationTemplateManager.css';

const DecorationTemplateManager: React.FC = () => {
  const [currentView, setCurrentView] = useState('templates');
  const [isBasicInfoExpanded, setIsBasicInfoExpanded] = useState(true);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const showPublishModal = () => setPublishModalVisible(true);
  const hidePublishModal = () => setPublishModalVisible(false);

  return (
    <div className="decoration-template-manager-container" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/*  ===== VIEW: TEMPLATE LIST =====  */}
    <div className="view visible" style={{ display: currentView === "templates" ? "block" : "none" }}>
      <div className="page-content">

        <div className="page-header">
          <div>
            <div className="page-title">装修模板管理</div>
            <div className="page-desc">管理系统内置的装修模板，供各租户在装修时选用。模板数据变更后需发布才能生效。</div>
          </div>
          <button className="btn btn-primary" onClick={() => {setCurrentView('new-template')}}>
            ＋ 新建模板
          </button>
        </div>

        <div className="notice-bar">
          <span className="notice-icon">ℹ️</span>
          <span>此功能仅在 <strong>内部租户（tenant_id: system）</strong> 下可见，其他租户无法访问本页面。模板发布后对全部租户生效。</span>
        </div>

        {/*  Filter + View Toggle  */}
        <div className="filter-bar">
          <div className="filter-group">
            <span className="filter-label">搜索：</span>
            <input className="filter-input" type="text" placeholder="模板名称" style={{ width: '180px' }} />
          </div>
          <div className="filter-group">
            <span className="filter-label">分类：</span>
            <select className="filter-select" style={{ width: '130px' }}>
              <option>全部分类</option>
              <option>首页</option>
              <option>活动页</option>
              <option>商品页</option>
              <option>节日主题</option>
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">状态：</span>
            <select className="filter-select" style={{ width: '110px' }}>
              <option>全部状态</option>
              <option>已发布</option>
              <option>草稿</option>
              <option>预览中</option>
            </select>
          </div>
          <div className="filter-divider"></div>
          <button className="btn btn-default">🔍 搜索</button>
          <button className="btn btn-ghost">重置</button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>视图：</span>
            <div className="view-toggle">
              <button className="view-toggle-btn active" id="btn-grid" onClick={() => {switchLayout('grid')}}>⊞</button>
              <button className="view-toggle-btn" id="btn-list" onClick={() => {switchLayout('list')}}>☰</button>
            </div>
          </div>
        </div>

        {/*  Status tabs  */}
        <div className="status-tabs">
          <div className="status-tab active">全部 <span className="count">16</span></div>
          <div className="status-tab">已发布 <span className="count">11</span></div>
          <div className="status-tab">草稿 <span className="count">3</span></div>
          <div className="status-tab">预览中 <span className="count">2</span></div>
        </div>

        {/*  GRID VIEW  */}
        <div id="layout-grid" className="card-view visible">
          <div className="template-grid">

            {/*  NEW ADD CARD  */}
            <div className="template-card-add" onClick={() => {setCurrentView('new-template')}}>
              <div className="add-icon">＋</div>
              <div className="add-text">新建模板</div>
            </div>

            {/*  CARD 1 - Published  */}
            <div className="template-card" onClick={() => {setCurrentView('detail')}}>
              <div className="card-thumb">
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#667eea 0%,#764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '24px' }}>🛍</div>
                  <span>时尚女装首页</span>
                </div>
                <div className="card-status status-published">✓ 已发布</div>
                <div className="card-more" onClick={() => {event.stopPropagation(); toggleDropdown('dd1')}}>⋯
                  <div className="dropdown-menu" id="dd1">
                    <div className="dropdown-item" onClick={() => {setCurrentView('edit')}}>✏️ 编辑</div>
                    <div className="dropdown-item" onClick={() => {setCurrentView('preview')}}>👁 预览</div>
                    <div className="dropdown-item">📋 复制模板</div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item danger">🗑 下架</div>
                  </div>
                </div>
                <div className="card-overlay">
                  <button className="overlay-btn overlay-btn-primary" onClick={() => {event.stopPropagation(); setCurrentView('edit')}}>✏️ 编辑</button>
                  <button className="overlay-btn overlay-btn-default" onClick={() => {event.stopPropagation(); setCurrentView('preview')}}>👁 预览</button>
                </div>
              </div>
              <div className="card-info">
                <div className="card-name">时尚女装首页模板</div>
                <div className="card-meta">
                  <span className="card-category"><span className="tag tag-blue">首页</span></span>
                  <span className="card-date">2024-11-20</span>
                </div>
                <div className="card-usages"><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0F7FF', border: '1px solid #BAD4FF', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', color: '#0958D9' }}>👥 <strong>38</strong> 个租户使用中</span></div>
              </div>
            </div>

            {/*  CARD 2 - Published  */}
            <div className="template-card" onClick={() => {setCurrentView('detail')}}>
              <div className="card-thumb">
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#f093fb 0%,#f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '24px' }}>🎪</div>
                  <span>双11活动页</span>
                </div>
                <div className="card-status status-published">✓ 已发布</div>
                <div className="card-more" onClick={() => {event.stopPropagation()}}>⋯</div>
                <div className="card-overlay">
                  <button className="overlay-btn overlay-btn-primary" onClick={() => {event.stopPropagation(); setCurrentView('edit')}}>✏️ 编辑</button>
                  <button className="overlay-btn overlay-btn-default" onClick={() => {event.stopPropagation(); setCurrentView('preview')}}>👁 预览</button>
                </div>
              </div>
              <div className="card-info">
                <div className="card-name">双11大促活动模板</div>
                <div className="card-meta">
                  <span className="card-category"><span className="tag tag-blue">活动页</span></span>
                  <span className="card-date">2024-10-15</span>
                </div>
                <div className="card-usages"><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0F7FF', border: '1px solid #BAD4FF', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', color: '#0958D9' }}>👥 <strong>124</strong> 个租户使用中</span></div>
              </div>
            </div>

            {/*  CARD 3 - Draft  */}
            <div className="template-card" onClick={() => {setCurrentView('detail')}}>
              <div className="card-thumb">
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#43e97b 0%,#38f9d7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '24px' }}>🌿</div>
                  <span>清新生鲜首页</span>
                </div>
                <div className="card-status status-draft">⏳ 草稿</div>
                <div className="card-more" onClick={() => {event.stopPropagation()}}>⋯</div>
                <div className="card-overlay">
                  <button className="overlay-btn overlay-btn-primary" onClick={() => {event.stopPropagation(); setCurrentView('edit')}}>✏️ 编辑</button>
                  <button className="overlay-btn overlay-btn-default" onClick={() => {event.stopPropagation(); showPublishModal()}}>🚀 发布</button>
                </div>
              </div>
              <div className="card-info">
                <div className="card-name">清新生鲜首页模板</div>
                <div className="card-meta">
                  <span className="card-category"><span className="tag tag-gray">首页</span></span>
                  <span className="card-date">2024-11-28</span>
                </div>
                <div className="card-usages"><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FFF7E6', border: '1px solid #FFD591', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', color: '#D46B08' }}>⏳ 草稿，尚未发布</span></div>
              </div>
            </div>

            {/*  CARD 4 - Preview  */}
            <div className="template-card" onClick={() => {setCurrentView('detail')}}>
              <div className="card-thumb">
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#4facfe 0%,#00f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '24px' }}>🎄</div>
                  <span>圣诞节主题页</span>
                </div>
                <div className="card-status status-preview">👁 预览中</div>
                <div className="card-more" onClick={() => {event.stopPropagation()}}>⋯</div>
                <div className="card-overlay">
                  <button className="overlay-btn overlay-btn-primary" onClick={() => {event.stopPropagation(); showPublishModal()}}>🚀 发布</button>
                  <button className="overlay-btn overlay-btn-default" onClick={() => {event.stopPropagation(); setCurrentView('edit')}}>✏️ 继续编辑</button>
                </div>
              </div>
              <div className="card-info">
                <div className="card-name">圣诞节主题首页模板</div>
                <div className="card-meta">
                  <span className="card-category"><span className="tag tag-blue">节日主题</span></span>
                  <span className="card-date">2024-11-30</span>
                </div>
                <div className="card-usages"><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#E8F3FF', border: '1px solid #BAD4FF', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', color: '#0958D9' }}>👁 预览中，待发布</span></div>
              </div>
            </div>

            {/*  CARD 5  */}
            <div className="template-card" onClick={() => {setCurrentView('detail')}}>
              <div className="card-thumb">
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#fa709a 0%,#fee140 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '24px' }}>🧴</div>
                  <span>美妆精品首页</span>
                </div>
                <div className="card-status status-published">✓ 已发布</div>
                <div className="card-more" onClick={() => {event.stopPropagation()}}>⋯</div>
                <div className="card-overlay">
                  <button className="overlay-btn overlay-btn-primary" onClick={() => {event.stopPropagation(); setCurrentView('edit')}}>✏️ 编辑</button>
                  <button className="overlay-btn overlay-btn-default" onClick={() => {event.stopPropagation(); setCurrentView('preview')}}>👁 预览</button>
                </div>
              </div>
              <div className="card-info">
                <div className="card-name">美妆精品首页模板</div>
                <div className="card-meta">
                  <span className="card-category"><span className="tag tag-blue">首页</span></span>
                  <span className="card-date">2024-09-10</span>
                </div>
                <div className="card-usages"><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0F7FF', border: '1px solid #BAD4FF', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', color: '#0958D9' }}>👥 <strong>56</strong> 个租户使用中</span></div>
              </div>
            </div>

            {/*  CARD 6  */}
            <div className="template-card" onClick={() => {setCurrentView('detail')}}>
              <div className="card-thumb">
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#a18cd1 0%,#fbc2eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '24px' }}>🍜</div>
                  <span>餐饮外卖首页</span>
                </div>
                <div className="card-status status-published">✓ 已发布</div>
                <div className="card-more" onClick={() => {event.stopPropagation()}}>⋯</div>
                <div className="card-overlay">
                  <button className="overlay-btn overlay-btn-primary" onClick={() => {event.stopPropagation(); setCurrentView('edit')}}>✏️ 编辑</button>
                  <button className="overlay-btn overlay-btn-default" onClick={() => {event.stopPropagation(); setCurrentView('preview')}}>👁 预览</button>
                </div>
              </div>
              <div className="card-info">
                <div className="card-name">餐饮外卖首页模板</div>
                <div className="card-meta">
                  <span className="card-category"><span className="tag tag-blue">首页</span></span>
                  <span className="card-date">2024-08-20</span>
                </div>
                <div className="card-usages"><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0F7FF', border: '1px solid #BAD4FF', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', color: '#0958D9' }}>👥 <strong>19</strong> 个租户使用中</span></div>
              </div>
            </div>
          </div>
          <div className="pagination">
            <span className="page-total">共 16 条</span>
            <div className="page-btn">‹</div>
            <div className="page-btn active">1</div>
            <div className="page-btn">2</div>
            <div className="page-btn">3</div>
            <div className="page-btn">›</div>
          </div>
        </div>

        {/*  LIST VIEW  */}
        <div id="layout-list" className="table-view">
          <div className="info-section">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}><input type="checkbox" /></th>
                  <th>模板名称</th>
                  <th>分类</th>
                  <th>状态</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => {sortByUsage(this)}}>使用租户数 ↕</th>
                  <th>创建时间</th>
                  <th>最后发布</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '60px', borderRadius: '4px', background: 'linear-gradient(160deg,#667eea,#764ba2)', flexShrink: '0' }}></div>
                      <div>
                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>时尚女装首页模板</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>template_id: tpl_001</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="tag tag-blue">首页</span></td>
                  <td><span className="chip chip-green">✓ 已发布</span></td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F0F7FF', border: '1px solid #BAD4FF', borderRadius: '20px', padding: '3px 12px', fontSize: '13px', color: '#0958D9', fontWeight: '500' }}>👥 38</span></td>
                  <td>2024-11-20</td>
                  <td>2024-11-25</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-sm btn-default" onClick={() => {setCurrentView('edit')}}>编辑</button>
                      <button className="btn btn-sm btn-default" onClick={() => {setCurrentView('preview')}}>预览</button>
                      <button className="btn btn-sm btn-ghost">⋯</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '60px', borderRadius: '4px', background: 'linear-gradient(160deg,#f093fb,#f5576c)', flexShrink: '0' }}></div>
                      <div>
                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>双11大促活动模板</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>template_id: tpl_002</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="tag tag-blue">活动页</span></td>
                  <td><span className="chip chip-green">✓ 已发布</span></td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F0F7FF', border: '1px solid #BAD4FF', borderRadius: '20px', padding: '3px 12px', fontSize: '13px', color: '#0958D9', fontWeight: '500' }}>👥 124</span></td>
                  <td>2024-10-15</td>
                  <td>2024-10-20</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-sm btn-default" onClick={() => {setCurrentView('edit')}}>编辑</button>
                      <button className="btn btn-sm btn-default" onClick={() => {setCurrentView('preview')}}>预览</button>
                      <button className="btn btn-sm btn-ghost">⋯</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '60px', borderRadius: '4px', background: 'linear-gradient(160deg,#43e97b,#38f9d7)', flexShrink: '0' }}></div>
                      <div>
                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>清新生鲜首页模板</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>template_id: tpl_003</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="tag tag-gray">首页</span></td>
                  <td><span className="chip chip-orange">⏳ 草稿</span></td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F5F5F5', border: '1px solid #E8E8E8', borderRadius: '20px', padding: '3px 12px', fontSize: '13px', color: '#8C8C8C' }}>— 未发布</span></td>
                  <td>2024-11-28</td>
                  <td>—</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-sm btn-default" onClick={() => {setCurrentView('edit')}}>编辑</button>
                      <button className="btn btn-sm btn-primary" onClick={() => {showPublishModal()}}>发布</button>
                      <button className="btn btn-sm btn-ghost">⋯</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span className="page-total">共 16 条</span>
            <div className="page-btn">‹</div>
            <div className="page-btn active">1</div>
            <div className="page-btn">2</div>
            <div className="page-btn">›</div>
          </div>
        </div>

      </div>
    </div>{/*  /view-templates  */}


    {/*  ===== VIEW: NEW TEMPLATE =====  */}
    <div className="view" style={{ display: currentView === "new-template" ? "block" : "none" }}>
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0' }}>
        <div className="page-header" style={{ flexShrink: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="back-btn" onClick={() => {setCurrentView('templates')}}>← 返回模板库</div>
            <div style={{ color: 'var(--border)' }}>|</div>
            <div className="page-title">新建装修模板</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" onClick={() => {setCurrentView('templates')}}>取消</button>
            <button className="btn btn-default" onClick={() => {setCurrentView('preview')}}>👁 预览</button>
            <button className="btn btn-default" onClick={() => {setCurrentView('detail')}}>💾 保存草稿</button>
            <button className="btn btn-primary" onClick={() => {showPublishModal()}}>🚀 保存并发布</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '1', minHeight: '0' }}>
          {/*  Basic Info  */}
          <div className="info-section" style={{ marginBottom: '0', flexShrink: '0' }}>
            <div className="info-section-header" style={{ cursor: 'pointer', background: 'var(--gray-1)' }} onClick={() => setIsBasicInfoExpanded(!isBasicInfoExpanded)} >
              <span className="info-section-title">📋 基本信息设置</span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                <span>点击收起/展开</span>
                <span className="toggle-icon" style={{ transition: 'transform 0.2s' }}>▼</span>
              </div>
            </div>
            <div style={{ padding: '20px', display: isBasicInfoExpanded ? 'block' : 'none' }}>
              <div className="form-row-2" style={{ marginBottom: '20px' }}>
                <div>
                  <div className="form-label">模板名称 <span className="required">*</span></div>
                  <input className="form-input" type="text" placeholder="如：时尚女装首页模板" />
                  <div className="form-hint" style={{ marginTop: '4px' }}>建议格式：{行业/场景}+{页面类型}模板</div>
                </div>
                <div>
                  <div className="form-label">排序权重</div>
                  <input className="form-input" type="number" value="100" />
                </div>
              </div>
              <div className="form-row-2" style={{ marginBottom: '20px' }}>
                <div>
                  <div className="form-label">页面分类 <span className="required">*</span></div>
                  <select className="form-select">
                    <option value="">请选择分类</option>
                    <option>首页</option>
                    <option>活动页</option>
                    <option>商品详情页</option>
                    <option>个人中心页</option>
                    <option>节日主题</option>
                    <option>行业模板</option>
                  </select>
                </div>
                <div>
                  <div className="form-label">适用行业</div>
                  <select className="form-select">
                    <option>通用</option>
                    <option>服装鞋包</option>
                    <option>美妆护肤</option>
                    <option>食品生鲜</option>
                    <option>餐饮外卖</option>
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ marginBottom: '0' }}>
                <div className="form-label">标签（多选）</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" /> 促销活动</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" /> 女装</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" /> 轻奢</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" /> 简约</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" /> 深色系</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" /> 大图流</label>
                </div>
              </div>
            </div>
          </div>

          {/*  Decoration Editor  */}
          <div className="info-section" style={{ marginBottom: '0', display: 'flex', flexDirection: 'column', height: '600px' }}>
             <div className="info-section-header">
                <span className="info-section-title">🎨 页面装修</span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>搭建好页面后，保存时系统将自动生成缩略图和配置数据，无需手动上传。</span>
             </div>
             <div style={{ flex: '1', display: 'flex', background: 'var(--bg)' }}>
               {/*  left  */}
               <div style={{ width: '220px', background: 'white', borderRight: '1px solid var(--border)', padding: '16px', overflowY: 'auto' }}>
                 <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>组件库</div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>🖼</div><div style={{ fontSize: '12px' }}>轮播图</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>🗂</div><div style={{ fontSize: '12px' }}>导航组</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>🛍</div><div style={{ fontSize: '12px' }}>商品列表</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>📝</div><div style={{ fontSize: '12px' }}>图文</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>📢</div><div style={{ fontSize: '12px' }}>公告栏</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>🎁</div><div style={{ fontSize: '12px' }}>优惠券</div></div>
                 </div>
               </div>
               {/*  center  */}
               <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'hidden' }}>
                 <div style={{ width: '340px', height: '520px', background: 'white', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ height: '48px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#262626', fontSize: '14px', fontWeight: 500 }}>页面标题</div>
                   <div style={{ flex: '1', padding: '0', overflowY: 'auto', background: 'var(--gray-2)' }}>
                     <div style={{ background: 'white', border: '1px dashed transparent', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '10px', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                       从左侧拖拽组件至此处
                     </div>
                   </div>
                 </div>
               </div>
               {/*  right  */}
               <div style={{ width: '280px', background: 'white', borderLeft: '1px solid var(--border)', padding: '16px', overflowY: 'auto' }}>
                 <div className="empty-state" style={{ padding: '40px 10px' }}>
                   <div className="empty-icon" style={{ fontSize: '32px' }}>🖱</div>
                   <div className="empty-title" style={{ fontSize: '13px' }}>请选择一个组件</div>
                   <div className="empty-desc" style={{ fontSize: '12px' }}>选中组件后即可在此配置属性</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>{/*  /view-new-template  */}


    {/*  ===== VIEW: EDIT TEMPLATE =====  */}
    <div className="view" style={{ display: currentView === "edit" ? "block" : "none" }}>
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0' }}>
        <div className="page-header" style={{ flexShrink: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="back-btn" onClick={() => {setCurrentView('detail')}}>← 返回详情</div>
            <div style={{ color: 'var(--border)' }}>|</div>
            <div className="page-title">编辑模板</div>
            <span className="chip chip-green" style={{ fontSize: '12px' }}>时尚女装首页模板</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" onClick={() => {setCurrentView('detail')}}>取消</button>
            <button className="btn btn-default" onClick={() => {setCurrentView('preview')}}>👁 预览变更</button>
            <button className="btn btn-default" onClick={() => {setCurrentView('detail')}}>💾 保存草稿</button>
            <button className="btn btn-primary" onClick={() => {showPublishModal()}}>🚀 保存并发布</button>
          </div>
        </div>

        {/*  Version history notice  */}
        <div className="alert alert-info" style={{ marginBottom: '16px', flexShrink: '0' }}>
          <span className="alert-icon">📌</span>
          <div>当前编辑的是 <strong>v1.3</strong>（最新发布版本），发布后将升级至 <strong>v1.4</strong>。<a onClick={() => {setCurrentView('detail')}} style={{ cursor: 'pointer' }}>查看版本历史</a></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '1', minHeight: '0' }}>

          {/*  Basic Info  */}
          <div className="info-section" style={{ marginBottom: '0', flexShrink: '0' }}>
            <div className="info-section-header" style={{ cursor: 'pointer', background: 'var(--gray-1)' }} onClick={() => setIsBasicInfoExpanded(!isBasicInfoExpanded)} >
              <span className="info-section-title">📋 基本信息设置 (时尚女装首页模板)</span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                <span>点击收起/展开</span>
                <span className="toggle-icon" style={{ transform: 'rotate(-90deg)', transition: 'transform 0.2s' }}>▼</span>
              </div>
            </div>
            <div style={{ padding: '20px', display: isBasicInfoExpanded ? 'none' : 'block' }}>
              <div className="form-row-2" style={{ marginBottom: '20px' }}>
                <div>
                  <div className="form-label">模板名称 <span className="required">*</span></div>
                  <input className="form-input" type="text" value="时尚女装首页模板" />
                  <div className="form-hint" style={{ marginTop: '4px' }}>建议格式：{行业/场景}+{页面类型}模板</div>
                </div>
                <div>
                  <div className="form-label">排序权重</div>
                  <input className="form-input" type="number" value="100" />
                </div>
              </div>
              <div className="form-row-2" style={{ marginBottom: '20px' }}>
                <div>
                  <div className="form-label">页面分类 <span className="required">*</span></div>
                  <select className="form-select">
                    <option value="">请选择分类</option>
                    <option defaultValue>首页</option>
                    <option>活动页</option>
                    <option>商品详情页</option>
                    <option>个人中心页</option>
                    <option>节日主题</option>
                    <option>行业模板</option>
                  </select>
                </div>
                <div>
                  <div className="form-label">适用行业</div>
                  <select className="form-select">
                    <option>通用</option>
                    <option defaultValue>服装鞋包</option>
                    <option>美妆护肤</option>
                    <option>食品生鲜</option>
                    <option>餐饮外卖</option>
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ marginBottom: '0' }}>
                <div className="form-label">标签（多选）</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" /> 促销活动</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> 女装</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> 轻奢</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> 简约</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" /> 深色系</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" /> 大图流</label>
                </div>
              </div>
            </div>
          </div>

          {/*  Decoration Editor  */}
          <div className="info-section" style={{ marginBottom: '0', display: 'flex', flexDirection: 'column', height: '600px' }}>
             <div className="info-section-header">
                <span className="info-section-title">🎨 页面装修</span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>搭建好页面后，保存时系统将自动生成缩略图和配置数据，无需手动上传。</span>
             </div>
             <div style={{ flex: '1', display: 'flex', background: 'var(--bg)' }}>
               {/*  left  */}
               <div style={{ width: '220px', background: 'white', borderRight: '1px solid var(--border)', padding: '16px', overflowY: 'auto' }}>
                 <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>组件库</div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>🖼</div><div style={{ fontSize: '12px' }}>轮播图</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>🗂</div><div style={{ fontSize: '12px' }}>导航组</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>🛍</div><div style={{ fontSize: '12px' }}>商品列表</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>📝</div><div style={{ fontSize: '12px' }}>图文</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>📢</div><div style={{ fontSize: '12px' }}>公告栏</div></div>
                   <div style={{ textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--gray-1)' }}><div style={{ fontSize: '20px', marginBottom: '4px' }}>🎁</div><div style={{ fontSize: '12px' }}>优惠券</div></div>
                 </div>
               </div>
               {/*  center  */}
               <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'hidden' }}>
                 <div style={{ width: '340px', height: '520px', background: 'white', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ height: '48px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#262626', fontSize: '14px', fontWeight: 500 }}>页面标题</div>
                   <div style={{ flex: '1', padding: '0', overflowY: 'auto', background: 'var(--gray-2)' }}>
                     <div style={{ border: '2px solid var(--primary)', background: 'white', minHeight: '140px', display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer' }}>
                       <div style={{ position: 'absolute', right: '-2px', top: '-2px', background: 'var(--primary)', color: 'white', fontSize: '11px', padding: '2px 8px' }}>轮播图</div>
                       <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', fontSize: '14px' }}>[ 轮播图内容区 ]</div>
                     </div>
                     <div style={{ background: 'white', border: '1px dashed transparent', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '10px', cursor: 'pointer' }}>
                       <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
                         <div style={{ width: '40px', height: '40px', background: 'var(--gray-3)', borderRadius: '50%' }}></div>
                         <div style={{ width: '40px', height: '40px', background: 'var(--gray-3)', borderRadius: '50%' }}></div>
                         <div style={{ width: '40px', height: '40px', background: 'var(--gray-3)', borderRadius: '50%' }}></div>
                         <div style={{ width: '40px', height: '40px', background: 'var(--gray-3)', borderRadius: '50%' }}></div>
                       </div>
                     </div>
                     <div style={{ background: 'white', border: '1px dashed transparent', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '13px', marginTop: '8px', cursor: 'pointer' }}>
                       [ 商品列表内容区 ]
                     </div>
                   </div>
                 </div>
               </div>
               {/*  right  */}
               <div style={{ width: '280px', background: 'white', borderLeft: '1px solid var(--border)', padding: '16px', overflowY: 'auto' }}>
                 <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span>轮播图设置</span>
                   <button className="btn btn-xs btn-ghost" style={{ color: 'var(--danger)' }}>删除</button>
                 </div>
                 <div className="form-row">
                   <div className="form-label">上传图片</div>
                   <div className="upload-box" style={{ padding: '16px', minHeight: '80px', marginBottom: '10px', background: 'var(--gray-2)', borderStyle: 'solid' }}>
                     <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>图片_banner.jpg <span style={{ float: 'right', color: 'var(--danger)', cursor: 'pointer' }}>✕</span></div>
                   </div>
                   <div className="upload-box" style={{ padding: '16px', minHeight: '80px' }}>
                     <div className="upload-icon" style={{ fontSize: '20px', marginBottom: '4px' }}>+</div>
                     <div className="upload-text" style={{ fontSize: '12px' }}>添加图片</div>
                   </div>
                 </div>
                 <div className="form-row">
                   <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> 自动播放</label>
                 </div>
                 <div className="form-row">
                   <div className="form-label">图片圆角</div>
                   <input className="form-input" type="number" value="8" />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>{/*  /view-edit  */}


    {/*  ===== VIEW: DETAIL =====  */}
    <div className="view" style={{ display: currentView === "detail" ? "block" : "none" }}>
      <div className="detail-topbar">
        <div className="back-btn" onClick={() => {setCurrentView('templates')}}>← 返回模板库</div>
        <div style={{ color: 'var(--border)' }}>|</div>
        <div className="detail-title">时尚女装首页模板</div>
        <span className="chip chip-green">✓ 已发布</span>
        <div className="detail-actions">
          <button className="btn btn-default" onClick={() => {setCurrentView('preview')}}>👁 预览</button>
          <button className="btn btn-default" onClick={() => {setCurrentView('edit')}}>✏️ 编辑</button>
          <button className="btn btn-primary" onClick={() => {showPublishModal()}}>🚀 重新发布</button>
          <div className="dropdown" id="detail-more">
            <button className="btn btn-default" onClick={() => {toggleDropdown('detail-more')}}>⋯ 更多</button>
            <div className="dropdown-menu">
              <div className="dropdown-item">📋 复制模板</div>
              <div className="dropdown-item">📤 导出 JSON</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item danger" onClick={() => {showConfirm()}}>🗑 下架模板</div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        {/*  PREVIEW PANEL  */}
        <div className="preview-panel">
          <div className="preview-toolbar">
            <span className="preview-label">📱 小程序预览</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
              <button className="btn btn-sm btn-ghost">手机</button>
              <button className="btn btn-sm btn-ghost">平板</button>
            </div>
          </div>
          <div className="preview-frame-wrap">
            <div className="phone-frame">
              <div className="phone-notch"></div>
              <div className="phone-content">
                <div className="mini-header">
                  <div style={{ fontSize: '9px', textAlign: 'center', color: '#262626', fontWeight: '600' }}>LUMIÈRE</div>
                </div>
                <div className="mini-banner">轮播图组件</div>
                <div className="mini-nav">
                  <div className="mini-nav-item">新品</div>
                  <div className="mini-nav-item">热销</div>
                  <div className="mini-nav-item">特惠</div>
                  <div className="mini-nav-item">品牌</div>
                </div>
                <div className="mini-notice">🔔 限时活动通知栏</div>
                <div className="mini-section">
                  <div className="mini-section-title">爆款推荐</div>
                  <div className="mini-products">
                    <div className="mini-product">
                      <div className="mini-product-img"></div>
                      <div className="mini-product-info">
                        <div className="mini-product-name">商品名称</div>
                        <div className="mini-product-price">¥299</div>
                      </div>
                    </div>
                    <div className="mini-product">
                      <div className="mini-product-img" style={{ background: 'linear-gradient(135deg,#43e97b,#38f9d7)' }}></div>
                      <div className="mini-product-info">
                        <div className="mini-product-name">商品名称</div>
                        <div className="mini-product-price">¥189</div>
                      </div>
                    </div>
                    <div className="mini-product">
                      <div className="mini-product-img" style={{ background: 'linear-gradient(135deg,#4facfe,#00f2fe)' }}></div>
                      <div className="mini-product-info">
                        <div className="mini-product-name">商品名称</div>
                        <div className="mini-product-price">¥459</div>
                      </div>
                    </div>
                    <div className="mini-product">
                      <div className="mini-product-img" style={{ background: 'linear-gradient(135deg,#fa709a,#fee140)' }}></div>
                      <div className="mini-product-info">
                        <div className="mini-product-name">商品名称</div>
                        <div className="mini-product-price">¥129</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mini-ad">广告组件</div>
              </div>
            </div>
          </div>
        </div>

        {/*  INFO PANEL  */}
        <div className="info-panel">
          {/*  Version history as tabs  */}
          <div className="tab-nav">
            <div className="tab-nav-item active">📋 模板详情</div>
            <div className="tab-nav-item">📜 版本历史</div>
            <div className="tab-nav-item">📊 使用统计</div>
          </div>

          <div className="info-section" style={{ marginBottom: '16px' }}>
            <div className="info-section-header">
              <span className="info-section-title">基本信息</span>
              <button className="btn btn-sm btn-default" onClick={() => {setCurrentView('edit')}}>编辑</button>
            </div>
            <div className="info-row">
              <span className="info-key">模板ID</span>
              <span className="info-val" style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-tertiary)' }}>tpl_001_fashion_home</span>
            </div>
            <div className="info-row">
              <span className="info-key">模板名称</span>
              <span className="info-val" style={{ fontWeight: '500' }}>时尚女装首页模板</span>
            </div>
            <div className="info-row">
              <span className="info-key">页面分类</span>
              <span className="info-val"><span className="tag tag-blue">首页</span></span>
            </div>
            <div className="info-row">
              <span className="info-key">适用行业</span>
              <span className="info-val">服装鞋包</span>
            </div>
            <div className="info-row">
              <span className="info-key">状态</span>
              <span className="info-val"><span className="chip chip-green">✓ 已发布</span></span>
            </div>
            <div className="info-row">
              <span className="info-key">当前版本</span>
              <span className="info-val">v1.3</span>
            </div>
            <div className="info-row">
              <span className="info-key">描述</span>
              <span className="info-val">适用于时尚女装品牌的首页装修，包含轮播图、品类导航、爆款商品等核心模块，视觉风格简约高级。</span>
            </div>
            <div className="info-row">
              <span className="info-key">标签</span>
              <span className="info-val">
                <span className="tag tag-blue">简约</span>
                <span className="tag tag-blue">女装</span>
                <span className="tag tag-blue">轻奢</span>
              </span>
            </div>
            <div className="info-row">
              <span className="info-key">排序权重</span>
              <span className="info-val">100</span>
            </div>
          </div>

          <div className="info-section" style={{ marginBottom: '16px' }}>
            <div className="info-section-header">
              <span className="info-section-title">发布信息</span>
            </div>
            <div className="info-row">
              <span className="info-key">创建时间</span>
              <span className="info-val">2024-09-15 10:23:00</span>
            </div>
            <div className="info-row">
              <span className="info-key">首次发布</span>
              <span className="info-val">2024-09-20 14:00:00</span>
            </div>
            <div className="info-row">
              <span className="info-key">最近发布</span>
              <span className="info-val">2024-11-25 09:30:00</span>
            </div>
            <div className="info-row">
              <span className="info-key">发布人</span>
              <span className="info-val">张三（admin@internal.com）</span>
            </div>
          </div>

          <div className="info-section">
            <div className="info-section-header">
              <span className="info-section-title">📊 使用统计</span>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>近 30 天</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
              <div style={{ padding: '16px 20px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>38</div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>使用租户数</div>
              </div>
              <div style={{ padding: '16px 20px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>12</div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>本月新增</div>
              </div>
              <div style={{ padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--warning)' }}>3</div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>版本历史</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>{/*  /view-detail  */}


    {/*  ===== VIEW: PREVIEW =====  */}
    <div className="view" style={{ display: currentView === "preview" ? "block" : "none" }}>
      <div className="detail-topbar">
        <div className="back-btn" onClick={() => {setCurrentView('new-template')}}>← 返回编辑</div>
        <div style={{ color: 'var(--border)' }}>|</div>
        <div className="detail-title">预览模板</div>
        <span className="chip chip-blue">👁 预览中</span>
        <div className="detail-actions">
          <button className="btn btn-default" onClick={() => {setCurrentView('edit')}}>✏️ 继续编辑</button>
          <button className="btn btn-default" onClick={() => {setCurrentView('detail')}}>💾 保存草稿</button>
          <button className="btn btn-primary" onClick={() => {showPublishModal()}}>🚀 确认发布</button>
        </div>
      </div>

      <div style={{ flex: '1', background: 'var(--gray-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '40px', overflowY: 'auto', gap: '24px' }}>
        <div className="alert alert-info" style={{ maxWidth: '500px', width: '100%' }}>
          <span className="alert-icon">ℹ️</span>
          <div>当前为预览模式，展示的是模板在小程序中的大致效果。数据为示例数据，正式上线后将由租户自行配置。</div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/*  Large phone mockup  */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>📱 小程序端预览</div>
            <div style={{ width: '280px', height: '560px', border: '8px solid #1a1a1a', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden', background: 'white', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '20px', background: '#1a1a1a', borderRadius: '0 0 14px 14px', zIndex: '10' }}></div>
              <div style={{ paddingTop: '20px', overflowY: 'auto', height: '100%' }}>
                <div className="mini-header" style={{ padding: '10px' }}>
                  <div style={{ fontSize: '12px', textAlign: 'center', color: '#262626', fontWeight: '700', letterSpacing: '2px' }}>LUMIÈRE 品牌旗舰店</div>
                </div>
                <div className="mini-banner" style={{ height: '100px', margin: '6px', fontSize: '11px' }}>🖼 轮播图组件<br /><span style={{ fontSize: '9px', opacity: '0.8' }}>支持3-5张图片自动播放</span></div>
                <div className="mini-nav" style={{ padding: '8px 6px' }}>
                  <div className="mini-nav-item" style={{ height: '36px', fontSize: '9px', flexDirection: 'column', gap: '2px' }}><span style={{ fontSize: '14px' }}>👗</span>新品</div>
                  <div className="mini-nav-item" style={{ height: '36px', fontSize: '9px', flexDirection: 'column', gap: '2px' }}><span style={{ fontSize: '14px' }}>🔥</span>热销</div>
                  <div className="mini-nav-item" style={{ height: '36px', fontSize: '9px', flexDirection: 'column', gap: '2px' }}><span style={{ fontSize: '14px' }}>💰</span>特惠</div>
                  <div className="mini-nav-item" style={{ height: '36px', fontSize: '9px', flexDirection: 'column', gap: '2px' }}><span style={{ fontSize: '14px' }}>🏷</span>品牌</div>
                  <div className="mini-nav-item" style={{ height: '36px', fontSize: '9px', flexDirection: 'column', gap: '2px' }}><span style={{ fontSize: '14px' }}>👤</span>我的</div>
                </div>
                <div className="mini-notice" style={{ fontSize: '9px', margin: '6px' }}>🔔 限时优惠：新用户注册立减50元！</div>
                <div className="mini-section" style={{ padding: '6px' }}>
                  <div className="mini-section-title" style={{ fontSize: '10px' }}>🔥 爆款推荐</div>
                  <div className="mini-products" style={{ gap: '6px' }}>
                    <div className="mini-product" style={{ height: '90px' }}>
                      <div className="mini-product-img" style={{ height: '60px' }}></div>
                      <div className="mini-product-info"><div className="mini-product-name" style={{ fontSize: '8px' }}>女士连衣裙</div><div className="mini-product-price" style={{ fontSize: '9px' }}>¥299</div></div>
                    </div>
                    <div className="mini-product" style={{ height: '90px' }}>
                      <div className="mini-product-img" style={{ height: '60px', background: 'linear-gradient(135deg,#43e97b,#38f9d7)' }}></div>
                      <div className="mini-product-info"><div className="mini-product-name" style={{ fontSize: '8px' }}>轻奢手提包</div><div className="mini-product-price" style={{ fontSize: '9px' }}>¥589</div></div>
                    </div>
                    <div className="mini-product" style={{ height: '90px' }}>
                      <div className="mini-product-img" style={{ height: '60px', background: 'linear-gradient(135deg,#4facfe,#00f2fe)' }}></div>
                      <div className="mini-product-info"><div className="mini-product-name" style={{ fontSize: '8px' }}>休闲外套</div><div className="mini-product-price" style={{ fontSize: '9px' }}>¥459</div></div>
                    </div>
                    <div className="mini-product" style={{ height: '90px' }}>
                      <div className="mini-product-img" style={{ height: '60px', background: 'linear-gradient(135deg,#fa709a,#fee140)' }}></div>
                      <div className="mini-product-info"><div className="mini-product-name" style={{ fontSize: '8px' }}>丝绒上衣</div><div className="mini-product-price" style={{ fontSize: '9px' }}>¥129</div></div>
                    </div>
                  </div>
                </div>
                <div className="mini-ad" style={{ height: '60px', margin: '6px', fontSize: '9px', fontWeight: '600' }}>📢 广告位（可选组件）</div>
              </div>
            </div>
          </div>

          {/*  Component List  */}
          <div style={{ width: '260px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px' }}>📦 组件清单</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>🖼</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>轮播图</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Banner · 3张图片</div>
                </div>
                <span className="chip chip-green" style={{ marginLeft: 'auto', fontSize: '11px' }}>✓</span>
              </div>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>🗂</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>品类导航</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Nav · 5个入口</div>
                </div>
                <span className="chip chip-green" style={{ marginLeft: 'auto', fontSize: '11px' }}>✓</span>
              </div>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>📣</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>公告栏</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Notice · 跑马灯</div>
                </div>
                <span className="chip chip-green" style={{ marginLeft: 'auto', fontSize: '11px' }}>✓</span>
              </div>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>🛍</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>商品列表</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>ProductList · 两列布局</div>
                </div>
                <span className="chip chip-green" style={{ marginLeft: 'auto', fontSize: '11px' }}>✓</span>
              </div>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>📢</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>广告组件</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Ad · 可选</div>
                </div>
                <span className="chip chip-gray" style={{ marginLeft: 'auto', fontSize: '11px' }}>可选</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>{/*  /view-preview  */}

  



{/*  ===== PUBLISH MODAL =====  */}
<div className="modal-mask" style={{ display: publishModalVisible ? "flex" : "none" }} onClick={hidePublishModal}>
  <div className="modal" style={{ maxWidth: '480px', width: '100%' }} onClick={(e) => {e.stopPropagation()}}>
    <div className="modal-header">
      <div className="modal-title">🚀 发布模板</div>
      <button className="modal-close" onClick={hidePublishModal}>✕</button>
    </div>
    <div className="modal-body">
      {/*  Publish step bar  */}
      <div className="publish-steps" style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '20px' }}>
        <div className="pub-step done"><div className="pub-step-num">✓</div> 基本信息</div>
        <div className="pub-step done"><div className="pub-step-num">✓</div> 页面装修</div>
        <div className="pub-step active"><div className="pub-step-num">3</div> 确认发布</div>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
        <span className="alert-icon">⚠️</span>
        <div>发布后，该模板将在租户装修模板选择界面对所有租户展示。请确认内容无误。</div>
      </div>

      <div className="info-section" style={{ marginBottom: '0' }}>
        <div className="info-row">
          <span className="info-key">模板名称</span>
          <span className="info-val" style={{ fontWeight: '500' }}>时尚女装首页模板</span>
        </div>
        <div className="info-row">
          <span className="info-key">分类</span>
          <span className="info-val"><span className="tag tag-blue">首页</span></span>
        </div>
        <div className="info-row">
          <span className="info-key">发布版本</span>
          <span className="info-val">v1.4（当前最新）</span>
        </div>
        <div className="info-row" style={{ borderBottom: 'none' }}>
          <span className="info-key">生效范围</span>
          <span className="info-val">全部租户（新装修时可选用）</span>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <div className="form-label" style={{ marginBottom: '8px' }}>发布备注（选填）</div>
        <textarea className="form-textarea" placeholder="描述本次发布的主要变更内容，如：新增秋冬风格色系" style={{ minHeight: '60px' }}></textarea>
      </div>
    </div>
    <div className="modal-footer">
      <button className="btn btn-default" onClick={() => {closePublishModal()}}>取消</button>
      <button className="btn btn-primary" onClick={() => {closePublishModal(); setCurrentView('detail')}}>✓ 确认发布</button>
    </div>
  </div>
</div>


{/*  ===== CONFIRM MODAL =====  */}
<div className="modal-mask" id="modal-confirm" onClick={() => {closeConfirm(event)}}>
  <div className="confirm-dialog" onClick={() => {event.stopPropagation()}}>
    <div className="confirm-icon">⚠️</div>
    <div className="confirm-title">确认下架此模板？</div>
    <div className="confirm-desc">
      下架后，该模板将从所有租户的模板选择界面移除，<strong>已使用该模板的页面不受影响</strong>。
      如需恢复，可重新发布该模板。
    </div>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
      <button className="btn btn-default" onClick={() => {closeConfirm()}}>取消</button>
      <button className="btn btn-danger" onClick={() => {closeConfirm()}}>确认下架</button>
    </div>
  </div>
</div>
    </div>
  );
};

export default DecorationTemplateManager;
