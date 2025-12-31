// Permission Utilities

import { User, UserRole, ResourceRequest } from './types';
import { ROLE_PERMISSIONS } from './constants';

export const canCreateRequest = (user: User | null): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.canCreateRequest || false;
};

export const canEditRequest = (user: User | null, request: ResourceRequest): boolean => {
    if (!user) return false;

    // Admin can edit any request
    if (user.role === 'admin') return true;

    // User can edit their own requests if not yet approved
    if (request.requestedBy._id === user._id && request.status === 'draft') {
        return true;
    }

    return false;
};

export const canCancelRequest = (user: User | null, request: ResourceRequest): boolean => {
    if (!user) return false;

    // Admin can cancel any request
    if (user.role === 'admin') return true;

    // User can cancel their own requests if not yet fulfilled
    if (request.requestedBy._id === user._id && request.status !== 'fulfilled') {
        return true;
    }

    return false;
};

export const canApproveRequest = (user: User | null, request: ResourceRequest): boolean => {
    if (!user) return false;

    const approverRoles: UserRole[] = ['manager', 'department_head', 'finance', 'admin'];
    if (!approverRoles.includes(user.role)) return false;

    // Check if this user has already approved
    const hasApproved = request.approvals.some(
        (approval) => approval.approver._id === user._id
    );

    if (hasApproved) return false;

    // Check if it's this user's turn in the workflow
    const currentApprovalLevel = request.approvals.length;
    const approvalWorkflow: UserRole[] = ['manager', 'department_head', 'finance', 'admin'];

    return approvalWorkflow[currentApprovalLevel] === user.role;
};

export const canManageUsers = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'admin';
};

export const canManageDepartments = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'admin';
};

export const canViewAllRequests = (user: User | null): boolean => {
    if (!user) return false;
    return ['finance', 'admin'].includes(user.role);
};

export const canManageFunding = (user: User | null): boolean => {
    if (!user) return false;
    return ['finance', 'admin'].includes(user.role);
};

export const canViewAuditLogs = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'admin';
};

export const canGenerateReports = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'admin';
};

export const canOverrideApprovals = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'admin';
};
