import { InitWithGeneresAction } from "../types/context";
import { Generes } from "../types/rest";

const initStoreWithGeneres = (generes: Generes): InitWithGeneresAction => {
  return {
    type: 'init',
    payload: generes
  }
}

export const AC = {
  initStoreWithGeneres
}