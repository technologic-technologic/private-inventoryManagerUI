import React from "react";
import {Input} from "antd";
import {useSearchContext} from "../../../../context/SearchContext";
import type {Product} from "../../../../types/Product";

interface Props {
    parameter: keyof Product;
}

const InputSearch: React.FC<Props> = ({parameter}) => {

    const {setParams} = useSearchContext();

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const next = e.target.value;
        if (!e.target.value) {
            if (parameter === 'name') setParams({name: null});
            if (parameter === 'category') setParams({category: null});
        } else {
            if (parameter === 'name') setParams({name: next});
            if (parameter === 'category') setParams({category: next});
        }
    }

    const getPlaceholder = (): string => {
        if (parameter === 'name') return 'Watermelon';
        if (parameter === 'category') return 'Food';
        return '';
    };

    return (
        <Input
            placeholder={getPlaceholder()}
            onChange={onChange}
        />
    );
}

export default InputSearch;