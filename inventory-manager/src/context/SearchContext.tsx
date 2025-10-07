import React, {createContext, useContext, useState} from 'react';

type FilterParams = {
    name: string | undefined | null;
    category: string | undefined | null;
    stockQuantity: number | undefined;
    page: number | undefined;
    sort: string[] | undefined;
    setParams: (params: Partial<FilterParams>) => void;
};

const defaultValues = {
    name: undefined,
    category: undefined,
    stockQuantity: undefined,
    page: 0,
    sort: undefined,
    setParams: () => {
    },
};

const SearchContext = createContext<FilterParams>(defaultValues);

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [name, setName] = useState<string|null>('');
    const [stockQuantity, setStockQuantity] = useState(0);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState(['']);
    const [category, setCategory] = useState<string|null>('');

    const setParams = (params: Partial<FilterParams>) => {
        if (params.name !== undefined && params.name !== '') setName(params.name);
        if (params.page !== undefined) setPage(params.page);
        if (params.sort !== undefined) setSort(params.sort);
        if (params.stockQuantity !== undefined && params.stockQuantity !== null) setStockQuantity(params.stockQuantity);
        if (params.category !== undefined && params.category !== '') setCategory(params.category);
    };

    return (
        <SearchContext.Provider value={{name, page, sort, stockQuantity, category, setParams}}>
            {children}
        </SearchContext.Provider>
    );
};
