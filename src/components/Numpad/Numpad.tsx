import { useState } from "react";
import "./numpad.css";

interface NumpadProps {
    onCancel: () => void;
    onSuccess: (value: number) => void;
}

export default function Numpad({ onCancel, onSuccess }: NumpadProps) {
    const [value, setValue] = useState(0);

    const onButtonClick = (val: string) => {};

    return (
        <div className="numpad-outer-container">
            <div className="numpad-inner-container">
                <div className="numpad-value-container">
                    <div className="numpad-value-container-inner">
                        {value.toFixed(2)}
                        <span>BYR</span>
                    </div>
                </div>
                <div className="numpad-numpad">
                    <div className="numpad-row">
                        <button onClick={(e) => onButtonClick("1")}>1</button>
                        <button onClick={(e) => onButtonClick("2")}>2</button>
                        <button onClick={(e) => onButtonClick("3")}>3</button>
                    </div>
                    <div className="numpad-row">
                        <button onClick={(e) => onButtonClick("4")}>4</button>
                        <button onClick={(e) => onButtonClick("5")}>5</button>
                        <button onClick={(e) => onButtonClick("6")}>6</button>
                    </div>
                    <div className="numpad-row">
                        <button onClick={(e) => onButtonClick("7")}>7</button>
                        <button onClick={(e) => onButtonClick("8")}>8</button>
                        <button onClick={(e) => onButtonClick("9")}>9</button>
                    </div>
                    <div className="numpad-row">
                        <button onClick={(e) => onButtonClick("-")}>
                            <span className="material-icons-outlined">
                                arrow_back
                            </span>
                        </button>
                        <button onClick={(e) => onButtonClick("0")}>0</button>
                        <button onClick={(e) => onButtonClick("+")}>
                            <span className="material-icons-outlined">
                                done
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
