import { CardBody, CardContainer, CardImageWrapper, CardText, CardTitle } from './card.styled'

interface Props {
  imageSrc: string
  imageAlt?: string
  title: string
  description: string
}

export const Card = ({ imageSrc, imageAlt = 'Benefit image', title, description }: Props) => (
  <CardContainer>
    <CardImageWrapper>
      <img src={imageSrc} alt={imageAlt} />
    </CardImageWrapper>
    <CardBody>
      <CardTitle>{title}</CardTitle>
      <CardText>{description}</CardText>
    </CardBody>
  </CardContainer>
)
