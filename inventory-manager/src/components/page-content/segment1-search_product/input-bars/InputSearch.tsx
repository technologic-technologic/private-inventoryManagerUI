import React from "react";
import {Input} from "antd";
import {useSearchContext} from "../../../../context/SearchContext";
import type {Product} from "../../../../types/Product";

interface Props {
    parameter: keyof Product;
}

const InputSearch: React.FC<Props> = ({parameter}) => {
    const {name, category, setParams} = useSearchContext();
    const timerRef = React.useRef<number | null>(null);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const next = e.target.value;
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            if (!e.target.value) {
                if (parameter === 'name') setParams({name: null});
                if (parameter === 'category') setParams({category: null});
            } else {
                if (parameter === 'name' && next !== name) setParams({name: next});
                if (parameter === 'category' && next !== category) setParams({category: next});
            }
        }, 400);
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
};

export default InputSearch;