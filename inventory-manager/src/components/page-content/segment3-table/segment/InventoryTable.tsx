import React, {useRef, useState} from 'react';
import {Button, Input, type InputRef, Modal, Popconfirm, Space, Table, type TableColumnType} from 'antd';
import type {TableColumnsType, TableProps} from 'antd';
import type {Product} from "../../../../types/Product";
import {SearchOutlined} from '@ant-design/icons';
import {useSearchContext} from "../../../../context/SearchContext";
import {useDataContext} from "../../../../context/DataContext";
import {deleteProduct, markInStock, markOutOfStock} from "../../../../services/Requests";
import ProductForm from "../../segment2-new_product/ProductForm";

type DataIndex = keyof Product;
const InventoryTable: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleClose = () => {
        setIsModalVisible(false);
        setEditingProduct(null);
    }

    const searchInput = useRef<InputRef>(null);

    const {stockQuantity, name, category, page, setParams} = useSearchContext();
    const {products, loading, refreshProducts} = useDataContext()
    const timerRef = React.useRef<number | null>(null);


    const handleTableChange: TableProps<Product>['onChange'] = (_pagination, filters, sorter) => {
        setParams({page: ((page as number))});
        if ((filters.name !== undefined) &&
            ((filters.name as unknown as string) !== '') &&
            (filters.name !== null) &&
            (filters.name as unknown as string !== name)) {
            setParams({name: filters.name?.[0] as unknown as string});
        }
        if (filters.category !== undefined &&
            (filters.category as unknown as string) !== '' &&
            filters.category !== null &&
            (filters.category as unknown as string !== category)) {
            setParams({category: filters.category?.[0] as unknown as string});
        }
        if (filters.stockQuantity?.[0] &&
            filters.stockQuantity?.[0] !== null &&
            filters.stockQuantity?.[0] as unknown as number !== stockQuantity) {
            setParams({stockQuantity: filters.stockQuantity?.[0] as unknown as number});
        }
        const sortObj = Array.isArray(sorter) ? sorter : [sorter];
        if (sortObj.length) {
            const sortParams = sortObj
                .filter(s => s.order)
                .map(s => `${s.field},${s.order === 'descend' ? 'desc' : 'asc'}`);
            setParams({sort: sortParams})
        }
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Product> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={e => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => {
                        if (!selectedKeys[0]) {
                            setParams({[dataIndex]: null});
                        }
                        confirm();
                        setParams({[dataIndex]: selectedKeys[0]});
                    }}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            confirm();
                            setParams({[dataIndex]: selectedKeys[0]});
                        }}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters?.();
                            setParams({[dataIndex]: null});
                        }}
                        size="small"
                        style={{width: 90}}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false});
                            setParams({[dataIndex]: selectedKeys[0]});
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
        ),
    });

    const handleDelete = async (record: Product) => {
        try {
            await deleteProduct(record.id);
        } catch (err: any) {
            console.log(err);
        } finally {
            if (stockQuantity === 0) {
                setParams(
                    {
                        name: undefined,
                        page: 0,
                        category: undefined,
                        stockQuantity: 3,
                        sort: undefined
                    })
            } else {
                setParams(
                    {
                        name: undefined,
                        page: 0,
                        category: undefined,
                        stockQuantity: 0,
                        sort: undefined
                    })
            }
        }
    };

    const handleEdit = async (record: Product) => {
        try {
            setIsModalVisible(true);
            setEditingProduct(record);
        } catch (err: any) {
            console.log(err);
        }
    };

    const columns: TableColumnsType<Product> = [
        {
            title: 'Category',
            dataIndex: 'category',
            sorter: {multiple: 3},
            filteredValue: category ? [String(category)] : null,
            ...getColumnSearchProps("category")
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: {multiple: 3},
            filteredValue: name ? [String(name)] : null,
            ...getColumnSearchProps("name")
        },
        {
            title: 'Price',
            dataIndex: 'unitPrice',
            sorter: {multiple: 3},
            filteredValue: null
        },
        {
            title: 'Expiration Date',
            dataIndex: 'expirationDate',
            sorter: {multiple: 3},
            filteredValue: null,
            render: (_) => _ ? new Date(_).toLocaleDateString() : 'No date',
        },
        {
            title: 'Stock',
            dataIndex: 'stockQuantity',
            sorter: {multiple: 3},
            render: (_) => _ ?? '_',
            filters: [
                {text: 'All', value: '0'},
                {text: 'Stock', value: '1'},
                {text: 'No stock', value: '2'}
            ],
            filterMultiple: false,
            filteredValue: stockQuantity ? ['1', '2'].includes(String(stockQuantity)) ? [String(stockQuantity)] : null: null,
            onFilter: (_value, _record) => {
                return true;
            },

        },
        {
            title: 'Actions',
            dataIndex: 'action',
            filteredValue: null,
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>Edit</a>
                    <Popconfirm
                        title="Are you sure?"
                        description="This cannot be undone"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <a role={"button"}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },

    ];

    const rowSelection = {
        onChange: async (_: any, selectedRowsData: Product[]) => {
            await changeAvailabilityOfSelected(selectedRowsData);
        },
    };

    const changeAvailabilityOfSelected = async (selectedRows: Product[]) => {
        for (const product of selectedRows) {
            if (product.stockQuantity as number > 0) {
                await markOutOfStock(product.id);
                if (timerRef.current) window.clearTimeout(timerRef.current);
                timerRef.current = window.setTimeout(async () => {
                    await refreshProducts();
                }, 200);
            } else {
                await markInStock(product.id);
                if (timerRef.current) window.clearTimeout(timerRef.current);
                timerRef.current = window.setTimeout(async () => {
                    await refreshProducts();
                }, 200);
            }
        }
    };

    return <>
        <Table<Product> rowSelection={rowSelection}
                        columns={columns}
                        dataSource={products}
                        loading={loading}
                        rowKey="id"
                        onChange={handleTableChange}
                        pagination={false}
                        style={{width: "100%",}}
        />
        <Modal
            title="Edit Product"
            open={isModalVisible}
            onCancel={handleClose}
            footer={null}
            destroyOnHidden={true}
        >
            {editingProduct && (
                <ProductForm
                    mode="edit"
                    initialValues={editingProduct}
                    onClose={handleClose}
                />
            )}
        </Modal>
    </>;
};

export default InventoryTable;