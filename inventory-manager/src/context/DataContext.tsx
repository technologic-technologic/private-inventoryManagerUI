import React, {createContext, useEffect, useState} from "react";
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

const DataContext = createContext<ProductDataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [products, setProducts] = useState<Product[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [categories, setCategories] = useState<string[]>([""]);
    const [summary, setSummary] = useState<CategorySummary[]>();


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

    useEffect(() => {
        refreshProducts().then();
    }, []);

    return (
        <DataContext.Provider value={{products, loading, error, total, categories, summary, refreshProducts}}>
            {children}
        </DataContext.Provider>
    );
};

export function useProductsData() {
    const {name, category, stockQuantity, page, sort} = useSearchContext();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [categories, setCategories] = useState<string[]>([""]);
    const [summary, setSummary] = useState<CategorySummary[]>();


    useEffect(() => {
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
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then();
    }, [name, category, stockQuantity, page, sort]);

    return {products, loading, error, total, categories, summary};
}