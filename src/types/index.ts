export interface Product {
    id?: number;
    name: string;
    slug?: string;
    description?: string;
    shortDescription?: string; // Thêm trường này
    price: number;
    developerId?: number;
    publisherId?: number;
    releaseDate?: string;
    status: number;
    categoryIds?: number[];
    categories?: Category[];
    productCategories?: ProductCategory[];
    images?: ProductImage[];
    versions?: ProductVersion[];
    productImages?: ProductImage[];
    // Bổ sung các thông tin mở rộng thường có từ API Include
    publisher?: { name: string };
    developer?: { name: string };
    createdAt?: string;
}

export interface ProductCategory {
    productId: number;
    categoryId: number;
    category: {
        id: number;
        name: string;
    };
}

export interface ProductImage {
    id?: number;
    productId: number;
    imageUrl: string;
    displayOrder?: number;
}

export interface ProductVersion {
    id?: number;
    productId: number;
    version: string;
    changelog?: string;
    fileUrl: string;
}export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}