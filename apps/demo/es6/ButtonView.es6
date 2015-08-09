import View from "core/View";

export default class ButtonView extends View {
    constructor(options = {}) {
        super(...arguments);

        this.title = options.title;
        this.times = 0;
    }

    attachTo(el) {
        super.attachTo(el);

        this.titleElement = this.findChildById("title");
        var button = this.findChildById("button");
        button.addEventListener("click", this.onButtonClick.bind(this));
    }

    onButtonClick() {
        this.times++;
        this.render();
    }

    render() {
        this.titleElement.innerText = "My name is" + this.title + " I was clicked: " + this.times + " times";
    }

    static template() {
        return {
            "div": {
                "title#div": "",
                "button#button": {
                    "type": "button",
                    "body": "Click me"
                }
            }
        };
    }
}