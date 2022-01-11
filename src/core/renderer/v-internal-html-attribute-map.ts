import {VInternalHtmlAttribute} from './v-internal-html-attribute';

export const VInternalHtmlAttributeMap: VInternalHtmlAttribute[] = [
    // Dom events
    { clientAttrName: '@abort', internalClientAttrName: 'data-v-abort', internalAttrName: 'vAbort', domEvent: 'abort'},
    { clientAttrName: '@afterPrint', internalClientAttrName: 'data-v-after-print', internalAttrName: 'vAfterPrint', domEvent: 'afterprint'},
    { clientAttrName: '@animationEnd', internalClientAttrName: 'data-v-animation-end', internalAttrName: 'vAnimationEnd', domEvent: 'animationend'},
    { clientAttrName: '@animationIteration', internalClientAttrName: 'data-v-animation-iteration', internalAttrName: 'vAnimationIteration', domEvent: 'animationiteration'},
    { clientAttrName: '@animationStart', internalClientAttrName: 'data-v-animation-start', internalAttrName: 'vAnimationStart', domEvent: 'animationstart'},
    { clientAttrName: '@beforePrint', internalClientAttrName: 'data-v-before-print', internalAttrName: 'vBeforePrint', domEvent: 'beforeprint'},
    { clientAttrName: '@beforeUnload', internalClientAttrName: 'data-v-before-unload', internalAttrName: 'vBeforeUnload', domEvent: 'beforeunload'},
    { clientAttrName: '@blur', internalClientAttrName: 'data-v-blur', internalAttrName: 'vBlur', domEvent: 'blur'},
    { clientAttrName: '@canPlay', internalClientAttrName: 'data-v-can-play', internalAttrName: 'vCanPlay', domEvent: 'canplay'},
    { clientAttrName: '@canPlayThrough', internalClientAttrName: 'data-v-can-play-through', internalAttrName: 'vCanPlayThrough', domEvent: 'canplaythrough'},
    { clientAttrName: '@change', internalClientAttrName: 'data-v-change', internalAttrName: 'vChange', domEvent: 'change'},
    { clientAttrName: '@click', internalClientAttrName: 'data-v-click', internalAttrName: 'vClick', domEvent: 'click'},
    { clientAttrName: '@contextMenu', internalClientAttrName: 'data-v-context-menu', internalAttrName: 'vContextMenu', domEvent: 'contextmenu'},
    { clientAttrName: '@copy', internalClientAttrName: 'data-v-copy', internalAttrName: 'vCopy', domEvent: 'copy'},
    { clientAttrName: '@cut', internalClientAttrName: 'data-v-cut', internalAttrName: 'vCut', domEvent: 'cut'},
    { clientAttrName: '@dblClick', internalClientAttrName: 'data-v-dbl-click', internalAttrName: 'vDblClick', domEvent: 'dblclick'},
    { clientAttrName: '@drag', internalClientAttrName: 'data-v-drag', internalAttrName: 'vDrag', domEvent: 'drag'},
    { clientAttrName: '@dragEnd', internalClientAttrName: 'data-v-drag-end', internalAttrName: 'vDragEnd', domEvent: 'dragend'},
    { clientAttrName: '@dragEnter', internalClientAttrName: 'data-v-drag-enter', internalAttrName: 'vDragEnter', domEvent: 'dragenter'},
    { clientAttrName: '@dragLeave', internalClientAttrName: 'data-v-drag-leave', internalAttrName: 'vDragLeave', domEvent: 'dragleave'},
    { clientAttrName: '@dragOver', internalClientAttrName: 'data-v-drag-over', internalAttrName: 'vDragOver', domEvent: 'dragover'},
    { clientAttrName: '@dragStart', internalClientAttrName: 'data-v-drag-start', internalAttrName: 'vDragStart', domEvent: 'dragstart'},
    { clientAttrName: '@drop', internalClientAttrName: 'data-v-drop', internalAttrName: 'vDrop', domEvent: 'drop'},
    { clientAttrName: '@durationChange', internalClientAttrName: 'data-v-duration-change', internalAttrName: 'vDurationChange', domEvent: 'durationchange'},
    { clientAttrName: '@ended', internalClientAttrName: 'data-v-ended', internalAttrName: 'vEnded', domEvent: 'ended'},
    { clientAttrName: '@error', internalClientAttrName: 'data-v-error', internalAttrName: 'vError', domEvent: 'error'},
    { clientAttrName: '@focus', internalClientAttrName: 'data-v-focus', internalAttrName: 'vFocus', domEvent: 'focus'},
    { clientAttrName: '@focusIn', internalClientAttrName: 'data-v-focus-in', internalAttrName: 'vFocusIn', domEvent: 'focusin'},
    { clientAttrName: '@focusOut', internalClientAttrName: 'data-v-focus-out', internalAttrName: 'vFocusOut', domEvent: 'focusout'},
    { clientAttrName: '@fullScreenChange', internalClientAttrName: 'data-v-full-screen-change', internalAttrName: 'vFullScreenChange', domEvent: 'fullscreenchange'},
    { clientAttrName: '@fullScreenError', internalClientAttrName: 'data-v-full-screen-error', internalAttrName: 'vFullScreenError', domEvent: 'fullscreenerror'},
    { clientAttrName: '@hashChange', internalClientAttrName: 'data-v-hash-change', internalAttrName: 'vHashChange', domEvent: 'hashchange'},
    { clientAttrName: '@input', internalClientAttrName: 'data-v-input', internalAttrName: 'vInput', domEvent: 'input'},
    { clientAttrName: '@invalid', internalClientAttrName: 'data-v-invalid', internalAttrName: 'vInvalid', domEvent: 'invalid' },
    { clientAttrName: '@load', internalClientAttrName: 'data-v-load', internalAttrName: 'vLoad', domEvent: 'load' },
    { clientAttrName: '@loadedData', internalClientAttrName: 'data-v-loaded-data', internalAttrName: 'vLoadedData', domEvent: 'loadeddata' },
    { clientAttrName: '@loadedMetadata', internalClientAttrName: 'data-v-loaded-metadata', internalAttrName: 'vLoadedMetadata', domEvent: 'loadedmetadata' },
    { clientAttrName: '@loadStart', internalClientAttrName: 'data-v-load-start', internalAttrName: 'vLoadStart', domEvent: 'loadstart' },
    { clientAttrName: '@message', internalClientAttrName: 'data-v-message', internalAttrName: 'vMessage', domEvent: 'message' },
    { clientAttrName: '@mouseDown', internalClientAttrName: 'data-v-mouse-down', internalAttrName: 'vMouseDown', domEvent: 'mousedown' },
    { clientAttrName: '@mouseUp', internalClientAttrName: 'data-v-mouse-up', internalAttrName: 'vMouseUp', domEvent: 'mouseup' },
    { clientAttrName: '@offline', internalClientAttrName: 'data-v-offline', internalAttrName: 'vOffline', domEvent: 'offline' },
    { clientAttrName: '@online', internalClientAttrName: 'data-v-online', internalAttrName: 'vOnline', domEvent: 'online' },
    { clientAttrName: '@open', internalClientAttrName: 'data-v-open', internalAttrName: 'vOpen', domEvent: 'open' },
    { clientAttrName: '@pageHide', internalClientAttrName: 'data-v-page-hide', internalAttrName: 'vPageHide', domEvent: 'pagehide' },
    { clientAttrName: '@pageShow', internalClientAttrName: 'data-v-page-show', internalAttrName: 'vPageShow', domEvent: 'pageshow' },
    { clientAttrName: '@paste', internalClientAttrName: 'data-v-paste', internalAttrName: 'vPaste', domEvent: 'paste' },
    { clientAttrName: '@pause', internalClientAttrName: 'data-v-pause', internalAttrName: 'vPause', domEvent: 'pause' },
    { clientAttrName: '@play', internalClientAttrName: 'data-v-play', internalAttrName: 'vPlay', domEvent: 'play' },
    { clientAttrName: '@playing', internalClientAttrName: 'data-v-playing', internalAttrName: 'vPlaying', domEvent: 'playing' },
    { clientAttrName: '@progress', internalClientAttrName: 'data-v-progress', internalAttrName: 'vProgress', domEvent: 'progress' },
    { clientAttrName: '@rateChange', internalClientAttrName: 'data-v-rate-change', internalAttrName: 'vRateChange', domEvent: 'ratechange' },
    { clientAttrName: '@resize', internalClientAttrName: 'data-v-resize', internalAttrName: 'vResize', domEvent: 'resize' },
    { clientAttrName: '@reset', internalClientAttrName: 'data-v-reset', internalAttrName: 'vReset', domEvent: 'reset' },
    { clientAttrName: '@scroll', internalClientAttrName: 'data-v-scroll', internalAttrName: 'vScroll', domEvent: 'scroll' },
    { clientAttrName: '@search', internalClientAttrName: 'data-v-search', internalAttrName: 'vSearch', domEvent: 'search' },
    { clientAttrName: '@seeked', internalClientAttrName: 'data-v-seeked', internalAttrName: 'vSeeked', domEvent: 'seeked' },
    { clientAttrName: '@seeking', internalClientAttrName: 'data-v-seeking', internalAttrName: 'vSeeking', domEvent: 'seeking' },
    { clientAttrName: '@select', internalClientAttrName: 'data-v-select', internalAttrName: 'vSelect', domEvent: 'select' },
    { clientAttrName: '@show', internalClientAttrName: 'data-v-show', internalAttrName: 'vShow', domEvent: 'show' },
    { clientAttrName: '@stalled', internalClientAttrName: 'data-v-stalled', internalAttrName: 'vStalled', domEvent: 'stalled' },
    { clientAttrName: '@submit', internalClientAttrName: 'data-v-submit', internalAttrName: 'vSubmit', domEvent: 'submit' },
    { clientAttrName: '@suspend', internalClientAttrName: 'data-v-suspend', internalAttrName: 'vSuspend', domEvent: 'suspend' },
    { clientAttrName: '@timeUpdate', internalClientAttrName: 'data-v-time-update', internalAttrName: 'vTimeUpdate', domEvent: 'timeupdate' },
    { clientAttrName: '@toggle', internalClientAttrName: 'data-v-toggle', internalAttrName: 'vToggle', domEvent: 'toggle' },
    { clientAttrName: '@touchCancel', internalClientAttrName: 'data-v-touch-cancel', internalAttrName: 'vTouchCancel', domEvent: 'touchcancel' },
    { clientAttrName: '@touchEnd', internalClientAttrName: 'data-v-touch-end', internalAttrName: 'vTouchEnd', domEvent: 'touchend' },
    { clientAttrName: '@touchMove', internalClientAttrName: 'data-v-touch-move', internalAttrName: 'vTouchMove', domEvent: 'touchmove' },
    { clientAttrName: '@touchStart', internalClientAttrName: 'data-v-touch-start', internalAttrName: 'vTouchStart', domEvent: 'touchstart' },
    { clientAttrName: '@transitionEnd', internalClientAttrName: 'data-v-transition-end', internalAttrName: 'vTransitionEnd', domEvent: 'transitionend' },
    { clientAttrName: '@unload', internalClientAttrName: 'data-v-unload', internalAttrName: 'vUnload', domEvent: 'unload' },
    { clientAttrName: '@volumeChange', internalClientAttrName: 'data-v-volume-change', internalAttrName: 'vVolumeChange', domEvent: 'volumechange' },
    { clientAttrName: '@waiting', internalClientAttrName: 'data-v-waiting', internalAttrName: 'vWaiting', domEvent: 'waiting' },
    { clientAttrName: '@wheel', internalClientAttrName: 'data-v-wheel', internalAttrName: 'vWheel', domEvent: 'wheel' },

    // Keyboard events
    { clientAttrName: '@keyDown', internalClientAttrName: 'data-v-key-down', internalAttrName: 'vKeyDown', domEvent: 'keydown' },
    { clientAttrName: '@keyUp', internalClientAttrName: 'data-v-key-up', internalAttrName: 'vKeyUp', domEvent: 'keyup' },

    // Vienna events
    { clientAttrName: '@bind', internalClientAttrName: 'data-v-bind', internalAttrName: 'vBind'},
    { clientAttrName: '@emit', internalClientAttrName: 'data-v-emit', internalAttrName: 'vEmit'}
];
