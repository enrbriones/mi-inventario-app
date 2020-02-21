import { trigger, style, state, transition, animate } from '@angular/animations';

export const fade = trigger('fadeInOut', [
    state('void', style({
        opacity: 0
    })),
    transition('void <=> *', animate(200)),
]);

export const otroFade = trigger('openClose', [
    // ...
    state('void', style({
        opacity: 0
    })),
    state('*', style({
        opacity: 1
    })),
    transition('void => *', [
        animate('0.2s')
    ]),
    transition('* => void', [
        animate('0.2s')
    ]),
]);
