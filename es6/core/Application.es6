import View from "core/View";
import DOM from "core/DOM";


export default class Application extends View {
    constructor(options = {}) {
        super(...arguments);
    }

    renderTo(el) {
        let targetElement = document.createElement("div");
        targetElement.setAttribute("data-placeholder", this.name);
        el.appendChild(targetElement);
        DOM.renderView(this.name, this);
    }
}