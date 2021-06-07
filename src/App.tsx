import { useState } from "react";
import "./App.css";
import AppearTransition, {
    TransitionType,
} from "./components/AppearTransition/AppearTransition";
import Balance from "./components/Balance/Balance";
import Numpad from "./components/Numpad/Numpad";
import useKeeper from "./hooks/KeeperHook";

function App() {
    const MAX_HISTORY = 10;
    const [total, updateTotal, today, add, withdraw, history, undo] =
        useKeeper(MAX_HISTORY);

    const [numpadVisible, setNumpadVisible] = useState(false);

    const onAdd = () => {
        setNumpadVisible(true);
    };

    const onWithdraw = () => {
        withdraw(10);
    };

    const onNumpadSuccess = (val: number) => {
        console.log(val);
    };

    return (
        <div className="root-main">
            <div className="root-top">
                <AppearTransition
                    visible={numpadVisible}
                    effect={TransitionType.bottomToTop}
                >
                    <Numpad
                        onSuccess={onNumpadSuccess}
                        onCancel={() => setNumpadVisible(false)}
                    />
                </AppearTransition>
            </div>
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
