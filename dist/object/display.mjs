
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { Point } from '../position/point.mjs';
import '../common/event.mjs';

class Display {
    _angle = 1;
    _shouldUpdate = false;
    get angle() {
        return this._angle;
    }
    position;
    constructor() {
        this.position = new Point([-Infinity, -Infinity]);
        this.position.on('shouldUpdate', () => {
            this._shouldUpdate = true;
        });
    }
    set angle(value) {
        this._angle = value;
    }
    skew = new Point([0, 0]);
    anchor = new Point([0, 0]);
    scale = new Point([1, 1]);
    onAdd() {
        this._shouldUpdate = true;
    }
    onRemove() {
        this._shouldUpdate = true;
    }
    render(ctx) {
        this._render(ctx);
    }
}

export { Display };
//# sourceMappingURL=display.mjs.map
