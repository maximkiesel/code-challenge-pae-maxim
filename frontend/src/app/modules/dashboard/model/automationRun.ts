import {AutomationRunStatus} from './automationRunStatus';

export interface AutomationRun{

  id:number,
  name:string,
  application:string,
  status:AutomationRunStatus,
  created_at:string,
  duration_ms:number|null
}
