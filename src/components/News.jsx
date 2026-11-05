import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { Grid, GridCell, GRID } from '../grid'

const Section = styled.section`
  padding: 7rem 0;

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 3rem 0;
  }
`

const Block = styled.div`
  opacity: 0;
`

const NewsItem = styled.article`
  margin-bottom: ${(props) => props.$marginBottom ?? '5rem'};

  @media (max-width: ${GRID.BREAKPOINT}) {
    margin-bottom: ${(props) => props.$marginBottom ?? '3rem'};
  }
`

const NewsDate = styled.time`
  display: block;
  margin-bottom: 1rem;
`

const NewsTitle = styled.h3`
  margin-bottom: 1.5rem;
  white-space: pre-line;

  @media (max-width: ${GRID.BREAKPOINT}) {
    white-space: normal;
  }
`

const Description = styled.p`
  margin: 0 0 1.25rem;
  max-width: 425px;
`

/* Button: matches Bursaries "Learn More" */
const ReadMoreButton = styled.a`
  display: inline-block;
  padding: 10px 15px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 350;
  font-size: 1rem;
  line-height: 1.25;
  color: var(--color-strong-text);
  background: var(--color-strong-bg);
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 8px 16px;
    font-size: 0.925rem;
  }
`

const NEWS = [
  {
    date: '2026-10-01',
    dateLabel: 'October 1, 2026',
    title: 'Jade Raymond Fund\nfor Contemporary Art',
    description:
      'A $500,000 endowment at the Montreal Museum of Fine Arts supporting the acquisition, exhibition, and programming of contemporary art.',
    href: 'https://www.mbam.qc.ca/en/news/creation-of-the-jade-raymond-fund-in-support-of-contemporary-art/',
    marginBottom: '0',
  },
]

function News() {
  const blockRefs = useRef([])
  const animatedRef = useRef(false)

  useEffect(() => {
    const section = blockRefs.current[0]?.closest('section')
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return
        animatedRef.current = true
        const blocks = blockRefs.current.filter(Boolean)
        gsap.fromTo(
          blocks,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: 'power2.out',
          }
        )
      },
      { threshold: 0.3 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <Section aria-labelledby="news-heading">
      <Grid>
        <GridCell $start={1} $span={3} $startMobile={1} $spanMobile={4}>
          <div className="section-header">
            <h2 id="news-heading" className="section-heading-type">● News</h2>
          </div>
        </GridCell>
        {NEWS.map((item, i) => (
          <GridCell key={item.href} $start={4} $span={9} $startMobile={1} $spanMobile={4}>
            <Block ref={(el) => (blockRefs.current[i] = el)}>
              <NewsItem $marginBottom={item.marginBottom}>
                <NewsDate className="body-type" dateTime={item.date}>
                  {item.dateLabel}
                </NewsDate>
                <NewsTitle className="title-type">{item.title}</NewsTitle>
                <Description className="body-type">{item.description}</Description>
                <ReadMoreButton href={item.href} target="_blank" rel="noopener noreferrer">
                  Read More
                </ReadMoreButton>
              </NewsItem>
            </Block>
          </GridCell>
        ))}
      </Grid>
    </Section>
  )
}

export default News
