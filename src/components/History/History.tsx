import uuid from "react-uuid";
import { KeeperOperation, OperationType } from "../../hooks/KeeperHook";
import "./history.css";

interface HistoryProps {
    history: KeeperOperation[];
    undo: () => void;
}

const MonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const OperationSymbols = ["", "+", "-"];

export default function History({ history, undo }: HistoryProps) {
    return (
        <div className="history-container">
            {history.map((o) => {
                let t = new Date(o.time);
                return (
                    <div key={uuid()} className="history-operation">
                        <span className="operation-time">
                            {t.getDate()} {MonthNames[t.getMonth()]},{" "}
                            {t.getHours()}:{t.getMinutes()}
                        </span>
                        <span
                            className={
                                "operation-amount operation-" +
                                OperationType[o.type]
                            }
                        >
                            {OperationSymbols[o.type]}
                            {o.amount.toFixed(2)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}