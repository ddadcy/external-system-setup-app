export interface User {
    userNo: number;
    ownerName: string;
    plannerName: string;
    dateCreated: string;
    dateUpdated: string;
  }
  
  export interface Planner {
    plannerNo: number;
    plannerName: string;
    plannerDescription: string;
    plannerType: string;
    triggerSetup: string;
    sources: string;
    sourceName: string;
    runsName: string;
    reportName: string;
    reportType: string;
    plannerStatus: PlannerStatus;
    dateCreated: string;
    dateUpdated: string;
    users: User[];
  }
  
  export interface ExternalSystem {
    configNo: number;
    configName: string;
    baseUrl: string;
    authMethod: AuthMethod;
    configKey: string;
    configValue: string;
    authPlace: AuthPlace;
    dateCreated: string;
    dateUpdated: string;
    planners: Planner[];
  }
  
  export interface CreateSystemForm {
    name: string;
    baseUrl: string;
    authMethod: AuthMethod;
    key: string;
    authPlace: AuthPlace;
  }
  
  export interface UpdateSystemForm {
    configName?: string;
    baseUrl?: string;
    authMethod?: AuthMethod;
    configKey?: string;
    configValue?: string;
    authPlace?: AuthPlace;
  }
  
  // Enums for better type safety
  export enum AuthMethod {
    API_KEY = 'API Key',
    BEARER_TOKEN = 'Bearer Token',
    BASIC_AUTH = 'Basic Auth',
    OAUTH2 = 'OAuth2'
  }
  
  export enum AuthPlace {
    HEADER = 'header',
    QUERY_PARAMETER = 'query_parameter',
    BODY = 'body'
  }
  
  export enum PlannerStatus {
    FAILED = 'failed',
    SUCCESS = 'success',
    RUNNING = 'running',
    PENDING = 'pending',
    STOPPED = 'stopped'
  }
  
  // API Response interfaces
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
  
  export interface SystemConnectionTest {
    success: boolean;
    message: string;
    responseTime?: number;
    statusCode?: number;
  }
  
  // Filter and search interfaces
  export interface SystemFilter {
    authMethod?: AuthMethod;
    status?: PlannerStatus;
    dateFrom?: string;
    dateTo?: string;
  }
  
  export interface SystemSearchCriteria {
    searchTerm?: string;
    filter?: SystemFilter;
    sortBy?: 'configName' | 'dateCreated' | 'dateUpdated' | 'plannerCount';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }
  
  // Utility types
  export type SystemSortField = keyof Pick<ExternalSystem, 'configName' | 'dateCreated' | 'dateUpdated'>;
  export type PlannerSortField = keyof Pick<Planner, 'plannerName' | 'plannerStatus' | 'dateCreated' | 'dateUpdated'>;
  
  // Constants
  export const AUTH_METHODS: AuthMethod[] = [
    AuthMethod.API_KEY,
    AuthMethod.BEARER_TOKEN,
    AuthMethod.BASIC_AUTH,
    AuthMethod.OAUTH2
  ];
  
  export const AUTH_PLACES: AuthPlace[] = [
    AuthPlace.HEADER,
    AuthPlace.QUERY_PARAMETER,
    AuthPlace.BODY
  ];
  
  export const PLANNER_STATUSES: PlannerStatus[] = [
    PlannerStatus.PENDING,
    PlannerStatus.RUNNING,
    PlannerStatus.SUCCESS,
    PlannerStatus.FAILED,
    PlannerStatus.STOPPED
  ];
