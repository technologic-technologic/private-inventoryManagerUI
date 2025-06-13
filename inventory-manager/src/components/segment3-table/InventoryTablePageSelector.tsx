import React from 'react';
import { Pagination } from 'antd';

const InventoryTablePageSelector: React.FC = () =>{
    return(
        <Pagination defaultCurrent={1} total={50} />
    )
}
export default InventoryTablePageSelector;