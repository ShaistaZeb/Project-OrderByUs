import React from 'react'
import styles from "../styles/popUp.module.css";
function OrderListTile() {
    
  return (
      <div className={styles.tile}>
          <p className={styles.name}>Name</p>
          <p className={styles.cost}>$Cost</p>
          <p className={styles.icon}>
              <div className={styles.popup} onClick={myFunction}>
                  ...
                  <span className={styles.popuptext} id="myPopup">
                      <div>
                          <div className={styles.addAgain} onClick={addAgain}>
                              <span>
                                  <AiOutlinePlusCircle className={styles.iconD} />
                              </span>
                              <span > Add again</span>
                          </div>
                          <div className={styles.delete} onClick={deleteItem}>
                              <span>
                                  <AiFillDelete className={styles.iconD} />
                              </span>
                              <span>Delete</span>
                          </div>
                      </div>
                  </span>
              </div>
          </p>
      </div>
  )
}

export default OrderListTile