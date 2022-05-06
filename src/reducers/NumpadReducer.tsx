export enum NumpadActionType {
    open,
    close,
    hide,
}

export enum NumpadOperationType {
    withdraw,
    unknown,
    none,
}

type NumpadState = { visible: boolean; operation: NumpadOperationType };

type NumpadAction =
    | { type: NumpadActionType.open; payload: NumpadOperationType }
    | {
          type: NumpadActionType.close;
          payload: number;
          withdraw: (val: number) => boolean;
          onChoose: (val: number) => void;
          onError: () => void;
      }
    | { type: NumpadActionType.hide };

export default function numpadReducer(
    prevState: NumpadState,
    action: NumpadAction
): NumpadState {
    switch (action.type) {
        case NumpadActionType.open:
            return { visible: true, operation: action.payload };
        case NumpadActionType.close:
            switch (prevState.operation) {
                case NumpadOperationType.unknown:
                    action.onChoose(action.payload);
                    break;
                case NumpadOperationType.withdraw:
                    let res = action.withdraw(action.payload);
                    if (!res) action.onError();
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
}
