import { VAnimationCurve, VAnimationWrapMode } from "./AnimationCurve";



export class VAnimationInstance {
    //container: PIXI.Container;
    key: string;
    curve: VAnimationCurve;
    setter: (v: number) => void;
    time: number;
    //timeOffset: number;
    _then: (() => void) | undefined;

    constructor(/*container: PIXI.Container,*/ key: string, curve: VAnimationCurve, setter: (v: number) => void) {
        //this.container = container;
        this.key = key;
        this.curve = curve;
        this.setter = setter;
        this.time = 0;
        //this.timeOffset = 0;
    }

    public update(elapsedTime: number): void {
        const oldFinished = this.isFinished();
        this.time += elapsedTime;
        const value = this.curve.evaluate(/*this.timeOffset + */this.time);
        this.setter(value);

        if (this._then) {
            const afterFinished = this.isFinished();
            if (afterFinished && oldFinished != afterFinished) {
                this._then();
            }
        }
    }

    public isFinished(): boolean {
        if (this.curve.wrapMode() == VAnimationWrapMode.Once) {
            return this.time >= this.curve.lastFrameTime();
        }
        else {
            return false;
        }
    }

    public then(func: () => void): void {
        this._then = func;
    }
}
