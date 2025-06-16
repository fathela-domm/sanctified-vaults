import React from "react";
import styles from "./TagCellRenderer.module.css";

export const TagCellRenderer = ({ value, valueFormatted }) => (
  <div className={`${styles.tag} ${styles[value + "Tag"]}`}>
    <div className={`${styles.circle} ${styles[value + "Circle"]}`}></div>
    <span>{valueFormatted}</span>
  </div>
);
