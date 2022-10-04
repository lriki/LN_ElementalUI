
export interface DTransitionProps {
    property?: string;
    duration?: number;
    delay?: number;
    easing?: string;
}

/**
 * 指定プロパティの変更に応じてアニメーションを起動する。
 * CSS の transition に似ている。
 * Style とは独立したもので、プロパティに付属する情報である。
 */
export class DTransition {
    public readonly props: DTransitionProps;
    constructor(props: DTransitionProps) {
        this.props = props;
    }

    public get property(): string {
        return this.props.property ?? "";
    }

    public get duration(): number {
        return this.props.duration ?? 0;
    }

    public get delay(): number {
        return this.props.delay ?? 0;
    }
}

