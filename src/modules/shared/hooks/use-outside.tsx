import React, { RefObject, useEffect, useState } from 'react'

export function useOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T | null>) {
  const [isOutsideClicked, setIsOutsideClicked] = useState(false)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOutsideClicked(true)
      } else {
        setIsOutsideClicked(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
  return { isOutsideClicked }
}
