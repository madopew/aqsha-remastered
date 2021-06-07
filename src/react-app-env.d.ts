/// <reference types="react-scripts" />
declare module "react-uuid" {
    export default function uuid(): string;
}

declare module "react-number-easing" {
    interface NumberEasingProps {
        value: number;
        speed?: number;
        decimals?: number;
        ease?: string;
    }

    export default function NumberEasing(props: NumberEasingProps): JSX.Element;
}