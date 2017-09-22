/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("srjk.storyTelling.story.categories", {
        gradeNames: ["fluid.component"],
        categories: {
            childhood: "%category_childhood",
            immigration: "%category_immigration",
            education: "%category_education"
        },
        components: {
            // should we have this? it'll likely duplicate a lot of what's in templatedComponent
            // should it extend templatedComponent? hmm..
            // resourceLoader: {
            //     type: "fluid.resourceLoader",
            //     options: {
            //         resources: {
            //             // Specified by using grade
            //             // The messages file (JSON)
            //             // componentMessages: ""
            //         },
            //         locale: "en",
            //         defaultLocale: "en"
            //     }
            // }
        }
    });

})(jQuery, fluid);
