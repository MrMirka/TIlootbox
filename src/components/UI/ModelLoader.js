import React from "react";
import styles from './ModelLoader.module.css'
function ModelLoader () {
    return ( 
        <div className={styles.container}>
            <span className={styles.loader}></span>
        </div>
    );
}

export default ModelLoader ;