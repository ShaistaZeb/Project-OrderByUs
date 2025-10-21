import React from 'react'
import styles from "./HOME.module.css";

function Bar() {
  return (
    <div className={styles.navbar} >
          <div className={styles.title}>
              OrderByUs
          </div>

          <div className={styles.about}>
              About
          </div>
          <div className={styles.team}>
              Team
          </div>
    </div>
  )
}

export default Bar