import { useState, useEffect } from 'react'
import GlobalStyle from './styles.js'
import GridOverlay from './components/GridOverlay.jsx'
import Hero from './components/Hero.jsx'
import ContentSection from './components/ContentSection.jsx'
import Footer from './components/Footer.jsx'

function App() {
  const [cursorColor, setCursorColor] = useState('#00A86B')
  const [isGridLoaded, setIsGridLoaded] = useState(false)
  const [isHeroLoaded, setIsHeroLoaded] = useState(false)
  const [isContentLeftLoaded, setIsContentLeftLoaded] = useState(false)
  const [isContentRightLoaded, setIsContentRightLoaded] = useState(false)
  const [isFooterLoaded, setIsFooterLoaded] = useState(false)

  useEffect(() => {
    // Trigger fade-in animations at different delays
    const gridTimer = setTimeout(() => setIsGridLoaded(true), 200)
    const heroTimer = setTimeout(() => setIsHeroLoaded(true), 500)
    const contentLeftTimer = setTimeout(() => setIsContentLeftLoaded(true), 900)
    const contentRightTimer = setTimeout(() => setIsContentRightLoaded(true), 1200)
    const footerTimer = setTimeout(() => setIsFooterLoaded(true), 1400)

    return () => {
      clearTimeout(gridTimer)
      clearTimeout(heroTimer)
      clearTimeout(contentLeftTimer)
      clearTimeout(contentRightTimer)
      clearTimeout(footerTimer)
    }
  }, [])

  useEffect(() => {
    // Helper function to interpolate between two hex colors
    const interpolateColor = (color1, color2, factor) => {
      const hex1 = color1.replace('#', '')
      const hex2 = color2.replace('#', '')
      
      const r1 = parseInt(hex1.substr(0, 2), 16)
      const g1 = parseInt(hex1.substr(2, 2), 16)
      const b1 = parseInt(hex1.substr(4, 2), 16)
      
      const r2 = parseInt(hex2.substr(0, 2), 16)
      const g2 = parseInt(hex2.substr(2, 2), 16)
      const b2 = parseInt(hex2.substr(4, 2), 16)
      
      const r = Math.round(r1 + (r2 - r1) * factor)
      const g = Math.round(g1 + (g2 - g1) * factor)
      const b = Math.round(b1 + (b2 - b1) * factor)
      
      return `#${[r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')}`
    }

    const handleMouseMove = (e) => {
      const { clientX } = e
      const { innerWidth } = window
      
      // Calculate normalized X position (0 to 1)
      const xPercent = Math.max(0, Math.min(1, clientX / innerWidth))
      
      // Three jade shades for three horizontal zones
      const leftColor = '#00D68F' // Light jade (lighter than base)
      const middleColor = '#00A86B' // Base jade
      const rightColor = '#006B42' // Dark jade
      
      let selectedColor
      
      if (xPercent < 0.33) {
        // Left third: interpolate from light jade to base jade
        const factor = xPercent / 0.33
        selectedColor = interpolateColor(leftColor, middleColor, factor)
      } else if (xPercent < 0.66) {
        // Middle third: base jade (constant)
        selectedColor = middleColor
      } else {
        // Right third: interpolate from base jade to dark jade
        const factor = (xPercent - 0.66) / 0.34
        selectedColor = interpolateColor(middleColor, rightColor, factor)
      }
      
      setCursorColor(selectedColor)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Update favicon color based on cursor position
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${cursorColor}"/></svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    // Find existing favicon link or create new one
    let link = document.querySelector("link[rel*='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    
    const previousUrl = link.href
    link.href = url
    
    // Clean up previous blob URL on next update
    return () => {
      if (previousUrl && previousUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previousUrl)
      }
      URL.revokeObjectURL(url)
    }
  }, [cursorColor])

  return (
    <>
      <GlobalStyle cursorColor={cursorColor} />
      <GridOverlay isLoaded={isGridLoaded} delay={0.2} />
      <Hero isLoaded={isHeroLoaded} delay={0.5} />
      <ContentSection 
        isLeftLoaded={isContentLeftLoaded} 
        isRightLoaded={isContentRightLoaded}
        leftDelay={0.9}
        rightDelay={1.2}
      />
      <Footer isLoaded={isFooterLoaded} delay={1.4} cursorColor={cursorColor} />
    </>
  )
}

export default App
