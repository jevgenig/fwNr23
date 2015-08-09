import Application from "core/Application";
import DOM from "core/DOM";

import ButtonView from "ButtonView";

export default class App extends Application {
    constructor(options) {
        super(...arguments);

        this.buttonView = new ButtonView({
            title: "Early init"
        });
    }

    attachTo(el) {
        super.attachTo(el);
        DOM.renderView("earlyInit", this.buttonView);
        DOM.renderView("lateInit", ButtonView, {
            title: "Late init"
        });
    }

    static template() {
        var section = function (name) {
            return {"body": "", "data-placeholder": name};
        };
        return {
            "div": {
                "div": "I am the " + this.name,
                "earlyInit#div": section("earlyInit"),
                "lateInit#div": section("lateInit")
            }
        }

    }

    static css() {
        return {
            "body > div": {
                "position": "absolute",
                "color": "#778833",
                "left":"800px"
            }
        };
    }
}