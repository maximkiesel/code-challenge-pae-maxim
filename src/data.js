function createInitialRuns() {
  return [
    {
      id: 101,
      name: 'Customer Data Synchronization',
      application: 'Salesforce',
      status: 'success',
      created_at: '2026-08-20T08:15:00Z',
      duration_ms: 4280
    },
    {
      id: 102,
      name: 'Ticket Classification',
      application: 'Zendesk',
      status: 'failed',
      created_at: '2026-08-20T09:30:00Z',
      duration_ms: 1730
    },
    {
      id: 103,
      name: 'User Provisioning',
      application: 'Microsoft 365',
      status: 'running',
      created_at: '2026-08-20T10:05:00Z',
      duration_ms: null
    },
    {
      id: 104,
      name: 'Billing Export',
      application: 'SAP',
      status: 'success',
      created_at: '2026-08-20T11:45:00Z',
      duration_ms: 12150
    },
    {
      id: 105,
      name: 'Knowledge Base Translation',
      application: 'Confluence',
      status: 'failed',
      created_at: '2026-08-20T13:20:00Z',
      duration_ms: 6890
    }
  ];
}

module.exports = { createInitialRuns };
