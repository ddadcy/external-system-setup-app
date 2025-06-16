import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { ExternalSystemService } from './external-system.service';
import { 
  ExternalSystem, 
  CreateSystemForm, 
  AuthMethod, 
  AuthPlace, 
  PlannerStatus,
  AUTH_METHODS,
  AUTH_PLACES
} from './external-system.models';

@Component({
  selector: 'app-external-system',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './external-system.component.html',
  styleUrls: ['./external-system.component.scss']
})
export class ExternalSystemComponent implements OnInit, OnDestroy {
  // Component state
  systems: ExternalSystem[] = [];
  filteredSystems: ExternalSystem[] = [];
  expandedSystems = new Set<number>();
  expandedPlanners = new Set<number>();
  loading = false;
  error: string | null = null;

  // Search and filtering
  searchTerm = '';
  private searchSubject = new Subject<string>();
  
  // Modal states
  showCreateForm = false;
  showEditForm = false;
  selectedSystem: ExternalSystem | null = null;

  // Forms
  createSystemForm: FormGroup;
  editSystemForm: FormGroup;

  // Constants for template
  readonly authMethods = AUTH_METHODS;
  readonly authPlaces = AUTH_PLACES;
  readonly AuthMethod = AuthMethod;
  readonly AuthPlace = AuthPlace;

  // Lifecycle management
  private destroy$ = new Subject<void>();

  constructor(
    private externalSystemService: ExternalSystemService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createSystemForm = this.initializeCreateForm();
    this.editSystemForm = this.initializeEditForm();
  }

  ngOnInit(): void {
    this.setupSearchSubscription();
    this.loadSystems();
    this.checkRouteParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCreateForm(): FormGroup {
    return this.fb.group({
      name: [''],
      baseUrl: [''],
      authMethod: [""],
      key: [''],
      authPlace: [""]
    });
  }

  private initializeEditForm(): FormGroup {
    return this.fb.group({
      configName: [''],
      baseUrl: [''],
      authMethod: [],
      configKey: [''],
      configValue: [''],
      authPlace: [""]
    });
  }

  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
  }

  private checkRouteParams(): void {
    const mode = this.route.snapshot.data['mode'];
    const id = this.route.snapshot.paramMap.get('id');

    if (mode === 'create') {
      this.openCreateForm();
    } else if (mode === 'edit' && id) {
      this.loadSystemForEdit(+id);
    }
  }

  // Data loading methods
  loadSystems(): void {
    this.loading = true;
    this.error = null;

    this.externalSystemService.getSystems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (systems) => {
       //   this.systems = systems;
     //     this.filteredSystems = systems;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load external systems. Please try again.';
          this.loading = false;
          console.error('Error loading systems:', error);
        }
      });
  }

  private loadSystemForEdit(id: number): void {
    this.externalSystemService.getSystem(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (system) => {
          if (system) {
       //     this.selectedSystem = system;
       //     this.populateEditForm(system);
            this.showEditForm = true;
          }
        },
        error: (error) => {
          this.error = 'Failed to load system details.';
          console.error('Error loading system:', error);
        }
      });
  }

  // Search functionality
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  private performSearch(term: string): void {
    if (!term.trim()) {
      this.filteredSystems = this.systems;
      return;
    }

    this.filteredSystems = this.systems.filter(system => 
      system.configName.toLowerCase().includes(term.toLowerCase()) ||
      system.baseUrl.toLowerCase().includes(term.toLowerCase()) ||
      system.authMethod.toLowerCase().includes(term.toLowerCase())
    );
  }

  // Expansion methods
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

  // Status styling
  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case PlannerStatus.FAILED.toLowerCase(): return 'text-red-600 bg-red-50';
      case PlannerStatus.SUCCESS.toLowerCase(): return 'text-green-600 bg-green-50';
      case PlannerStatus.RUNNING.toLowerCase(): return 'text-blue-600 bg-blue-50';
      case PlannerStatus.PENDING.toLowerCase(): return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  // Form methods
  openCreateForm(): void {
    this.showCreateForm = true;
    this.createSystemForm.reset();
    this.createSystemForm.patchValue({
      authMethod: AuthMethod.API_KEY,
      authPlace: AuthPlace.HEADER
    });
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.createSystemForm.reset();
    if (this.route.snapshot.data['mode'] === 'create') {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  openEditForm(system: ExternalSystem): void {
    this.selectedSystem = system;
    this.populateEditForm(system);
    this.showEditForm = true;
  }

  closeEditForm(): void {
    this.showEditForm = false;
    this.selectedSystem = null;
    this.editSystemForm.reset();
  }

  private populateEditForm(system: ExternalSystem): void {
    this.editSystemForm.patchValue({
      configName: system.configName,
      baseUrl: system.baseUrl,
      authMethod: system.authMethod,
      configKey: system.configKey,
      configValue: system.configValue,
      authPlace: system.authPlace
    });
  }

  // CRUD operations
  onCreateSystem(): void {
    if (this.createSystemForm.valid) {
      const formValue = this.createSystemForm.value;
      const createData: CreateSystemForm = {
        name: formValue.name,
        baseUrl: formValue.baseUrl,
        authMethod: formValue.authMethod,
        key: formValue.key,
        authPlace: formValue.authPlace
      };

      this.externalSystemService.createSystem(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newSystem) => {
         //   this.systems.push(newSystem);
            this.filteredSystems = this.systems;
            this.closeCreateForm();
            this.showSuccessMessage('External system created successfully!');
          },
          error: (error) => {
            this.showErrorMessage('Failed to create external system. Please try again.');
            console.error('Error creating system:', error);
          }
        });
    }
  }

  onUpdateSystem(): void {
    if (this.editSystemForm.valid && this.selectedSystem) {
      const formValue = this.editSystemForm.value;
      
      this.externalSystemService.updateSystem(this.selectedSystem.configNo, formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedSystem) => {
            const index = this.systems.findIndex(s => s.configNo === updatedSystem.configNo);
            if (index !== -1) {
         //     this.systems[index] = updatedSystem;
              this.filteredSystems = this.systems;
            }
            this.closeEditForm();
            this.showSuccessMessage('External system updated successfully!');
          },
          error: (error) => {
            this.showErrorMessage('Failed to update external system. Please try again.');
            console.error('Error updating system:', error);
          }
        });
    }
  }





  // Additional actions
  onViewSystem(system: ExternalSystem): void {
    this.router.navigate(['/external-systems', system.configNo]);
  }

  onTestConnection(system: ExternalSystem): void {
    this.externalSystemService.testConnection(system.configNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.showSuccessMessage('Connection test successful!');
          } else {
            this.showErrorMessage(`Connection test failed: ${result.message}`);
          }
        },
        error: (error) => {
          this.showErrorMessage('Connection test failed. Please check your configuration.');
          console.error('Error testing connection:', error);
        }
      });
  }

  // Utility methods
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  private showSuccessMessage(message: string): void {
    // Implement your preferred notification system
    console.log('Success:', message);
    // You might want to use a toast notification service here
  }

  private showErrorMessage(message: string): void {
    // Implement your preferred notification system
    console.error('Error:', message);
    // You might want to use a toast notification service here
  }

  // Getters for template
  get isCreateFormValid(): boolean {
    return this.createSystemForm.valid;
  }

  get isEditFormValid(): boolean {
    return this.editSystemForm.valid;
  }

  get hasFilteredSystems(): boolean {
    return this.filteredSystems.length > 0;
  }

  get isLoading(): boolean {
    return this.loading;
  }

  get hasError(): boolean {
    return !!this.error;
  }
}