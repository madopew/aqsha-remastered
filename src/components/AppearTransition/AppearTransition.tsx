import { CSSTransition } from "react-transition-group";

export enum TransitionType {
    bottomToTop,
    fadeIn,
}

interface TransitionProps {
    children: JSX.Element;
    visible: boolean;
    effect: TransitionType;
}

export default function AppearTransition({
    children,
    visible,
    effect,
}: TransitionProps) {
    return (
        <CSSTransition
            in={visible}
            timeout={0}
            classNames={"appear-transition-" + TransitionType[effect]}
            unmountOnExit
        >
            {children}
        </CSSTransition>
    );
}
