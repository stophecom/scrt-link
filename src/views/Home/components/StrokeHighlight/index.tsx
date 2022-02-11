import React, { ReactNode, useState, useEffect } from 'react'

import clsx from 'clsx'
import { styled } from '@mui/system'

type SVGProps = {
  className?: string
}
const SVG = ({ className }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 13" className={className} />
)

const StrokeSvg = styled(SVG)`
  display: block;
  stroke: #ff0083;
  stroke-width: 3;
  transition: stroke-dashoffset 1800ms ease-out;
  stroke-dasharray: 650px;
  stroke-dashoffset: 650px;

  &.ready {
    stroke-dashoffset: 0;
  }
`

const StrokeWrapper = styled('span')`
  display: inline-block;
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
`

const Highlight = styled('span')`
  position: relative;
  display: inline-block;
`

type StrokeHighlightProps = {
  children: ReactNode
}
const StrokeHighlight = ({ children }: StrokeHighlightProps) => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])
  return (
    <Highlight>
      {children}
      <StrokeWrapper>
        <StrokeSvg className={clsx({ ready: ready })}>
          <path
            id="line"
            d="M2 2c49.7 2.6 100 3.1 150 1.7-46.5 2-93 4.4-139.2 7.3 45.2-1.5 90.6-1.8 135.8-.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </StrokeSvg>
      </StrokeWrapper>
    </Highlight>
  )
}

export default StrokeHighlight
