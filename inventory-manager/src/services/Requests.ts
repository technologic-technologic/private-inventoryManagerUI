import axios, {AxiosResponse} from "axios";
import {Product, ProductResponse} from "../types/Product";

const BASE_URL = "http://localhost:8080";

export const getProducts = async (filters?: {
    name?: string;
    category?: string[];
    unitPrice?: number;
    expirationDate?: string;
    stockQuantity?: number;
    creationDate?: string;
    updatedDate?: string;
    page?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
}): Promise<ProductResponse> => {
    const response = await axios.get(`${BASE_URL}/products`, {
        params: filters,
    });
    return response.data;
};

export const getCategories = async (): Promise<AxiosResponse<any, any>> => {
    return await axios.get(`${BASE_URL}/products/categories`);
};

export const getFilteredProducts = async (params?: {
    name?: string;
    category?: string[];
    unitPrice?: number;
    expirationDate?: string;
    stockQuantity?: number;
    creationDate?: string;
    updatedDate?: string;
    page?: number;
    sort?: string[];
    sortBy?: string;
    sortDir?: "asc" | "desc";
}): Promise<AxiosResponse<any, any>> => {
    return await axios.get(`${BASE_URL}/products/filters`, {
        params,
        paramsSerializer: (params) => {
            const query = new URLSearchParams();
            for (const key in params) {
                if (Array.isArray(params[key])) {
                    params[key].forEach((v: string) => query.append(key, v));
                } else {
                    query.append(key, String(params[key]));
                }
            }
            return query.toString();
        },
    });
};

export const createProduct = async (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> => {
    const response = await axios.post(`${BASE_URL}/products`, product);
    return response.data;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await axios.put(`${BASE_URL}/products/${id}`, product);
    return response.data;
};

export const markOutOfStock = async (id: string): Promise<void> => {
    await axios.post(`${BASE_URL}/products/${id}/outofstock`);
};

export const markInStock = async (id: string): Promise<void> => {
    await axios.put(`${BASE_URL}/products/${id}/instock`);
};

export const deleteProduct = async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/products/${id}`);
};
