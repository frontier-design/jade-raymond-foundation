import { useState, useEffect } from 'react'
import styled from 'styled-components'

const GridContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.6s ease-in-out;
  transition-delay: ${props => props.$delay}s;
`

const GridInner = styled.div`
  width: 100%;
  max-width: 1700px;
  height: 100%;
  margin: 0 auto;
  display: ${props => props.$isVisible ? 'grid' : 'none'};
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  padding: 0 50px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 0 20px;
    gap: 1rem;
  }
`


const GridColumn = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
`

function GridOverlay(props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'g' || e.key === 'G') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <GridContainer $isLoaded={props.isLoaded} $delay={props.delay}>
      <GridInner $isVisible={isVisible}>
        {Array.from({ length: 12 }).map((_, index) => (
          <GridColumn key={index} />
        ))}
      </GridInner>
    </GridContainer>
  )
}

export default GridOverlay
