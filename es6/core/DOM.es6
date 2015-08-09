import _ from "underscore";
import View from "core/View";

export default class DOM {
    static renderView(viewName, viewClass, viewOptions = {}) {
        let placeHolderNode = document.querySelector("[data-placeholder=" + viewName + "]"),
            view = viewClass instanceof View ? viewClass : undefined,
            options = {ids: [viewName]},
            template = (view && view.constructor || viewClass).template,
            templateNode, targetElement;

        if (!(placeHolderNode instanceof HTMLElement)) {
            throw new Error("Placeholder " + viewName + " was not found");
        }
        view = view || new viewClass(viewOptions);
        let templateObject = (typeof template === "function") ? template.apply(view) : (typeof template === "string" ? template : undefined);


        if (templateObject !== undefined) {
            if (_.size(templateObject) > 1) {
                throw new Error("Single node expected for " + viewName + "'s template");
            }
            templateNode = DOM._createElement(options, undefined, templateObject, placeHolderNode.attributes);
            templateNode.firstChild.setAttribute("data-placeholder-for", viewName);
            placeHolderNode.parentNode.replaceChild(templateNode.firstChild, placeHolderNode);
            targetElement = document.querySelector("[data-placeholder-for=" + viewName + "]");
        } else {
            targetElement = placeHolderNode;
        }
        view.attachTo(targetElement, options);
        view.render();
        return view;
    }

    static _createElement(options, tagIdOrNameOrClass, tagBodyOrAttrs, attrs) {
        var self = this,
            rootNode = tagIdOrNameOrClass === undefined,
            tagIdNameClass = (rootNode ? "div" : tagIdOrNameOrClass).split("."),
            tagIdOrName = tagIdNameClass.shift(),
            tagIdName = tagIdOrName.split("#"),
            tagName = tagIdName.pop(),
            tagId = tagIdName.pop() || undefined,
            tagBody = tagBodyOrAttrs.body !== undefined ? tagBodyOrAttrs.body : tagBodyOrAttrs,
            classList = _.union(tagIdNameClass, (_.isArray(tagBody.class) && tagBody.class) || (_.isString(tagBody.class) && [tagBody.class]) || []),
            tagAttrs = tagBodyOrAttrs.body !== undefined ? _.omit(tagBodyOrAttrs, ["body", "class"]) : {},
            element = document.createElement(tagName);
        if (attrs) {
            _.each(attrs.class && attrs.class.value && attrs.class.value.split(/\s+?/), function (proxiedClass) {
                if (proxiedClass) {
                    classList.push(proxiedClass);
                }
            });

            _.each(attrs, function (attr) {
                if (_.contains(["data-placeholder", "class", attr.name])) {
                    tagAttrs[attr.name] = tagAttrs[attr.name] || attr.value;
                }
            });
        }
        if (tagId) {
            var idsPath = options.ids.slice();
            idsPath.push(tagId);
            element.setAttribute("data-id", tagId);
            element.setAttribute("data-ref", idsPath.join("."));
        }
        _.each(classList, function (className) {
            element.classList.add(className);
        });
        _.each(tagAttrs, function (v, k) {
            element.setAttribute(k, v);
        });
        if (typeof tagBody === "function") {
            tagBody = tagBody.apply(this);
        }

        if (typeof tagBody === "string") {
            element.innerHTML = tagBody;
        } else {
            if (tagId) {
                options.ids.push(tagId);
            }
            _.each(tagBody, function (v, k) {
                element.appendChild(self._createElement(options, k, v, rootNode && attrs));
            });
            if (tagId) {
                options.ids.pop();
            }
        }
        return element;
    }

}