import React from "react";
import styles from "./ContactCellRenderer.module.css";

export const ContactCellRenderer = ({ data }) => {
  const emailName = data.orgHierarchy.at(-1).toLowerCase().replace(" ", ".");

  return (
    <div className={styles.contactCell}>
      <div className={styles.iconContainer}>
        <button className="button-secondary">
          <a
            href={`https://www.linkedin.com/company/ag-grid/`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <img
              className={styles.icon}
              src={`/example/hr/linkedin.svg`}
              alt="linkedin"
            />
          </a>
        </button>
        <button className="button-secondary">
          <a
            href={`mailto:${emailName}@company.com`}
            className={styles.iconLink}
          >
            <img
              className={styles.icon}
              src={`/example/hr/email.svg`}
              alt="email"
            />
          </a>
        </button>
      </div>
    </div>
  );
};
