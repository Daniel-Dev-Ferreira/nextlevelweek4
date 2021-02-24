import { useState, useEffect, useContext } from 'react';
import { start } from 'repl';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Countdown.module.css';

// variavel global para finalizar o setTimeout
let countdownTime: NodeJS.Timeout;

const Countdown = () => {
    const {startNewChallenge} = useContext(ChallengesContext);

    const [time, setTime] = useState(0.1 * 60);
    const [active, setActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

    function startCountdown(){
        setActive(true);
    }

    function resetCountdown(){
        clearTimeout(countdownTime);
        setActive(false);
        setTime(0.1 * 60);
    }

    //setTimeout -> aconter algo apos algum tempo especificado

    useEffect(() => {
        if(active && time > 0){
        countdownTime = setTimeout(() => {
                setTime(time -1);
            }, 1000)
        } else if(active && time == 0) {
            setHasFinished(true);
            setActive(false);
            startNewChallenge();
        }
    }, [active, time])

    return(
        <div>
        <div className={styles.countdownContainer}>
            <div>
                <span>{minuteLeft}</span>
                <span>{minuteRight}</span>
            </div>
                <span>:</span>
            <div>
                <span>{secondLeft}</span>
                <span>{secondRight}</span>
            </div>
        </div>

        {hasFinished ? (
            <button
            disabled
            className={styles.countdownButton}>
            Ciclo Encerreado           
        </button>
        ) : <> 
            {active ? (
            <button type="button"
                className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
                onClick={resetCountdown}>
                Cancelar ciclo           
            </button>
            ): (
                <button type="button"
                    className={styles.countdownButton}
                    onClick={startCountdown}>
                    Iniciar um ciclo                 
                </button>
            )}
        </>}

        

        </div>
    );
}

export default Countdown;