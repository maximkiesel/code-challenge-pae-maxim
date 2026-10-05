import {Component, OnInit, signal} from '@angular/core';
import {AutomationRunsService} from '../service/automation-runs-service';
import {AutomationRun} from '../model/automationRun';
import {AutomationRunStatus} from '../model/automationRunStatus';
import {AutomationRunCard} from '../component/automation-run-card/automation-run-card';

@Component({
  imports: [
    AutomationRunCard
  ],
  selector: 'app-dashboard-page',
  styleUrl: './dashboard-page.css',
  templateUrl: './dashboard-page.html',
})
export class DashboardPage implements OnInit  {

  protected automationRunsBase = signal<AutomationRun[]>([]);
  protected automationRuns = signal<AutomationRun[]>([]);
  protected isLoading = signal(false);
  protected hasFailed = signal(false);
  protected selectedStatus: AutomationRunStatus | null = null;
  protected selectedSort = '';
  protected readonly AutomationRunStatus = AutomationRunStatus;

  constructor(private automationRunService:AutomationRunsService) {
  }

  ngOnInit(): void {
    this.loadAutomationRuns();
  }

  protected loadAutomationRuns():void{
    this.isLoading.set(true);
    this.automationRunService.getAllAutomationRuns().subscribe({
      next:(runs) => {
        this.automationRunsBase.set(runs);
        this.automationRuns.set(this.automationRunsBase());

        if (this.selectedStatus !== null) {
          this.filterByListByStatus(this.selectedStatus);
        }

        if (this.selectedSort !== '') {
          this.sortBy(this.selectedSort);
        }

        this.hasFailed.set(false);
        this.isLoading.set(false);
      },
      error:(error) => {
        console.error("failed to load data",error);
        this.hasFailed.set(true);
        this.isLoading.set(false);
      }
    });
  }

  protected filterByListByStatus(status: AutomationRunStatus | null): void {
    this.selectedStatus = status;
    if(status===null){
      this.automationRuns.set(this.automationRunsBase());
    } else{
      let filtered = this.automationRunsBase().filter(run => run.status == status);
      this.automationRuns.set(filtered);
    }

  }

  protected sortBy(value: string): void {
    this.selectedSort = value;
    switch (value) {
      case 'date-asc':
        this.sortListByDate(true);
        break;

      case 'date-desc':
        this.sortListByDate(false);
        break;

      case 'duration-asc':
        this.sortListByDuration(true);
        break;

      case 'duration-desc':
        this.sortListByDuration(false);
        break;
    }
  }

  private sortListByDate(ascending:boolean):void{
   let sorted = [... this.automationRuns()].sort((a,b)=>{
     let dataA = new Date(a.created_at).getTime();
     let dataB = new Date(b.created_at).getTime();
     return ascending ? dataA-dataB : dataB-dataA;
   });
    this.automationRuns.set(sorted);
  }

  private sortListByDuration(ascending:boolean):void{
    let sorted = [... this.automationRuns()].sort((a,b)=>{
      if (a.duration_ms === null && b.duration_ms === null) {
        return 0;
      }

      if (a.duration_ms === null) {
        return 1;
      }

      if (b.duration_ms === null) {
        return -1;
      }

      return ascending
        ? a.duration_ms - b.duration_ms
        : b.duration_ms - a.duration_ms;
    });

    this.automationRuns.set(sorted);
  }
}
