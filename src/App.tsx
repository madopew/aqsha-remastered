import { useReducer } from "react";
import "./App.css";
import AppearTransition, {
    TransitionType,
} from "./components/AppearTransition/AppearTransition";
import Balance from "./components/Balance/Balance";
import Dialog, { DIALOG_OPTIONS_INIT } from "./components/Dialog/Dialog";
import Numpad from "./components/Numpad/Numpad";
import useKeeper from "./hooks/KeeperHook";
import dialogReducer, { DialogActionType } from "./reducers/DialogReducer";
import numpadReducer, {
    NumpadActionType,
    NumpadOperationType,
} from "./reducers/NumpadReducer";

function App() {
    const MAX_HISTORY = 10;
    const [total, updateTotal, today, add, withdraw, history, undo] =
        useKeeper(MAX_HISTORY);

    const [numpadState, numpadDispatch] = useReducer(numpadReducer, {
        visible: false,
        operation: NumpadOperationType.none,
    });

    const [dialogState, dialogDispatch] = useReducer(dialogReducer, {
        visible: false,
        options: DIALOG_OPTIONS_INIT,
    });

    const onAdd = () => {
        numpadDispatch({
            type: NumpadActionType.open,
            payload: NumpadOperationType.unknown,
        });
    };

    const onWithdraw = () => {
        numpadDispatch({
            type: NumpadActionType.open,
            payload: NumpadOperationType.withdraw,
        });
    };

    const onNumpadSuccess = (val: number) => {
        numpadDispatch({
            type: NumpadActionType.close,
            payload: val,
            withdraw,
            onChoose: (val) =>
                dialogDispatch({
                    type: DialogActionType.openChoose,
                    payload: val,
                    info: {
                        title: "Balance added.",
                        text: "Do you want to add extra income or update monthy budget?",
                    },
                    add: add,
                    update: updateTotal,
                    close: () =>
                        dialogDispatch({ type: DialogActionType.hide }),
                }),
            onError: () =>
                dialogDispatch({
                    type: DialogActionType.openInfo,
                    info: {
                        title: "You don't have enough balance.",
                        text: null,
                    },
                    close: () =>
                        dialogDispatch({ type: DialogActionType.hide }),
                }),
        });
    };

    return (
        <div className="root-main">
            <div className="root-top">
                <AppearTransition
                    visible={numpadState.visible}
                    effect={TransitionType.bottomToTop}
                >
                    <Numpad
                        onSuccess={onNumpadSuccess}
                        onCancel={() =>
                            numpadDispatch({ type: NumpadActionType.hide })
                        }
                    />
                </AppearTransition>
            </div>
            <div className="root-top">
                <AppearTransition
                    visible={dialogState.visible}
                    effect={TransitionType.fadeIn}
                >
                    <Dialog options={dialogState.options} />
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
