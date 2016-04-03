import {
    TestComponentBuilder,
    beforeEach,
    describe,
    expect,
    inject,
    fakeAsync, tick,
    injectAsync,
    ComponentFixture,
    beforeEachProviders,
    it
} from 'angular2/testing';
import {Component, Injectable, provide} from "angular2/core";

import {WijmoService} from '../wijmo-service'

export function main() {
    var svc: WijmoService;

    beforeEachProviders(() => [
        WijmoService
    ]);

    beforeEach(inject([WijmoService], (_svc) => {
        svc = _svc;
    }));

    describe("Gandalf says you", () => {
        it("shall pass", () => {
            var res = svc.getSomething();
            expect(parseInt(res)).toBe(123);
        });
    });
}
