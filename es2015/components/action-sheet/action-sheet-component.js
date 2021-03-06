import { Component, ElementRef, HostListener, Renderer, ViewEncapsulation } from '@angular/core';
import { BLOCK_ALL, GestureController } from '../../gestures/gesture-controller';
import { Config } from '../../config/config';
import { KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class ActionSheetCmp {
    /**
     * @param {?} _viewCtrl
     * @param {?} config
     * @param {?} _elementRef
     * @param {?} gestureCtrl
     * @param {?} params
     * @param {?} renderer
     */
    constructor(_viewCtrl, config, _elementRef, gestureCtrl, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._elementRef = _elementRef;
        this.gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
        this.d = params.data;
        this.mode = config.get('mode');
        renderer.setElementClass(_elementRef.nativeElement, `action-sheet-${this.mode}`, true);
        if (this.d.cssClass) {
            this.d.cssClass.split(' ').forEach(cssClass => {
                // Make sure the class isn't whitespace, otherwise it throws exceptions
                if (cssClass.trim() !== '')
                    renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
            });
        }
        this.id = (++actionSheetIds);
        if (this.d.title) {
            this.hdrId = 'acst-hdr-' + this.id;
        }
        if (this.d.subTitle) {
            this.descId = 'acst-subhdr-' + this.id;
        }
    }
    /**
     * @return {?}
     */
    ionViewDidLoad() {
        // normalize the data
        this.d.buttons = this.d.buttons.map(button => {
            if (typeof button === 'string') {
                button = { text: button };
            }
            if (!button.cssClass) {
                button.cssClass = '';
            }
            switch (button.role) {
                case 'cancel':
                    this.cancelButton = button;
                    return null;
                case 'destructive':
                    button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-destructive';
                    break;
                case 'selected':
                    button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-selected';
                    break;
            }
            return button;
        }).filter(button => button !== null);
    }
    /**
     * @return {?}
     */
    ionViewWillEnter() {
        this.gestureBlocker.block();
    }
    /**
     * @return {?}
     */
    ionViewDidLeave() {
        this.gestureBlocker.unblock();
    }
    /**
     * @return {?}
     */
    ionViewDidEnter() {
        const /** @type {?} */ focusableEle = this._elementRef.nativeElement.querySelector('button');
        if (focusableEle) {
            focusableEle.focus();
        }
        this.enabled = true;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    keyUp(ev) {
        if (this.enabled && ev.keyCode === KEY_ESCAPE && this._viewCtrl.isLast()) {
            (void 0) /* console.debug */;
            this.bdClick();
        }
    }
    /**
     * @param {?} button
     * @return {?}
     */
    click(button) {
        if (!this.enabled) {
            return;
        }
        let /** @type {?} */ shouldDismiss = true;
        if (button.handler) {
            // a handler has been provided, execute it
            if (button.handler() === false) {
                // if the return value of the handler is false then do not dismiss
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            this.dismiss(button.role);
        }
    }
    /**
     * @return {?}
     */
    bdClick() {
        if (this.enabled && this.d.enableBackdropDismiss) {
            if (this.cancelButton) {
                this.click(this.cancelButton);
            }
            else {
                this.dismiss('backdrop');
            }
        }
    }
    /**
     * @param {?} role
     * @return {?}
     */
    dismiss(role) {
        const /** @type {?} */ opts = {
            minClickBlockDuration: 400
        };
        return this._viewCtrl.dismiss(null, role, opts);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        (void 0) /* assert */;
        this.d = this.cancelButton = null;
        this.gestureBlocker.destroy();
    }
}
ActionSheetCmp.decorators = [
    { type: Component, args: [{
                selector: 'ion-action-sheet',
                template: '<ion-backdrop (click)="bdClick()" [class.backdrop-no-tappable]="!d.enableBackdropDismiss"></ion-backdrop>' +
                    '<div class="action-sheet-wrapper">' +
                    '<div class="action-sheet-container">' +
                    '<div class="action-sheet-group">' +
                    '<div class="action-sheet-title" id="{{hdrId}}" *ngIf="d.title">{{d.title}}</div>' +
                    '<div class="action-sheet-sub-title" id="{{descId}}" *ngIf="d.subTitle">{{d.subTitle}}</div>' +
                    '<button ion-button="action-sheet-button" (click)="click(b)" *ngFor="let b of d.buttons" class="disable-hover" [attr.icon-start]="b.icon ? \'\' : null" [ngClass]="b.cssClass">' +
                    '<ion-icon [name]="b.icon" *ngIf="b.icon" class="action-sheet-icon"></ion-icon>' +
                    '{{b.text}}' +
                    '</button>' +
                    '</div>' +
                    '<div class="action-sheet-group" *ngIf="cancelButton">' +
                    '<button ion-button="action-sheet-button" (click)="click(cancelButton)" class="action-sheet-cancel disable-hover" [attr.icon-start]="cancelButton.icon ? \'\' : null" [ngClass]="cancelButton.cssClass">' +
                    '<ion-icon [name]="cancelButton.icon" *ngIf="cancelButton.icon" class="action-sheet-icon"></ion-icon>' +
                    '{{cancelButton.text}}' +
                    '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                host: {
                    'role': 'dialog',
                    '[attr.aria-labelledby]': 'hdrId',
                    '[attr.aria-describedby]': 'descId'
                },
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
ActionSheetCmp.ctorParameters = () => [
    { type: ViewController, },
    { type: Config, },
    { type: ElementRef, },
    { type: GestureController, },
    { type: NavParams, },
    { type: Renderer, },
];
ActionSheetCmp.propDecorators = {
    'keyUp': [{ type: HostListener, args: ['body:keyup', ['$event'],] },],
};
function ActionSheetCmp_tsickle_Closure_declarations() {
    /** @type {?} */
    ActionSheetCmp.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ActionSheetCmp.ctorParameters;
    /** @type {?} */
    ActionSheetCmp.propDecorators;
    /** @type {?} */
    ActionSheetCmp.prototype.d;
    /** @type {?} */
    ActionSheetCmp.prototype.cancelButton;
    /** @type {?} */
    ActionSheetCmp.prototype.descId;
    /** @type {?} */
    ActionSheetCmp.prototype.enabled;
    /** @type {?} */
    ActionSheetCmp.prototype.hdrId;
    /** @type {?} */
    ActionSheetCmp.prototype.id;
    /** @type {?} */
    ActionSheetCmp.prototype.mode;
    /** @type {?} */
    ActionSheetCmp.prototype.gestureBlocker;
    /** @type {?} */
    ActionSheetCmp.prototype._viewCtrl;
    /** @type {?} */
    ActionSheetCmp.prototype._elementRef;
}
let /** @type {?} */ actionSheetIds = -1;
//# sourceMappingURL=action-sheet-component.js.map