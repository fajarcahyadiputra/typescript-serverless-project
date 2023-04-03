export interface Product  {
    id: string;
    name: string;
    price: number;
    description: string;
    createdAt: Date
}

export interface Newproduct extends Omit<Product, "id"| "createdAt"> {}