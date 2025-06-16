import styles from "./StatusCellRenderer.module.css";
import React from "react";

export const StatusCellRenderer = ({
  value,
}) => (
  <div className={`${styles.tag} ${styles[value + "Tag"]}`}>
    {value === "paid" && (
      <img className={styles.tick} src={`/example/hr/tick.svg`} alt="tick" />
    )}
    <span>{value}</span>
  </div>
);
