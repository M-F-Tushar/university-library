/**
 * API Types
 * Centralized type definitions for API requests and responses
 */

// Base API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasMore: boolean
    }
}

// Resource Types
export interface Resource {
    id: string
    title: string
    description: string
    author?: string | null
    year?: number | null
    format?: string | null
    fileUrl?: string | null
    externalUrl?: string | null
    coverImage?: string | null
    abstract?: string | null
    fileSize?: string | null
    category: string
    department: string
    course?: string | null
    semester?: string | null
    tags: string
    createdAt: string
    updatedAt: string
}

export interface ResourceWithRelations extends Resource {
    bookmarks?: Bookmark[]
    reviews?: ResourceReview[]
    rating?: ResourceRating | null
}

export interface CreateResourceRequest {
    title: string
    description: string
    author?: string
    year?: number
    format?: string
    fileUrl?: string
    externalUrl?: string
    coverImage?: string
    abstract?: string
    fileSize?: string
    category: string
    department: string
    course?: string
    semester?: string
    tags: string
}

export interface UpdateResourceRequest extends Partial<CreateResourceRequest> {
    id: string
}

// User Types
export interface User {
    id: string
    name: string
    email: string
    role: 'STUDENT' | 'ADMIN'
    createdAt: string
    updatedAt: string
}

export interface UserProfile extends Omit<User, 'password'> {
    bookmarks?: Bookmark[]
    activities?: UserActivity[]
}

export interface CreateUserRequest {
    name: string
    email: string
    password: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    user: UserProfile
    token?: string
}

// Bookmark Types
export interface Bookmark {
    id: string
    userId: string
    resourceId: string
    createdAt: string
    resource?: Resource
}

export interface CreateBookmarkRequest {
    resourceId: string
}

// Review Types
export interface ResourceReview {
    id: string
    userId: string
    resourceId: string
    rating: number
    review?: string | null
    isApproved: boolean
    createdAt: string
    updatedAt: string
    user?: Pick<User, 'id' | 'name' | 'email'>
    resource?: Pick<Resource, 'id' | 'title'>
}

export interface CreateReviewRequest {
    resourceId: string
    rating: number
    review?: string
}

export interface ResourceRating {
    id: string
    resourceId: string
    averageRating: number
    totalRatings: number
    totalReviews: number
}

// Activity Types
export interface UserActivity {
    id: string
    userId: string
    resourceId: string
    action: string
    createdAt: string
    resource?: Resource
}

// Category & Course Types
export interface Category {
    id: string
    name: string
    description?: string | null
    icon?: string | null
    _count?: {
        resources: number
    }
}

export interface Course {
    id: string
    code: string
    name: string
    description?: string | null
    semesterId: string
    department: string
    semester?: Semester
}

export interface Semester {
    id: string
    name: string
    year: number
    order: number
    courses?: Course[]
}

export interface Department {
    id: string
    name: string
    code: string
    description?: string | null
}

// Search Types
export interface SearchRequest {
    query: string
    category?: string
    department?: string
    course?: string
    semester?: string
    format?: string
    page?: number
    limit?: number
    sortBy?: 'relevance' | 'date' | 'title' | 'rating'
    sortOrder?: 'asc' | 'desc'
}

export interface SearchResult {
    resources: ResourceWithRelations[]
    total: number
    page: number
    totalPages: number
    facets?: {
        categories: { name: string; count: number }[]
        departments: { name: string; count: number }[]
        formats: { name: string; count: number }[]
    }
}

// Analytics Types
export interface AnalyticsSummary {
    totalUsers: number
    totalResources: number
    totalBookmarks: number
    totalReviews: number
    recentActivity: UserActivity[]
    popularResources: ResourceWithRelations[]
    userGrowth: { date: string; count: number }[]
    resourcesByCategory: { category: string; count: number }[]
}

// Settings Types
export interface SiteSetting {
    id: string
    key: string
    value: string
    updatedAt: string
}

export interface SiteSettings {
    site_title: string
    site_meta_description: string
    site_keywords: string
    contact_email: string
    announcement_enabled: string
    announcement_message: string
    [key: string]: string
}

// External Resource Types
export interface ExternalResource {
    id: string
    title: string
    description?: string | null
    url: string
    category?: string | null
    createdAt: string
    updatedAt: string
}

// Feature Flag Types
export interface Feature {
    id: string
    key: string
    enabled: boolean
    description?: string | null
}

// Upload Types
export interface UploadResponse {
    url: string
    filename: string
    size: number
    type: string
}

// Error Types
export interface ApiError {
    code: string
    message: string
    details?: Record<string, string[]>
    statusCode: number
}

// Form State Types (for server actions)
export interface FormState<T = unknown> {
    success: boolean
    data?: T
    error?: string
    errors?: Record<string, string[]>
}
