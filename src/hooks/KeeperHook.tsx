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

export enum OperationType {
    update,
    add,
    withdraw,
}
export interface KeeperOperation {
    time: Date;
    type: OperationType;
    amount: number;
}

interface KeeperState {
    total: number;
    today: number;
    daily: number;
}

type KeeperOutput = [
    total: number,
    updateTotal: (amount: number) => void,
    today: number,
    add: (amount: number) => void,
    withdraw: (amount: number) => boolean,
    history: Array<KeeperOperation>,
    undo: () => void
];

export default function useKeeper(historyDepth: number): KeeperOutput {
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

    const [undos, setUndos] = useLocalStorage<Array<KeeperState>>("undos", []);

    const addOperation = (type: OperationType, amount: number) => {
        undos.push({ total, today, daily });
        setUndos(undos);

        let cp = history.slice(0);
        if (history.length >= historyDepth) {
            cp = history.slice(history.length - historyDepth + 1);
        }

        cp.unshift({ time: new Date(), type, amount });
        setHistory(cp);
    };

    const updateTotalBalance = (newTotal: number) => {
        addOperation(OperationType.update, newTotal);

        let newDaily = newTotal / getMonthDays();
        setLast(getTodayDate());
        setDaily(newDaily);
        setToday(newDaily);
        setTotal(newTotal);
    };

    const add = (amount: number) => {
        addOperation(OperationType.add, amount);

        setTotal(total + amount);
        setToday(today + amount);
    };

    const withdraw = (amount: number) => {
        if (total - amount > -EPS) {
            addOperation(OperationType.withdraw, amount);

            setToday(today - amount);
            setTotal(Math.abs(total - amount));
            return true;
        }
        return false;
    };

    const undo = () => {
        if (undos.length > 0) {
            history.pop();
            setHistory(history);
            let u = undos.pop();
            if (u === undefined) throw new Error("Undo operation is undefined");
            setUndos(undos);
            setTotal(u.total);
            setToday(u.today);
            setDaily(u.daily);
        }
    };

    return [total, updateTotalBalance, today, add, withdraw, history, undo];
}
