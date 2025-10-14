import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import type {CategorySummary, Product} from "../types/Product";
import {getCategories, getFilteredProducts, getProducts, getSummary} from "../services/Requests";
import {useSearchContext} from "./SearchContext";

interface ProductDataContextProps {
    products: Product[] | undefined;
    loading: boolean;
    error: string | null;
    total: number | null;
    categories: string[];
    summary: CategorySummary[] | undefined;
    refreshProducts: () => Promise<void>;
}

const defaultValues = {
    products: undefined,
    loading: true,
    error: null,
    total: null,
    categories: [],
    summary: undefined,
    refreshProducts: async () => {
    },
};

const DataContext = createContext<ProductDataContextProps>(defaultValues);

export const useDataContext = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {name, category, stockQuantity, page, sort} = useSearchContext();
    const lastKeyRef = (useRef<string | null>(null));
    const inFlightRef = (useRef(false));

    const [products, setProducts] = useState<Product[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [categories, setCategories] = useState<string[]>([""]);
    const [summary, setSummary] = useState<CategorySummary[]>();

    useEffect(() => {
        const paramsKey = JSON.stringify({
            name: name ?? null,
            category: category ?? null,
            stockQuantity: stockQuantity ?? null,
            page: page ?? null,
            sort: Array.isArray(sort) ? sort : (sort ?? null)
        });

        if (lastKeyRef.current === paramsKey) return;
        if (inFlightRef.current) return;

        inFlightRef.current = true;
        lastKeyRef.current = paramsKey;

        const fetchData = async () => {
            setLoading(true);
            try {
                const params: any = {
                    page,
                    size: 10,
                };

                if (name) params.name = name;
                if (category) params.category = category;
                if (stockQuantity !== undefined) params.stockQuantity = stockQuantity;
                if (sort && sort.length > 0) params.sort = sort;

                const response = await getFilteredProducts(params)

                setProducts(response.data.products);
                setTotal(response.data.totalPages || 50);

                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories.data);

                const fetchedSummary = await getSummary();
                setSummary(fetchedSummary.data);

            } catch (err: any) {
                let msg: string;
                if (typeof err === 'object' && err !== null) {
                    msg =
                        (err as any)?.response?.data?.message ??
                        (err as any)?.response?.data ??
                        (err as Error)?.message ??
                        'Unknown error';
                    setError(String(msg));

                } else {
                    msg = String(err);
                }
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then(() => inFlightRef.current = false);
    }, [name, category, stockQuantity, page, sort]);

    const refreshProducts = async () => {
        setLoading(true);
        try {
            const fetched = await getProducts({page: 0});
            setProducts(fetched.products);
            setTotal(fetched.totalPages);
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories.data);
            const fetchedSummary = await getSummary();
            setSummary(fetchedSummary.data);

        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DataContext.Provider value={{products, loading, error, total, categories, summary, refreshProducts}}>
            {children}
        </DataContext.Provider>
    );
};
