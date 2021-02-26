import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import Countdown from "../components/Countdown"
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number,
    seconds: number
    hasFinished: boolean
    active: boolean
    startCountdown: () => void, 
    resetCountdown: () => void
}

interface CountdownProviderProps{
    children: ReactNode;   
}

export const CountdownContext = createContext({} as CountdownContextData);

// variavel global para finalizar o setTimeout
let countdownTime: NodeJS.Timeout;

export function CountdownProvider({children}: CountdownProviderProps) {
    const {startNewChallenge} = useContext(ChallengesContext);

    const [time, setTime] = useState(10 * 60);
    const [active, setActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown(){
        setActive(true);
    }

    function resetCountdown(){
        clearTimeout(countdownTime);
        setActive(false);
        setHasFinished(false);
        setTime(10 * 60);
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
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            active,
            startCountdown,
            resetCountdown
        }}>
            {children}
        </CountdownContext.Provider>
    );
}