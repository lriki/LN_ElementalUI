import { VAnimation } from "./AnimationManager";

const _PIXI_Container_prototype_destroy = PIXI.Container.prototype.destroy;
PIXI.Container.prototype.destroy = function(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
}) {
    VAnimation.stopAll(this);
    _PIXI_Container_prototype_destroy.call(this, options);
};
