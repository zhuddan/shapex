
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { _ as __decorate } from '../tslib.es6-Dn8e3nS6.js';
import { interceptDirty } from '../common/intercept.mjs';
import { Point } from '../position/point.mjs';
import '../position/coordinate.mjs';

class Display {
    constructor() {
    }
    _dirty = true;
    set dirty(value) {
        if (this._dirty !== value) {
            this._dirty = value;
        }
    }
    get dirty() {
        return this._dirty;
    }
    _visible = true;
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
    }
    _angle = 0;
    get angle() {
        return this._angle;
    }
    set angle(value) {
        this._angle = value;
    }
    get x() {
        return this.position.x;
    }
    set x(val) {
        this.position.x = val;
    }
    get y() {
        return this.position.y;
    }
    set y(val) {
        this.position.y = val;
    }
    position = new Point([-Infinity, -Infinity], this);
    skew = new Point([0, 0], this);
    anchor = new Point([0, 0], this);
    scale = new Point([1, 1], this);
    render(ctx) {
        this._render(ctx);
    }
    onAdd() { }
    onRemove() { }
}
__decorate([
    interceptDirty()
], Display.prototype, "visible", null);

export { Display };
