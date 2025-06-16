import styles from "./FlagCellRenderer.module.css";
import React from "react";

export const FlagCellRenderer = ({
  value,
  data: { flag },
}) => (
  <div className={styles.flagCell}>
    <div className={styles.employeeData}>
      <span>{value}</span>
    </div>
    <img
      className={styles.flagImage}
      src={`/example/hr/${flag}.svg`}
      alt={value.toLowerCase()}
    />
  </div>
);
