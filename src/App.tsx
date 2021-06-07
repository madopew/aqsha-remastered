import { useReducer, useState } from "react";
import "./App.css";
import AppearTransition, {
    TransitionType,
} from "./components/AppearTransition/AppearTransition";
import Balance from "./components/Balance/Balance";
import Dialog, { DialogOptions } from "./components/Dialog/Dialog";
import Numpad from "./components/Numpad/Numpad";
import useKeeper from "./hooks/KeeperHook";

function App() {
    const MAX_HISTORY = 10;
    const [total, updateTotal, today, add, withdraw, history, undo] =
        useKeeper(MAX_HISTORY);

    enum NumpadActionType {
        open,
        close,
        hide,
    }
    enum NumpadOperationType {
        withdraw,
        unknown,
        none,
    }
    type NumpadState = { visible: boolean; operation: NumpadOperationType };
    type NumpadAction =
        | { type: NumpadActionType.open; payload: NumpadOperationType }
        | { type: NumpadActionType.close; payload: number }
        | { type: NumpadActionType.hide };
    const numpadReducer = (
        prevState: NumpadState,
        action: NumpadAction
    ): NumpadState => {
        switch (action.type) {
            case NumpadActionType.open:
                return { visible: true, operation: action.payload };
            case NumpadActionType.close:
                switch (prevState.operation) {
                    case NumpadOperationType.unknown:
                        // TODO: show dialog
                        break;
                    case NumpadOperationType.withdraw:
                        withdraw(action.payload);
                        break;
                    default:
                        throw Error(
                            "Invalid numpad close " +
                                NumpadOperationType[prevState.operation]
                        );
                }
                return { visible: false, operation: NumpadOperationType.none };
            case NumpadActionType.hide:
                return { visible: false, operation: NumpadOperationType.none };
        }
    };
    const [numpadState, numpadDispatch] = useReducer(numpadReducer, {
        visible: false,
        operation: NumpadOperationType.none,
    });

    const DIALOG_OPTIONS_INIT: DialogOptions = {
        title: "Title",
        text: "Text",
        firstButtonText: "First",
        secondButtonText: "Second",
        showCancelButton: true,
        onFirst: null,
        onSecond: null,
        onCancel: () => setDialogVisible(false),
    };

    const DIALOG_OPTIONS_ADD: DialogOptions = {
        title: "Balance updated.",
        text: "Do you want to add extra income or update monthly balance?",
        firstButtonText: "Add",
        secondButtonText: "Update",
        showCancelButton: true,
        onFirst: null,
        onSecond: null,
        onCancel: () => setDialogVisible(false),
    };

    const DIALOG_OPTIONS_NOT_ENOUGH: DialogOptions = {
        title: "You don't have enough money.",
        text: null,
        firstButtonText: "Close",
        secondButtonText: null,
        showCancelButton: false,
        onFirst: () => setDialogVisible(false),
        onSecond: null,
        onCancel: () => setDialogVisible(false),
    };

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogOptions, setDialogOptions] =
        useState<DialogOptions>(DIALOG_OPTIONS_INIT);

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
                    visible={dialogVisible}
                    effect={TransitionType.fadeIn}
                >
                    <Dialog options={dialogOptions} />
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
