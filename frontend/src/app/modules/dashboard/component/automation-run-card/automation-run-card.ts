import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {AutomationRun} from '../../model/automationRun';
import {AutomationRunStatus} from '../../model/automationRunStatus';
import {AutomationRunsService} from '../../service/automation-runs-service';

@Component({
  imports: [],
  selector: 'app-automation-run-card',
  styleUrl: './automation-run-card.css',
  templateUrl: './automation-run-card.html',
})
export class AutomationRunCard {
  @Input() automationRun!: AutomationRun;
  @Output() retrySuccess = new EventEmitter<void>();

  isLoading = signal(false);
  hasFailed = signal(false);

  constructor(private automationRunService:AutomationRunsService) {
  }

  protected readonly AutomationRunStatus = AutomationRunStatus;

  retryRun():void{
    this.isLoading.set(true);
    this.automationRunService.postRetryRun(this.automationRun.id).subscribe({
      next:(response) => {
        this.retrySuccess.emit();
        this.hasFailed.set(false);
        this.isLoading.set(false);
      },
      error:(error) => {
        console.error("Error",error);
        this.hasFailed.set(true);
        this.isLoading.set(false);
      }
    });
  }



}
