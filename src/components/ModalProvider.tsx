import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import produce from "immer";
import React, { createContext, useReducer } from "react";
import { createPortal } from "react-dom";
import { ModalActions, ModalState } from "../types/context";

const initialModalState = {
  showModal: false,
} as ModalState;

const reducer = (state = initialModalState, action: ModalActions) =>
  produce(state, (draft): void | ModalState => {
    switch (action.type) {
      case "close-modal": {
        return {
          showModal: false
        };
      }
      case "open-modal": {
        return {
          showModal: true,
          modal: action.payload,
          key: +dayjs()
        };
      }
    }
  });

export const modalContext = createContext({} as React.Dispatch<ModalActions>);

const ModalProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [modalData, dispatch] = useReducer(reducer, { showModal: false });
  const portalContainer = document.querySelector("#modal-root");

  return (
    <modalContext.Provider value={dispatch}>
      {createPortal(
        <AnimatePresence>
          {modalData.showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: .3 } }}
              style={{ display: "contents" }} 
              key={modalData.key}
            >
              {modalData.modal}
            </motion.div>
          )}
        </AnimatePresence>,
        portalContainer
      )}
      {children}
    </modalContext.Provider>
  );
};

export default ModalProvider;
