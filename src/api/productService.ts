import axios from 'axios';
import type { Product, ProductImage, ProductVersion } from '../types';

const API_URL = 'https://le-minh-thanh.onrender.com/api';

const apiClient = axios.create({
    baseURL: API_URL,
});


apiClient.interceptors.response.use(
    res => res,
    error => {
        console.error('API Error:', error.response?.data);

        return Promise.reject(error);
    }
);
export const productService = {
    // Product - Khớp với ProductController.cs
    getAll: () => apiClient.get<Product[]>('/Product'),

    getById: (id: number) => apiClient.get<Product>(`/Product/${id}`),

    create: (data: Product) => {
        // Đảm bảo các ID là số long/number trước khi gửi
        const payload = {
            ...data,
            price: Number(data.price),
            status: Number(data.status),
            developerId: data.developerId ? Number(data.developerId) : 1,
            publisherId: data.publisherId ? Number(data.publisherId) : 1,
            categoryIds: data.categoryIds?.map(id => Number(id))
        };
        return apiClient.post<Product>('/Product', payload);
    },
    // Thêm vào productService.ts
    getBySlug: (slug: string) => apiClient.get<Product>(`/Product/slug/${slug}`),
    update: (id: number, data: Product) => apiClient.put<Product>(`/Product/${id}`, data),

    delete: (id: number) => apiClient.delete(`/Product/${id}`),

    // Images - Khớp với ProductImageController.cs
    getImages: () => apiClient.get<ProductImage[]>('/product-images'),
    uploadImage: (formData: FormData) =>
        apiClient.post("/product-images/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    uploadVersion: (formData: FormData) =>
        apiClient.post("/product-versions/upload", formData, {
            headers: { "Content-Type": undefined }
        }),
    deleteImage: (id: number) => apiClient.delete(`/product-images/${id}`),
    // Thêm vào productService
    deleteVersion: (id: number) => apiClient.delete(`/product-versions/${id}`),
    // Versions - Khớp với ProductVersionController.cs
    getVersions: (productId?: number) =>
        apiClient.get<ProductVersion[]>('/product-versions').then(res => {
            if (productId) {
                return res.data.filter(v => v.productId === productId);
            }
            return res.data;
        }),

    addVersion: (data: ProductVersion) => apiClient.post('/product-versions', data),
};
