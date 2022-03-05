import { observable } from "mobx";

export class Theme {
    @observable
    spacing: string;
    constructor() {
        this.spacing = "16px";
    }
}
