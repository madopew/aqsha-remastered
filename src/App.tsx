import "./App.css";
import Balance from "./components/Balance/Balance";
import useKeeper from "./hooks/KeeperHook";

function App() {
    const MAX_HISTORY = 10;
    const [total, updateTotal, today, add, withdraw, history, undo] =
        useKeeper(MAX_HISTORY);

    const onAdd = () => {
        console.log("add");
    };

    const onWithdraw = () => {
        console.log("withdraw");
    };

    return (
        <div className="root-main">
            <div className="root-balance">
                <Balance
                    total={total}
                    today={today}
                    onAdd={onAdd}
                    onWithdraw={onWithdraw}
                />
            </div>
        </div>
    );
}

export default App;
