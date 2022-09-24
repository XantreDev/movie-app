/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  indexesRefContext,
  moviesDataContext
} from "./../contexts/MoviesDataProvider";
import { MoviesDataLoaded } from "./../types/context";

const useCentralIndex = (genreId: number) => {
  const { data } = useContext(moviesDataContext) as MoviesDataLoaded;

  const indexesRef = useContext(indexesRefContext);
  const currentData = useMemo(
    () => data.find((element) => element.genre.id === genreId),
    [data]
  );

  const [centralIndex, setCentralIndex] = useState(
    indexesRef.current.columnIndexes?.[genreId] ??
      data.find((value) => value.genre.id === genreId)?.currentCenter ??
      10
  );

  useEffect(() => {
    if (genreId in indexesRef.current.columnIndexes) {
      indexesRef.current.columnIndexes[genreId] = centralIndex;
    }
  }, [centralIndex]);

  const decriment = useCallback(() => {
    setCentralIndex((index) => (index > 0 ? index - 1 : index));
  }, [setCentralIndex]);

  const increment = useCallback(() => {
    setCentralIndex((index) =>
      index < currentData.movies.length - 1 ? index + 1 : index
    );
  }, [setCentralIndex, currentData]);

  const unsafeChange = useCallback(
    (offset) => {
      setCentralIndex((index) => index + offset);
    },
    [setCentralIndex]
  );

  return {
    centralIndex,
    increment,
    decriment,
    unsafeChange,
  };
};

export default useCentralIndex;
