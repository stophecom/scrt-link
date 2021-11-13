import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import clsx from 'clsx'

export const ImageBox = styled.div`
  position: relative;

  & > .image {
    position: relative;

    & > div {
      display: block !important; // Workaround
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-shadow: 0 0 80px rgba(255, 0, 131, 0.2), 0px 0px 22px rgba(255, 0, 131, 0.2),
        0 0 1px rgba(255, 0, 131, 1);
      opacity: 0.1;
      border-radius: 12px;
      transition: 1000ms;
    }
  }

  &.image--in-view > .image {
    &::after {
      opacity: 1;
    }
  }
`

type BoxShadowWrapperProps = {
  className?: string
  children: ReactNode
}
const BoxShadowWrapper: React.FC<BoxShadowWrapperProps> = ({ className, children }) => {
  const { ref, inView } = useInView({
    threshold: 0.9,
    delay: 300,
    initialInView: false,
  })

  return (
    <ImageBox className={clsx(className, { 'image--in-view': inView })}>
      <div ref={ref} className="image">
        {children}
      </div>
    </ImageBox>
  )
}

export default BoxShadowWrapper
