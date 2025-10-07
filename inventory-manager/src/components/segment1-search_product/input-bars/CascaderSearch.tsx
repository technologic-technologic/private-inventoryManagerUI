import { Cascader } from 'antd';
import React from 'react';
import { useSearchContext } from '../../../context/SearchContext';

const STOCK_OPTIONS = [
    { label: 'Everything', value: '0' },
    { label: 'Stock', value: '1' },
    { label: 'No stock', value: '2' },
];

const CascaderSearch: React.FC = () => {
    const { stockQuantity, setParams } = useSearchContext();

    const value = stockQuantity !== undefined ? [String(stockQuantity)] : undefined;

    const onChange = (val?: string[]) => {
        if (!val || val.length === 0) {
            setParams({ stockQuantity: undefined });
        } else {
            setParams({ stockQuantity: Number(val[0]) });
        }
    };

    return (
        <Cascader
            options={STOCK_OPTIONS}
            value={value}
            onChange={onChange}
            allowClear
            placeholder="Stock"
            changeOnSelect={false}
            style={{ flex: '1 1 220px', minWidth: 220, maxWidth: 420 }}        />
    );
};

export default CascaderSearch;
