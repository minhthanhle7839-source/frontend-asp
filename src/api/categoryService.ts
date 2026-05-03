import axios from 'axios';

const API_URL = 'https://le-minh-thanh.onrender.com/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.response.use(
    res => res,
    error => {
        console.error('Category API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export interface Category {
    id?: number;
    name: string;
    slug?: string;
    description?: string;
    createdAt?: string;
    productCategories?: any[];
}

export const categoryService = {
    getAll: () => apiClient.get<Category[]>('/Category'),
    getById: (id: number) => apiClient.get<Category>(`/Category/${id}`),
    create: (data: Omit<Category, 'id' | 'createdAt'>) =>
        apiClient.post<Category>('/Category', data),
    update: (id: number, data: Omit<Category, 'id' | 'createdAt'>) =>
        apiClient.put<Category>(`/Category/${id}`, data),
    delete: (id: number) => apiClient.delete(`/Category/${id}`)
};