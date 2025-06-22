export interface Product {
    id: string;
    name: string;
    category: string;
    unitPrice: number;
    expirationDate?: Date;
    stockQuantity: number;
    creationDate: Date;
    updatedDate?: string;
}

export interface FilterProducts {
    name: string;
    category: string;
    unitPrice: number;
    expirationDate: Date;
    quantityInStock: number;
}

export interface ProductResponse {
    products: Product[];
    totalPages: number;
}

export interface CategorySummary {
    averageValue: number;
    category: string;
    productsInStock: number;
    valueInStock: number;

}