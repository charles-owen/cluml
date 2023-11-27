import {Component} from "../../src/Cluml/Component";
import {Diagram} from "../../src/Cluml/Diagram";

describe('Component', function() {
    it('Constructor', function() {
        let c = new Component();
        c.naming = 'U1';
        expect(c.naming).toBe('U1');
    });
    it('Should save and load', function() {
        let c = new Component();
        c.naming = 'component';

        let obj = c.saveComponent();
        c.loadComponent(obj);
        expect(c.naming).toEqual("component");
    });
    it('Should be added to a diagram', function() {
       let c = new Component();
       let d = new Diagram("diagram");
       d.add(c);
       expect(c.diagram).toBe(d);
    });
});
