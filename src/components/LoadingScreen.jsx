import { useState, useEffect } from 'react'
import styled from 'styled-components'

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00A86B;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.4s ease-in-out;
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
`

const LoadingContent = styled.div`
  color: white;
  font-size: 20px;
  font-weight: 700;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`

function LoadingScreen() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true)
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    // Fade out the loading text before the overlay fades out
    const textFadeTimer = setTimeout(() => {
      setIsTextVisible(false)
    }, 300)

    // Fade out the overlay
    const overlayFadeTimer = setTimeout(() => {
      setIsOverlayVisible(false)
    }, 600)

    // Remove from DOM after animation completes
    const removeTimer = setTimeout(() => {
      setShouldRender(false)
    }, 1000)

    return () => {
      clearTimeout(textFadeTimer)
      clearTimeout(overlayFadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!shouldRender) {
    return null
  }

  return (
    <LoadingOverlay isVisible={isOverlayVisible}>
      <LoadingContent isVisible={isTextVisible}>
        Jade Raymond Foundation
      </LoadingContent>
    </LoadingOverlay>
  )
}

export default LoadingScreen
