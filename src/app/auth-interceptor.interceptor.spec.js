"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var auth_interceptor_interceptor_1 = require("./auth-interceptor.interceptor");
describe('AuthInterceptorInterceptor', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({
        providers: [
            auth_interceptor_interceptor_1.AuthInterceptorInterceptor
        ]
    }); });
    it('should be created', function () {
        var interceptor = testing_1.TestBed.inject(auth_interceptor_interceptor_1.AuthInterceptorInterceptor);
        expect(interceptor).toBeTruthy();
    });
});
//# sourceMappingURL=auth-interceptor.interceptor.spec.js.map