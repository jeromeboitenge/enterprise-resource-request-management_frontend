// API Service Layer with Axios

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from './constants';
import {
    AuthResponse,
    LoginCredentials,
    User,
    ResourceRequest,
    CreateRequestDTO,
    UpdateRequestDTO,
    ApprovalDTO,
    Department,
    Notification,
    DashboardStats,
    PaginatedResponse,
    PaginationParams,
    FilterOptions,
    CreateUserDTO,
    UpdateUserDTO,
    AuditLog,
} from './types';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    this.clearToken();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    private setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }

    private clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    // Authentication
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await this.api.post<AuthResponse>('/auth/login', credentials);
        this.setToken(data.token);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    }

    async logout(): Promise<void> {
        this.clearToken();
    }

    async getCurrentUser(): Promise<User> {
        const { data } = await this.api.get<User>('/auth/me');
        return data;
    }

    // Resource Requests
    async getRequests(params?: PaginationParams & FilterOptions): Promise<PaginatedResponse<ResourceRequest>> {
        const { data } = await this.api.get<PaginatedResponse<ResourceRequest>>('/requests', { params });
        return data;
    }

    async getRequestById(id: string): Promise<ResourceRequest> {
        const { data } = await this.api.get<ResourceRequest>(`/requests/${id}`);
        return data;
    }

    async createRequest(requestData: CreateRequestDTO): Promise<ResourceRequest> {
        const { data } = await this.api.post<ResourceRequest>('/requests', requestData);
        return data;
    }

    async updateRequest(id: string, requestData: UpdateRequestDTO): Promise<ResourceRequest> {
        const { data } = await this.api.put<ResourceRequest>(`/requests/${id}`, requestData);
        return data;
    }

    async deleteRequest(id: string): Promise<void> {
        await this.api.delete(`/requests/${id}`);
    }

    async cancelRequest(id: string): Promise<ResourceRequest> {
        const { data } = await this.api.patch<ResourceRequest>(`/requests/${id}/cancel`);
        return data;
    }

    // Approvals
    async approveRequest(id: string, approvalData: ApprovalDTO): Promise<ResourceRequest> {
        const { data } = await this.api.post<ResourceRequest>(`/requests/${id}/approve`, approvalData);
        return data;
    }

    async getPendingApprovals(): Promise<ResourceRequest[]> {
        const { data } = await this.api.get<ResourceRequest[]>('/approvals/pending');
        return data;
    }

    // Finance
    async fundRequest(id: string, paymentDetails?: any): Promise<ResourceRequest> {
        const { data } = await this.api.post<ResourceRequest>(`/requests/${id}/fund`, paymentDetails);
        return data;
    }

    async getFundingQueue(): Promise<ResourceRequest[]> {
        const { data } = await this.api.get<ResourceRequest[]>('/finance/funding-queue');
        return data;
    }

    // Departments
    async getDepartments(): Promise<Department[]> {
        const { data } = await this.api.get<Department[]>('/departments');
        return data;
    }

    async getDepartmentById(id: string): Promise<Department> {
        const { data } = await this.api.get<Department>(`/departments/${id}`);
        return data;
    }

    async createDepartment(departmentData: Partial<Department>): Promise<Department> {
        const { data } = await this.api.post<Department>('/departments', departmentData);
        return data;
    }

    async updateDepartment(id: string, departmentData: Partial<Department>): Promise<Department> {
        const { data } = await this.api.put<Department>(`/departments/${id}`, departmentData);
        return data;
    }

    async deleteDepartment(id: string): Promise<void> {
        await this.api.delete(`/departments/${id}`);
    }

    // Users (Admin)
    async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
        const { data } = await this.api.get<PaginatedResponse<User>>('/users', { params });
        return data;
    }

    async getUserById(id: string): Promise<User> {
        const { data } = await this.api.get<User>(`/users/${id}`);
        return data;
    }

    async createUser(userData: CreateUserDTO): Promise<User> {
        const { data } = await this.api.post<User>('/users', userData);
        return data;
    }

    async updateUser(id: string, userData: UpdateUserDTO): Promise<User> {
        const { data } = await this.api.put<User>(`/users/${id}`, userData);
        return data;
    }

    async deactivateUser(id: string): Promise<User> {
        const { data } = await this.api.patch<User>(`/users/${id}/deactivate`);
        return data;
    }

    async activateUser(id: string): Promise<User> {
        const { data } = await this.api.patch<User>(`/users/${id}/activate`);
        return data;
    }

    // Notifications
    async getNotifications(): Promise<Notification[]> {
        const { data } = await this.api.get<Notification[]>('/notifications');
        return data;
    }

    async markNotificationAsRead(id: string): Promise<void> {
        await this.api.patch(`/notifications/${id}/read`);
    }

    async markAllNotificationsAsRead(): Promise<void> {
        await this.api.patch('/notifications/read-all');
    }

    // Dashboard Stats
    async getDashboardStats(): Promise<DashboardStats> {
        const { data } = await this.api.get<DashboardStats>('/dashboard/stats');
        return data;
    }

    // Audit Logs
    async getAuditLogs(params?: PaginationParams): Promise<PaginatedResponse<AuditLog>> {
        const { data } = await this.api.get<PaginatedResponse<AuditLog>>('/audit-logs', { params });
        return data;
    }

    // Reports
    async generateReport(reportType: string, params?: any): Promise<Blob> {
        const { data } = await this.api.get(`/reports/${reportType}`, {
            params,
            responseType: 'blob',
        });
        return data;
    }

    // Password Reset
    async forgotPassword(email: string): Promise<void> {
        await this.api.post('/auth/forgot-password', { email });
    }

    async resetPassword(token: string, password: string): Promise<void> {
        await this.api.post('/auth/reset-password', { token, password });
    }

    // Team Management
    async getTeamMembers(): Promise<User[]> {
        const { data } = await this.api.get<User[]>('/users/team');
        return data;
    }
}

export const api = new ApiService();
export default api;
