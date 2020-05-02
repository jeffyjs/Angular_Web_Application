"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var _ = require("./lodash");
exports.RESTANGULAR = new core_1.InjectionToken('restangularWithConfig');
function RestangularFactory(config) {
    var configObj = {
        fn: config[0],
        arrServices: [],
    };
    if (_.isArray(config[0])) {
        configObj = {
            arrServices: config[0],
            fn: config[1]
        };
    }
    return configObj;
}
exports.RestangularFactory = RestangularFactory;
//# sourceMappingURL=ngx-restangular.config.js.map