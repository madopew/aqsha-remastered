import { useState } from "react";
import "./App.css";
import AppearTransition, {
    TransitionType,
} from "./components/AppearTransition/AppearTransition";
import Balance from "./components/Balance/Balance";
import Numpad from "./components/Numpad/Numpad";
import useKeeper from "./hooks/KeeperHook";

enum NumpadActionType {
    update,
    add,
    withdraw,
    unknown,
    none,
}

function App() {
    const MAX_HISTORY = 10;
    const [total, updateTotal, today, add, withdraw, history, undo] =
        useKeeper(MAX_HISTORY);

    const [numpadVisible, setNumpadVisible] = useState(false);
    const [numpadAction, setNumpadAction] = useState(NumpadActionType.none);

    const onAdd = () => {
        // TODO: change to unknown
        setNumpadAction(NumpadActionType.add);
        setNumpadVisible(true);
    };

    const onWithdraw = () => {
        setNumpadAction(NumpadActionType.withdraw);
        setNumpadVisible(true);
    };

    const dispatchNumpadAction = (val: number) => {
        switch (numpadAction) {
            case NumpadActionType.update:
                updateTotal(val);
                break;
            case NumpadActionType.add:
                add(val);
                break;
            case NumpadActionType.withdraw:
                withdraw(val);
                // TODO: show error message
                break;
            case NumpadActionType.none:
                break;
            default:
                throw Error("Something wrong with numpad action!");
        }
    };

    const onNumpadSuccess = (val: number) => {
        setNumpadVisible(false);
        if (numpadAction === NumpadActionType.unknown) {
            // TODO: ask for action type
        }

        dispatchNumpadAction(val);
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
