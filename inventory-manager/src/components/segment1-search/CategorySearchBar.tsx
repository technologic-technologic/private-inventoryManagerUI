import React from 'react';
import {Select} from 'antd';
import {useSearchContext} from "../../context/SearchContext";

const options1 = [
    {
        value: 'jack',
        label: 'Jack',
    },
    {
        value: 'lucy',
        label: 'Lucy',
    },
    {
        value: 'tom',
        label: 'Tom',
    },
];
const CategorySearchBar: React.FC = () => {
    const {setCategory} = useSearchContext();

    return (
        <Select
            showSearch
            placeholder="Food"
            optionFilterProp="label"
            onChange={(e) => {
                setCategory(e)
            }}
            onSearch={(e) => {
                setCategory(e)
            }}
            options={options1}
            style={{width: 200, textAlign: "left"}}
        />
    );
}

export default CategorySearchBar;

//return <Select options={[{ value: 'sample', label: <span>sample</span> }]} />;
