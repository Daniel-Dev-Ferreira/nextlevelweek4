import './Button.css';
import { useState } from 'react'

interface ButtonPage {
    children: string,
    color: string,
}

const Button = (props: ButtonPage) => {
    const [counter, setCounter] = useState(1);

    function increment(){
        setCounter(counter + 1);
    }

    function decrement(){
        setCounter(counter - 1);
    }

    return(
        <>
            <button 
            className="Button"
            type="button"
            onClick={increment}
            style={{ backgroundColor: props.color }}>
                {props.children}
            </button>

            <button onClick={decrement}>
                decremento
            </button>
            
            <p>{counter}</p>
        </>
    )
};

export default Button;