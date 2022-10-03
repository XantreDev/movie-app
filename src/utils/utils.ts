import { Pages } from "../constants/paths";

export const generateBaseRequest = (baseUrl: string, apiKey: string) => ({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});

export const getFormattedRating = (rating: string | number) =>
  (+rating).toFixed(1);

export const formatRutime = (runtime: number) =>
  `${Math.floor(runtime / 60)}h ${runtime % 60}m`;

export const getGoogleUrl = (query: string) =>
  `https://www.google.com/search?q=${query}`;

export const getDetailsMovieUrl = (id: number | string) =>
  `/${Pages.Details}/${id}`;

export const onHrefChange = (callback: () => void, signal?: AbortSignal) => {
  let previousUrl = window.location.href;
  const mutationObserver = new MutationObserver(() => {
    if (previousUrl === window.location.href) return;

    callback();
    previousUrl = window.location.href;
  });

  if (!signal) return;
  signal.addEventListener("abort", () => mutationObserver.disconnect(), {
    signal,
  });
};
