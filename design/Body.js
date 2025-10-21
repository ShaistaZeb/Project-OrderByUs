import styles from './Body.module.css'
import Image from 'next/image';
import home from '../images/h.png'
const Body = (props) => {
    return <div className={styles.body}>

        <div className={styles.text}>
        <div className={styles.text_title}>Are you Busy in work (Lazy) then ur in right place..</div>
        <div className={styles.text_description}>Order now from ur room</div>
        </div>
        <div className={styles.image}>
            <Image
                src={home}
                alt="Order food"
                width="500px"
                
            />
        </div>
        <div className={styles.imgg}>
            
        </div>
    </div>
}

export default Body;