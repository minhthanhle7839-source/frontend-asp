import axios from 'axios';

const API_URL = 'https://le-minh-thanh.onrender.com/api';
const apiClient = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

export interface Developer {
    id?: number;
    name: string;
    description?: string;
    website?: string;
    createdAt?: string;
}

export const developerService = {
    getAll: () => apiClient.get<Developer[]>('/Developer'),
    getById: (id: number) => apiClient.get<Developer>(`/Developer/${id}`),
    create: (data: Omit<Developer, 'id' | 'createdAt'>) => apiClient.post<Developer>('/Developer', data),
    update: (id: number, data: Omit<Developer, 'id' | 'createdAt'>) => apiClient.put<Developer>(`/Developer/${id}`, data),
    delete: (id: number) => apiClient.delete(`/Developer/${id}`)
};