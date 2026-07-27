import React, { useState } from 'react';
import { Button } from 'antd';
import GroupBuyProductSelector from '../components/GroupBuyProductSelector';
import './GroupBuyPage.css';

const GroupBuyPage: React.FC = () => {
  const [selectorVisible, setSelectorVisible] = useState(false);

  return (
    <div className="group-buy-page">
      <div className="page-header">
        <h2 className="page-title">管理活动商品</h2>
        <Button type="primary" onClick={() => setSelectorVisible(true)}>
          新增活动商品
        </Button>
      </div>

      <div className="page-content">
        <div className="empty-content">
          <p>当前活动暂无商品，请点击右上角新增商品。</p>
        </div>
      </div>

      {selectorVisible && (
        <GroupBuyProductSelector 
          visible={selectorVisible} 
          onClose={() => setSelectorVisible(false)} 
        />
      )}
    </div>
  );
};

export default GroupBuyPage;
