import { useEffect } from "react";
import useEventListener from "./EventListener";
import useLocalStorage from "./LocalStorage";

function getTodayDate() {
    let today = new Date().setHours(0, 0, 0, 0);
    return today;
}

function getMonthDays() {
    let now = new Date();
    return new Date(now.getUTCFullYear(), now.getUTCMonth(), 0).getDate();
}

enum OperationType {
    Update,
    Add,
    Withdraw,
}
interface KeeperOperation {
    time: Date;
    type: OperationType;
    amount: number;
}

export default function useKeeper(
    historyDepth: number
): [
    total: number,
    updateTotal: (amount: number) => void,
    today: number,
    add: (amount: number) => void,
    withdraw: (amount: number) => void,
    history: Array<KeeperOperation>
] {
    const EPS = 0.001;

    const updateTodayBalance = () => {
        if (getTodayDate() > last) {
            let diffDays = (getTodayDate() - last) / (1000 * 60 * 60 * 24);
            let newToday = daily * diffDays + today;
            if (total - newToday > -EPS) {
                setToday(newToday);
            } else {
                setToday(total);
            }
            setLast(getTodayDate());
        }
    };

    const [total, setTotal] = useLocalStorage("total_balance", 0);
    const [today, setToday] = useLocalStorage("today_balance", 0);
    const [daily, setDaily] = useLocalStorage("daily_balance", 0);
    const [last, setLast] = useLocalStorage("last_updated", getTodayDate());

    useEffect(() => {
        updateTodayBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEventListener("focus", (e) => {
        updateTodayBalance();
    });

    const [history, setHistory] = useLocalStorage<Array<KeeperOperation>>(
        "history",
        []
    );

    const addOperation = (type: OperationType, amount: number) => {
        let cp = history.slice(0);
        if (history.length >= historyDepth) {
            cp = history.slice(history.length - historyDepth + 1);
        }

        cp.push({ time: new Date(), type, amount });
        setHistory(cp);
    };

    const updateTotalBalance = (newTotal: number) => {
        addOperation(OperationType.Update, newTotal);

        let newDaily = newTotal / getMonthDays();
        setLast(getTodayDate());
        setDaily(newDaily);
        setToday(newDaily);
        setTotal(newTotal);
    };

    const add = (amount: number) => {
        addOperation(OperationType.Add, amount);

        setTotal(total + amount);
        setToday(today + amount);
    };

    const withdraw = (amount: number) => {
        if (total - amount > -EPS) {
            addOperation(OperationType.Withdraw, amount);

            setToday(today - amount);
            setTotal(Math.abs(total - amount));
            return true;
        }
        return false;
    };

    return [total, updateTotalBalance, today, add, withdraw, history];
}
