import React from 'react';
import {Layout} from 'antd';
import NewProductButton from "./segment2-new_product/NewProductButton";
import InventoryTableObj from "./segment3-table/segment/InventoryTableObj";
import {SearchProvider} from "../context/SearchContext";
import InventoryMetricsTable from "./segment4-metrics/InventoryMetricsTable";

const HomePageContent: React.FC = () => {

    return (
        <SearchProvider>
            <Layout>
                <div style={{padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
                    <div style={{marginBottom: 16}}>
                        <NewProductButton/>
                    </div>
                    <div style={{marginBottom: 16}}>
                        <InventoryTableObj/>
                    </div>
                    <div style={{marginBottom: 16}}>
                        <InventoryMetricsTable/>
                    </div>
                </div>
            </Layout>
        </SearchProvider>


    );
};

export default HomePageContent;