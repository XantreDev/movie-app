import { useLayoutEffect, useState } from "react";

const useLazyBackgroundImage = (src: string | null) => {
  const [source, setSource] = useState<string | null>(null);

  useLayoutEffect(() => {
    setSource(null);

    if (!src) return;

    const image = new Image();
    image.src = src;
    const abortController = new AbortController();
    image.addEventListener("load", () => setSource(src), {
      signal: abortController.signal,
    });

    return () => abortController.abort();
  }, [src]);

  const isLoaded = !!source;
  return [isLoaded, source] as [boolean, string | null];
};

export default useLazyBackgroundImage;
