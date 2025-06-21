import React from 'react';
import {Table} from 'antd';
import type {TableProps} from 'antd';

interface DataType {
    category: string;
    totalProducts: string;
    totalValue: number;
    averagePrice: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: '',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Total Products in Stock',
        dataIndex: 'totalProducts',
        key: 'totalProducts',
    },
    {
        title: 'Total Value in Stock',
        dataIndex: 'totalValue',
        key: 'totalValue',
    },
    {
        title: 'Average Price in Stock',
        key: 'averagePrice',
        dataIndex: 'averagePrice',
    },
];

const data: DataType[] = [
    {
        category: 'John Brown',
        totalValue: 32,
        totalProducts: 'New York No. 1 Lake Park',
        averagePrice: 'nice',
    },
    {
        category: 'Jim Green',
        totalValue: 42,
        totalProducts: 'London No. 1 Lake Park',
        averagePrice: 'loser',
    },
    {
        category: 'Joe Black',
        totalValue: 32,
        totalProducts: 'Sydney No. 1 Lake Park',
        averagePrice: 'cool',
    },
];

const App: React.FC = () => <Table<DataType> columns={columns} dataSource={data} pagination={false}/>;

export default App;