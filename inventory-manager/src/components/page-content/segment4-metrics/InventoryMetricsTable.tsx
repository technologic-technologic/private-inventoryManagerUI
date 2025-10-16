import React from 'react';
import {Table, type TableColumnsType} from 'antd';
import type {CategorySummary} from "../../../types/Product";
import {useDataContext} from "../../../context/DataContext";
import currencyTransformator from "../../../utils/CurrencyFormatter.ts";

const InventoryMetricsTable: React.FC = () => {
    const {summary} = useDataContext();

    const columns: TableColumnsType<CategorySummary> = [
        {
            title: '',
            dataIndex: 'category',
        },
        {
            title: 'Total Products in Stock',
            dataIndex: 'productsInStock',
        },
        {
            title: 'Total Value in Stock',
            dataIndex: 'valueInStock',
            render: (value: number | null | undefined) => (
                value == null ? "—" : currencyTransformator(value)),
        },
        {
            title: 'Average Price in Stock',
            dataIndex: 'averageValue',
            render: (value: number | null | undefined) => (
                value == null ? "—" : currencyTransformator(value)),
        },
    ];

    return (
        <Table columns={columns}
               dataSource={summary}
               pagination={false}
               style={{width: "100%",}}
               scroll={{y: 280}}
               summary={(overall) => {
                   const overallStock = overall.reduce((accu, actual) => accu+actual.productsInStock,0);
                   const overallValue = overall.reduce((acc,actual) => acc+actual.valueInStock,0);
                   return(
                       <Table.Summary.Row>
                           <Table.Summary.Cell index={summary?.length || 0}>Overall</Table.Summary.Cell>
                           <Table.Summary.Cell index={summary?.length || 0}>{overallStock}</Table.Summary.Cell>
                           <Table.Summary.Cell index={summary?.length || 0}>{currencyTransformator(overallValue)}</Table.Summary.Cell>
                           <Table.Summary.Cell index={summary?.length || 0}>{currencyTransformator(overallValue/overallStock)}</Table.Summary.Cell>
                       </Table.Summary.Row>
                   )
               }}
        />);
}

export default InventoryMetricsTable;