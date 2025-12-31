// Application Constants

import { UserRole, RequestStatus, Priority, ResourceType } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api/v1';

export const ROLES: Record<UserRole, string> = {
    employee: 'Employee',
    manager: 'Manager',
    department_head: 'Department Head',
    finance: 'Finance',
    admin: 'Admin',
};

export const STATUSES: Record<RequestStatus, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'gray' },
    submitted: { label: 'Submitted', color: 'blue' },
    under_review: { label: 'Under Review', color: 'yellow' },
    approved: { label: 'Approved', color: 'green' },
    rejected: { label: 'Rejected', color: 'red' },
    funded: { label: 'Funded', color: 'purple' },
    fulfilled: { label: 'Fulfilled', color: 'teal' },
    cancelled: { label: 'Cancelled', color: 'gray' },
};

export const PRIORITIES: Record<Priority, { label: string; color: string }> = {
    low: { label: 'Low', color: 'gray' },
    medium: { label: 'Medium', color: 'blue' },
    high: { label: 'High', color: 'orange' },
    urgent: { label: 'Urgent', color: 'red' },
};

export const RESOURCE_TYPES: Record<ResourceType, string> = {
    equipment: 'Equipment',
    software: 'Software',
    supplies: 'Supplies',
    services: 'Services',
    infrastructure: 'Infrastructure',
    other: 'Other',
};

export const APPROVAL_WORKFLOW: UserRole[] = [
    'manager',
    'department_head',
    'finance',
    'admin',
];

export const ROLE_PERMISSIONS = {
    employee: {
        canCreateRequest: true,
        canViewOwnRequests: true,
        canEditOwnRequests: true,
        canCancelOwnRequests: true,
    },
    manager: {
        canCreateRequest: true,
        canViewOwnRequests: true,
        canEditOwnRequests: true,
        canCancelOwnRequests: true,
        canViewTeamRequests: true,
        canApproveRequests: true,
    },
    department_head: {
        canCreateRequest: true,
        canViewOwnRequests: true,
        canEditOwnRequests: true,
        canCancelOwnRequests: true,
        canViewDepartmentRequests: true,
        canApproveRequests: true,
    },
    finance: {
        canViewAllRequests: true,
        canApproveRequests: true,
        canManageFunding: true,
    },
    admin: {
        canViewAllRequests: true,
        canApproveRequests: true,
        canManageUsers: true,
        canManageDepartments: true,
        canViewAuditLogs: true,
        canGenerateReports: true,
        canOverrideApprovals: true,
    },
};

export const NOTIFICATION_TYPES = {
    REQUEST_SUBMITTED: 'Request Submitted',
    REQUEST_APPROVED: 'Request Approved',
    REQUEST_REJECTED: 'Request Rejected',
    REQUEST_FUNDED: 'Request Funded',
    REQUEST_FULFILLED: 'Request Fulfilled',
    APPROVAL_REQUIRED: 'Approval Required',
    COMMENT_ADDED: 'Comment Added',
};

export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

export const PAGINATION_LIMITS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 25;
