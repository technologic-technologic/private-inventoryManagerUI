import React, {useState} from 'react';
import {Table} from 'antd';
import type {TableColumnsType, TableProps} from 'antd';
import {Product} from "../../types/Product";

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];


const columns: TableColumnsType<Product> = [
    {
        title: 'Category',
        dataIndex: 'category',
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Price',
        dataIndex: 'unitPrice',
    },
    {
        title: 'Expiration Date',
        dataIndex: 'expirationDate',
    },
    {
        title: 'Stock',
        dataIndex: 'quantityInStock',
    },
    {
        title: 'Actions',
        dataIndex: 'unitPrice',
    },

];

const dataSource = Array.from({length: 46}).map<Product>((_, i) => ({
    id: `${i}`,
    category: `Edward King ${i}`,
    name: `Edward King ${i}`,
    unitPrice: 32,
    expirationDate: `London, Park Lane no. ${i}`,
    quantityInStock: i,
    creationDate: 'asdfsdf',
}));

const InventoryTable: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<Product> = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys: any[];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        return index % 2 === 0;

                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys: any[];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        return index % 2 !== 0;

                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };

    return <Table<Product> rowSelection={rowSelection} columns={columns} dataSource={dataSource}/>;
};

export default InventoryTable;