import styled from 'styled-components'

// --- Estilos ---
export const Spinner = styled.div<{ size: number; color: string }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: 4px solid ${({ color }) => color};
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const LoaderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 12px;
  border-radius: 8px;
`

export const ViewStyled = styled.div<{
  $bgTransparent: boolean
  $direction: 'column' | 'row'
  $full: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $bgTransparent }) => ($bgTransparent ? 'transparent' : '#00000088')};
  flex-direction: ${({ $direction }) => $direction};
  gap: 4px;

  ${({ $full }) =>
    $full
      ? `
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  `
      : ''};
`
