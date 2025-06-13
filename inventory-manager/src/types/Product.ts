export interface Product {
    id: string;
    name: string;
    category: string;
    unitPrice: number;
    expirationDate?: string;
    quantityInStock: number;
    creationDate: string;
    updatedDate?: string;
}
