// Core Types and Interfaces for Enterprise Resource Request System

export type UserRole = 'employee' | 'manager' | 'department_head' | 'finance' | 'admin';

export type RequestStatus =
    | 'draft'
    | 'submitted'
    | 'under_review'
    | 'approved'
    | 'rejected'
    | 'funded'
    | 'fulfilled'
    | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ResourceType =
    | 'equipment'
    | 'software'
    | 'supplies'
    | 'services'
    | 'infrastructure'
    | 'other';

export type ApprovalAction = 'approve' | 'reject' | 'comment';

export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    department: Department;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Department {
    _id: string;
    name: string;
    code: string;
    description?: string;
    headId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ResourceRequest {
    _id: string;
    title: string;
    description: string;
    resourceType: ResourceType;
    quantity: number;
    estimatedCost: number;
    department: Department;
    priority: Priority;
    status: RequestStatus;
    requestedBy: User;
    approvals: Approval[];
    comments: Comment[];
    attachments?: Attachment[];
    createdAt: string;
    updatedAt: string;
}

export interface Approval {
    _id: string;
    requestId: string;
    approverRole: UserRole;
    approver: User;
    action: ApprovalAction;
    comments?: string;
    timestamp: string;
}

export interface Comment {
    _id: string;
    userId: string;
    user: User;
    text: string;
    timestamp: string;
}

export interface Attachment {
    _id: string;
    filename: string;
    url: string;
    uploadedBy: string;
    uploadedAt: string;
}

export interface Notification {
    _id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    relatedRequestId?: string;
    createdAt: string;
}

export interface AuditLog {
    _id: string;
    userId: string;
    user: User;
    action: string;
    resource: string;
    resourceId: string;
    details: Record<string, any>;
    timestamp: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface CreateRequestDTO {
    title: string;
    description: string;
    resourceType: ResourceType;
    quantity: number;
    estimatedCost: number;
    departmentId: string;
    priority: Priority;
}

export interface UpdateRequestDTO {
    title?: string;
    description?: string;
    resourceType?: ResourceType;
    quantity?: number;
    estimatedCost?: number;
    priority?: Priority;
    status?: RequestStatus;
}

export interface ApprovalDTO {
    action: ApprovalAction;
    comments?: string;
}

export interface CreateUserDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    departmentId: string;
}

export interface UpdateUserDTO {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    departmentId?: string;
    isActive?: boolean;
}

export interface DashboardStats {
    totalRequests: number;
    pendingApprovals: number;
    approvedRequests: number;
    rejectedRequests: number;
    totalBudget: number;
    usedBudget: number;
}

export interface FilterOptions {
    status?: RequestStatus[];
    priority?: Priority[];
    department?: string[];
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
