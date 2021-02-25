import { create } from 'domain';
import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';

interface Challenge {
    type: string,
    description: string,
    amount: number
}

// serve para monstrar os parametros que estão disponiveis para usa nos componentes
interface ChallengesContextData {
    level: number,
    currentExperience: number,
    challengesCompleted: number,
    experienceToNextLevel: number,
    activeChallenge: Challenge,
    startNewChallenge: () => void,
    levelUp: () => void,
    resetChallenge: () => void,
    completeChallenge: () => void,
}

interface ChallengesProviderProps {
    children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({children}: ChallengesProviderProps ){
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrenteExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    // quando a gente passa um array vazio como segundo parâmetro, so vai executar apenas uma vez a função do useEffect
    useEffect(() => {
        Notification.requestPermission();
    },[]);

    function levelUp(){
        setLevel(level +1);
    }

    function startNewChallenge(){

        new Audio('/notification.mp3').play();
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        if(Notification.permission === 'granted'){
            new Notification('Novo desafio', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge(){
        setActiveChallenge(null)
    }

    function completeChallenge(){
        if(!activeChallenge){
            return;
        }

        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel){
            finalExperience -= experienceToNextLevel;
            levelUp();
        }

        setCurrenteExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return(
        <ChallengesContext.Provider 
        value={{
            level,
            currentExperience,
            challengesCompleted,
            activeChallenge,
            experienceToNextLevel,
            startNewChallenge,
            levelUp,
            resetChallenge,
            completeChallenge
          }}
        >
            {children}
        </ChallengesContext.Provider>
    );
}