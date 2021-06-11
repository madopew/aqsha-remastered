import { DialogOptions } from "../components/Dialog/Dialog";

export enum DialogActionType {
    openChoose,
    openInfo,
    hide,
}

type DialogInfo = { title: string; text: string | null };

type DialogState = { visible: boolean; options: DialogOptions };

type DialogAction =
    | {
          type: DialogActionType.openChoose;
          payload: number;
          info: DialogInfo;
          add: (val: number) => void;
          update: (val: number) => void;
          close: () => void;
      }
    | { type: DialogActionType.openInfo; info: DialogInfo; close: () => void }
    | { type: DialogActionType.hide };

export default function dialogReducer(
    prevState: DialogState,
    action: DialogAction
): DialogState {
    switch (action.type) {
        case DialogActionType.openChoose:
            return {
                visible: true,
                options: {
                    title: action.info.title,
                    text: action.info.text,
                    firstButtonText: "Add",
                    secondButtonText: "Update",
                    showCancelButton: true,
                    onFirst: () => {
                        action.add(action.payload);
                        action.close();
                    },
                    onSecond: () => {
                        action.update(action.payload);
                        action.close();
                    },
                    onCancel: () => action.close(),
                },
            };
        case DialogActionType.openInfo:
            return {
                visible: true,
                options: {
                    title: action.info.title,
                    text: action.info.text,
                    firstButtonText: null,
                    secondButtonText: null,
                    showCancelButton: true,
                    onFirst: null,
                    onSecond: null,
                    onCancel: () => action.close(),
                },
            };
        case DialogActionType.hide:
            return { ...prevState, visible: false };
    }
}
