import React from "react";
import styles from './Controllers.module.css'
function ControllersBox(props) {
    return ( 
        <div className={styles.controllerBox}>
            {props.children}
        </div>
    );
}

export default ControllersBox;
