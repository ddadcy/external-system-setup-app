import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  plannerStatus: string;
  dateCreated: string;
  dateUpdated: string;
  users: User[];
}

export interface ExternalSystem {
  configNo: number;
  configName: string;
  baseUrl: string;
  authMethod: string;
  configKey: string;
  configValue: string;
  authPlace: string;
  dateCreated: string;
  dateUpdated: string;
  planners: Planner[];
}

export interface CreateSystemForm {
  name: string;
  baseUrl: string;
  authMethod: string;
  key: string;
  authPlace: string;
}

@Component({
  selector: 'app-external-system',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './external-system.component.html',
  styleUrls: ['./external-system.component.scss']
})
export class ExternalSystemComponent implements OnInit {
  systems: ExternalSystem[] = [];
  expandedSystems = new Set<number>();
  expandedPlanners = new Set<number>();
  searchTerm = '';
  showCreateForm = false;

  createSystemForm: CreateSystemForm = {
    name: '',
    baseUrl: '',
    authMethod: 'API Key',
    key: '',
    authPlace: 'header'
  };

  ngOnInit(): void {
    this.loadMockData();
  }

  private loadMockData(): void {
    const mockData: ExternalSystem[] = [
      {
        configNo: 2,
        configName: "test2_config",
        baseUrl: "https://test.example.com",
        authMethod: "API Key",
        configKey: "api_key_2",
        configValue: "api_key_sample",
        authPlace: "query_parameter",
        dateCreated: "2025-06-16T08:48:51.060184",
        dateUpdated: "2025-06-16T08:48:51.060184",
        planners: [
          {
            plannerNo: 2,
            plannerName: "juantest",
            plannerDescription: "Test Plan Sample 2",
            plannerType: "Setup 2",
            triggerSetup: "runs",
            sources: "Sources",
            sourceName: "Datasource - Y",
            runsName: "Carried interest - Realized",
            reportName: "01 - Standard report per LP",
            reportType: "Management Reports",
            plannerStatus: "failed",
            dateCreated: "2025-06-16T08:48:56.289581",
            dateUpdated: "2025-06-16T08:48:56.289581",
            users: [
              {
                userNo: 2,
                ownerName: "Juan Smith",
                plannerName: "juantest",
                dateCreated: "2025-06-16T08:48:59.167624",
                dateUpdated: "2025-06-16T08:48:59.167624"
              }
            ]
          }
        ]
      }
    ];
    this.systems = mockData;
  }

  get filteredSystems(): ExternalSystem[] {
    return this.systems.filter(system => 
      system.configName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      system.baseUrl.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSystemExpansion(configNo: number): void {
    if (this.expandedSystems.has(configNo)) {
    } else {
      this.expandedSystems.add(configNo);
    }
  }

  togglePlannerExpansion(plannerNo: number): void {
    if (this.expandedPlanners.has(plannerNo)) {
    } else {
      this.expandedPlanners.add(plannerNo);
    }
  }

  isSystemExpanded(configNo: number): boolean {
    return this.expandedSystems.has(configNo);
  }

  isPlannerExpanded(plannerNo: number): boolean {
    return this.expandedPlanners.has(plannerNo);
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'failed': return 'text-red-600 bg-red-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.createSystemForm = {
      name: '',
      baseUrl: '',
      authMethod: 'API Key',
      key: '',
      authPlace: 'header'
    };
  }

  onCreateSystem(): void {
    console.log('Creating system:', this.createSystemForm);
    this.closeCreateForm();
  }

  onViewSystem(system: ExternalSystem): void {
    console.log('Viewing system:', system);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}