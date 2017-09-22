/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.resourceLoader", {
        gradeNames: ["fluid.resourceLoader"],
        terms: {
            "resourcePrefix": "."
        }
    });

    fluid.defaults("sjrk.storyTelling.resourceLoaderForTemplate", {
        gradeNames: ["sjrk.storyTelling.resourceLoader"],
        resources: {
            // Specified by using grade
            // The template file using the
            // fluid.stringTemplate syntax
            // componentTemplate: ""
        }
    });

    fluid.defaults("sjrk.storyTelling.resourceLoaderForLocalization", {
        gradeNames: ["sjrk.storyTelling.resourceLoader"],
        resources: {
            // Specified by using grade
            // The messages file (JSON)
            // componentMessages: ""
        },
        locale: "en",
        defaultLocale: "en"
    });

    sjrk.storyTelling.resourceLoaderForLocalization.loadLocalizationMessages = function (componentMessages, that, modelEndpoint) {
        var messages = JSON.parse(componentMessages);
        that.applier.change(modelEndpoint, messages);
    };

    // Component that renders its UI using an external
    // HTML file with fluid.stringTemplate syntax
    // see concrete components in storyTelling.js for examples

    fluid.defaults("sjrk.storyTelling.templatedComponent", {
        gradeNames: ["fluid.viewComponent"],
        templateConfig: {
            // Used to supply both control and style classes
            // by the getClasses invoker
            classPrefix: "sjrk"
        },
        model: {
            // Specified by using grade
            // These will be passed as the second argument of
            // fluid.stringTemplate when rendering the page
            // template
            templateTerms: {
            }
        },
        events: {
            "onTemplateRendered": null,
            "onAllResourcesLoaded": {
                events: {
                    "onTemplatesLoaded": "{that}.templateLoader.events.onResourcesLoaded"
                }
            }
        },
        listeners: {
            "onAllResourcesLoaded.renderTemplateOnSelf": {
                funcName: "{that}.renderTemplateOnSelf"
            }
        },
        components: {
            templateLoader: {
                type: "sjrk.storyTelling.resourceLoaderForTemplate"
            }
        },
        invokers: {
            // Invoker used to create a control and style class for
            // insertion into the template; configured using the
            // templateConfig.classPrefix option
            getClasses: {
                funcName: "sjrk.storyTelling.templatedComponent.getClasses",
                args: ["{that}.options.templateConfig.classPrefix", "{arguments}.0"]
            },
            getLabelId: {
                funcName: "sjrk.storyTelling.templatedComponent.getLabelId",
                args: ["{arguments}.0"]
            },
            // Invoker used to render the component's template and fire
            // the onTemplateRendered event that the applyBinding's listener
            // waits on
            renderTemplateOnSelf: {
                funcName: "sjrk.storyTelling.templatedComponent.renderTemplate",
                args: ["{that}.events.onTemplateRendered", "{that}.container", "{templateLoader}.resources.componentTemplate.resourceText", "{that}.model.templateTerms"]
            }
        }
    });

    /* Returns a control and style class based on a prefix and classname
     * Used for templating
     * - "prefix": typically the first piece of the project namespace ("sjrk")
     * - "className": classname to follow after the prefixes
    */
    sjrk.storyTelling.templatedComponent.getClasses = function (prefix, className) {
        return prefix + "c-" + className + " " + prefix + "-" + className;
    };

    /* Generates a unique ID (GUID) for use in labeling form
     * elements in the component template
     * - "prefix": prefix to prepend before the GUID
    */
    sjrk.storyTelling.templatedComponent.getLabelId = function (prefix) {
        return prefix + "-" + fluid.allocateGuid();
    };

    /* Renders a template with fluid.stringTemplate into the
     * specified container, and fires completionEvent when done
     * - "completionEvent": component even to fire when complete
     * - "container": container to render the template into
     * - "template": a template string in the fluid.stringTemplate style
     * - "terms": terms to use in fluid.stringTemplate
    */
    sjrk.storyTelling.templatedComponent.renderTemplate = function (completionEvent, container, template, terms) {
        var renderedTemplate = fluid.stringTemplate(template, terms);
        container.html(renderedTemplate);
        completionEvent.fire();
    };


    // Adds gpii-binder to bind form components and models
    fluid.defaults("sjrk.storyTelling.templatedComponentWithBinder", {
        gradeNames: ["gpii.binder", "sjrk.storyTelling.templatedComponent"],
        // Specified by using grade to bind form markup
        // to component model;
        // see https://github.com/GPII/gpii-binder
        bindings: {
        },
        events: {
            "onBindingApplied": null
        },
        // Applies bindings from gpii-binder after
        // the template is loaded
        listeners: {
            "onTemplateRendered.applyBinding": {
                funcName: "gpii.binder.applyBinding",
                args: "{that}"
            },
            "onTemplateRendered.fireOnBindingApplied": {
                func: "{that}.events.onBindingApplied.fire",
                priority: "after:applyBinding"
            }
        }
    });

    // TODO: refer to Tony's work for further implementation
    // https://wiki.gpii.net/w/Technology_Evaluation_-_Internationalising_and_Localising_UI_strings#Detailed_Review
    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalization", {
        gradeNames: ["sjrk.storyTelling.templatedComponent"],
        events: {
            "onAllResourcesLoaded": {
                events: {
                    "onMessagesLoaded": "{that}.messageLoader.events.onResourcesLoaded"
                }
            }
        },
        listeners: {
            "{messageLoader}.events.onResourcesLoaded": {
                "func": "sjrk.storyTelling.resourceLoaderForLocalization.loadLocalizationMessages",
                "args": ["{messageLoader}.resources.componentMessages.resourceText", "{that}", "templateTerms"]
            },
            "onAllResourcesLoaded.log": {
                "this": "console",
                "method": "log",
                "args": ["onAllResourcesLoaded fired", "{that}"]
            }
        },
        components: {
            templateLoader: {
                options: {
                    listeners: {
                        "onResourcesLoaded.log": {
                            "this": "console",
                            "method": "log",
                            "args": ["templateLoader onResourcesLoaded fired", "{templatedComponentWithLocalization}"]
                        }
                    }
                }
            },
            messageLoader: {
                type: "sjrk.storyTelling.resourceLoaderForLocalization",
                options: {
                    listeners: {
                        "onResourcesLoaded.log": {
                            "this": "console",
                            "method": "log",
                            "args": ["messageLoader onResourcesLoaded fired", "{templatedComponentWithLocalization}"]
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
