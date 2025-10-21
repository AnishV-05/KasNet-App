import { KdsLoaderProps, LoaderSizes } from './kds-loader.types'
import { LoaderBox, Spinner, ViewStyled } from './kds-loader.styled'

export const KdsLoader = ({
  name = 'spinner',
  direction = 'column',
  full = false,
  size: sizeLoader = 'lg',
  bgTransparent = false,
  testID = 'default',
  style,
}: KdsLoaderProps) => {
  return (
    <ViewStyled
      $full={full}
      $direction={direction}
      $bgTransparent={bgTransparent}
      style={style}
      data-testid={`${testID}_loader_section`}
    >
      <LoaderBox data-testid={`${testID}_loader`} data-name={name}>
        <Spinner size={LoaderSizes[sizeLoader] || LoaderSizes.md} color="blue" />
      </LoaderBox>
    </ViewStyled>
  )
}
