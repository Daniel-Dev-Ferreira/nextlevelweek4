import { create } from 'domain';
import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import LevelUpModal from '../components/LevelUpModal';

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
    closeLevelUpModal: () => void,
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number,
    currentExperience: number,
    challengesCompleted: number
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({children, ...rest}: ChallengesProviderProps ){
    const [level, setLevel] = useState(rest.level ? rest.level : 1);
    const [currentExperience, setCurrenteExperience] = useState(rest.currentExperience ? rest.currentExperience : 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ? rest.challengesCompleted : 0);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    // quando a gente passa um array vazio como segundo parâmetro, so vai executar apenas uma vez a função do useEffect
    useEffect(() => {
        Notification.requestPermission();
    },[]);

    useEffect( () => {
        Cookies.set('level', level.toString());
        Cookies.set('currentExperience', currentExperience.toString());
        Cookies.set('challengesCompleted', challengesCompleted.toString());
    }, [level, currentExperience, challengesCompleted] )

    function levelUp(){
        setLevel(level +1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false);
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
            completeChallenge,
            closeLevelUpModal
          }}
        >
            {children}

            {isLevelUpModalOpen &&  <LevelUpModal/>}
           
        </ChallengesContext.Provider>
    );
}