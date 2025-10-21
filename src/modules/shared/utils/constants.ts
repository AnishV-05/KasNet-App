export const INTEROP_STATE_TYPE = {
  ACTIVE: {
    CODE: 'ACTIVE',
    DESCRIPTION: 'Activo',
  },
  INACTIVE: {
    CODE: 'INACTIVE',
    DESCRIPTION: 'De baja',
  },
  SUSPENDED: {
    CODE: 'SUSPENDED',
    DESCRIPTION: 'Suspendido',
  },
  UNDER_KYC_REVIEW: {
    CODE: 'UNDER_KYC_REVIEW',
    DESCRIPTION: 'En revisión KYC',
  },
  BO_FLAGGED: {
    CODE: ' BO_FLAGGED',
    DESCRIPTION: 'Observado Backoffice',
  },
  KYC_FLAGGED: {
    CODE: 'KYC_FLAGGED',
    DESCRIPTION: 'Observado KYC',
  },
  DIRECTORY_FLAGGED: {
    CODE: 'DIRECTORY_FLAGGED',
    DESCRIPTION: 'Observado Directory',
  },
  REFUSED: {
    CODE: 'REFUSED',
    DESCRIPTION: 'Rechazado',
  },
} as const

export const AGENT_STATUS_TYPE = {
  COMPLETED: {
    CODE: 'completed',
    DESCRIPTION: 'Activo',
  },
  DELETED: {
    CODE: 'deleted',
    DESCRIPTION: 'De baja',
  },
  BLOCKED: {
    CODE: 'blocked',
    DESCRIPTION: 'Bloqueado',
  },
  CREATED: {
    CODE: 'created',
    DESCRIPTION: 'Creado',
  },
  VERIFIED: {
    CODE: 'verified',
    DESCRIPTION: 'Verificado',
  },
} as const
