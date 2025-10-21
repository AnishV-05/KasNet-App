import styled from 'styled-components'

export const CardContainer = styled.div`
  box-shadow: 0px 20px 20px 0px rgba(0, 0, 0, 0.04);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`

export const CardImageWrapper = styled.div`
  background-color: #ededff;
  height: 160px;
  max-height: 200px;
  text-align: center;

  img {
    height: 100%;
    object-fit: contain;
  }
`
export const CardBody = styled.div`
  min-height: 110px;
  max-height: 320px;
`

export const CardTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin: 48px 0 16px;
  padding: 0 16px;
`

export const CardText = styled.p`
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  padding: 0 16px;
  color: black;
`
