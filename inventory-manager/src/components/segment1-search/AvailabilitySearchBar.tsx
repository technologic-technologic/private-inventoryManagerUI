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
const AvailabilitySearchBar: React.FC = () => {
    const {setAvailability} = useSearchContext();

    return (
        <Select
            showSearch
            placeholder="In Stock"
            optionFilterProp="label"
            onChange={(e) => {
                setAvailability(e)
            }}
            onSearch={(e) => {
                setAvailability(e)
            }}
            options={options1}
            style={{width: 200, textAlign: "left"}}
        />
    );
}

export default AvailabilitySearchBar;

