
/**
 * 
 */
export class SceneDesign {
    name: string;
    content: string;
    public revision: number;
    constructor(name: string, content: string) {
        this.name = name;
        this.content = content;
        this.revision = 1;
    }
}
