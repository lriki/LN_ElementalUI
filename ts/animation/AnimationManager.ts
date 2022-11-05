import { assert } from "ts/core/Common";
import { DAnimationCurve, DEasingAnimationCurve } from "./AnimationCurve";
import { VAnimationInstance } from "./AnimationInstance";
import { TEasing } from "./Easing";

export class VAnimation {
    //private static _animations: VAnimationInstance[] = [];
    private static _containers: PIXI.Container[] = []; 

    public static start(container: PIXI.Container, key: string, curve: DAnimationCurve, setter: (v: number) => void, timeOffset: number = 0.0): VAnimationInstance {
        const instance = new VAnimationInstance(/*container,*/ key, curve, setter);
        //instance.timeOffset = timeOffset;
        instance.time += timeOffset;
        this.add(container, key, instance);
        return instance;
    }

    /**
     * start に対してこちらは現在値を始点とした相対的なアニメーションを表現するのに使用する。
     */
    public static startAt(container: PIXI.Container, key: string, start: number, target: number, duration: number, curve: TEasing, setter: (v: number) => void, timeOffset: number = 0.0): VAnimationInstance {
        const instance = new VAnimationInstance(/*container,*/ key, new DEasingAnimationCurve(start, target, duration, curve), setter);
        //instance.timeOffset = timeOffset;
        instance.time += timeOffset;
        this.add(container, key, instance);
        return instance;
    }

    public static add(container_: PIXI.Container, key: string, instance: VAnimationInstance): void {
        const container = container_ as any;
        if (!container._animations_RE) {
            container._animations_RE = [];
        }
        const animations = container._animations_RE;
        assert(animations);

        // 同一 key があればそこへ上書き設定
        for (let i = 0; i < animations.length; i++) {
            if (animations[i].key == key) {
                animations[i] = instance;
                return;
            }
        }
        
        // 無ければ新しく追加
        animations.push(instance);
        
        if (!this._containers.includes(container)) {
            this._containers.push(container);
        }
    }

    public static stop(container_: PIXI.Container, key: string): void {
        const container = container_ as any;
        if (container._animations_RE) {
            const animations = container._animations_RE;
            for (let i = animations.length - 1; i >= 0; i--) {
                if (animations[i].key == key) {
                    animations.splice(i, 1);
                }
            }
        }
    }

    public static stopAll(container_: PIXI.Container): void {
        const container = container_ as any;
        if (container._animations_RE) {
            container._animations_RE = [];

            // mutableRemoveAll
            {
                for (let i = this.length - 1; i >= 0; i--) {
                    if (this._containers[i] == container) {
                        this._containers.splice(i, 1);
                    }
                }
            }
        }
    }

    public static update(): void {
        const elapsedTime = 0.016;

        for (const container of this._containers) {
            const animations = (container as any)._animations_RE;
            if (animations) {
                for (const instance of animations) {
                    instance.update(elapsedTime);
                }
            }
        }

        this.refresh();
    }

    private static refresh(): void {
        for (let i = this._containers.length - 1; i >= 0; i--) {
            // この container のアニメーションはすべて終了している？
            let allFin = true;
            const animations = (this._containers[i] as any)._animations_RE;
            if (animations) {
                // for (const instance of animations) {
                //     if (!instance.isFinished()) {
                //         allFin = false;
                //         break;
                //     }
                // }
                for (let iInst = animations.length - 1; iInst >= 0; iInst--) {
                    if (animations[iInst].isFinished()) {
                        animations.splice(iInst, 1);
                    }
                    else {
                        allFin = false;
                    }
                }
                
            }

            // 更新対象から取り除く
            if (allFin) {
                this._containers.splice(i, 1);
            }
        }
    }
}


// declare namespace PIXI { 
//     interface Container {
//         _animations_RE: (VAnimationInstance[] | undefined);
//     }
// }



// declare global {
//     interface Window {
//         _animationClocks_RE: (VAnimationInstance[] | undefined);
//     }
// }
