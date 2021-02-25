import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';

const Profile = () => {

    const {level} = useContext(ChallengesContext);

    return(
        <div className={styles.profileContainer}>
            <img src="https://github.com/Daniel-Dev-Ferreira.png" alt="Daniel Ferreira"/>
            <div>
                <strong>Daniel Ferreira</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
            </div>

        </div>
    );
}

export default Profile;