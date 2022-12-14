import { assert } from "ts/core/Common";
import { TEasing } from "./Easing";

/** アニメーションの繰り返し方法 */
export enum DAnimationWrapMode {
    /** 繰り返しを行わず、1度だけ再生します。 */
    Once,

    /** 最後まで再生された後、先頭に戻ってループします。 */
    Loop,

    /** 最後まで再生された後、逆方向に戻ってループします。 */
    Alternate,
}

export class DAnimationCurve {
    private _wrapMode: DAnimationWrapMode;

    public constructor() {
        this._wrapMode = DAnimationWrapMode.Once;
    }

	/** 指定した時間における値を評価します。*/
	public evaluate(time: number): number {
        return this.onEvaluate(this.calculateLocalTime(time, this.lastFrameTime(), this._wrapMode));
    }

	/** アニメーションの終端の時間を取得します。 */
	public lastFrameTime(): number {
        return this.onGetLastFrameTime();
    }

	/** アニメーションの繰り返しの動作を取得します。 */
	public wrapMode(): DAnimationWrapMode {
        return this._wrapMode;
    }

	/** アニメーションの繰り返しの動作を設定します。(default: Once) */
	public setWrapMode(mode: DAnimationWrapMode) {
        this._wrapMode = mode;
    }
    
	protected onEvaluate(time: number): number {
        return 0;
    }

	protected onGetLastFrameTime(): number {
        return 0;
    }
     
	private calculateLocalTime(time: number, duration: number, wrapMode: DAnimationWrapMode): number {
        let localTime = 0.0;
        switch (wrapMode) {
        case DAnimationWrapMode.Once:
            localTime = Math.min(time, duration);
            break;
        case DAnimationWrapMode.Loop:
            localTime = time % duration;
            break;
        case DAnimationWrapMode.Alternate:
        {
            const freq = duration * 2;
            const t = (time % freq);
            const phase = t / freq;
            if (phase <= 0.5) {
                localTime = t;
            }
            else {
                localTime = freq - t;
            }
            break;
        }
        default:
            throw new Error("Unreachable.");
        }
        return localTime;
    }
}

export class DEasingAnimationCurve extends DAnimationCurve {
	_startValue: number;
	_targetValue: number;
	_duration: number;
	_func: TEasing;

    public constructor(startValue: number, targetValue: number, duration: number, func: TEasing) {
        super();
        this._startValue = startValue;
        this._targetValue = targetValue;
        this._duration = duration;
        this._func = func;
    }

	protected onEvaluate(time: number): number {
        const t = this._func(time / this._duration);
        return (this._targetValue - this._startValue) * t + this._startValue;
    }

	protected onGetLastFrameTime(): number {
        return this._duration;
    }
}

export enum DKeyFrameTangentMode {
	/** 線形補間 */
	Linear,

	/** 接線 (速度) を使用した補間 (エルミートスプライン) */
	Tangent,

	/** キーフレームの値を通過するなめらかな補間 (Catmull-Rom) */
	Auto,

	/** 補間なし */
	Constant,
}

export interface DKeyFrame {
	/** 時間 */
	time: number;

	/** 値 */
	value: number;

	/** 前のキーフレームとの補間方法 */
	leftTangentMode: DKeyFrameTangentMode;

	/** 前のキーフレームからこのキーフレームに近づくときの接線 */
	leftTangent: number;

	/** 次のキーフレームとの補間方法 */
	rightTangentMode: DKeyFrameTangentMode;

	/** このキーフレームから次のキーフレームに向かうときの接線 */
	rightTangent: number;
}

export class DKeyFrameAnimationCurve extends DAnimationCurve {
    private _keyFrames: DKeyFrame[];
    private _defaultValue: number;

    public constructor() {
        super();
        this._keyFrames = [];
        this._defaultValue = 0.0;
    }

	public addKeyFrame(keyFrame: DKeyFrame): void {
        // そのまま追加できる
        if (this._keyFrames.length == 0 || this._keyFrames[this._keyFrames.length - 1].time <= keyFrame.time) {
            this._keyFrames.push(keyFrame);
        }
        // 追加後のソートが必要
        else {
            throw new Error("Not implemetend.");
        }
    }

    public addFrame(time: number, value: number, rightTangentMode = DKeyFrameTangentMode.Linear, tangent: number = 0.0): this {

        const k: DKeyFrame  = {
            time: time,
            value: value,
            leftTangentMode: DKeyFrameTangentMode.Constant,
            leftTangent: 0.0,
            rightTangentMode: rightTangentMode,
            rightTangent: tangent,
        };
    
        if (this._keyFrames.length > 0 && this._keyFrames[0].time <= time) {
            const ikey0 = this.findKeyFrameIndex(time);
            assert(ikey0 >= 0);
            const key0 = this._keyFrames[ikey0];
            k.leftTangentMode = key0.rightTangentMode;
            k.leftTangent = -key0.rightTangent;
        }
        else {
            k.leftTangentMode = DKeyFrameTangentMode.Constant;
            k.leftTangent = 0.0;
        }
    
        this.addKeyFrame(k);
        return this;
    }
    

	onEvaluate(time: number): number {
        if (this._keyFrames.length == 0) {
            return this._defaultValue;
        }
        // time が最初のフレーム位置より前の場合は Clamp
        if (time < this._keyFrames[0].time) {
            return this._keyFrames[0].value;
        }
        // キーがひとつだけの場合はそのキーの値
        else if (this._keyFrames.length == 1) {
            return this._keyFrames[0].value;
        }
        // time が終端以降の場合は終端の値
        else if (time >= this._keyFrames[this._keyFrames.length - 1].time) {
            return this._keyFrames[this._keyFrames.length - 1].value;
        }
        // 以上以外の場合は補間する
        else
        {
            const ikey0 = this.findKeyFrameIndex(time);
            const key0 = this._keyFrames[ikey0];
            const key1 = this._keyFrames[ikey0 + 1];
    
            const p0 = key0.value;
            const p1 = key1.value;
            const t0 = (key0.time);
            const t1 = (key1.time);
            const t = (time - t0) / (t1 - t0);
    
            // まず2種類のモードで保管する。最後にそれらを t で線形補間することで、異なる TangentMode を補間する
            const modes = [key0.rightTangentMode, key1.leftTangentMode];
            const values = [0, 0];
            for (let i = 0; i < 2; i++)
            {
                switch (modes[i])
                {
                // 補間無し
                case DKeyFrameTangentMode.Constant:
                {
                    values[i] = p0;
                    break;
                }
                // 線形
                case DKeyFrameTangentMode.Linear:
                {
                    values[i] = p0 + (p1 - p0) * t;
                    break;
                }
                // 三次補間
                case DKeyFrameTangentMode.Tangent:
                {
                    values[i] = this.hermite(
                        p0, key0.rightTangent,
                        p1, key1.leftTangent,
                        t);
                    break;
                }
                // Catmull-Rom
                case DKeyFrameTangentMode.Auto:
                {
                    // ループ再生で time が終端を超えている場合、
                    // この時点でkey の値は ループ開始位置のひとつ前のキーを指している
    
                    const begin = this._keyFrames[0];
                    const end = this._keyFrames[this._keyFrames.length - 1];
    
                    // この補間には、begin のひとつ前と end のひとつ後の値が必要。
                    // それぞれが始点、終点の場合はループするように補間する
                    values[i] = this.catmullRom(
                        ((key0.time == begin.time) ? end.value : this._keyFrames[ikey0 - 1].value),
                        p0,
                        p1,
                        ((key1.time == end.time) ? begin.value : this._keyFrames[ikey0 + 2].value),
                        t);
                    break;
                }
                }
            }
    
            return values[0] + (values[1] - values[0]) * t;
        }
    }

	onGetLastFrameTime(): number {
        if (this._keyFrames.length == 0) return 0.0;
        return this._keyFrames[this._keyFrames.length - 1].time;
    }

    private findKeyFrameIndex(time: number): number {
        // TODO: 二分探索
        for (let i = this._keyFrames.length - 1; i >= 0; i--) {
            if (this._keyFrames[i].time <= time) {
                return i;
            }
        }
        return -1;
    }
    
    private hermite(v1: number, a1: number, v2: number, a2: number, t: number): number {
        const a = 2.0 * (v1 - v2) + (a1 + a2);
        const b = 3.0 * (v2 - v1) - (2.0 * a1) - a2;
        let r = a;
        r *= t;
        r += b;
        r *= t;
        r += a1;
        r *= t;
        return r + v1;
    }

    private catmullRom(v1: number, v2: number, v3: number, v4: number, t: number): number {
        const d1 = (v3 - v1) * 0.5;
        const d2 = (v4 - v2) * 0.5;
        return (2.0 * v2 - 2.0 * v3 + d1 + d2) * t * t * t + (-3.0 * v2 + 3.0 * v3 - 2.0 * d1 - d2) * t * t + d1 * t + v2;
    }

}
