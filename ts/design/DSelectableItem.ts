import { DElement, DElementProps } from "./DElement";

export interface DSelectableItemProps extends DElementProps {
}

/**
 */
export class DSelectableItem extends DElement {
    public readonly props: DSelectableItemProps;

    constructor(props: DSelectableItemProps) {
        super(props);
        this.props = props;
    }

    override clone(): DElement {
        return new DSelectableItem({...this.props});
    }
}
