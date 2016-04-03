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

import {SomeService} from '../some-service'

export function main() {
    var svc: SomeService;

    beforeEachProviders(() => [
        SomeService
    ]);

    beforeEach(inject([SomeService], (_svc) => {
        svc = _svc;
    }));

    describe("Gandalf says you", () => {
        it("shall pass", () => {
            var res = svc.getSomething();
            expect(parseInt(res)).toBe(123);
        });
    });
}
