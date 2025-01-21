export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface SelectOption {
  label: string
  value: string | number
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: string
  direction: SortDirection
}

export interface PaginationConfig {
  page: number
  pageSize: number
} 