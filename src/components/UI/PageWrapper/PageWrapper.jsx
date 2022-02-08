import React from 'react';
import styles from './PageWrapper.module.scss'

const PageWrapper = (props) => {
  return (
  <div className={styles.wrapper}>
      {props.children}
  </div>);
};

export default PageWrapper;
