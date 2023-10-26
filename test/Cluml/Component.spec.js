import {Component} from "../../src/Cluml/Component";

describe('Component', function() {
    it('Constructor', function() {
        let c = new Component();
        c.naming = 'U1';
        expect(c.naming).toBe('U1');
    });
});
