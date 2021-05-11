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

export default function useKeeper(): [
    total: number,
    updateTotal: (amount: number) => void,
    today: number,
    add: (amount: number) => void,
    withdraw: (amount: number) => void
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

    const updateTotalBalance = (newTotal: number) => {
        let newDaily = newTotal / getMonthDays();
        setLast(getTodayDate());
        setDaily(newDaily);
        setToday(newDaily);
        setTotal(newTotal);
    };

    const add = (amount: number) => {
        setTotal(total + amount);
        setToday(today + amount);
    };

    const withdraw = (amount: number) => {
        if (total - amount > -EPS) {
            setToday(today - amount);
            setTotal(total - amount);
            return true;
        }
        return false;
    };

    return [total, updateTotalBalance, today, add, withdraw];
}
