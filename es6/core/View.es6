export default class View {
    constructor(options = {}) {
        this.name = options.name;
        this.el = options.el;
    }

    attachTo(el) {
        this.el = el;
    }

    findChildById(id) {
        return this.el.querySelector("[data-id=" + id + "]");
    }

    render() {
    }
}