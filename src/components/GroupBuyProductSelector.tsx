import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Checkbox, Pagination, Tooltip, message } from 'antd';
import './GroupBuyProductSelector.css';

interface Product {
  id: string;
  name: string;
  pid: string;
  price: string;
  stock: number;
  img: string;
  type: 'normal' | 'conflict' | 'historical';
  conflictMsg?: string;
  conflictAct?: string;
}

const mockData: Record<number, Product[]> = {
  1: [
    { id: 'prod1', name: '夏季透气运动跑鞋 男女同款 减震耐磨', pid: '88923145', price: '¥299.00', stock: 450, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80', type: 'normal' },
    { id: 'prod2', name: '日式字母透气中筒袜袜子女生款冬季运动风极简风痞帅', pid: '375746022434', price: '¥12.00 - ¥16.00', stock: 22, img: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=100&q=80', type: 'conflict', conflictMsg: '该商品当前已参与单品直降，互斥不可选', conflictAct: '限时抢购 20260724' },
    { id: 'hist_prod3', name: '日式复古纯色百搭衬衫 秋季长袖', pid: '55432190', price: '¥158.00', stock: 88, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80', type: 'historical' },
    { id: 'prod4', name: '极简风百搭鸭舌帽 防晒遮阳 男女通用', pid: '99012344', price: '¥39.00', stock: 920, img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&q=80', type: 'normal' }
  ],
  2: [
    { id: 'prod5', name: '秋季新款韩版宽松连帽卫衣 男士休闲外套', pid: '11223344', price: '¥129.00', stock: 300, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80', type: 'normal' },
    { id: 'prod6', name: '高腰显瘦直筒牛仔裤 女宽松阔腿裤', pid: '55667788', price: '¥99.00', stock: 150, img: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=100&q=80', type: 'normal' },
    { id: 'prod7', name: '网红同款便携式大容量水杯 吸管杯', pid: '99001122', price: '¥25.90', stock: 1200, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80', type: 'conflict', conflictMsg: '该商品当前参与满减活动，不可重叠', conflictAct: '国庆满减大促 20261001' },
    { id: 'hist_prod8', name: '防蓝光护目镜 电竞游戏看电脑眼镜', pid: '33445566', price: '¥88.00', stock: 55, img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&q=80', type: 'historical' }
  ],
  3: [
    { id: 'prod9', name: '无线蓝牙耳机 降噪高音质 超长续航', pid: '77889900', price: '¥199.00', stock: 800, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80', type: 'normal' },
    { id: 'prod10', name: '桌面迷你加湿器 办公室静音补水', pid: '22334455', price: '¥35.00', stock: 430, img: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=100&q=80', type: 'normal' },
    { id: 'prod11', name: '多功能护颈枕 记忆棉U型枕 飞机旅行', pid: '66778899', price: '¥69.00', stock: 210, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80', type: 'normal' },
    { id: 'prod12', name: '速干运动毛巾 健身跑步吸汗冰丝巾', pid: '11112222', price: '¥19.90', stock: 3000, img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&q=80', type: 'normal' }
  ]
};

const initialHistorical = [
  { id: 'hist_prod3', name: '日式复古纯色百搭衬衫 秋季长袖', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80' },
  { id: 'hist_prod8', name: '防蓝光护目镜 电竞游戏看电脑眼镜', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&q=80' }
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

const GroupBuyProductSelector: React.FC<Props> = ({ visible, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Selected new items map
  const [selectedItems, setSelectedItems] = useState<Record<string, {name: string; img: string}>>({});
  
  // Submodal State
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [currentConflict, setCurrentConflict] = useState<Product | null>(null);
  const [isPendingDelete, setIsPendingDelete] = useState(false);

  // Load data simulation
  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      setTimeout(() => {
        setProducts(mockData[currentPage] || []);
        setLoading(false);
      }, 300);
    }
  }, [currentPage, visible]);

  const toggleSelect = (product: Product, checked: boolean) => {
    const newSelected = { ...selectedItems };
    if (checked) {
      newSelected[product.id] = { name: product.name, img: product.img };
    } else {
      delete newSelected[product.id];
    }
    setSelectedItems(newSelected);
  };

  const removeSelect = (id: string) => {
    const newSelected = { ...selectedItems };
    delete newSelected[id];
    setSelectedItems(newSelected);
  };

  const clearAll = () => {
    setSelectedItems({});
  };

  const openSubModal = (product: Product) => {
    setCurrentConflict(product);
    setIsPendingDelete(false);
    setSubModalVisible(true);
  };

  const confirmSubModal = () => {
    if (isPendingDelete && currentConflict) {
      // Resolve conflict visually
      const newProducts = products.map(p => {
        if (p.id === currentConflict.id) {
          return { ...p, type: 'normal' } as Product;
        }
        return p;
      });
      setProducts(newProducts);
      message.success('已解除互斥关联，现在可以勾选该商品了。');
    }
    setSubModalVisible(false);
    setCurrentConflict(null);
  };

  // Rendering Right Panel
  const renderSelectedItems = () => {
    const newKeys = Object.keys(selectedItems);
    const totalCount = initialHistorical.length + newKeys.length;

    if (totalCount === 0) {
      return (
        <div className="gb-empty-state">
          暂无已选商品
        </div>
      );
    }

    return (
      <>
        {initialHistorical.map(item => (
          <div className="gb-selected-item historical" key={item.id}>
            <img src={item.img} alt={item.name} />
            <div className="name-wrap">
              <div className="name" title={item.name}>{item.name}</div>
              <div className="tip">如需删除，请前往活动商品列表操作</div>
            </div>
          </div>
        ))}
        {newKeys.map(id => {
          const item = selectedItems[id];
          return (
            <div className="gb-selected-item" key={id}>
              <img src={item.img} alt={item.name} />
              <div className="name-wrap">
                <div className="name" title={item.name}>{item.name}</div>
                <div className="tip" style={{ color: '#1677ff' }}>本次新增</div>
              </div>
              <button className="gb-remove-btn" onClick={() => removeSelect(id)} title="移除">&times;</button>
            </div>
          );
        })}
      </>
    );
  };

  const totalSelectedCount = initialHistorical.length + Object.keys(selectedItems).length;

  return (
    <>
      <Modal
        title="选择活动商品"
        open={visible}
        onCancel={onClose}
        width={1000}
        footer={[
          <Button key="cancel" onClick={onClose}>取消</Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('已成功添加活动商品！');
            onClose();
          }}>确定添加</Button>
        ]}
        wrapClassName="group-buy-modal"
        maskClosable={false}
      >
        <div className="group-buy-selector-container">
          {/* Left Layout */}
          <div className="gb-layout-left">
            <div className="gb-toolbar">
              <Input placeholder="请输入商品名称/ID，多个请用空格隔开" style={{ flex: 1 }} />
              <Button type="primary">查询</Button>
            </div>
            
            <div className="gb-list-header">
              <div className="gb-col-checkbox"></div>
              <div className="gb-col-info">商品信息</div>
              <div className="gb-col-price">商品原价</div>
              <div className="gb-col-stock">商品库存</div>
            </div>
            
            <div className="gb-product-list" style={{ opacity: loading ? 0.3 : 1 }}>
              {products.map(p => {
                const isConflict = p.type === 'conflict';
                const isHistorical = p.type === 'historical';
                
                return (
                  <div className={`gb-product-item ${isConflict ? 'conflict' : ''}`} key={p.id}>
                    <div className="gb-checkbox-wrap">
                      <Checkbox 
                        disabled={isConflict || isHistorical}
                        checked={isHistorical || !!selectedItems[p.id]}
                        onChange={(e) => toggleSelect(p, e.target.checked)}
                      />
                    </div>
                    <div className="gb-product-info">
                      <img src={p.img} alt={p.name} className="gb-product-img" />
                      <div className="gb-product-detail">
                        <div className={`gb-product-name ${isConflict ? 'disabled' : ''}`} title={p.name}>{p.name}</div>
                        <span className="gb-product-id">ID: {p.pid}</span>
                        {isHistorical && <span className="gb-tag gb-tag-success">已在本活动中</span>}
                        {isConflict && (
                          <div className="gb-conflict-alert">
                            <span className="gb-conflict-msg" title={p.conflictMsg}>{p.conflictMsg}</span>
                            <Tooltip 
                              placement="bottom" 
                              title={
                                <div>
                                  <strong>互斥原因：</strong>相同时间下同商品只能创建一个活动<br/><br/>
                                  <strong>冲突活动：</strong>{p.conflictAct}<br/>
                                  <strong>商品ID：</strong>{p.pid}<br/>
                                  <strong>活动时间：</strong>2026/07/24 14:06 - 2026/07/28 14:06
                                </div>
                              }
                            >
                              <span className="gb-tooltip-icon">!</span>
                            </Tooltip>
                            <span style={{ margin: '0 4px', color: '#ffccc7' }}>|</span>
                            <a onClick={() => openSubModal(p)}>点击去修改</a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`gb-product-price ${isConflict ? 'disabled' : ''}`}>{p.price}</div>
                    <div className={`gb-product-stock ${isConflict ? 'disabled' : ''}`}>{p.stock}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="gb-pagination-bar">
              <Pagination 
                current={currentPage} 
                total={187} 
                onChange={(page) => setCurrentPage(page)} 
                showSizeChanger={false}
                size="small"
              />
            </div>
          </div>
          
          {/* Right Layout */}
          <div className="gb-layout-right">
            <div className="gb-panel-header">
              <span>当前活动已选 ({totalSelectedCount})</span>
              <button className="gb-clear-btn" onClick={clearAll}>清空新增</button>
            </div>
            <div className="gb-selected-list">
              {renderSelectedItems()}
            </div>
            <div className="gb-pagination-bar" style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>共 {totalSelectedCount} 件</span>
              <Pagination simple defaultCurrent={1} total={totalSelectedCount} size="small" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Sub Modal */}
      <Modal
        title="快速修改已创建活动"
        open={subModalVisible}
        onCancel={() => setSubModalVisible(false)}
        width={740}
        footer={[
          <Button key="cancel" onClick={() => setSubModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={confirmSubModal}>确定</Button>
        ]}
      >
        <div className="gb-sub-modal-body">
          <div className="gb-info-alert">
            <span className="gb-info-icon">i</span>
            该商品同时间段已有以下活动生效，您可以删除该商品。
          </div>
          
          <div className="gb-form-row">
            <div className="gb-form-label">活动名称</div>
            <div className="gb-form-content">
              {currentConflict?.conflictAct} <span className="gb-tag-purple">限时降价</span>
            </div>
          </div>

          <div className="gb-form-row">
            <div className="gb-form-label">活动时间</div>
            <div className="gb-form-content">2026/07/24 14:06:47 - 2026/07/28 14:06:47</div>
          </div>
          
          <div className="gb-form-row" style={{ alignItems: 'flex-start' }}>
            <div className="gb-form-label" style={{ paddingTop: 14 }}>互斥商品</div>
            <div className="gb-form-content">
              <table className="gb-sub-table">
                <thead>
                  <tr>
                    <th>商品信息</th>
                    <th style={{ width: 100 }}>商品原价</th>
                    <th style={{ width: 100 }}>当前库存</th>
                    <th style={{ width: 60 }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={isPendingDelete ? 'gb-row-deleted' : ''}>
                    <td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <img src={currentConflict?.img} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} alt="prod" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 250 }}>
                            {currentConflict?.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>商品ID: {currentConflict?.pid}</div>
                        </div>
                      </div>
                    </td>
                    <td>{currentConflict?.price}</td>
                    <td>{currentConflict?.stock}</td>
                    <td><a onClick={() => setIsPendingDelete(!isPendingDelete)}>{isPendingDelete ? '撤销' : '删除'}</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="gb-form-row">
            <div className="gb-form-label">更多信息</div>
            <div className="gb-form-content gb-more-info">
              更多活动商品及活动信息，请点击 <a href="#">查看详情</a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GroupBuyProductSelector;
