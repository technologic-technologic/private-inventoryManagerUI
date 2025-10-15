import InventoryTable from "./segment/InventoryTable";
import InventoryTablePageSelector from "./segment/InventoryTablePageSelector";
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