import InventoryTable from "../InventoryTable";
import InventoryTablePageSelector from "../InventoryTablePageSelector";
import React from "react";
import {Content} from "antd/es/layout/layout";

const InventoryTableObj: React.FC = () => {
    return(
        <Content>
            <InventoryTable />
            <InventoryTablePageSelector />
        </Content>
    )
}

export default InventoryTableObj;