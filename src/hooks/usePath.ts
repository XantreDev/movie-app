import { useLocation } from "react-router-dom";

import { Pages } from "../constants/paths";

export const usePage = () => {
  const { pathname } = useLocation();

  if (pathname.includes(Pages.Details)) return Pages.Details;
  if (pathname.includes(Pages.Search)) return Pages.Search;

  return Pages.Main;
};
