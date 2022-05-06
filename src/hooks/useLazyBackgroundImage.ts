import React, { useEffect, useMemo, useState } from 'react'

const useLazyBackgroundImage = (src: string) => {
  const [source, setSource] = useState<string | null>(null)

  useEffect(() => {
    setSource(null)
    const image = new Image()
    image.src = src
    image.onload = () => setSource(src)
  }, [src])

  const isLoaded = useMemo(() => source === null ? false : true, [src, source])
  return [isLoaded, source] as [boolean, string | null]
}

export default useLazyBackgroundImage