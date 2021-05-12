import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { useEffect, useState } from "react";
import "./balance.css";

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
                    {total.toFixed(2)} <span>BYR</span>
                </h3>
            </div>
            <div className="balance-indicator">
                <h2>Today Balance</h2>
                <h3>
                    {today.toFixed(2)} <span>BYR</span>
                </h3>
            </div>
            <div className="balance-buttons">
                <button onTouchEnd={() => onAdd()}>
                    <AddCircle />
                    Add
                </button>
                <div className="balance-buttons-separator"></div>
                <button onTouchEnd={() => onWithdraw()}>
                    <RemoveCircle />
                    Out
                </button>
            </div>
        </div>
    );
}
