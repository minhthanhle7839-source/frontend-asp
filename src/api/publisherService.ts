// src/api/publisherService.ts
import axios from 'axios';

const API_URL = 'https://le-minh-thanh.onrender.com/api';
const apiClient = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

export interface Publisher {
    id?: number;
    name: string;
    website?: string;
    createdAt?: string;
}

export const publisherService = {
    getAll: () => apiClient.get<Publisher[]>('/Publisher'),
    getById: (id: number) => apiClient.get<Publisher>(`/Publisher/${id}`),
    create: (data: Omit<Publisher, 'id' | 'createdAt'>) => apiClient.post<Publisher>('/Publisher', data),
    update: (id: number, data: Omit<Publisher, 'id' | 'createdAt'>) => apiClient.put<Publisher>(`/Publisher/${id}`, data),
    delete: (id: number) => apiClient.delete(`/Publisher/${id}`)
};