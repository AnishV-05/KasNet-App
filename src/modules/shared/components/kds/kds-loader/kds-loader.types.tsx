export type LoaderDirection = 'row' | 'column'
export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'

export const LoaderSizes = {
  lg: 36,
  md: 24,
  sm: 16,
  xl: 48,
} as const

export interface KdsLoaderProps {
  /** Nombre del componente, útil para tracking o testing */
  name?: string
  /** Dirección del layout interno (spinner + label) */
  direction?: LoaderDirection
  /** Si debe ocupar toda la pantalla */
  full?: boolean
  /** Tamaño del loader */
  size?: LoaderSize
  /** Si el fondo debe ser transparente */
  bgTransparent?: boolean
  /** ID para pruebas unitarias o E2E */
  testID?: string
  /** Estilos adicionales */
  style?: React.CSSProperties
}
