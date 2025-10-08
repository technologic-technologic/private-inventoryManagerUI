import React from 'react';
import {Col, Layout} from 'antd';
import NewProductButton from "./segment2-new_product/NewProductButton";
import InventoryTableObj from "./segment3-table/segment/InventoryTableObj";
import {SearchProvider} from "../context/SearchContext";
import InventoryMetricsTable from "./segment4-metrics/InventoryMetricsTable";
import {DataProvider} from "../context/DataContext";
import SearchByComponent from "./segment1-search_product/SearchByBar";

const HomePageContent: React.FC = () => {
    return (
        <SearchProvider>
            <DataProvider>
                <Layout>
                    <div style={{padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
                        <div style={{
                            display: 'flex',
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            marginBottom: 16
                        }}>
                            <Col>
                                <SearchByComponent/>
                            </Col>
                            <Col>
                                <NewProductButton/>
                            </Col>
                        </div>
                        <div style={{marginBottom: 16}}>
                            <InventoryTableObj/>
                        </div>
                        <div style={{marginBottom: 16}}>
                            <InventoryMetricsTable/>
                        </div>
                    </div>
                </Layout>
            </DataProvider>
        </SearchProvider>


    );
};

export default HomePageContent;