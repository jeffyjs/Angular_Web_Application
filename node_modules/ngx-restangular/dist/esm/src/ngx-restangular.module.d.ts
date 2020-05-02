import { ModuleWithProviders, InjectionToken } from '@angular/core';
export declare const CONFIG_OBJ: InjectionToken<string>;
export declare class RestangularModule {
    constructor(parentModule: RestangularModule);
    static forRoot(config1?: any, config2?: any): ModuleWithProviders;
}
