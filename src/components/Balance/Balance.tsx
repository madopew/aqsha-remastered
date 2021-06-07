import { useEffect, useState } from "react";
import "./balance.css";
import NumberEasing from "react-number-easing";
interface BalanceProps {
    total: number;
    today: number;
    onAdd: () => void;
    onWithdraw: () => void;
}

export default function Balance({
    total,
    today,
    onAdd,
    onWithdraw,
}: BalanceProps) {
    const [opacity, setOpacity] = useState(today < 0 ? 1 : 0);
    useEffect(() => {
        if (today < 0) {
            setOpacity(1);
        } else {
            setOpacity(0);
        }
    }, [today]);

    return (
        <div className="balance-container">
            <div className="balance-positive"></div>
            <div
                className="balance-negative"
                style={{ opacity: opacity }}
            ></div>
            <div className="balance-indicator">
                <h2>Total Balance</h2>
                <h3>
                    <NumberEasing value={total} decimals={2} /> <span>BYR</span>
                </h3>
            </div>
            <div className="balance-indicator">
                <h2>Today Balance</h2>
                <h3>
                    <NumberEasing value={today} decimals={2} /> <span>BYR</span>
                </h3>
            </div>
            <div className="balance-buttons">
                <button onTouchEnd={() => onAdd()}>
                    <span className="material-icons-outlined">add_circle</span>{" "}
                    Add
                </button>
                <div className="balance-buttons-separator"></div>
                <button onTouchEnd={() => onWithdraw()}>
                    <span className="material-icons-outlined">
                        remove_circle
                    </span>{" "}
                    Out
                </button>
            </div>
        </div>
    );
}
