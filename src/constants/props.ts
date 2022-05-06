export const transitionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } },
  transition: {
    type: "spring",
    stiffness: 30,
  },
};
