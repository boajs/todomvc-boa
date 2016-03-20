(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var b_o_a_1 = require('b-o-a');
var dom_1 = require('b-o-a/handlers/dom');
// utils/
var FocusHook = (function () {
    function FocusHook(focus) {
        this.focus = focus;
    }
    FocusHook.prototype.hook = function (e) {
        if (focus)
            e.focus();
    };
    return FocusHook;
}());
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
var id = function () {
    return String(new Date().getTime());
};
// actions/
var makeAction = function (type) {
    var create = function (data) { return ({ type: type, data: data }); };
    var filter = function (action$) {
        return action$
            .filter(function (action) { return action.type === type; })
            .map(function (_a) {
            var data = _a.data;
            return data;
        });
    };
    return { create: create, filter: filter };
};
var _a = makeAction('add-todo'), addTodo = _a.create, addTodo$ = _a.filter;
var render = makeAction('render').create;
// actions/props/todo/
var _b = makeAction('props/todo/change'), propsTodoChange = _b.create, propsTodoChange$ = _b.filter;
// actions/props/todos/
var _c = makeAction('props/todos/add'), propsTodosAdd = _c.create, propsTodosAdd$ = _c.filter;
var _d = makeAction('props/todos/change'), propsTodosChange = _d.create, propsTodosChange$ = _d.filter;
var _e = makeAction('props/todos/clear-completed'), propsTodosClearCompleted = _e.create, propsTodosClearCompleted$ = _e.filter;
var _f = makeAction('props/todos/destroy'), propsTodosDestroy = _f.create, propsTodosDestroy$ = _f.filter;
var _g = makeAction('props/todos/edit'), propsTodosEdit = _g.create, propsTodosEdit$ = _g.filter;
var _h = makeAction('props/todos/save'), propsTodosSave = _h.create, propsTodosSave$ = _h.filter;
var _j = makeAction('props/todos/toggle'), propsTodosToggle = _j.create, propsTodosToggle$ = _j.filter;
var _k = makeAction('props/todos/toggle-all'), propsTodosToggleAll = _k.create, propsTodosToggleAll$ = _k.filter;
// actions/views/
var _l = makeAction('views/clear-completed/click'), viewsClearCompletedClick = _l.create, viewsClearCompletedClick$ = _l.filter;
var _m = makeAction('views/new-todo/change'), viewsNewTodoChange = _m.create, viewsNewTodoChange$ = _m.filter;
var _o = makeAction('views/new-todo/keyup'), viewsNewTodoKeyup = _o.create, viewsNewTodoKeyup$ = _o.filter;
var _p = makeAction('views/todo/blur'), viewsTodoBlur = _p.create, viewsTodoBlur$ = _p.filter;
var _q = makeAction('views/todo/change'), viewsTodoChange = _q.create, viewsTodoChange$ = _q.filter;
var _r = makeAction('views/todo/keyup'), viewsTodoKeyup = _r.create, viewsTodoKeyup$ = _r.filter;
var _s = makeAction('views/todo/destroy'), viewsTodoDestroy = _s.create, viewsTodoDestroy$ = _s.filter;
var _t = makeAction('views/todo/edit'), viewsTodoEdit = _t.create, viewsTodoEdit$ = _t.filter;
var _u = makeAction('views/todo/toggle'), viewsTodoToggle = _u.create, viewsTodoToggle$ = _u.filter;
var _v = makeAction('views/toggle-all/change'), viewsToggleAllChange = _v.create, viewsToggleAllChange$ = _v.filter;
// views/
// views/header
var headerView = function (state, helpers) {
    var h = helpers.create, e = helpers.e;
    return h('header.header', [
        h('h1', ['todos']),
        h('input.new-todo', {
            placeholder: 'What needs to be done?',
            autofocus: true,
            onchange: function (data) { return e(viewsNewTodoChange(data)); },
            onkeyup: function (data) { return e(viewsNewTodoKeyup(data)); },
            value: state.todo
        })
    ]);
};
// views/main
var mainView = function (state, helpers) {
    if (state.todos.length === 0)
        return null;
    var h = helpers.create, e = helpers.e;
    return h('section.main', [
        h('input.toggle-all', {
            type: 'checkbox',
            onchange: function (data) { return e(viewsToggleAllChange(data)); },
            checked: state.todos.every(function (_a) {
                var completed = _a.completed;
                return completed;
            })
        }),
        h('label', {
            attributes: { for: 'toggle-all' }
        }, ['Mark all as complete']),
        h('ul.todo-list', state.todos.map(function (todo) {
            var classes = ''
                + (todo.completed ? '.completed' : '')
                + (todo.editing ? '.editing' : '');
            return h('li' + classes, [
                h('div.view', [
                    h('input.toggle', {
                        type: 'checkbox',
                        checked: todo.completed,
                        onchange: function () { return e(viewsTodoToggle(todo.id)); }
                    }),
                    h('label', {
                        ondblclick: function () { return e(viewsTodoEdit(todo.id)); }
                    }, [todo.title]),
                    h('button.destroy', {
                        onclick: function () { return e(viewsTodoDestroy(todo.id)); }
                    })
                ]),
                h('input.edit', {
                    'ev-focus': new FocusHook(todo.editing),
                    onblur: function () { return e(viewsTodoBlur(todo.id)); },
                    onchange: function (event) { return e(viewsTodoChange({ event: event, id: todo.id })); },
                    onkeyup: function (event) { return e(viewsTodoKeyup({ event: event, id: todo.id })); },
                    value: todo.title
                })
            ]);
        }))
    ]);
};
// views/footer
var footerView = function (state, helpers) {
    if (state.todos.length === 0)
        return null;
    var h = helpers.create, e = helpers.e;
    var items = state.todos.filter(function (i) { return !i.completed; }).length;
    var hasCompleted = state.todos.filter(function (i) { return i.completed; }).length > 0;
    return h('footer.footer', [
        h('span.todo-count', [
            h('strong', [String(items)]),
            ' item' + (items === 1 ? '' : 's') + ' left'
        ]),
        h('ul.filters', [
            h('li', [
                h('a.selected', { href: '#/' }, ['All'])
            ]),
            h('li', [
                h('a', { href: '#/active' }, ['Active'])
            ]),
            h('li', [
                h('a', { href: '#/completed' }, ['Completed'])
            ])
        ]),
        (hasCompleted
            ? h('button.clear-completed', {
                onclick: function () { return e(viewsClearCompletedClick(null)); }
            }, ['Clear completed'])
            : null)
    ]);
};
// views/index
var view = function (state, helpers) {
    var h = helpers.create;
    return h('section.todoapp', [
        headerView(state, helpers),
        mainView(state, helpers),
        footerView(state, helpers)
    ]);
};
// props/
// props/todo
var todo$ = function (action$, state) {
    var todoUpdater$ = propsTodoChange$(action$).map(function (value) { return function () { return value; }; });
    var todo$ = b_o_a_1.O
        .of(state)
        .merge(todoUpdater$)
        .scan(function (state, updater) { return updater(state); });
    return todo$;
};
// props/todos
var todos$ = function (action$, state) {
    var todosUpdater$ = b_o_a_1.O.merge(propsTodosAdd$(action$)
        .map(function (value) { return function (state) { return state.concat([value]); }; }), propsTodosChange$(action$)
        .map(function (_a) {
        var id = _a.id, title = _a.title;
        return function (state) {
            var index = state.findIndex(function (i) { return i.id === id; });
            if (index < 0)
                return state;
            var newTodo = Object.assign({}, state[index], { title: title });
            return state
                .slice(0, index)
                .concat([newTodo])
                .concat(state.slice(index + 1));
        };
    }), propsTodosClearCompleted$(action$)
        .map(function () { return function (state) { return state.filter(function (i) { return !i.completed; }); }; }), propsTodosDestroy$(action$)
        .map(function (id) { return function (state) {
        var index = state.findIndex(function (i) { return i.id === id; });
        if (index < 0)
            return state;
        return state.slice(0, index).concat(state.slice(index + 1));
    }; }), propsTodosEdit$(action$)
        .map(function (id) { return function (state) {
        var index = state.findIndex(function (i) { return i.id === id; });
        if (index < 0)
            return state;
        var newTodo = Object.assign({}, state[index], { editing: true });
        return state
            .slice(0, index)
            .concat([newTodo])
            .concat(state.slice(index + 1));
    }; }), propsTodosSave$(action$)
        .map(function (id) { return function (state) {
        var index = state.findIndex(function (i) { return i.id === id; });
        if (index < 0)
            return state;
        var newTodo = Object.assign({}, state[index], { editing: false });
        return newTodo.title.trim().length > 0
            ? state
                .slice(0, index)
                .concat([newTodo])
                .concat(state.slice(index + 1))
            : state.slice(0, index).concat(state.slice(index + 1));
    }; }), propsTodosToggle$(action$)
        .map(function (id) { return function (state) {
        var index = state.findIndex(function (i) { return i.id === id; });
        if (index < 0)
            return state;
        var completed = !state[index].completed;
        var newTodo = Object.assign({}, state[index], { completed: completed });
        return state
            .slice(0, index)
            .concat([newTodo])
            .concat(state.slice(index + 1));
    }; }), propsTodosToggleAll$(action$)
        .map(function (value) { return function (state) {
        return state.map(function (todo) {
            return Object.assign({}, todo, { completed: value });
        });
    }; }));
    var todos$ = b_o_a_1.O
        .of(state)
        .merge(todosUpdater$)
        .scan(function (state, updater) { return updater(state); });
    return todos$;
};
// props/index
var props = function (action$, options) {
    var state = options.state;
    return b_o_a_1.O.combineLatest(todo$(action$, state.todo), todos$(action$, state.todos), function (todo, todos) { return ({ todo: todo, todos: todos }); })
        .do(console.log.bind(console)) // TODO: state logger for debug
        .publishReplay(1)
        .refCount();
};
// maps/
var maps = function (action$, options) {
    var state$ = options.state$;
    return b_o_a_1.O.merge(addTodo$(action$)
        .map(propsTodosAdd), addTodo$(action$)
        .map(function () { return propsTodoChange(''); }), viewsClearCompletedClick$(action$)
        .map(function (data) { return propsTodosClearCompleted(null); }), viewsNewTodoChange$(action$)
        .map(function (_a) {
        var target = _a.target;
        return target.value;
    })
        .map(propsTodoChange), viewsNewTodoKeyup$(action$)
        .filter(function (_a) {
        var keyCode = _a.keyCode;
        return keyCode === ENTER_KEY;
    })
        .withLatestFrom(state$, function (_, _a) {
        var title = _a.todo;
        return title;
    })
        .filter(function (title) { return title.trim().length > 0; })
        .map(function (title) { return ({ id: id(), completed: false, editing: false, title: title }); })
        .map(addTodo), viewsTodoBlur$(action$)
        .map(propsTodosSave), viewsTodoChange$(action$)
        .map(function (_a) {
        var target = _a.event.target, id = _a.id;
        return ({ id: id, title: target.value });
    })
        .map(function (data) { return propsTodosChange(data); }), viewsTodoDestroy$(action$)
        .map(propsTodosDestroy), viewsTodoEdit$(action$)
        .map(propsTodosEdit), viewsTodoKeyup$(action$)
        .filter(function (_a) {
        var keyCode = _a.event.keyCode;
        return keyCode === ENTER_KEY || keyCode == ESCAPE_KEY;
    })
        .map(function (_a) {
        var id = _a.id;
        return id;
    })
        .map(propsTodosSave), viewsTodoToggle$(action$)
        .map(propsTodosToggle), viewsToggleAllChange$(action$)
        .map(function (_a) {
        var target = _a.target;
        return target.checked;
    })
        .map(propsTodosToggleAll), state$
        .map(render));
};
// app
var handler = function (action$, options) {
    var id1 = id();
    var state = {
        todo: '',
        todos: [
            {
                id: id1,
                completed: true,
                title: 'Taste JavaScript',
            },
            {
                id: String(parseInt(id1, 10) + 1),
                completed: false,
                title: 'Buy a unicorn',
            }
        ].map(function (i) { return Object.assign(i, { editing: false }); })
    };
    var state$ = props(action$, { state: state });
    var map$ = maps(action$, { state$: state$ });
    return map$;
};
// client
var main = function () {
    b_o_a_1.run(function (action$, options) {
        var log$ = action$
            .do(console.log.bind(console)) // action logger for debug
            .share();
        var dom$ = dom_1.init({
            render: view,
            root: '.todoapp'
        }).handler(log$, options);
        return handler(dom$, options);
    });
};
main();

},{"b-o-a":3,"b-o-a/handlers/dom":2}],2:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('boa-handler-dom'));

},{"boa-handler-dom":261}],3:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('boa-core'));

},{"boa-core":4}],4:[function(require,module,exports){
"use strict";
var o_1 = require('./o');
exports.O = o_1.O;
var run_1 = require('./run');
exports.run = run_1.default;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run_1.default;

},{"./o":5,"./run":6}],5:[function(require,module,exports){
"use strict";
var rxjs_1 = require('rxjs');
var O = rxjs_1.Observable;
exports.O = O;

},{"rxjs":13}],6:[function(require,module,exports){
"use strict";
var rxjs_1 = require('rxjs');
function run(app) {
    var subject = new rxjs_1.Subject();
    var action$ = subject
        .asObservable()
        .filter(function (action) { return !!action; })
        .share();
    var re = function (action) { return setTimeout(function () { return subject.next(action); }); };
    app(action$, { re: re }).subscribe(re);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
;

},{"rxjs":13}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('./Subscriber');
var InnerSubscriber = (function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        _super.call(this);
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_1.Subscriber));
exports.InnerSubscriber = InnerSubscriber;

},{"./Subscriber":15}],8:[function(require,module,exports){
"use strict";
var Observable_1 = require('./Observable');
var Notification = (function () {
    function Notification(kind, value, exception) {
        this.kind = kind;
        this.value = value;
        this.exception = exception;
        this.hasValue = kind === 'N';
    }
    Notification.prototype.observe = function (observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.exception);
            case 'C':
                return observer.complete && observer.complete();
        }
    };
    Notification.prototype.do = function (next, error, complete) {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.exception);
            case 'C':
                return complete && complete();
        }
    };
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        }
        else {
            return this.do(nextOrObserver, error, complete);
        }
    };
    Notification.prototype.toObservable = function () {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return Observable_1.Observable.of(this.value);
            case 'E':
                return Observable_1.Observable.throw(this.exception);
            case 'C':
                return Observable_1.Observable.empty();
        }
    };
    Notification.createNext = function (value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return this.undefinedValueNotification;
    };
    Notification.createError = function (err) {
        return new Notification('E', undefined, err);
    };
    Notification.createComplete = function () {
        return this.completeNotification;
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
}());
exports.Notification = Notification;

},{"./Observable":9}],9:[function(require,module,exports){
"use strict";
var root_1 = require('./util/root');
var SymbolShim_1 = require('./util/SymbolShim');
var toSubscriber_1 = require('./util/toSubscriber');
var tryCatch_1 = require('./util/tryCatch');
var errorObject_1 = require('./util/errorObject');
/**
 * A representation of any set of values over any amount of time. This the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is
     * called when the Observable is initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or `complete` can be called to notify
     * of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @returns {Observable} a new observable with the Operator applied
     * @description creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * @method subscribe
     * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
     * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled
     * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
     * @returns {Subscription} a subscription reference to the registered handlers
     * @description registers handlers for handling emitted values, error and completions from the observable, and
     *  executes the observable's subscriber function, which will take action to set up the underlying data stream
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var subscriber = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            subscriber.add(this._subscribe(operator.call(subscriber)));
        }
        else {
            subscriber.add(this._subscribe(subscriber));
        }
        if (subscriber.syncErrorThrowable) {
            subscriber.syncErrorThrowable = false;
            if (subscriber.syncErrorThrown) {
                throw subscriber.syncErrorValue;
            }
        }
        return subscriber;
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {any} [thisArg] a `this` context for the `next` handler function
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @returns {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, thisArg, PromiseCtor) {
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        var source = this;
        return new PromiseCtor(function (resolve, reject) {
            source.subscribe(function (value) {
                var result = tryCatch_1.tryCatch(next).call(thisArg, value);
                if (result === errorObject_1.errorObject) {
                    reject(errorObject_1.errorObject.e);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * @method Symbol.observable
     * @returns {Observable} this instance of the observable
     * @description an interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     */
    Observable.prototype[SymbolShim_1.SymbolShim.observable] = function () {
        return this;
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * @static
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @returns {Observable} a new cold observable
     * @description creates a new cold Observable by calling the Observable constructor
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;

},{"./util/SymbolShim":244,"./util/errorObject":245,"./util/root":255,"./util/toSubscriber":258,"./util/tryCatch":259}],10:[function(require,module,exports){
"use strict";
exports.empty = {
    isUnsubscribed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};

},{}],11:[function(require,module,exports){
"use strict";
var Subscriber_1 = require('./Subscriber');
var Operator = (function () {
    function Operator() {
    }
    Operator.prototype.call = function (subscriber) {
        return new Subscriber_1.Subscriber(subscriber);
    };
    return Operator;
}());
exports.Operator = Operator;

},{"./Subscriber":15}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('./Subscriber');
var OuterSubscriber = (function (_super) {
    __extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber_1.Subscriber));
exports.OuterSubscriber = OuterSubscriber;

},{"./Subscriber":15}],13:[function(require,module,exports){
"use strict";
/* tslint:disable:no-unused-variable */
// Subject imported before Observable to bypass circular dependency issue since
// Subject extends Observable and Observable references Subject in it's
// definition
var Subject_1 = require('./Subject');
exports.Subject = Subject_1.Subject;
/* tslint:enable:no-unused-variable */
var Observable_1 = require('./Observable');
exports.Observable = Observable_1.Observable;
// statics
/* tslint:disable:no-use-before-declare */
require('./add/observable/combineLatest');
require('./add/observable/concat');
require('./add/observable/merge');
require('./add/observable/race');
require('./add/observable/bindCallback');
require('./add/observable/bindNodeCallback');
require('./add/observable/defer');
require('./add/observable/empty');
require('./add/observable/forkJoin');
require('./add/observable/from');
require('./add/observable/fromArray');
require('./add/observable/fromEvent');
require('./add/observable/fromEventPattern');
require('./add/observable/fromPromise');
require('./add/observable/interval');
require('./add/observable/never');
require('./add/observable/range');
require('./add/observable/throw');
require('./add/observable/timer');
require('./add/observable/zip');
//operators
require('./add/operator/buffer');
require('./add/operator/bufferCount');
require('./add/operator/bufferTime');
require('./add/operator/bufferToggle');
require('./add/operator/bufferWhen');
require('./add/operator/cache');
require('./add/operator/catch');
require('./add/operator/combineAll');
require('./add/operator/combineLatest');
require('./add/operator/concat');
require('./add/operator/concatAll');
require('./add/operator/concatMap');
require('./add/operator/concatMapTo');
require('./add/operator/count');
require('./add/operator/dematerialize');
require('./add/operator/debounce');
require('./add/operator/debounceTime');
require('./add/operator/defaultIfEmpty');
require('./add/operator/delay');
require('./add/operator/delayWhen');
require('./add/operator/distinctUntilChanged');
require('./add/operator/do');
require('./add/operator/expand');
require('./add/operator/filter');
require('./add/operator/finally');
require('./add/operator/first');
require('./add/operator/groupBy');
require('./add/operator/ignoreElements');
require('./add/operator/inspect');
require('./add/operator/inspectTime');
require('./add/operator/every');
require('./add/operator/last');
require('./add/operator/let');
require('./add/operator/map');
require('./add/operator/mapTo');
require('./add/operator/materialize');
require('./add/operator/merge');
require('./add/operator/mergeAll');
require('./add/operator/mergeMap');
require('./add/operator/mergeMapTo');
require('./add/operator/multicast');
require('./add/operator/observeOn');
require('./add/operator/partition');
require('./add/operator/pluck');
require('./add/operator/publish');
require('./add/operator/publishBehavior');
require('./add/operator/publishReplay');
require('./add/operator/publishLast');
require('./add/operator/race');
require('./add/operator/reduce');
require('./add/operator/repeat');
require('./add/operator/retry');
require('./add/operator/retryWhen');
require('./add/operator/sample');
require('./add/operator/sampleTime');
require('./add/operator/scan');
require('./add/operator/share');
require('./add/operator/single');
require('./add/operator/skip');
require('./add/operator/skipUntil');
require('./add/operator/skipWhile');
require('./add/operator/startWith');
require('./add/operator/subscribeOn');
require('./add/operator/switch');
require('./add/operator/switchMap');
require('./add/operator/switchMapTo');
require('./add/operator/take');
require('./add/operator/takeLast');
require('./add/operator/takeUntil');
require('./add/operator/takeWhile');
require('./add/operator/throttle');
require('./add/operator/throttleTime');
require('./add/operator/timeout');
require('./add/operator/timeoutWith');
require('./add/operator/toArray');
require('./add/operator/toPromise');
require('./add/operator/window');
require('./add/operator/windowCount');
require('./add/operator/windowTime');
require('./add/operator/windowToggle');
require('./add/operator/windowWhen');
require('./add/operator/withLatestFrom');
require('./add/operator/zip');
require('./add/operator/zipAll');
/* tslint:disable:no-unused-variable */
var Operator_1 = require('./Operator');
exports.Operator = Operator_1.Operator;
var Subscription_1 = require('./Subscription');
exports.Subscription = Subscription_1.Subscription;
exports.UnsubscriptionError = Subscription_1.UnsubscriptionError;
var Subscriber_1 = require('./Subscriber');
exports.Subscriber = Subscriber_1.Subscriber;
var AsyncSubject_1 = require('./subject/AsyncSubject');
exports.AsyncSubject = AsyncSubject_1.AsyncSubject;
var ReplaySubject_1 = require('./subject/ReplaySubject');
exports.ReplaySubject = ReplaySubject_1.ReplaySubject;
var BehaviorSubject_1 = require('./subject/BehaviorSubject');
exports.BehaviorSubject = BehaviorSubject_1.BehaviorSubject;
var ConnectableObservable_1 = require('./observable/ConnectableObservable');
exports.ConnectableObservable = ConnectableObservable_1.ConnectableObservable;
var Notification_1 = require('./Notification');
exports.Notification = Notification_1.Notification;
var EmptyError_1 = require('./util/EmptyError');
exports.EmptyError = EmptyError_1.EmptyError;
var ArgumentOutOfRangeError_1 = require('./util/ArgumentOutOfRangeError');
exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
exports.ObjectUnsubscribedError = ObjectUnsubscribedError_1.ObjectUnsubscribedError;
var asap_1 = require('./scheduler/asap');
var queue_1 = require('./scheduler/queue');
var rxSubscriber_1 = require('./symbol/rxSubscriber');
/* tslint:enable:no-unused-variable */
/* tslint:disable:no-var-keyword */
var Scheduler = {
    asap: asap_1.asap,
    queue: queue_1.queue
};
exports.Scheduler = Scheduler;
var Symbol = {
    rxSubscriber: rxSubscriber_1.rxSubscriber
};
exports.Symbol = Symbol;
/* tslint:enable:no-var-keyword */

},{"./Notification":8,"./Observable":9,"./Operator":11,"./Subject":14,"./Subscriber":15,"./Subscription":16,"./add/observable/bindCallback":17,"./add/observable/bindNodeCallback":18,"./add/observable/combineLatest":19,"./add/observable/concat":20,"./add/observable/defer":21,"./add/observable/empty":22,"./add/observable/forkJoin":23,"./add/observable/from":24,"./add/observable/fromArray":25,"./add/observable/fromEvent":26,"./add/observable/fromEventPattern":27,"./add/observable/fromPromise":28,"./add/observable/interval":29,"./add/observable/merge":30,"./add/observable/never":31,"./add/observable/race":32,"./add/observable/range":33,"./add/observable/throw":34,"./add/observable/timer":35,"./add/observable/zip":36,"./add/operator/buffer":37,"./add/operator/bufferCount":38,"./add/operator/bufferTime":39,"./add/operator/bufferToggle":40,"./add/operator/bufferWhen":41,"./add/operator/cache":42,"./add/operator/catch":43,"./add/operator/combineAll":44,"./add/operator/combineLatest":45,"./add/operator/concat":46,"./add/operator/concatAll":47,"./add/operator/concatMap":48,"./add/operator/concatMapTo":49,"./add/operator/count":50,"./add/operator/debounce":51,"./add/operator/debounceTime":52,"./add/operator/defaultIfEmpty":53,"./add/operator/delay":54,"./add/operator/delayWhen":55,"./add/operator/dematerialize":56,"./add/operator/distinctUntilChanged":57,"./add/operator/do":58,"./add/operator/every":59,"./add/operator/expand":60,"./add/operator/filter":61,"./add/operator/finally":62,"./add/operator/first":63,"./add/operator/groupBy":64,"./add/operator/ignoreElements":65,"./add/operator/inspect":66,"./add/operator/inspectTime":67,"./add/operator/last":68,"./add/operator/let":69,"./add/operator/map":70,"./add/operator/mapTo":71,"./add/operator/materialize":72,"./add/operator/merge":73,"./add/operator/mergeAll":74,"./add/operator/mergeMap":75,"./add/operator/mergeMapTo":76,"./add/operator/multicast":77,"./add/operator/observeOn":78,"./add/operator/partition":79,"./add/operator/pluck":80,"./add/operator/publish":81,"./add/operator/publishBehavior":82,"./add/operator/publishLast":83,"./add/operator/publishReplay":84,"./add/operator/race":85,"./add/operator/reduce":86,"./add/operator/repeat":87,"./add/operator/retry":88,"./add/operator/retryWhen":89,"./add/operator/sample":90,"./add/operator/sampleTime":91,"./add/operator/scan":92,"./add/operator/share":93,"./add/operator/single":94,"./add/operator/skip":95,"./add/operator/skipUntil":96,"./add/operator/skipWhile":97,"./add/operator/startWith":98,"./add/operator/subscribeOn":99,"./add/operator/switch":100,"./add/operator/switchMap":101,"./add/operator/switchMapTo":102,"./add/operator/take":103,"./add/operator/takeLast":104,"./add/operator/takeUntil":105,"./add/operator/takeWhile":106,"./add/operator/throttle":107,"./add/operator/throttleTime":108,"./add/operator/timeout":109,"./add/operator/timeoutWith":110,"./add/operator/toArray":111,"./add/operator/toPromise":112,"./add/operator/window":113,"./add/operator/windowCount":114,"./add/operator/windowTime":115,"./add/operator/windowToggle":116,"./add/operator/windowWhen":117,"./add/operator/withLatestFrom":118,"./add/operator/zip":119,"./add/operator/zipAll":120,"./observable/ConnectableObservable":125,"./scheduler/asap":230,"./scheduler/queue":231,"./subject/AsyncSubject":232,"./subject/BehaviorSubject":233,"./subject/ReplaySubject":234,"./symbol/rxSubscriber":236,"./util/ArgumentOutOfRangeError":237,"./util/EmptyError":238,"./util/ObjectUnsubscribedError":243}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('./Observable');
var Subscriber_1 = require('./Subscriber');
var Subscription_1 = require('./Subscription');
var SubjectSubscription_1 = require('./subject/SubjectSubscription');
var rxSubscriber_1 = require('./symbol/rxSubscriber');
var throwError_1 = require('./util/throwError');
var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject(destination, source) {
        _super.call(this);
        this.destination = destination;
        this.source = source;
        this.observers = [];
        this.isUnsubscribed = false;
        this.isStopped = false;
        this.hasErrored = false;
        this.dispatching = false;
        this.hasCompleted = false;
    }
    Subject.prototype.lift = function (operator) {
        var subject = new Subject(this.destination || this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.add = function (subscription) {
        Subscription_1.Subscription.prototype.add.call(this, subscription);
    };
    Subject.prototype.remove = function (subscription) {
        Subscription_1.Subscription.prototype.remove.call(this, subscription);
    };
    Subject.prototype.unsubscribe = function () {
        Subscription_1.Subscription.prototype.unsubscribe.call(this);
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.source) {
            return this.source.subscribe(subscriber);
        }
        else {
            if (subscriber.isUnsubscribed) {
                return;
            }
            else if (this.hasErrored) {
                return subscriber.error(this.errorValue);
            }
            else if (this.hasCompleted) {
                return subscriber.complete();
            }
            this.throwIfUnsubscribed();
            var subscription = new SubjectSubscription_1.SubjectSubscription(this, subscriber);
            this.observers.push(subscriber);
            return subscription;
        }
    };
    Subject.prototype._unsubscribe = function () {
        this.source = null;
        this.isStopped = true;
        this.observers = null;
        this.destination = null;
    };
    Subject.prototype.next = function (value) {
        this.throwIfUnsubscribed();
        if (this.isStopped) {
            return;
        }
        this.dispatching = true;
        this._next(value);
        this.dispatching = false;
        if (this.hasErrored) {
            this._error(this.errorValue);
        }
        else if (this.hasCompleted) {
            this._complete();
        }
    };
    Subject.prototype.error = function (err) {
        this.throwIfUnsubscribed();
        if (this.isStopped) {
            return;
        }
        this.isStopped = true;
        this.hasErrored = true;
        this.errorValue = err;
        if (this.dispatching) {
            return;
        }
        this._error(err);
    };
    Subject.prototype.complete = function () {
        this.throwIfUnsubscribed();
        if (this.isStopped) {
            return;
        }
        this.isStopped = true;
        this.hasCompleted = true;
        if (this.dispatching) {
            return;
        }
        this._complete();
    };
    Subject.prototype.asObservable = function () {
        var observable = new SubjectObservable(this);
        return observable;
    };
    Subject.prototype._next = function (value) {
        if (this.destination) {
            this.destination.next(value);
        }
        else {
            this._finalNext(value);
        }
    };
    Subject.prototype._finalNext = function (value) {
        var index = -1;
        var observers = this.observers.slice(0);
        var len = observers.length;
        while (++index < len) {
            observers[index].next(value);
        }
    };
    Subject.prototype._error = function (err) {
        if (this.destination) {
            this.destination.error(err);
        }
        else {
            this._finalError(err);
        }
    };
    Subject.prototype._finalError = function (err) {
        var index = -1;
        var observers = this.observers;
        // optimization to block our SubjectSubscriptions from
        // splicing themselves out of the observers list one by one.
        this.observers = null;
        this.isUnsubscribed = true;
        if (observers) {
            var len = observers.length;
            while (++index < len) {
                observers[index].error(err);
            }
        }
        this.isUnsubscribed = false;
        this.unsubscribe();
    };
    Subject.prototype._complete = function () {
        if (this.destination) {
            this.destination.complete();
        }
        else {
            this._finalComplete();
        }
    };
    Subject.prototype._finalComplete = function () {
        var index = -1;
        var observers = this.observers;
        // optimization to block our SubjectSubscriptions from
        // splicing themselves out of the observers list one by one.
        this.observers = null;
        this.isUnsubscribed = true;
        if (observers) {
            var len = observers.length;
            while (++index < len) {
                observers[index].complete();
            }
        }
        this.isUnsubscribed = false;
        this.unsubscribe();
    };
    Subject.prototype.throwIfUnsubscribed = function () {
        if (this.isUnsubscribed) {
            throwError_1.throwError(new ObjectUnsubscribedError_1.ObjectUnsubscribedError());
        }
    };
    Subject.prototype[rxSubscriber_1.rxSubscriber] = function () {
        return new Subscriber_1.Subscriber(this);
    };
    Subject.create = function (destination, source) {
        return new Subject(destination, source);
    };
    return Subject;
}(Observable_1.Observable));
exports.Subject = Subject;
var SubjectObservable = (function (_super) {
    __extends(SubjectObservable, _super);
    function SubjectObservable(source) {
        _super.call(this);
        this.source = source;
    }
    return SubjectObservable;
}(Observable_1.Observable));

},{"./Observable":9,"./Subscriber":15,"./Subscription":16,"./subject/SubjectSubscription":235,"./symbol/rxSubscriber":236,"./util/ObjectUnsubscribedError":243,"./util/throwError":257}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isFunction_1 = require('./util/isFunction');
var Subscription_1 = require('./Subscription');
var rxSubscriber_1 = require('./symbol/rxSubscriber');
var Observer_1 = require('./Observer');
var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer_1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.destination = destinationOrNext;
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.isUnsubscribed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () {
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parent, observerOrNext, error, complete) {
        _super.call(this);
        this._parent = _parent;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            context = observerOrNext;
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parent = this._parent;
            if (!_parent.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parent, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parent = this._parent;
            if (this._error) {
                if (!_parent.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parent, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parent.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parent.syncErrorValue = err;
                _parent.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _parent = this._parent;
            if (this._complete) {
                if (!_parent.syncErrorThrowable) {
                    this.__tryOrUnsub(this._complete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parent, this._complete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parent = this._parent;
        this._context = null;
        this._parent = null;
        _parent.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));

},{"./Observer":10,"./Subscription":16,"./symbol/rxSubscriber":236,"./util/isFunction":248}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isArray_1 = require('./util/isArray');
var isObject_1 = require('./util/isObject');
var isFunction_1 = require('./util/isFunction');
var tryCatch_1 = require('./util/tryCatch');
var errorObject_1 = require('./util/errorObject');
var Subscription = (function () {
    function Subscription(_unsubscribe) {
        this.isUnsubscribed = false;
        if (_unsubscribe) {
            this._unsubscribe = _unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.isUnsubscribed) {
            return;
        }
        this.isUnsubscribed = true;
        var _a = this, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this._subscriptions = null;
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                (errors = errors || []).push(errorObject_1.errorObject.e);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            var index = -1;
            var len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError) {
                            errors = errors.concat(err.errors);
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError(errors);
        }
    };
    Subscription.prototype.add = function (subscription) {
        // return early if:
        //  1. the subscription is null
        //  2. we're attempting to add our this
        //  3. we're attempting to add the static `empty` Subscription
        if (!subscription || (subscription === this) || (subscription === Subscription.EMPTY)) {
            return;
        }
        var sub = subscription;
        switch (typeof subscription) {
            case 'function':
                sub = new Subscription(subscription);
            case 'object':
                if (sub.isUnsubscribed || typeof sub.unsubscribe !== 'function') {
                    break;
                }
                else if (this.isUnsubscribed) {
                    sub.unsubscribe();
                }
                else {
                    (this._subscriptions || (this._subscriptions = [])).push(sub);
                }
                break;
            default:
                throw new Error('Unrecognized subscription ' + subscription + ' added to Subscription.');
        }
    };
    Subscription.prototype.remove = function (subscription) {
        // return early if:
        //  1. the subscription is null
        //  2. we're attempting to remove ourthis
        //  3. we're attempting to remove the static `empty` Subscription
        if (subscription == null || (subscription === this) || (subscription === Subscription.EMPTY)) {
            return;
        }
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.isUnsubscribed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
var UnsubscriptionError = (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this, 'unsubscriptoin error(s)');
        this.errors = errors;
        this.name = 'UnsubscriptionError';
    }
    return UnsubscriptionError;
}(Error));
exports.UnsubscriptionError = UnsubscriptionError;

},{"./util/errorObject":245,"./util/isArray":246,"./util/isFunction":248,"./util/isObject":250,"./util/tryCatch":259}],17:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var BoundCallbackObservable_1 = require('../../observable/BoundCallbackObservable');
Observable_1.Observable.bindCallback = BoundCallbackObservable_1.BoundCallbackObservable.create;

},{"../../Observable":9,"../../observable/BoundCallbackObservable":123}],18:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var BoundNodeCallbackObservable_1 = require('../../observable/BoundNodeCallbackObservable');
Observable_1.Observable.bindNodeCallback = BoundNodeCallbackObservable_1.BoundNodeCallbackObservable.create;

},{"../../Observable":9,"../../observable/BoundNodeCallbackObservable":124}],19:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var combineLatest_1 = require('../../operator/combineLatest');
Observable_1.Observable.combineLatest = combineLatest_1.combineLatestStatic;

},{"../../Observable":9,"../../operator/combineLatest":149}],20:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var concat_1 = require('../../operator/concat');
Observable_1.Observable.concat = concat_1.concatStatic;

},{"../../Observable":9,"../../operator/concat":150}],21:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var DeferObservable_1 = require('../../observable/DeferObservable');
Observable_1.Observable.defer = DeferObservable_1.DeferObservable.create;

},{"../../Observable":9,"../../observable/DeferObservable":126}],22:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var EmptyObservable_1 = require('../../observable/EmptyObservable');
Observable_1.Observable.empty = EmptyObservable_1.EmptyObservable.create;

},{"../../Observable":9,"../../observable/EmptyObservable":127}],23:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var ForkJoinObservable_1 = require('../../observable/ForkJoinObservable');
Observable_1.Observable.forkJoin = ForkJoinObservable_1.ForkJoinObservable.create;

},{"../../Observable":9,"../../observable/ForkJoinObservable":129}],24:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var FromObservable_1 = require('../../observable/FromObservable');
Observable_1.Observable.from = FromObservable_1.FromObservable.create;

},{"../../Observable":9,"../../observable/FromObservable":132}],25:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var ArrayObservable_1 = require('../../observable/ArrayObservable');
Observable_1.Observable.fromArray = ArrayObservable_1.ArrayObservable.create;
Observable_1.Observable.of = ArrayObservable_1.ArrayObservable.of;

},{"../../Observable":9,"../../observable/ArrayObservable":122}],26:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var FromEventObservable_1 = require('../../observable/FromEventObservable');
Observable_1.Observable.fromEvent = FromEventObservable_1.FromEventObservable.create;

},{"../../Observable":9,"../../observable/FromEventObservable":130}],27:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var FromEventPatternObservable_1 = require('../../observable/FromEventPatternObservable');
Observable_1.Observable.fromEventPattern = FromEventPatternObservable_1.FromEventPatternObservable.create;

},{"../../Observable":9,"../../observable/FromEventPatternObservable":131}],28:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var PromiseObservable_1 = require('../../observable/PromiseObservable');
Observable_1.Observable.fromPromise = PromiseObservable_1.PromiseObservable.create;

},{"../../Observable":9,"../../observable/PromiseObservable":136}],29:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var IntervalObservable_1 = require('../../observable/IntervalObservable');
Observable_1.Observable.interval = IntervalObservable_1.IntervalObservable.create;

},{"../../Observable":9,"../../observable/IntervalObservable":133}],30:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var merge_1 = require('../../operator/merge');
Observable_1.Observable.merge = merge_1.mergeStatic;

},{"../../Observable":9,"../../operator/merge":177}],31:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var NeverObservable_1 = require('../../observable/NeverObservable');
Observable_1.Observable.never = NeverObservable_1.NeverObservable.create;

},{"../../Observable":9,"../../observable/NeverObservable":135}],32:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var race_1 = require('../../operator/race');
Observable_1.Observable.race = race_1.raceStatic;

},{"../../Observable":9,"../../operator/race":189}],33:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var RangeObservable_1 = require('../../observable/RangeObservable');
Observable_1.Observable.range = RangeObservable_1.RangeObservable.create;

},{"../../Observable":9,"../../observable/RangeObservable":137}],34:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var ErrorObservable_1 = require('../../observable/ErrorObservable');
Observable_1.Observable.throw = ErrorObservable_1.ErrorObservable.create;

},{"../../Observable":9,"../../observable/ErrorObservable":128}],35:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var TimerObservable_1 = require('../../observable/TimerObservable');
Observable_1.Observable.timer = TimerObservable_1.TimerObservable.create;

},{"../../Observable":9,"../../observable/TimerObservable":140}],36:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var zip_1 = require('../../operator/zip');
Observable_1.Observable.zip = zip_1.zipStatic;

},{"../../Observable":9,"../../operator/zip":223}],37:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var buffer_1 = require('../../operator/buffer');
Observable_1.Observable.prototype.buffer = buffer_1.buffer;

},{"../../Observable":9,"../../operator/buffer":141}],38:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var bufferCount_1 = require('../../operator/bufferCount');
Observable_1.Observable.prototype.bufferCount = bufferCount_1.bufferCount;

},{"../../Observable":9,"../../operator/bufferCount":142}],39:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var bufferTime_1 = require('../../operator/bufferTime');
Observable_1.Observable.prototype.bufferTime = bufferTime_1.bufferTime;

},{"../../Observable":9,"../../operator/bufferTime":143}],40:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var bufferToggle_1 = require('../../operator/bufferToggle');
Observable_1.Observable.prototype.bufferToggle = bufferToggle_1.bufferToggle;

},{"../../Observable":9,"../../operator/bufferToggle":144}],41:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var bufferWhen_1 = require('../../operator/bufferWhen');
Observable_1.Observable.prototype.bufferWhen = bufferWhen_1.bufferWhen;

},{"../../Observable":9,"../../operator/bufferWhen":145}],42:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var cache_1 = require('../../operator/cache');
Observable_1.Observable.prototype.cache = cache_1.cache;

},{"../../Observable":9,"../../operator/cache":146}],43:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var catch_1 = require('../../operator/catch');
Observable_1.Observable.prototype.catch = catch_1._catch;

},{"../../Observable":9,"../../operator/catch":147}],44:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var combineAll_1 = require('../../operator/combineAll');
Observable_1.Observable.prototype.combineAll = combineAll_1.combineAll;

},{"../../Observable":9,"../../operator/combineAll":148}],45:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var combineLatest_1 = require('../../operator/combineLatest');
Observable_1.Observable.prototype.combineLatest = combineLatest_1.combineLatest;

},{"../../Observable":9,"../../operator/combineLatest":149}],46:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var concat_1 = require('../../operator/concat');
Observable_1.Observable.prototype.concat = concat_1.concat;

},{"../../Observable":9,"../../operator/concat":150}],47:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var concatAll_1 = require('../../operator/concatAll');
Observable_1.Observable.prototype.concatAll = concatAll_1.concatAll;

},{"../../Observable":9,"../../operator/concatAll":151}],48:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var concatMap_1 = require('../../operator/concatMap');
Observable_1.Observable.prototype.concatMap = concatMap_1.concatMap;

},{"../../Observable":9,"../../operator/concatMap":152}],49:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var concatMapTo_1 = require('../../operator/concatMapTo');
Observable_1.Observable.prototype.concatMapTo = concatMapTo_1.concatMapTo;

},{"../../Observable":9,"../../operator/concatMapTo":153}],50:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var count_1 = require('../../operator/count');
Observable_1.Observable.prototype.count = count_1.count;

},{"../../Observable":9,"../../operator/count":154}],51:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var debounce_1 = require('../../operator/debounce');
Observable_1.Observable.prototype.debounce = debounce_1.debounce;

},{"../../Observable":9,"../../operator/debounce":155}],52:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var debounceTime_1 = require('../../operator/debounceTime');
Observable_1.Observable.prototype.debounceTime = debounceTime_1.debounceTime;

},{"../../Observable":9,"../../operator/debounceTime":156}],53:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var defaultIfEmpty_1 = require('../../operator/defaultIfEmpty');
Observable_1.Observable.prototype.defaultIfEmpty = defaultIfEmpty_1.defaultIfEmpty;

},{"../../Observable":9,"../../operator/defaultIfEmpty":157}],54:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var delay_1 = require('../../operator/delay');
Observable_1.Observable.prototype.delay = delay_1.delay;

},{"../../Observable":9,"../../operator/delay":158}],55:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var delayWhen_1 = require('../../operator/delayWhen');
Observable_1.Observable.prototype.delayWhen = delayWhen_1.delayWhen;

},{"../../Observable":9,"../../operator/delayWhen":159}],56:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var dematerialize_1 = require('../../operator/dematerialize');
Observable_1.Observable.prototype.dematerialize = dematerialize_1.dematerialize;

},{"../../Observable":9,"../../operator/dematerialize":160}],57:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var distinctUntilChanged_1 = require('../../operator/distinctUntilChanged');
Observable_1.Observable.prototype.distinctUntilChanged = distinctUntilChanged_1.distinctUntilChanged;

},{"../../Observable":9,"../../operator/distinctUntilChanged":161}],58:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var do_1 = require('../../operator/do');
Observable_1.Observable.prototype.do = do_1._do;

},{"../../Observable":9,"../../operator/do":162}],59:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var every_1 = require('../../operator/every');
Observable_1.Observable.prototype.every = every_1.every;

},{"../../Observable":9,"../../operator/every":163}],60:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var expand_1 = require('../../operator/expand');
Observable_1.Observable.prototype.expand = expand_1.expand;

},{"../../Observable":9,"../../operator/expand":164}],61:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var filter_1 = require('../../operator/filter');
Observable_1.Observable.prototype.filter = filter_1.filter;

},{"../../Observable":9,"../../operator/filter":165}],62:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var finally_1 = require('../../operator/finally');
Observable_1.Observable.prototype.finally = finally_1._finally;

},{"../../Observable":9,"../../operator/finally":166}],63:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var first_1 = require('../../operator/first');
Observable_1.Observable.prototype.first = first_1.first;

},{"../../Observable":9,"../../operator/first":167}],64:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var groupBy_1 = require('../../operator/groupBy');
Observable_1.Observable.prototype.groupBy = groupBy_1.groupBy;

},{"../../Observable":9,"../../operator/groupBy":168}],65:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var ignoreElements_1 = require('../../operator/ignoreElements');
Observable_1.Observable.prototype.ignoreElements = ignoreElements_1.ignoreElements;

},{"../../Observable":9,"../../operator/ignoreElements":169}],66:[function(require,module,exports){
"use strict";
/**
 * Everything in this file is generated by the 'tools/generate-operator-patches.ts' script.
 * Any manual edits to this file will be lost next time the script is run.
 **/
var Observable_1 = require('../../Observable');
var inspect_1 = require('../../operator/inspect');
Observable_1.Observable.prototype.inspect = inspect_1.inspect;

},{"../../Observable":9,"../../operator/inspect":170}],67:[function(require,module,exports){
"use strict";
/**
 * Everything in this file is generated by the 'tools/generate-operator-patches.ts' script.
 * Any manual edits to this file will be lost next time the script is run.
 **/
var Observable_1 = require('../../Observable');
var inspectTime_1 = require('../../operator/inspectTime');
Observable_1.Observable.prototype.inspectTime = inspectTime_1.inspectTime;

},{"../../Observable":9,"../../operator/inspectTime":171}],68:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var last_1 = require('../../operator/last');
Observable_1.Observable.prototype.last = last_1.last;

},{"../../Observable":9,"../../operator/last":172}],69:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var let_1 = require('../../operator/let');
Observable_1.Observable.prototype.let = let_1.letProto;
Observable_1.Observable.prototype.letBind = let_1.letProto;

},{"../../Observable":9,"../../operator/let":173}],70:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var map_1 = require('../../operator/map');
Observable_1.Observable.prototype.map = map_1.map;

},{"../../Observable":9,"../../operator/map":174}],71:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var mapTo_1 = require('../../operator/mapTo');
Observable_1.Observable.prototype.mapTo = mapTo_1.mapTo;

},{"../../Observable":9,"../../operator/mapTo":175}],72:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var materialize_1 = require('../../operator/materialize');
Observable_1.Observable.prototype.materialize = materialize_1.materialize;

},{"../../Observable":9,"../../operator/materialize":176}],73:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var merge_1 = require('../../operator/merge');
Observable_1.Observable.prototype.merge = merge_1.merge;

},{"../../Observable":9,"../../operator/merge":177}],74:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var mergeAll_1 = require('../../operator/mergeAll');
Observable_1.Observable.prototype.mergeAll = mergeAll_1.mergeAll;

},{"../../Observable":9,"../../operator/mergeAll":178}],75:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var mergeMap_1 = require('../../operator/mergeMap');
Observable_1.Observable.prototype.mergeMap = mergeMap_1.mergeMap;
Observable_1.Observable.prototype.flatMap = mergeMap_1.mergeMap;

},{"../../Observable":9,"../../operator/mergeMap":179}],76:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var mergeMapTo_1 = require('../../operator/mergeMapTo');
Observable_1.Observable.prototype.mergeMapTo = mergeMapTo_1.mergeMapTo;

},{"../../Observable":9,"../../operator/mergeMapTo":180}],77:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var multicast_1 = require('../../operator/multicast');
Observable_1.Observable.prototype.multicast = multicast_1.multicast;

},{"../../Observable":9,"../../operator/multicast":181}],78:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var observeOn_1 = require('../../operator/observeOn');
Observable_1.Observable.prototype.observeOn = observeOn_1.observeOn;

},{"../../Observable":9,"../../operator/observeOn":182}],79:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var partition_1 = require('../../operator/partition');
Observable_1.Observable.prototype.partition = partition_1.partition;

},{"../../Observable":9,"../../operator/partition":183}],80:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var pluck_1 = require('../../operator/pluck');
Observable_1.Observable.prototype.pluck = pluck_1.pluck;

},{"../../Observable":9,"../../operator/pluck":184}],81:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var publish_1 = require('../../operator/publish');
Observable_1.Observable.prototype.publish = publish_1.publish;

},{"../../Observable":9,"../../operator/publish":185}],82:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var publishBehavior_1 = require('../../operator/publishBehavior');
Observable_1.Observable.prototype.publishBehavior = publishBehavior_1.publishBehavior;

},{"../../Observable":9,"../../operator/publishBehavior":186}],83:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var publishLast_1 = require('../../operator/publishLast');
Observable_1.Observable.prototype.publishLast = publishLast_1.publishLast;

},{"../../Observable":9,"../../operator/publishLast":187}],84:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var publishReplay_1 = require('../../operator/publishReplay');
Observable_1.Observable.prototype.publishReplay = publishReplay_1.publishReplay;

},{"../../Observable":9,"../../operator/publishReplay":188}],85:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var race_1 = require('../../operator/race');
Observable_1.Observable.prototype.race = race_1.race;

},{"../../Observable":9,"../../operator/race":189}],86:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var reduce_1 = require('../../operator/reduce');
Observable_1.Observable.prototype.reduce = reduce_1.reduce;

},{"../../Observable":9,"../../operator/reduce":190}],87:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var repeat_1 = require('../../operator/repeat');
Observable_1.Observable.prototype.repeat = repeat_1.repeat;

},{"../../Observable":9,"../../operator/repeat":191}],88:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var retry_1 = require('../../operator/retry');
Observable_1.Observable.prototype.retry = retry_1.retry;

},{"../../Observable":9,"../../operator/retry":192}],89:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var retryWhen_1 = require('../../operator/retryWhen');
Observable_1.Observable.prototype.retryWhen = retryWhen_1.retryWhen;

},{"../../Observable":9,"../../operator/retryWhen":193}],90:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var sample_1 = require('../../operator/sample');
Observable_1.Observable.prototype.sample = sample_1.sample;

},{"../../Observable":9,"../../operator/sample":194}],91:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var sampleTime_1 = require('../../operator/sampleTime');
Observable_1.Observable.prototype.sampleTime = sampleTime_1.sampleTime;

},{"../../Observable":9,"../../operator/sampleTime":195}],92:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var scan_1 = require('../../operator/scan');
Observable_1.Observable.prototype.scan = scan_1.scan;

},{"../../Observable":9,"../../operator/scan":196}],93:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var share_1 = require('../../operator/share');
Observable_1.Observable.prototype.share = share_1.share;

},{"../../Observable":9,"../../operator/share":197}],94:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var single_1 = require('../../operator/single');
Observable_1.Observable.prototype.single = single_1.single;

},{"../../Observable":9,"../../operator/single":198}],95:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var skip_1 = require('../../operator/skip');
Observable_1.Observable.prototype.skip = skip_1.skip;

},{"../../Observable":9,"../../operator/skip":199}],96:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var skipUntil_1 = require('../../operator/skipUntil');
Observable_1.Observable.prototype.skipUntil = skipUntil_1.skipUntil;

},{"../../Observable":9,"../../operator/skipUntil":200}],97:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var skipWhile_1 = require('../../operator/skipWhile');
Observable_1.Observable.prototype.skipWhile = skipWhile_1.skipWhile;

},{"../../Observable":9,"../../operator/skipWhile":201}],98:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var startWith_1 = require('../../operator/startWith');
Observable_1.Observable.prototype.startWith = startWith_1.startWith;

},{"../../Observable":9,"../../operator/startWith":202}],99:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var subscribeOn_1 = require('../../operator/subscribeOn');
Observable_1.Observable.prototype.subscribeOn = subscribeOn_1.subscribeOn;

},{"../../Observable":9,"../../operator/subscribeOn":203}],100:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var switch_1 = require('../../operator/switch');
Observable_1.Observable.prototype.switch = switch_1._switch;

},{"../../Observable":9,"../../operator/switch":204}],101:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var switchMap_1 = require('../../operator/switchMap');
Observable_1.Observable.prototype.switchMap = switchMap_1.switchMap;

},{"../../Observable":9,"../../operator/switchMap":205}],102:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var switchMapTo_1 = require('../../operator/switchMapTo');
Observable_1.Observable.prototype.switchMapTo = switchMapTo_1.switchMapTo;

},{"../../Observable":9,"../../operator/switchMapTo":206}],103:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var take_1 = require('../../operator/take');
Observable_1.Observable.prototype.take = take_1.take;

},{"../../Observable":9,"../../operator/take":207}],104:[function(require,module,exports){
"use strict";
/**
 * Everything in this file is generated by the 'tools/generate-operator-patches.ts' script.
 * Any manual edits to this file will be lost next time the script is run.
 **/
var Observable_1 = require('../../Observable');
var takeLast_1 = require('../../operator/takeLast');
Observable_1.Observable.prototype.takeLast = takeLast_1.takeLast;

},{"../../Observable":9,"../../operator/takeLast":208}],105:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var takeUntil_1 = require('../../operator/takeUntil');
Observable_1.Observable.prototype.takeUntil = takeUntil_1.takeUntil;

},{"../../Observable":9,"../../operator/takeUntil":209}],106:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var takeWhile_1 = require('../../operator/takeWhile');
Observable_1.Observable.prototype.takeWhile = takeWhile_1.takeWhile;

},{"../../Observable":9,"../../operator/takeWhile":210}],107:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var throttle_1 = require('../../operator/throttle');
Observable_1.Observable.prototype.throttle = throttle_1.throttle;

},{"../../Observable":9,"../../operator/throttle":211}],108:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var throttleTime_1 = require('../../operator/throttleTime');
Observable_1.Observable.prototype.throttleTime = throttleTime_1.throttleTime;

},{"../../Observable":9,"../../operator/throttleTime":212}],109:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var timeout_1 = require('../../operator/timeout');
Observable_1.Observable.prototype.timeout = timeout_1.timeout;

},{"../../Observable":9,"../../operator/timeout":213}],110:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var timeoutWith_1 = require('../../operator/timeoutWith');
Observable_1.Observable.prototype.timeoutWith = timeoutWith_1.timeoutWith;

},{"../../Observable":9,"../../operator/timeoutWith":214}],111:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var toArray_1 = require('../../operator/toArray');
Observable_1.Observable.prototype.toArray = toArray_1.toArray;

},{"../../Observable":9,"../../operator/toArray":215}],112:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var toPromise_1 = require('../../operator/toPromise');
Observable_1.Observable.prototype.toPromise = toPromise_1.toPromise;

},{"../../Observable":9,"../../operator/toPromise":216}],113:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var window_1 = require('../../operator/window');
Observable_1.Observable.prototype.window = window_1.window;

},{"../../Observable":9,"../../operator/window":217}],114:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var windowCount_1 = require('../../operator/windowCount');
Observable_1.Observable.prototype.windowCount = windowCount_1.windowCount;

},{"../../Observable":9,"../../operator/windowCount":218}],115:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var windowTime_1 = require('../../operator/windowTime');
Observable_1.Observable.prototype.windowTime = windowTime_1.windowTime;

},{"../../Observable":9,"../../operator/windowTime":219}],116:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var windowToggle_1 = require('../../operator/windowToggle');
Observable_1.Observable.prototype.windowToggle = windowToggle_1.windowToggle;

},{"../../Observable":9,"../../operator/windowToggle":220}],117:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var windowWhen_1 = require('../../operator/windowWhen');
Observable_1.Observable.prototype.windowWhen = windowWhen_1.windowWhen;

},{"../../Observable":9,"../../operator/windowWhen":221}],118:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var withLatestFrom_1 = require('../../operator/withLatestFrom');
Observable_1.Observable.prototype.withLatestFrom = withLatestFrom_1.withLatestFrom;

},{"../../Observable":9,"../../operator/withLatestFrom":222}],119:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var zip_1 = require('../../operator/zip');
Observable_1.Observable.prototype.zip = zip_1.zipProto;

},{"../../Observable":9,"../../operator/zip":223}],120:[function(require,module,exports){
"use strict";
var Observable_1 = require('../../Observable');
var zipAll_1 = require('../../operator/zipAll');
Observable_1.Observable.prototype.zipAll = zipAll_1.zipAll;

},{"../../Observable":9,"../../operator/zipAll":224}],121:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var ScalarObservable_1 = require('./ScalarObservable');
var EmptyObservable_1 = require('./EmptyObservable');
var ArrayLikeObservable = (function (_super) {
    __extends(ArrayLikeObservable, _super);
    function ArrayLikeObservable(arrayLike, mapFn, thisArg, scheduler) {
        _super.call(this);
        this.arrayLike = arrayLike;
        this.scheduler = scheduler;
        if (!mapFn && !scheduler && arrayLike.length === 1) {
            this._isScalar = true;
            this.value = arrayLike[0];
        }
        if (mapFn) {
            this.mapFn = mapFn.bind(thisArg);
        }
    }
    ArrayLikeObservable.create = function (arrayLike, mapFn, thisArg, scheduler) {
        var length = arrayLike.length;
        if (length === 0) {
            return new EmptyObservable_1.EmptyObservable();
        }
        else if (length === 1 && !mapFn) {
            return new ScalarObservable_1.ScalarObservable(arrayLike[0], scheduler);
        }
        else {
            return new ArrayLikeObservable(arrayLike, mapFn, thisArg, scheduler);
        }
    };
    ArrayLikeObservable.dispatch = function (state) {
        var arrayLike = state.arrayLike, index = state.index, length = state.length, mapFn = state.mapFn, subscriber = state.subscriber;
        if (subscriber.isUnsubscribed) {
            return;
        }
        if (index >= length) {
            subscriber.complete();
            return;
        }
        var result = mapFn ? mapFn(arrayLike[index], index) : arrayLike[index];
        subscriber.next(result);
        state.index = index + 1;
        this.schedule(state);
    };
    ArrayLikeObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this, arrayLike = _a.arrayLike, mapFn = _a.mapFn, scheduler = _a.scheduler;
        var length = arrayLike.length;
        if (scheduler) {
            return scheduler.schedule(ArrayLikeObservable.dispatch, 0, {
                arrayLike: arrayLike, index: index, length: length, mapFn: mapFn, subscriber: subscriber
            });
        }
        else {
            for (var i = 0; i < length && !subscriber.isUnsubscribed; i++) {
                var result = mapFn ? mapFn(arrayLike[i], i) : arrayLike[i];
                subscriber.next(result);
            }
            subscriber.complete();
        }
    };
    return ArrayLikeObservable;
}(Observable_1.Observable));
exports.ArrayLikeObservable = ArrayLikeObservable;

},{"../Observable":9,"./EmptyObservable":127,"./ScalarObservable":138}],122:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var ScalarObservable_1 = require('./ScalarObservable');
var EmptyObservable_1 = require('./EmptyObservable');
var isScheduler_1 = require('../util/isScheduler');
var ArrayObservable = (function (_super) {
    __extends(ArrayObservable, _super);
    function ArrayObservable(array, scheduler) {
        _super.call(this);
        this.array = array;
        this.scheduler = scheduler;
        if (!scheduler && array.length === 1) {
            this._isScalar = true;
            this.value = array[0];
        }
    }
    ArrayObservable.create = function (array, scheduler) {
        return new ArrayObservable(array, scheduler);
    };
    ArrayObservable.of = function () {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i - 0] = arguments[_i];
        }
        var scheduler = array[array.length - 1];
        if (isScheduler_1.isScheduler(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        var len = array.length;
        if (len > 1) {
            return new ArrayObservable(array, scheduler);
        }
        else if (len === 1) {
            return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
        }
        else {
            return new EmptyObservable_1.EmptyObservable(scheduler);
        }
    };
    ArrayObservable.dispatch = function (state) {
        var array = state.array, index = state.index, count = state.count, subscriber = state.subscriber;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(array[index]);
        if (subscriber.isUnsubscribed) {
            return;
        }
        state.index = index + 1;
        this.schedule(state);
    };
    ArrayObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var array = this.array;
        var count = array.length;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array: array, index: index, count: count, subscriber: subscriber
            });
        }
        else {
            for (var i = 0; i < count && !subscriber.isUnsubscribed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        }
    };
    return ArrayObservable;
}(Observable_1.Observable));
exports.ArrayObservable = ArrayObservable;

},{"../Observable":9,"../util/isScheduler":252,"./EmptyObservable":127,"./ScalarObservable":138}],123:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var AsyncSubject_1 = require('../subject/AsyncSubject');
var BoundCallbackObservable = (function (_super) {
    __extends(BoundCallbackObservable, _super);
    function BoundCallbackObservable(callbackFunc, selector, args, scheduler) {
        _super.call(this);
        this.callbackFunc = callbackFunc;
        this.selector = selector;
        this.args = args;
        this.scheduler = scheduler;
    }
    /* tslint:enable:max-line-length */
    BoundCallbackObservable.create = function (callbackFunc, selector, scheduler) {
        if (selector === void 0) { selector = undefined; }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return new BoundCallbackObservable(callbackFunc, selector, args, scheduler);
        };
    };
    BoundCallbackObservable.prototype._subscribe = function (subscriber) {
        var callbackFunc = this.callbackFunc;
        var args = this.args;
        var scheduler = this.scheduler;
        var subject = this.subject;
        if (!scheduler) {
            if (!subject) {
                subject = this.subject = new AsyncSubject_1.AsyncSubject();
                var handler = function handlerFn() {
                    var innerArgs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        innerArgs[_i - 0] = arguments[_i];
                    }
                    var source = handlerFn.source;
                    var selector = source.selector, subject = source.subject;
                    if (selector) {
                        var result_1 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                        if (result_1 === errorObject_1.errorObject) {
                            subject.error(errorObject_1.errorObject.e);
                        }
                        else {
                            subject.next(result_1);
                            subject.complete();
                        }
                    }
                    else {
                        subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    }
                };
                // use named function instance to avoid closure.
                handler.source = this;
                var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
                if (result === errorObject_1.errorObject) {
                    subject.error(errorObject_1.errorObject.e);
                }
            }
            return subject.subscribe(subscriber);
        }
        else {
            return scheduler.schedule(dispatch, 0, { source: this, subscriber: subscriber });
        }
    };
    return BoundCallbackObservable;
}(Observable_1.Observable));
exports.BoundCallbackObservable = BoundCallbackObservable;
function dispatch(state) {
    var self = this;
    var source = state.source, subscriber = state.subscriber;
    var callbackFunc = source.callbackFunc, args = source.args, scheduler = source.scheduler;
    var subject = source.subject;
    if (!subject) {
        subject = source.subject = new AsyncSubject_1.AsyncSubject();
        var handler = function handlerFn() {
            var innerArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                innerArgs[_i - 0] = arguments[_i];
            }
            var source = handlerFn.source;
            var selector = source.selector, subject = source.subject;
            if (selector) {
                var result_2 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                if (result_2 === errorObject_1.errorObject) {
                    self.add(scheduler.schedule(dispatchError, 0, { err: errorObject_1.errorObject.e, subject: subject }));
                }
                else {
                    self.add(scheduler.schedule(dispatchNext, 0, { value: result_2, subject: subject }));
                }
            }
            else {
                var value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
                self.add(scheduler.schedule(dispatchNext, 0, { value: value, subject: subject }));
            }
        };
        // use named function to pass values in without closure
        handler.source = source;
        var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
        if (result === errorObject_1.errorObject) {
            subject.error(errorObject_1.errorObject.e);
        }
    }
    self.add(subject.subscribe(subscriber));
}
function dispatchNext(_a) {
    var value = _a.value, subject = _a.subject;
    subject.next(value);
    subject.complete();
}
function dispatchError(_a) {
    var err = _a.err, subject = _a.subject;
    subject.error(err);
}

},{"../Observable":9,"../subject/AsyncSubject":232,"../util/errorObject":245,"../util/tryCatch":259}],124:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var AsyncSubject_1 = require('../subject/AsyncSubject');
var BoundNodeCallbackObservable = (function (_super) {
    __extends(BoundNodeCallbackObservable, _super);
    function BoundNodeCallbackObservable(callbackFunc, selector, args, scheduler) {
        _super.call(this);
        this.callbackFunc = callbackFunc;
        this.selector = selector;
        this.args = args;
        this.scheduler = scheduler;
    }
    /* tslint:enable:max-line-length */
    BoundNodeCallbackObservable.create = function (callbackFunc, selector, scheduler) {
        if (selector === void 0) { selector = undefined; }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return new BoundNodeCallbackObservable(callbackFunc, selector, args, scheduler);
        };
    };
    BoundNodeCallbackObservable.prototype._subscribe = function (subscriber) {
        var callbackFunc = this.callbackFunc;
        var args = this.args;
        var scheduler = this.scheduler;
        var subject = this.subject;
        if (!scheduler) {
            if (!subject) {
                subject = this.subject = new AsyncSubject_1.AsyncSubject();
                var handler = function handlerFn() {
                    var innerArgs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        innerArgs[_i - 0] = arguments[_i];
                    }
                    var source = handlerFn.source;
                    var selector = source.selector, subject = source.subject;
                    var err = innerArgs.shift();
                    if (err) {
                        subject.error(err);
                    }
                    else if (selector) {
                        var result_1 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                        if (result_1 === errorObject_1.errorObject) {
                            subject.error(errorObject_1.errorObject.e);
                        }
                        else {
                            subject.next(result_1);
                            subject.complete();
                        }
                    }
                    else {
                        subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    }
                };
                // use named function instance to avoid closure.
                handler.source = this;
                var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
                if (result === errorObject_1.errorObject) {
                    subject.error(errorObject_1.errorObject.e);
                }
            }
            return subject.subscribe(subscriber);
        }
        else {
            return scheduler.schedule(dispatch, 0, { source: this, subscriber: subscriber });
        }
    };
    return BoundNodeCallbackObservable;
}(Observable_1.Observable));
exports.BoundNodeCallbackObservable = BoundNodeCallbackObservable;
function dispatch(state) {
    var self = this;
    var source = state.source, subscriber = state.subscriber;
    var callbackFunc = source.callbackFunc, args = source.args, scheduler = source.scheduler;
    var subject = source.subject;
    if (!subject) {
        subject = source.subject = new AsyncSubject_1.AsyncSubject();
        var handler = function handlerFn() {
            var innerArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                innerArgs[_i - 0] = arguments[_i];
            }
            var source = handlerFn.source;
            var selector = source.selector, subject = source.subject;
            var err = innerArgs.shift();
            if (err) {
                subject.error(err);
            }
            else if (selector) {
                var result_2 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                if (result_2 === errorObject_1.errorObject) {
                    self.add(scheduler.schedule(dispatchError, 0, { err: errorObject_1.errorObject.e, subject: subject }));
                }
                else {
                    self.add(scheduler.schedule(dispatchNext, 0, { value: result_2, subject: subject }));
                }
            }
            else {
                var value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
                self.add(scheduler.schedule(dispatchNext, 0, { value: value, subject: subject }));
            }
        };
        // use named function to pass values in without closure
        handler.source = source;
        var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
        if (result === errorObject_1.errorObject) {
            subject.error(errorObject_1.errorObject.e);
        }
    }
    self.add(subject.subscribe(subscriber));
}
function dispatchNext(_a) {
    var value = _a.value, subject = _a.subject;
    subject.next(value);
    subject.complete();
}
function dispatchError(_a) {
    var err = _a.err, subject = _a.subject;
    subject.error(err);
}

},{"../Observable":9,"../subject/AsyncSubject":232,"../util/errorObject":245,"../util/tryCatch":259}],125:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var Subscriber_1 = require('../Subscriber');
var Subscription_1 = require('../Subscription');
var ConnectableObservable = (function (_super) {
    __extends(ConnectableObservable, _super);
    function ConnectableObservable(source, subjectFactory) {
        _super.call(this);
        this.source = source;
        this.subjectFactory = subjectFactory;
    }
    ConnectableObservable.prototype._subscribe = function (subscriber) {
        return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable.prototype.getSubject = function () {
        var subject = this.subject;
        if (subject && !subject.isUnsubscribed) {
            return subject;
        }
        return (this.subject = this.subjectFactory());
    };
    ConnectableObservable.prototype.connect = function () {
        var source = this.source;
        var subscription = this.subscription;
        if (subscription && !subscription.isUnsubscribed) {
            return subscription;
        }
        subscription = source.subscribe(this.getSubject());
        subscription.add(new ConnectableSubscription(this));
        return (this.subscription = subscription);
    };
    ConnectableObservable.prototype.refCount = function () {
        return new RefCountObservable(this);
    };
    /**
     * This method is opened for `ConnectableSubscription`.
     * Not to call from others.
     */
    ConnectableObservable.prototype._closeSubscription = function () {
        this.subject = null;
        this.subscription = null;
    };
    return ConnectableObservable;
}(Observable_1.Observable));
exports.ConnectableObservable = ConnectableObservable;
var ConnectableSubscription = (function (_super) {
    __extends(ConnectableSubscription, _super);
    function ConnectableSubscription(connectable) {
        _super.call(this);
        this.connectable = connectable;
    }
    ConnectableSubscription.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        connectable._closeSubscription();
        this.connectable = null;
    };
    return ConnectableSubscription;
}(Subscription_1.Subscription));
var RefCountObservable = (function (_super) {
    __extends(RefCountObservable, _super);
    function RefCountObservable(connectable, refCount) {
        if (refCount === void 0) { refCount = 0; }
        _super.call(this);
        this.connectable = connectable;
        this.refCount = refCount;
    }
    RefCountObservable.prototype._subscribe = function (subscriber) {
        var connectable = this.connectable;
        var refCountSubscriber = new RefCountSubscriber(subscriber, this);
        var subscription = connectable.subscribe(refCountSubscriber);
        if (!subscription.isUnsubscribed && ++this.refCount === 1) {
            refCountSubscriber.connection = this.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountObservable;
}(Observable_1.Observable));
var RefCountSubscriber = (function (_super) {
    __extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, refCountObservable) {
        _super.call(this, null);
        this.destination = destination;
        this.refCountObservable = refCountObservable;
        this.connection = refCountObservable.connection;
        destination.add(this);
    }
    RefCountSubscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    RefCountSubscriber.prototype._error = function (err) {
        this._resetConnectable();
        this.destination.error(err);
    };
    RefCountSubscriber.prototype._complete = function () {
        this._resetConnectable();
        this.destination.complete();
    };
    RefCountSubscriber.prototype._resetConnectable = function () {
        var observable = this.refCountObservable;
        var obsConnection = observable.connection;
        var subConnection = this.connection;
        if (subConnection && subConnection === obsConnection) {
            observable.refCount = 0;
            obsConnection.unsubscribe();
            observable.connection = null;
            this.unsubscribe();
        }
    };
    RefCountSubscriber.prototype._unsubscribe = function () {
        var observable = this.refCountObservable;
        if (observable.refCount === 0) {
            return;
        }
        if (--observable.refCount === 0) {
            var obsConnection = observable.connection;
            var subConnection = this.connection;
            if (subConnection && subConnection === obsConnection) {
                obsConnection.unsubscribe();
                observable.connection = null;
            }
        }
    };
    return RefCountSubscriber;
}(Subscriber_1.Subscriber));

},{"../Observable":9,"../Subscriber":15,"../Subscription":16}],126:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var DeferObservable = (function (_super) {
    __extends(DeferObservable, _super);
    function DeferObservable(observableFactory) {
        _super.call(this);
        this.observableFactory = observableFactory;
    }
    DeferObservable.create = function (observableFactory) {
        return new DeferObservable(observableFactory);
    };
    DeferObservable.prototype._subscribe = function (subscriber) {
        var result = tryCatch_1.tryCatch(this.observableFactory)();
        if (result === errorObject_1.errorObject) {
            subscriber.error(errorObject_1.errorObject.e);
        }
        else {
            result.subscribe(subscriber);
        }
    };
    return DeferObservable;
}(Observable_1.Observable));
exports.DeferObservable = DeferObservable;

},{"../Observable":9,"../util/errorObject":245,"../util/tryCatch":259}],127:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var EmptyObservable = (function (_super) {
    __extends(EmptyObservable, _super);
    function EmptyObservable(scheduler) {
        _super.call(this);
        this.scheduler = scheduler;
    }
    EmptyObservable.create = function (scheduler) {
        return new EmptyObservable(scheduler);
    };
    EmptyObservable.dispatch = function (_a) {
        var subscriber = _a.subscriber;
        subscriber.complete();
    };
    EmptyObservable.prototype._subscribe = function (subscriber) {
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
        }
        else {
            subscriber.complete();
        }
    };
    return EmptyObservable;
}(Observable_1.Observable));
exports.EmptyObservable = EmptyObservable;

},{"../Observable":9}],128:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var ErrorObservable = (function (_super) {
    __extends(ErrorObservable, _super);
    function ErrorObservable(error, scheduler) {
        _super.call(this);
        this.error = error;
        this.scheduler = scheduler;
    }
    ErrorObservable.create = function (error, scheduler) {
        return new ErrorObservable(error, scheduler);
    };
    ErrorObservable.dispatch = function (_a) {
        var error = _a.error, subscriber = _a.subscriber;
        subscriber.error(error);
    };
    ErrorObservable.prototype._subscribe = function (subscriber) {
        var error = this.error;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ErrorObservable.dispatch, 0, {
                error: error, subscriber: subscriber
            });
        }
        else {
            subscriber.error(error);
        }
    };
    return ErrorObservable;
}(Observable_1.Observable));
exports.ErrorObservable = ErrorObservable;

},{"../Observable":9}],129:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var Subscriber_1 = require('../Subscriber');
var PromiseObservable_1 = require('./PromiseObservable');
var EmptyObservable_1 = require('./EmptyObservable');
var isPromise_1 = require('../util/isPromise');
var isArray_1 = require('../util/isArray');
var ForkJoinObservable = (function (_super) {
    __extends(ForkJoinObservable, _super);
    function ForkJoinObservable(sources, resultSelector) {
        _super.call(this);
        this.sources = sources;
        this.resultSelector = resultSelector;
    }
    ForkJoinObservable.create = function () {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i - 0] = arguments[_i];
        }
        if (sources === null || arguments.length === 0) {
            return new EmptyObservable_1.EmptyObservable();
        }
        var resultSelector = null;
        if (typeof sources[sources.length - 1] === 'function') {
            resultSelector = sources.pop();
        }
        // if the first and only other argument besides the resultSelector is an array
        // assume it's been called with `forkJoin([obs1, obs2, obs3], resultSelector)`
        if (sources.length === 1 && isArray_1.isArray(sources[0])) {
            sources = sources[0];
        }
        if (sources.length === 0) {
            return new EmptyObservable_1.EmptyObservable();
        }
        return new ForkJoinObservable(sources, resultSelector);
    };
    ForkJoinObservable.prototype._subscribe = function (subscriber) {
        var sources = this.sources;
        var len = sources.length;
        var context = { completed: 0, total: len, values: emptyArray(len), selector: this.resultSelector };
        for (var i = 0; i < len; i++) {
            var source = sources[i];
            if (isPromise_1.isPromise(source)) {
                source = new PromiseObservable_1.PromiseObservable(source);
            }
            source.subscribe(new AllSubscriber(subscriber, i, context));
        }
    };
    return ForkJoinObservable;
}(Observable_1.Observable));
exports.ForkJoinObservable = ForkJoinObservable;
var AllSubscriber = (function (_super) {
    __extends(AllSubscriber, _super);
    function AllSubscriber(destination, index, context) {
        _super.call(this, destination);
        this.index = index;
        this.context = context;
        this._value = null;
    }
    AllSubscriber.prototype._next = function (value) {
        this._value = value;
    };
    AllSubscriber.prototype._complete = function () {
        var destination = this.destination;
        if (this._value == null) {
            destination.complete();
        }
        var context = this.context;
        context.completed++;
        context.values[this.index] = this._value;
        var values = context.values;
        if (context.completed !== values.length) {
            return;
        }
        if (values.every(hasValue)) {
            var value = context.selector ? context.selector.apply(this, values) :
                values;
            destination.next(value);
        }
        destination.complete();
    };
    return AllSubscriber;
}(Subscriber_1.Subscriber));
function hasValue(x) {
    return x !== null;
}
function emptyArray(len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(null);
    }
    return arr;
}

},{"../Observable":9,"../Subscriber":15,"../util/isArray":246,"../util/isPromise":251,"./EmptyObservable":127,"./PromiseObservable":136}],130:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var Subscription_1 = require('../Subscription');
function isNodeStyleEventEmmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
}
function isJQueryStyleEventEmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
}
function isNodeList(sourceObj) {
    return !!sourceObj && sourceObj.toString() === '[object NodeList]';
}
function isHTMLCollection(sourceObj) {
    return !!sourceObj && sourceObj.toString() === '[object HTMLCollection]';
}
function isEventTarget(sourceObj) {
    return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
}
var FromEventObservable = (function (_super) {
    __extends(FromEventObservable, _super);
    function FromEventObservable(sourceObj, eventName, selector) {
        _super.call(this);
        this.sourceObj = sourceObj;
        this.eventName = eventName;
        this.selector = selector;
    }
    FromEventObservable.create = function (sourceObj, eventName, selector) {
        return new FromEventObservable(sourceObj, eventName, selector);
    };
    FromEventObservable.setupSubscription = function (sourceObj, eventName, handler, subscriber) {
        var unsubscribe;
        if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
            for (var i = 0, len = sourceObj.length; i < len; i++) {
                FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber);
            }
        }
        else if (isEventTarget(sourceObj)) {
            sourceObj.addEventListener(eventName, handler);
            unsubscribe = function () { return sourceObj.removeEventListener(eventName, handler); };
        }
        else if (isJQueryStyleEventEmitter(sourceObj)) {
            sourceObj.on(eventName, handler);
            unsubscribe = function () { return sourceObj.off(eventName, handler); };
        }
        else if (isNodeStyleEventEmmitter(sourceObj)) {
            sourceObj.addListener(eventName, handler);
            unsubscribe = function () { return sourceObj.removeListener(eventName, handler); };
        }
        subscriber.add(new Subscription_1.Subscription(unsubscribe));
    };
    FromEventObservable.prototype._subscribe = function (subscriber) {
        var sourceObj = this.sourceObj;
        var eventName = this.eventName;
        var selector = this.selector;
        var handler = selector ? function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var result = tryCatch_1.tryCatch(selector).apply(void 0, args);
            if (result === errorObject_1.errorObject) {
                subscriber.error(errorObject_1.errorObject.e);
            }
            else {
                subscriber.next(result);
            }
        } : function (e) { return subscriber.next(e); };
        FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber);
    };
    return FromEventObservable;
}(Observable_1.Observable));
exports.FromEventObservable = FromEventObservable;

},{"../Observable":9,"../Subscription":16,"../util/errorObject":245,"../util/tryCatch":259}],131:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var Subscription_1 = require('../Subscription');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var FromEventPatternObservable = (function (_super) {
    __extends(FromEventPatternObservable, _super);
    function FromEventPatternObservable(addHandler, removeHandler, selector) {
        _super.call(this);
        this.addHandler = addHandler;
        this.removeHandler = removeHandler;
        this.selector = selector;
    }
    FromEventPatternObservable.create = function (addHandler, removeHandler, selector) {
        return new FromEventPatternObservable(addHandler, removeHandler, selector);
    };
    FromEventPatternObservable.prototype._subscribe = function (subscriber) {
        var addHandler = this.addHandler;
        var removeHandler = this.removeHandler;
        var selector = this.selector;
        var handler = selector ? function (e) {
            var result = tryCatch_1.tryCatch(selector).apply(null, arguments);
            if (result === errorObject_1.errorObject) {
                subscriber.error(result.e);
            }
            else {
                subscriber.next(result);
            }
        } : function (e) { subscriber.next(e); };
        var result = tryCatch_1.tryCatch(addHandler)(handler);
        if (result === errorObject_1.errorObject) {
            subscriber.error(result.e);
        }
        subscriber.add(new Subscription_1.Subscription(function () {
            //TODO: determine whether or not to forward to error handler
            removeHandler(handler);
        }));
    };
    return FromEventPatternObservable;
}(Observable_1.Observable));
exports.FromEventPatternObservable = FromEventPatternObservable;

},{"../Observable":9,"../Subscription":16,"../util/errorObject":245,"../util/tryCatch":259}],132:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isArray_1 = require('../util/isArray');
var isFunction_1 = require('../util/isFunction');
var isPromise_1 = require('../util/isPromise');
var isScheduler_1 = require('../util/isScheduler');
var PromiseObservable_1 = require('./PromiseObservable');
var IteratorObservable_1 = require('./IteratorObservable');
var ArrayObservable_1 = require('./ArrayObservable');
var ArrayLikeObservable_1 = require('./ArrayLikeObservable');
var SymbolShim_1 = require('../util/SymbolShim');
var Observable_1 = require('../Observable');
var observeOn_1 = require('../operator/observeOn');
var isArrayLike = (function (x) { return x && typeof x.length === 'number'; });
var FromObservable = (function (_super) {
    __extends(FromObservable, _super);
    function FromObservable(ish, scheduler) {
        _super.call(this, null);
        this.ish = ish;
        this.scheduler = scheduler;
    }
    FromObservable.create = function (ish, mapFnOrScheduler, thisArg, lastScheduler) {
        var scheduler = null;
        var mapFn = null;
        if (isFunction_1.isFunction(mapFnOrScheduler)) {
            scheduler = lastScheduler || null;
            mapFn = mapFnOrScheduler;
        }
        else if (isScheduler_1.isScheduler(scheduler)) {
            scheduler = mapFnOrScheduler;
        }
        if (ish != null) {
            if (typeof ish[SymbolShim_1.SymbolShim.observable] === 'function') {
                if (ish instanceof Observable_1.Observable && !scheduler) {
                    return ish;
                }
                return new FromObservable(ish, scheduler);
            }
            else if (isArray_1.isArray(ish)) {
                return new ArrayObservable_1.ArrayObservable(ish, scheduler);
            }
            else if (isPromise_1.isPromise(ish)) {
                return new PromiseObservable_1.PromiseObservable(ish, scheduler);
            }
            else if (typeof ish[SymbolShim_1.SymbolShim.iterator] === 'function' || typeof ish === 'string') {
                return new IteratorObservable_1.IteratorObservable(ish, null, null, scheduler);
            }
            else if (isArrayLike(ish)) {
                return new ArrayLikeObservable_1.ArrayLikeObservable(ish, mapFn, thisArg, scheduler);
            }
        }
        throw new TypeError((ish !== null && typeof ish || ish) + ' is not observable');
    };
    FromObservable.prototype._subscribe = function (subscriber) {
        var ish = this.ish;
        var scheduler = this.scheduler;
        if (scheduler == null) {
            return ish[SymbolShim_1.SymbolShim.observable]().subscribe(subscriber);
        }
        else {
            return ish[SymbolShim_1.SymbolShim.observable]().subscribe(new observeOn_1.ObserveOnSubscriber(subscriber, scheduler, 0));
        }
    };
    return FromObservable;
}(Observable_1.Observable));
exports.FromObservable = FromObservable;

},{"../Observable":9,"../operator/observeOn":182,"../util/SymbolShim":244,"../util/isArray":246,"../util/isFunction":248,"../util/isPromise":251,"../util/isScheduler":252,"./ArrayLikeObservable":121,"./ArrayObservable":122,"./IteratorObservable":134,"./PromiseObservable":136}],133:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isNumeric_1 = require('../util/isNumeric');
var Observable_1 = require('../Observable');
var asap_1 = require('../scheduler/asap');
var IntervalObservable = (function (_super) {
    __extends(IntervalObservable, _super);
    function IntervalObservable(period, scheduler) {
        if (period === void 0) { period = 0; }
        if (scheduler === void 0) { scheduler = asap_1.asap; }
        _super.call(this);
        this.period = period;
        this.scheduler = scheduler;
        if (!isNumeric_1.isNumeric(period) || period < 0) {
            this.period = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            this.scheduler = asap_1.asap;
        }
    }
    IntervalObservable.create = function (period, scheduler) {
        if (period === void 0) { period = 0; }
        if (scheduler === void 0) { scheduler = asap_1.asap; }
        return new IntervalObservable(period, scheduler);
    };
    IntervalObservable.dispatch = function (state) {
        var index = state.index, subscriber = state.subscriber, period = state.period;
        subscriber.next(index);
        if (subscriber.isUnsubscribed) {
            return;
        }
        state.index += 1;
        this.schedule(state, period);
    };
    IntervalObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var period = this.period;
        var scheduler = this.scheduler;
        subscriber.add(scheduler.schedule(IntervalObservable.dispatch, period, {
            index: index, subscriber: subscriber, period: period
        }));
    };
    return IntervalObservable;
}(Observable_1.Observable));
exports.IntervalObservable = IntervalObservable;

},{"../Observable":9,"../scheduler/asap":230,"../util/isNumeric":249}],134:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1 = require('../util/root');
var isObject_1 = require('../util/isObject');
var tryCatch_1 = require('../util/tryCatch');
var Observable_1 = require('../Observable');
var isFunction_1 = require('../util/isFunction');
var SymbolShim_1 = require('../util/SymbolShim');
var errorObject_1 = require('../util/errorObject');
var IteratorObservable = (function (_super) {
    __extends(IteratorObservable, _super);
    function IteratorObservable(iterator, project, thisArg, scheduler) {
        _super.call(this);
        if (iterator == null) {
            throw new Error('iterator cannot be null.');
        }
        if (isObject_1.isObject(project)) {
            this.thisArg = project;
            this.scheduler = thisArg;
        }
        else if (isFunction_1.isFunction(project)) {
            this.project = project;
            this.thisArg = thisArg;
            this.scheduler = scheduler;
        }
        else if (project != null) {
            throw new Error('When provided, `project` must be a function.');
        }
        this.iterator = getIterator(iterator);
    }
    IteratorObservable.create = function (iterator, project, thisArg, scheduler) {
        return new IteratorObservable(iterator, project, thisArg, scheduler);
    };
    IteratorObservable.dispatch = function (state) {
        var index = state.index, hasError = state.hasError, thisArg = state.thisArg, project = state.project, iterator = state.iterator, subscriber = state.subscriber;
        if (hasError) {
            subscriber.error(state.error);
            return;
        }
        var result = iterator.next();
        if (result.done) {
            subscriber.complete();
            return;
        }
        if (project) {
            result = tryCatch_1.tryCatch(project).call(thisArg, result.value, index);
            if (result === errorObject_1.errorObject) {
                state.error = errorObject_1.errorObject.e;
                state.hasError = true;
            }
            else {
                subscriber.next(result);
                state.index = index + 1;
            }
        }
        else {
            subscriber.next(result.value);
            state.index = index + 1;
        }
        if (subscriber.isUnsubscribed) {
            return;
        }
        this.schedule(state);
    };
    IteratorObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this, iterator = _a.iterator, project = _a.project, thisArg = _a.thisArg, scheduler = _a.scheduler;
        if (scheduler) {
            return scheduler.schedule(IteratorObservable.dispatch, 0, {
                index: index, thisArg: thisArg, project: project, iterator: iterator, subscriber: subscriber
            });
        }
        else {
            do {
                var result = iterator.next();
                if (result.done) {
                    subscriber.complete();
                    break;
                }
                else if (project) {
                    result = tryCatch_1.tryCatch(project).call(thisArg, result.value, index++);
                    if (result === errorObject_1.errorObject) {
                        subscriber.error(errorObject_1.errorObject.e);
                        break;
                    }
                    subscriber.next(result);
                }
                else {
                    subscriber.next(result.value);
                }
                if (subscriber.isUnsubscribed) {
                    break;
                }
            } while (true);
        }
    };
    return IteratorObservable;
}(Observable_1.Observable));
exports.IteratorObservable = IteratorObservable;
var StringIterator = (function () {
    function StringIterator(str, idx, len) {
        if (idx === void 0) { idx = 0; }
        if (len === void 0) { len = str.length; }
        this.str = str;
        this.idx = idx;
        this.len = len;
    }
    StringIterator.prototype[SymbolShim_1.SymbolShim.iterator] = function () { return (this); };
    StringIterator.prototype.next = function () {
        return this.idx < this.len ? {
            done: false,
            value: this.str.charAt(this.idx++)
        } : {
            done: true,
            value: undefined
        };
    };
    return StringIterator;
}());
var ArrayIterator = (function () {
    function ArrayIterator(arr, idx, len) {
        if (idx === void 0) { idx = 0; }
        if (len === void 0) { len = toLength(arr); }
        this.arr = arr;
        this.idx = idx;
        this.len = len;
    }
    ArrayIterator.prototype[SymbolShim_1.SymbolShim.iterator] = function () { return this; };
    ArrayIterator.prototype.next = function () {
        return this.idx < this.len ? {
            done: false,
            value: this.arr[this.idx++]
        } : {
            done: true,
            value: undefined
        };
    };
    return ArrayIterator;
}());
function getIterator(obj) {
    var i = obj[SymbolShim_1.SymbolShim.iterator];
    if (!i && typeof obj === 'string') {
        return new StringIterator(obj);
    }
    if (!i && obj.length !== undefined) {
        return new ArrayIterator(obj);
    }
    if (!i) {
        throw new TypeError('Object is not iterable');
    }
    return obj[SymbolShim_1.SymbolShim.iterator]();
}
var maxSafeInteger = Math.pow(2, 53) - 1;
function toLength(o) {
    var len = +o.length;
    if (isNaN(len)) {
        return 0;
    }
    if (len === 0 || !numberIsFinite(len)) {
        return len;
    }
    len = sign(len) * Math.floor(Math.abs(len));
    if (len <= 0) {
        return 0;
    }
    if (len > maxSafeInteger) {
        return maxSafeInteger;
    }
    return len;
}
function numberIsFinite(value) {
    return typeof value === 'number' && root_1.root.isFinite(value);
}
function sign(value) {
    var valueAsNumber = +value;
    if (valueAsNumber === 0) {
        return valueAsNumber;
    }
    if (isNaN(valueAsNumber)) {
        return valueAsNumber;
    }
    return valueAsNumber < 0 ? -1 : 1;
}

},{"../Observable":9,"../util/SymbolShim":244,"../util/errorObject":245,"../util/isFunction":248,"../util/isObject":250,"../util/root":255,"../util/tryCatch":259}],135:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var noop_1 = require('../util/noop');
var NeverObservable = (function (_super) {
    __extends(NeverObservable, _super);
    function NeverObservable() {
        _super.call(this);
    }
    NeverObservable.create = function () {
        return new NeverObservable();
    };
    NeverObservable.prototype._subscribe = function (subscriber) {
        noop_1.noop();
    };
    return NeverObservable;
}(Observable_1.Observable));
exports.NeverObservable = NeverObservable;

},{"../Observable":9,"../util/noop":253}],136:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1 = require('../util/root');
var Observable_1 = require('../Observable');
var PromiseObservable = (function (_super) {
    __extends(PromiseObservable, _super);
    function PromiseObservable(promise, scheduler) {
        if (scheduler === void 0) { scheduler = null; }
        _super.call(this);
        this.promise = promise;
        this.scheduler = scheduler;
    }
    PromiseObservable.create = function (promise, scheduler) {
        if (scheduler === void 0) { scheduler = null; }
        return new PromiseObservable(promise, scheduler);
    };
    PromiseObservable.prototype._subscribe = function (subscriber) {
        var _this = this;
        var promise = this.promise;
        var scheduler = this.scheduler;
        if (scheduler == null) {
            if (this._isScalar) {
                if (!subscriber.isUnsubscribed) {
                    subscriber.next(this.value);
                    subscriber.complete();
                }
            }
            else {
                promise.then(function (value) {
                    _this.value = value;
                    _this._isScalar = true;
                    if (!subscriber.isUnsubscribed) {
                        subscriber.next(value);
                        subscriber.complete();
                    }
                }, function (err) {
                    if (!subscriber.isUnsubscribed) {
                        subscriber.error(err);
                    }
                })
                    .then(null, function (err) {
                    // escape the promise trap, throw unhandled errors
                    root_1.root.setTimeout(function () { throw err; });
                });
            }
        }
        else {
            if (this._isScalar) {
                if (!subscriber.isUnsubscribed) {
                    return scheduler.schedule(dispatchNext, 0, { value: this.value, subscriber: subscriber });
                }
            }
            else {
                promise.then(function (value) {
                    _this.value = value;
                    _this._isScalar = true;
                    if (!subscriber.isUnsubscribed) {
                        subscriber.add(scheduler.schedule(dispatchNext, 0, { value: value, subscriber: subscriber }));
                    }
                }, function (err) {
                    if (!subscriber.isUnsubscribed) {
                        subscriber.add(scheduler.schedule(dispatchError, 0, { err: err, subscriber: subscriber }));
                    }
                })
                    .then(null, function (err) {
                    // escape the promise trap, throw unhandled errors
                    root_1.root.setTimeout(function () { throw err; });
                });
            }
        }
    };
    return PromiseObservable;
}(Observable_1.Observable));
exports.PromiseObservable = PromiseObservable;
function dispatchNext(_a) {
    var value = _a.value, subscriber = _a.subscriber;
    if (!subscriber.isUnsubscribed) {
        subscriber.next(value);
        subscriber.complete();
    }
}
function dispatchError(_a) {
    var err = _a.err, subscriber = _a.subscriber;
    if (!subscriber.isUnsubscribed) {
        subscriber.error(err);
    }
}

},{"../Observable":9,"../util/root":255}],137:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var RangeObservable = (function (_super) {
    __extends(RangeObservable, _super);
    function RangeObservable(start, end, scheduler) {
        _super.call(this);
        this.start = start;
        this.end = end;
        this.scheduler = scheduler;
    }
    RangeObservable.create = function (start, end, scheduler) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = 0; }
        return new RangeObservable(start, end, scheduler);
    };
    RangeObservable.dispatch = function (state) {
        var start = state.start, index = state.index, end = state.end, subscriber = state.subscriber;
        if (index >= end) {
            subscriber.complete();
            return;
        }
        subscriber.next(start);
        if (subscriber.isUnsubscribed) {
            return;
        }
        state.index = index + 1;
        state.start = start + 1;
        this.schedule(state);
    };
    RangeObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var start = this.start;
        var end = this.end;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(RangeObservable.dispatch, 0, {
                index: index, end: end, start: start, subscriber: subscriber
            });
        }
        else {
            do {
                if (index++ >= end) {
                    subscriber.complete();
                    break;
                }
                subscriber.next(start++);
                if (subscriber.isUnsubscribed) {
                    break;
                }
            } while (true);
        }
    };
    return RangeObservable;
}(Observable_1.Observable));
exports.RangeObservable = RangeObservable;

},{"../Observable":9}],138:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var ScalarObservable = (function (_super) {
    __extends(ScalarObservable, _super);
    function ScalarObservable(value, scheduler) {
        _super.call(this);
        this.value = value;
        this.scheduler = scheduler;
        this._isScalar = true;
    }
    ScalarObservable.create = function (value, scheduler) {
        return new ScalarObservable(value, scheduler);
    };
    ScalarObservable.dispatch = function (state) {
        var done = state.done, value = state.value, subscriber = state.subscriber;
        if (done) {
            subscriber.complete();
            return;
        }
        subscriber.next(value);
        if (subscriber.isUnsubscribed) {
            return;
        }
        state.done = true;
        this.schedule(state);
    };
    ScalarObservable.prototype._subscribe = function (subscriber) {
        var value = this.value;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ScalarObservable.dispatch, 0, {
                done: false, value: value, subscriber: subscriber
            });
        }
        else {
            subscriber.next(value);
            if (!subscriber.isUnsubscribed) {
                subscriber.complete();
            }
        }
    };
    return ScalarObservable;
}(Observable_1.Observable));
exports.ScalarObservable = ScalarObservable;

},{"../Observable":9}],139:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var asap_1 = require('../scheduler/asap');
var isNumeric_1 = require('../util/isNumeric');
var SubscribeOnObservable = (function (_super) {
    __extends(SubscribeOnObservable, _super);
    function SubscribeOnObservable(source, delayTime, scheduler) {
        if (delayTime === void 0) { delayTime = 0; }
        if (scheduler === void 0) { scheduler = asap_1.asap; }
        _super.call(this);
        this.source = source;
        this.delayTime = delayTime;
        this.scheduler = scheduler;
        if (!isNumeric_1.isNumeric(delayTime) || delayTime < 0) {
            this.delayTime = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            this.scheduler = asap_1.asap;
        }
    }
    SubscribeOnObservable.create = function (source, delay, scheduler) {
        if (delay === void 0) { delay = 0; }
        if (scheduler === void 0) { scheduler = asap_1.asap; }
        return new SubscribeOnObservable(source, delay, scheduler);
    };
    SubscribeOnObservable.dispatch = function (_a) {
        var source = _a.source, subscriber = _a.subscriber;
        return source.subscribe(subscriber);
    };
    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
        var delay = this.delayTime;
        var source = this.source;
        var scheduler = this.scheduler;
        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
            source: source, subscriber: subscriber
        });
    };
    return SubscribeOnObservable;
}(Observable_1.Observable));
exports.SubscribeOnObservable = SubscribeOnObservable;

},{"../Observable":9,"../scheduler/asap":230,"../util/isNumeric":249}],140:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isNumeric_1 = require('../util/isNumeric');
var Observable_1 = require('../Observable');
var asap_1 = require('../scheduler/asap');
var isScheduler_1 = require('../util/isScheduler');
var isDate_1 = require('../util/isDate');
var TimerObservable = (function (_super) {
    __extends(TimerObservable, _super);
    function TimerObservable(dueTime, period, scheduler) {
        if (dueTime === void 0) { dueTime = 0; }
        _super.call(this);
        this.period = -1;
        this.dueTime = 0;
        if (isNumeric_1.isNumeric(period)) {
            this.period = Number(period) < 1 && 1 || Number(period);
        }
        else if (isScheduler_1.isScheduler(period)) {
            scheduler = period;
        }
        if (!isScheduler_1.isScheduler(scheduler)) {
            scheduler = asap_1.asap;
        }
        this.scheduler = scheduler;
        this.dueTime = isDate_1.isDate(dueTime) ?
            (+dueTime - this.scheduler.now()) :
            dueTime;
    }
    TimerObservable.create = function (dueTime, period, scheduler) {
        if (dueTime === void 0) { dueTime = 0; }
        return new TimerObservable(dueTime, period, scheduler);
    };
    TimerObservable.dispatch = function (state) {
        var index = state.index, period = state.period, subscriber = state.subscriber;
        var action = this;
        subscriber.next(index);
        if (subscriber.isUnsubscribed) {
            return;
        }
        else if (period === -1) {
            return subscriber.complete();
        }
        state.index = index + 1;
        action.schedule(state, period);
    };
    TimerObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this, period = _a.period, dueTime = _a.dueTime, scheduler = _a.scheduler;
        return scheduler.schedule(TimerObservable.dispatch, dueTime, {
            index: index, period: period, subscriber: subscriber
        });
    };
    return TimerObservable;
}(Observable_1.Observable));
exports.TimerObservable = TimerObservable;

},{"../Observable":9,"../scheduler/asap":230,"../util/isDate":247,"../util/isNumeric":249,"../util/isScheduler":252}],141:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Buffers the incoming observable values until the passed `closingNotifier`
 * emits a value, at which point it emits the buffer on the returned observable
 * and starts a new buffer internally, awaiting the next time `closingNotifier`
 * emits.
 *
 * <img src="./img/buffer.png" width="100%">
 *
 * @param {Observable<any>} closingNotifier an Observable that signals the
 * buffer to be emitted} from the returned observable.
 * @returns {Observable<T[]>} an Observable of buffers, which are arrays of
 * values.
 */
function buffer(closingNotifier) {
    return this.lift(new BufferOperator(closingNotifier));
}
exports.buffer = buffer;
var BufferOperator = (function () {
    function BufferOperator(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    BufferOperator.prototype.call = function (subscriber) {
        return new BufferSubscriber(subscriber, this.closingNotifier);
    };
    return BufferOperator;
}());
var BufferSubscriber = (function (_super) {
    __extends(BufferSubscriber, _super);
    function BufferSubscriber(destination, closingNotifier) {
        _super.call(this, destination);
        this.buffer = [];
        this.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
    }
    BufferSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
    };
    return BufferSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],142:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Buffers a number of values from the source observable by `bufferSize` then
 * emits the buffer and clears it, and starts a new buffer each
 * `startBufferEvery` values. If `startBufferEvery` is not provided or is
 * `null`, then new buffers are started immediately at the start of the source
 * and when each buffer closes and is emitted.
 *
 * <img src="./img/bufferCount.png" width="100%">
 *
 * @param {number} bufferSize the maximum size of the buffer emitted.
 * @param {number} [startBufferEvery] optional interval at which to start a new
 * buffer. (e.g. if `startBufferEvery` is `2`, then a new buffer will be started
 * on every other value from the source.) A new buffer is started at the
 * beginning of the source by default.
 * @returns {Observable<T[]>} an Observable of arrays of buffered values.
 */
function bufferCount(bufferSize, startBufferEvery) {
    if (startBufferEvery === void 0) { startBufferEvery = null; }
    return this.lift(new BufferCountOperator(bufferSize, startBufferEvery));
}
exports.bufferCount = bufferCount;
var BufferCountOperator = (function () {
    function BufferCountOperator(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
    }
    BufferCountOperator.prototype.call = function (subscriber) {
        return new BufferCountSubscriber(subscriber, this.bufferSize, this.startBufferEvery);
    };
    return BufferCountOperator;
}());
var BufferCountSubscriber = (function (_super) {
    __extends(BufferCountSubscriber, _super);
    function BufferCountSubscriber(destination, bufferSize, startBufferEvery) {
        _super.call(this, destination);
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        this.buffers = [[]];
        this.count = 0;
    }
    BufferCountSubscriber.prototype._next = function (value) {
        var count = (this.count += 1);
        var destination = this.destination;
        var bufferSize = this.bufferSize;
        var startBufferEvery = (this.startBufferEvery == null) ? bufferSize : this.startBufferEvery;
        var buffers = this.buffers;
        var len = buffers.length;
        var remove = -1;
        if (count % startBufferEvery === 0) {
            buffers.push([]);
        }
        for (var i = 0; i < len; i++) {
            var buffer = buffers[i];
            buffer.push(value);
            if (buffer.length === bufferSize) {
                remove = i;
                destination.next(buffer);
            }
        }
        if (remove !== -1) {
            buffers.splice(remove, 1);
        }
    };
    BufferCountSubscriber.prototype._complete = function () {
        var destination = this.destination;
        var buffers = this.buffers;
        while (buffers.length > 0) {
            var buffer = buffers.shift();
            if (buffer.length > 0) {
                destination.next(buffer);
            }
        }
        _super.prototype._complete.call(this);
    };
    return BufferCountSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],143:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var asap_1 = require('../scheduler/asap');
/**
 * Buffers values from the source for a specific time period. Optionally allows
 * new buffers to be set up at an interval.
 *
 * <img src="./img/bufferTime.png" width="100%">
 *
 * @param {number} bufferTimeSpan the amount of time to fill each buffer for
 * before emitting them and clearing them.
 * @param {number} [bufferCreationInterval] the interval at which to start new
 * buffers.
 * @param {Scheduler} [scheduler] (optional, defaults to `asap` scheduler) The
 * scheduler on which to schedule the intervals that determine buffer
 * boundaries.
 * @returns {Observable<T[]>} an observable of arrays of buffered values.
 */
function bufferTime(bufferTimeSpan, bufferCreationInterval, scheduler) {
    if (bufferCreationInterval === void 0) { bufferCreationInterval = null; }
    if (scheduler === void 0) { scheduler = asap_1.asap; }
    return this.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, scheduler));
}
exports.bufferTime = bufferTime;
var BufferTimeOperator = (function () {
    function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, scheduler) {
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.scheduler = scheduler;
    }
    BufferTimeOperator.prototype.call = function (subscriber) {
        return new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.scheduler);
    };
    return BufferTimeOperator;
}());
var BufferTimeSubscriber = (function (_super) {
    __extends(BufferTimeSubscriber, _super);
    function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, scheduler) {
        _super.call(this, destination);
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.scheduler = scheduler;
        this.buffers = [];
        var buffer = this.openBuffer();
        if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
            var closeState = { subscriber: this, buffer: buffer };
            var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: this, scheduler: scheduler };
            this.add(scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
            this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
        }
        else {
            var timeSpanOnlyState = { subscriber: this, buffer: buffer, bufferTimeSpan: bufferTimeSpan };
            this.add(scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
    }
    BufferTimeSubscriber.prototype._next = function (value) {
        var buffers = this.buffers;
        var len = buffers.length;
        for (var i = 0; i < len; i++) {
            buffers[i].push(value);
        }
    };
    BufferTimeSubscriber.prototype._error = function (err) {
        this.buffers.length = 0;
        _super.prototype._error.call(this, err);
    };
    BufferTimeSubscriber.prototype._complete = function () {
        var _a = this, buffers = _a.buffers, destination = _a.destination;
        while (buffers.length > 0) {
            destination.next(buffers.shift());
        }
        _super.prototype._complete.call(this);
    };
    BufferTimeSubscriber.prototype._unsubscribe = function () {
        this.buffers = null;
    };
    BufferTimeSubscriber.prototype.openBuffer = function () {
        var buffer = [];
        this.buffers.push(buffer);
        return buffer;
    };
    BufferTimeSubscriber.prototype.closeBuffer = function (buffer) {
        this.destination.next(buffer);
        var buffers = this.buffers;
        buffers.splice(buffers.indexOf(buffer), 1);
    };
    return BufferTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchBufferTimeSpanOnly(state) {
    var subscriber = state.subscriber;
    var prevBuffer = state.buffer;
    if (prevBuffer) {
        subscriber.closeBuffer(prevBuffer);
    }
    state.buffer = subscriber.openBuffer();
    if (!subscriber.isUnsubscribed) {
        this.schedule(state, state.bufferTimeSpan);
    }
}
function dispatchBufferCreation(state) {
    var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
    var buffer = subscriber.openBuffer();
    var action = this;
    if (!subscriber.isUnsubscribed) {
        action.add(scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, buffer: buffer }));
        action.schedule(state, bufferCreationInterval);
    }
}
function dispatchBufferClose(_a) {
    var subscriber = _a.subscriber, buffer = _a.buffer;
    subscriber.closeBuffer(buffer);
}

},{"../Subscriber":15,"../scheduler/asap":230}],144:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Subscription_1 = require('../Subscription');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
/**
 * Buffers values from the source by opening the buffer via signals from an
 * Observable provided to `openings`, and closing and sending the buffers when
 * an Observable returned by the `closingSelector` emits.
 *
 * <img src="./img/bufferToggle.png" width="100%">
 *
 * @param {Observable<O>} openings An observable of notifications to start new
 * buffers.
 * @param {Function} closingSelector a function that takes the value emitted by
 * the `openings` observable and returns an Observable, which, when it emits,
 * signals that the associated buffer should be emitted and cleared.
 * @returns {Observable<T[]>} an observable of arrays of buffered values.
 */
function bufferToggle(openings, closingSelector) {
    return this.lift(new BufferToggleOperator(openings, closingSelector));
}
exports.bufferToggle = bufferToggle;
var BufferToggleOperator = (function () {
    function BufferToggleOperator(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    BufferToggleOperator.prototype.call = function (subscriber) {
        return new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector);
    };
    return BufferToggleOperator;
}());
var BufferToggleSubscriber = (function (_super) {
    __extends(BufferToggleSubscriber, _super);
    function BufferToggleSubscriber(destination, openings, closingSelector) {
        _super.call(this, destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(this.openings.subscribe(new BufferToggleOpeningsSubscriber(this)));
    }
    BufferToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        for (var i = 0; i < len; i++) {
            contexts[i].buffer.push(value);
        }
    };
    BufferToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context = contexts.shift();
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        _super.prototype._error.call(this, err);
    };
    BufferToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context = contexts.shift();
            this.destination.next(context.buffer);
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        _super.prototype._complete.call(this);
    };
    BufferToggleSubscriber.prototype.openBuffer = function (value) {
        var closingSelector = this.closingSelector;
        var contexts = this.contexts;
        var closingNotifier = tryCatch_1.tryCatch(closingSelector)(value);
        if (closingNotifier === errorObject_1.errorObject) {
            this._error(errorObject_1.errorObject.e);
        }
        else {
            var context = {
                buffer: [],
                subscription: new Subscription_1.Subscription()
            };
            contexts.push(context);
            var subscriber = new BufferToggleClosingsSubscriber(this, context);
            var subscription = closingNotifier.subscribe(subscriber);
            context.subscription.add(subscription);
            this.add(subscription);
        }
    };
    BufferToggleSubscriber.prototype.closeBuffer = function (context) {
        var contexts = this.contexts;
        if (contexts === null) {
            return;
        }
        var buffer = context.buffer, subscription = context.subscription;
        this.destination.next(buffer);
        contexts.splice(contexts.indexOf(context), 1);
        this.remove(subscription);
        subscription.unsubscribe();
    };
    return BufferToggleSubscriber;
}(Subscriber_1.Subscriber));
var BufferToggleOpeningsSubscriber = (function (_super) {
    __extends(BufferToggleOpeningsSubscriber, _super);
    function BufferToggleOpeningsSubscriber(parent) {
        _super.call(this, null);
        this.parent = parent;
    }
    BufferToggleOpeningsSubscriber.prototype._next = function (value) {
        this.parent.openBuffer(value);
    };
    BufferToggleOpeningsSubscriber.prototype._error = function (err) {
        this.parent.error(err);
    };
    BufferToggleOpeningsSubscriber.prototype._complete = function () {
        // noop
    };
    return BufferToggleOpeningsSubscriber;
}(Subscriber_1.Subscriber));
var BufferToggleClosingsSubscriber = (function (_super) {
    __extends(BufferToggleClosingsSubscriber, _super);
    function BufferToggleClosingsSubscriber(parent, context) {
        _super.call(this, null);
        this.parent = parent;
        this.context = context;
    }
    BufferToggleClosingsSubscriber.prototype._next = function () {
        this.parent.closeBuffer(this.context);
    };
    BufferToggleClosingsSubscriber.prototype._error = function (err) {
        this.parent.error(err);
    };
    BufferToggleClosingsSubscriber.prototype._complete = function () {
        this.parent.closeBuffer(this.context);
    };
    return BufferToggleClosingsSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../Subscription":16,"../util/errorObject":245,"../util/tryCatch":259}],145:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = require('../Subscription');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Opens a buffer immediately, then closes the buffer when the observable
 * returned by calling `closingSelector` emits a value. It that immediately
 * opens a new buffer and repeats the process.
 *
 * <img src="./img/bufferWhen.png" width="100%">
 *
 * @param {function} closingSelector a function that takes no arguments and
 * returns an Observable that signals buffer closure.
 * @returns {Observable<T[]>} an observable of arrays of buffered values.
 */
function bufferWhen(closingSelector) {
    return this.lift(new BufferWhenOperator(closingSelector));
}
exports.bufferWhen = bufferWhen;
var BufferWhenOperator = (function () {
    function BufferWhenOperator(closingSelector) {
        this.closingSelector = closingSelector;
    }
    BufferWhenOperator.prototype.call = function (subscriber) {
        return new BufferWhenSubscriber(subscriber, this.closingSelector);
    };
    return BufferWhenOperator;
}());
var BufferWhenSubscriber = (function (_super) {
    __extends(BufferWhenSubscriber, _super);
    function BufferWhenSubscriber(destination, closingSelector) {
        _super.call(this, destination);
        this.closingSelector = closingSelector;
        this.subscribing = false;
        this.openBuffer();
    }
    BufferWhenSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferWhenSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    BufferWhenSubscriber.prototype._unsubscribe = function () {
        this.buffer = null;
        this.subscribing = false;
    };
    BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openBuffer();
    };
    BufferWhenSubscriber.prototype.notifyComplete = function () {
        if (this.subscribing) {
            this.complete();
        }
        else {
            this.openBuffer();
        }
    };
    BufferWhenSubscriber.prototype.openBuffer = function () {
        var closingSubscription = this.closingSubscription;
        if (closingSubscription) {
            this.remove(closingSubscription);
            closingSubscription.unsubscribe();
        }
        var buffer = this.buffer;
        if (this.buffer) {
            this.destination.next(buffer);
        }
        this.buffer = [];
        var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject_1.errorObject) {
            this.error(errorObject_1.errorObject.e);
        }
        else {
            closingSubscription = new Subscription_1.Subscription();
            this.closingSubscription = closingSubscription;
            this.add(closingSubscription);
            this.subscribing = true;
            closingSubscription.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
            this.subscribing = false;
        }
    };
    return BufferWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../Subscription":16,"../util/errorObject":245,"../util/subscribeToResult":256,"../util/tryCatch":259}],146:[function(require,module,exports){
"use strict";
var publishReplay_1 = require('./publishReplay');
function cache(bufferSize, windowTime, scheduler) {
    if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
    if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
    return publishReplay_1.publishReplay.call(this, bufferSize, windowTime, scheduler).refCount();
}
exports.cache = cache;

},{"./publishReplay":188}],147:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Catches errors on the observable to be handled by returning a new observable or throwing an error.
 * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
 *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
 *  is returned by the `selector` will be used to continue the observable chain.
 * @return {Observable} an observable that originates from either the source or the observable returned by the
 *  catch `selector` function.
 */
function _catch(selector) {
    var operator = new CatchOperator(selector);
    var caught = this.lift(operator);
    return (operator.caught = caught);
}
exports._catch = _catch;
var CatchOperator = (function () {
    function CatchOperator(selector) {
        this.selector = selector;
    }
    CatchOperator.prototype.call = function (subscriber) {
        return new CatchSubscriber(subscriber, this.selector, this.caught);
    };
    return CatchOperator;
}());
var CatchSubscriber = (function (_super) {
    __extends(CatchSubscriber, _super);
    function CatchSubscriber(destination, selector, caught) {
        _super.call(this, destination);
        this.selector = selector;
        this.caught = caught;
    }
    // NOTE: overriding `error` instead of `_error` because we don't want
    // to have this flag this subscriber as `isStopped`.
    CatchSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var result = void 0;
            try {
                result = this.selector(err, this.caught);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this._innerSub(result);
        }
    };
    CatchSubscriber.prototype._innerSub = function (result) {
        this.unsubscribe();
        this.destination.remove(this);
        result.subscribe(this.destination);
    };
    return CatchSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],148:[function(require,module,exports){
"use strict";
var combineLatest_1 = require('./combineLatest');
/**
 * Takes an Observable of Observables, and collects all observables from it. Once the outer observable
 * completes, it subscribes to all collected observables and "combines" their values, such that:
 *  - every time an observable emits, the returned observable emits
 *  - when the returned observable emits, it emits all of the most recent values by:
 *    - if a `project` function is provided, it is called with each recent value from each observable in whatever order they arrived,
 *      and the result of the `project` function is what is emitted by the returned observable
 *    - if there is no `project` function, an array of all of the most recent values is emitted by the returned observable.
 * @param {function} [project] an optional function to map the most recent values from each observable into a new result. Takes each of the
 *   most recent values from each collected observable as arguments, in order.
 * @returns {Observable} an observable of projected results or arrays of recent values.
 */
function combineAll(project) {
    return this.lift(new combineLatest_1.CombineLatestOperator(project));
}
exports.combineAll = combineAll;

},{"./combineLatest":149}],149:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArrayObservable_1 = require('../observable/ArrayObservable');
var isArray_1 = require('../util/isArray');
var isScheduler_1 = require('../util/isScheduler');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Combines the values from this observable with values from observables passed as arguments. This is done by subscribing
 * to each observable, in order, and collecting an array of each of the most recent values any time any of the observables
 * emits, then either taking that array and passing it as arguments to an option `project` function and emitting the return
 * value of that, or just emitting the array of recent values directly if there is no `project` function.
 * @param {...Observable} observables the observables to combine the source with
 * @param {function} [project] an optional function to project the values from the combined recent values into a new value for emission.
 * @returns {Observable} an observable of other projected values from the most recent values from each observable, or an array of each of
 * the most recent values from each observable.
 */
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
        observables = observables[0];
    }
    observables.unshift(this);
    return new ArrayObservable_1.ArrayObservable(observables).lift(new CombineLatestOperator(project));
}
exports.combineLatest = combineLatest;
/* tslint:enable:max-line-length */
function combineLatestStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    var scheduler = null;
    if (isScheduler_1.isScheduler(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
        observables = observables[0];
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new CombineLatestOperator(project));
}
exports.combineLatestStatic = combineLatestStatic;
var CombineLatestOperator = (function () {
    function CombineLatestOperator(project) {
        this.project = project;
    }
    CombineLatestOperator.prototype.call = function (subscriber) {
        return new CombineLatestSubscriber(subscriber, this.project);
    };
    return CombineLatestOperator;
}());
exports.CombineLatestOperator = CombineLatestOperator;
var CombineLatestSubscriber = (function (_super) {
    __extends(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, project) {
        _super.call(this, destination);
        this.project = project;
        this.active = 0;
        this.values = [];
        this.observables = [];
        this.toRespond = [];
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        var toRespond = this.toRespond;
        toRespond.push(toRespond.length);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var values = this.values;
        values[outerIndex] = innerValue;
        var toRespond = this.toRespond;
        if (toRespond.length > 0) {
            var found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
        if (toRespond.length === 0) {
            if (this.project) {
                this._tryProject(values);
            }
            else {
                this.destination.next(values);
            }
        }
    };
    CombineLatestSubscriber.prototype._tryProject = function (values) {
        var result;
        try {
            result = this.project.apply(this, values);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return CombineLatestSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.CombineLatestSubscriber = CombineLatestSubscriber;

},{"../OuterSubscriber":12,"../observable/ArrayObservable":122,"../util/isArray":246,"../util/isScheduler":252,"../util/subscribeToResult":256}],150:[function(require,module,exports){
"use strict";
var isScheduler_1 = require('../util/isScheduler');
var ArrayObservable_1 = require('../observable/ArrayObservable');
var mergeAll_1 = require('./mergeAll');
/**
 * Joins this observable with multiple other observables by subscribing to them one at a time, starting with the source,
 * and merging their results into the returned observable. Will wait for each observable to complete before moving
 * on to the next.
 * @params {...Observable} the observables to concatenate
 * @params {Scheduler} [scheduler] an optional scheduler to schedule each observable subscription on.
 * @returns {Observable} All values of each passed observable merged into a single observable, in order, in serial fashion.
 */
function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    return concatStatic.apply(void 0, [this].concat(observables));
}
exports.concat = concat;
/**
 * Joins multiple observables together by subscribing to them one at a time and merging their results
 * into the returned observable. Will wait for each observable to complete before moving on to the next.
 * @params {...Observable} the observables to concatenate
 * @params {Scheduler} [scheduler] an optional scheduler to schedule each observable subscription on.
 * @returns {Observable} All values of each passed observable merged into a single observable, in order, in serial fashion.
 */
function concatStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var scheduler = null;
    var args = observables;
    if (isScheduler_1.isScheduler(args[observables.length - 1])) {
        scheduler = args.pop();
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(1));
}
exports.concatStatic = concatStatic;

},{"../observable/ArrayObservable":122,"../util/isScheduler":252,"./mergeAll":178}],151:[function(require,module,exports){
"use strict";
var mergeAll_1 = require('./mergeAll');
/**
 * Joins every Observable emitted by the source (an Observable of Observables), in a serial
 * fashion. Subscribing to each one only when the previous one has completed, and merging
 * all of their values into the returned observable.
 *
 * __Warning:__ If the source Observable emits Observables quickly and endlessly, and the
 * Observables it emits generally complete slower than the source emits, you can run into
 * memory issues as the incoming observables collect in an unbounded buffer.
 *
 * @returns {Observable} an observable of values merged from the incoming observables.
 */
function concatAll() {
    return this.lift(new mergeAll_1.MergeAllOperator(1));
}
exports.concatAll = concatAll;

},{"./mergeAll":178}],152:[function(require,module,exports){
"use strict";
var mergeMap_1 = require('./mergeMap');
/**
 * Maps values from the source observable into new Observables, then merges them in a serialized fashion,
 * waiting for each one to complete before merging the next.
 *
 * __Warning:__ if incoming values arrive endlessly and faster than the observables they're being mapped
 * to can complete, it will result in memory issues as created observables amass in an unbounded buffer
 * waiting for their turn to be subscribed to.
 *
 * @param {function} project a function to map incoming values into Observables to be concatenated. accepts
 * the `value` and the `index` as arguments.
 * @param {function} [resultSelector] an optional result selector that is applied to values before they're
 * merged into the returned observable. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @returns {Observable} an observable of values merged from the projected Observables as they were subscribed to,
 * one at a time. Optionally, these values may have been projected from a passed `projectResult` argument.
 */
function concatMap(project, resultSelector) {
    return this.lift(new mergeMap_1.MergeMapOperator(project, resultSelector, 1));
}
exports.concatMap = concatMap;

},{"./mergeMap":179}],153:[function(require,module,exports){
"use strict";
var mergeMapTo_1 = require('./mergeMapTo');
/**
 * Maps values from the source to a specific observable, and merges them together in a serialized fashion.
 *
 * @param {Observable} observable the observable to map each source value to
 * @param {function} [resultSelector] an optional result selector that is applied to values before they're
 * merged into the returned observable. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @returns {Observable} an observable of values merged together by joining the passed observable
 * with itself, one after the other, for each value emitted from the source.
 */
function concatMapTo(observable, resultSelector) {
    return this.lift(new mergeMapTo_1.MergeMapToOperator(observable, resultSelector, 1));
}
exports.concatMapTo = concatMapTo;

},{"./mergeMapTo":180}],154:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an observable of a single number that represents the number of items that either:
 * Match a provided predicate function, _or_ if a predicate is not provided, the number
 * represents the total count of all items in the source observable. The count is emitted
 * by the returned observable when the source observable completes.
 * @param {function} [predicate] a boolean function to select what values are to be counted.
 * it is provided with arguments of:
 *   - `value`: the value from the source observable
 *   - `index`: the "index" of the value from the source observable
 *   - `source`: the source observable instance itself.
 * @returns {Observable} an observable of one number that represents the count as described
 * above
 */
function count(predicate) {
    return this.lift(new CountOperator(predicate, this));
}
exports.count = count;
var CountOperator = (function () {
    function CountOperator(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    CountOperator.prototype.call = function (subscriber) {
        return new CountSubscriber(subscriber, this.predicate, this.source);
    };
    return CountOperator;
}());
var CountSubscriber = (function (_super) {
    __extends(CountSubscriber, _super);
    function CountSubscriber(destination, predicate, source) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.source = source;
        this.count = 0;
        this.index = 0;
    }
    CountSubscriber.prototype._next = function (value) {
        if (this.predicate) {
            this._tryPredicate(value);
        }
        else {
            this.count++;
        }
    };
    CountSubscriber.prototype._tryPredicate = function (value) {
        var result;
        try {
            result = this.predicate(value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.count++;
        }
    };
    CountSubscriber.prototype._complete = function () {
        this.destination.next(this.count);
        this.destination.complete();
    };
    return CountSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],155:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns the source Observable delayed by the computed debounce duration,
 * with the duration lengthened if a new source item arrives before the delay
 * duration ends.
 * In practice, for each item emitted on the source, this operator holds the
 * latest item, waits for a silence as long as the `durationSelector` specifies,
 * and only then emits the latest source item on the result Observable.
 * @param {function} durationSelector function for computing the timeout duration for each item.
 * @returns {Observable} an Observable the same as source Observable, but drops items.
 */
function debounce(durationSelector) {
    return this.lift(new DebounceOperator(durationSelector));
}
exports.debounce = debounce;
var DebounceOperator = (function () {
    function DebounceOperator(durationSelector) {
        this.durationSelector = durationSelector;
    }
    DebounceOperator.prototype.call = function (subscriber) {
        return new DebounceSubscriber(subscriber, this.durationSelector);
    };
    return DebounceOperator;
}());
var DebounceSubscriber = (function (_super) {
    __extends(DebounceSubscriber, _super);
    function DebounceSubscriber(destination, durationSelector) {
        _super.call(this, destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
        this.durationSubscription = null;
    }
    DebounceSubscriber.prototype._next = function (value) {
        try {
            var result = this.durationSelector.call(this, value);
            if (result) {
                this._tryNext(value, result);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DebounceSubscriber.prototype._complete = function () {
        this.emitValue();
        this.destination.complete();
    };
    DebounceSubscriber.prototype._tryNext = function (value, duration) {
        var subscription = this.durationSubscription;
        this.value = value;
        this.hasValue = true;
        if (subscription) {
            subscription.unsubscribe();
            this.remove(subscription);
        }
        subscription = subscribeToResult_1.subscribeToResult(this, duration);
        if (!subscription.isUnsubscribed) {
            this.add(this.durationSubscription = subscription);
        }
    };
    DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    };
    DebounceSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    DebounceSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            var value = this.value;
            var subscription = this.durationSubscription;
            if (subscription) {
                this.durationSubscription = null;
                subscription.unsubscribe();
                this.remove(subscription);
            }
            this.value = null;
            this.hasValue = false;
            _super.prototype._next.call(this, value);
        }
    };
    return DebounceSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],156:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var asap_1 = require('../scheduler/asap');
/**
 * Returns the source Observable delayed by the computed debounce duration,
 * with the duration lengthened if a new source item arrives before the delay
 * duration ends.
 * In practice, for each item emitted on the source, this operator holds the
 * latest item, waits for a silence for the `dueTime` length, and only then
 * emits the latest source item on the result Observable.
 * Optionally takes a scheduler for manging timers.
 * @param {number} dueTime the timeout value for the window of time required to not drop the item.
 * @param {Scheduler} [scheduler] the Scheduler to use for managing the timers that handle the timeout for each item.
 * @returns {Observable} an Observable the same as source Observable, but drops items.
 */
function debounceTime(dueTime, scheduler) {
    if (scheduler === void 0) { scheduler = asap_1.asap; }
    return this.lift(new DebounceTimeOperator(dueTime, scheduler));
}
exports.debounceTime = debounceTime;
var DebounceTimeOperator = (function () {
    function DebounceTimeOperator(dueTime, scheduler) {
        this.dueTime = dueTime;
        this.scheduler = scheduler;
    }
    DebounceTimeOperator.prototype.call = function (subscriber) {
        return new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler);
    };
    return DebounceTimeOperator;
}());
var DebounceTimeSubscriber = (function (_super) {
    __extends(DebounceTimeSubscriber, _super);
    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
        _super.call(this, destination);
        this.dueTime = dueTime;
        this.scheduler = scheduler;
        this.debouncedSubscription = null;
        this.lastValue = null;
        this.hasValue = false;
    }
    DebounceTimeSubscriber.prototype._next = function (value) {
        this.clearDebounce();
        this.lastValue = value;
        this.hasValue = true;
        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
    };
    DebounceTimeSubscriber.prototype._complete = function () {
        this.debouncedNext();
        this.destination.complete();
    };
    DebounceTimeSubscriber.prototype.debouncedNext = function () {
        this.clearDebounce();
        if (this.hasValue) {
            this.destination.next(this.lastValue);
            this.lastValue = null;
            this.hasValue = false;
        }
    };
    DebounceTimeSubscriber.prototype.clearDebounce = function () {
        var debouncedSubscription = this.debouncedSubscription;
        if (debouncedSubscription !== null) {
            this.remove(debouncedSubscription);
            debouncedSubscription.unsubscribe();
            this.debouncedSubscription = null;
        }
    };
    return DebounceTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchNext(subscriber) {
    subscriber.debouncedNext();
}

},{"../Subscriber":15,"../scheduler/asap":230}],157:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that emits the elements of the source or a specified default value if empty.
 * @param {any} defaultValue the default value used if source is empty; defaults to null.
 * @returns {Observable} an Observable of the items emitted by the where empty values are replaced by the specified default value or null.
 */
function defaultIfEmpty(defaultValue) {
    if (defaultValue === void 0) { defaultValue = null; }
    return this.lift(new DefaultIfEmptyOperator(defaultValue));
}
exports.defaultIfEmpty = defaultIfEmpty;
var DefaultIfEmptyOperator = (function () {
    function DefaultIfEmptyOperator(defaultValue) {
        this.defaultValue = defaultValue;
    }
    DefaultIfEmptyOperator.prototype.call = function (subscriber) {
        return new DefaultIfEmptySubscriber(subscriber, this.defaultValue);
    };
    return DefaultIfEmptyOperator;
}());
var DefaultIfEmptySubscriber = (function (_super) {
    __extends(DefaultIfEmptySubscriber, _super);
    function DefaultIfEmptySubscriber(destination, defaultValue) {
        _super.call(this, destination);
        this.defaultValue = defaultValue;
        this.isEmpty = true;
    }
    DefaultIfEmptySubscriber.prototype._next = function (value) {
        this.isEmpty = false;
        this.destination.next(value);
    };
    DefaultIfEmptySubscriber.prototype._complete = function () {
        if (this.isEmpty) {
            this.destination.next(this.defaultValue);
        }
        this.destination.complete();
    };
    return DefaultIfEmptySubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],158:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var asap_1 = require('../scheduler/asap');
var isDate_1 = require('../util/isDate');
var Subscriber_1 = require('../Subscriber');
var Notification_1 = require('../Notification');
/**
 * Returns an Observable that delays the emission of items from the source Observable
 * by a given timeout or until a given Date.
 * @param {number|Date} delay the timeout value or date until which the emission of the source items is delayed.
 * @param {Scheduler} [scheduler] the Scheduler to use for managing the timers that handle the timeout for each item.
 * @returns {Observable} an Observable that delays the emissions of the source Observable by the specified timeout or Date.
 */
function delay(delay, scheduler) {
    if (scheduler === void 0) { scheduler = asap_1.asap; }
    var absoluteDelay = isDate_1.isDate(delay);
    var delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
    return this.lift(new DelayOperator(delayFor, scheduler));
}
exports.delay = delay;
var DelayOperator = (function () {
    function DelayOperator(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    DelayOperator.prototype.call = function (subscriber) {
        return new DelaySubscriber(subscriber, this.delay, this.scheduler);
    };
    return DelayOperator;
}());
var DelaySubscriber = (function (_super) {
    __extends(DelaySubscriber, _super);
    function DelaySubscriber(destination, delay, scheduler) {
        _super.call(this, destination);
        this.delay = delay;
        this.scheduler = scheduler;
        this.queue = [];
        this.active = false;
        this.errored = false;
    }
    DelaySubscriber.dispatch = function (state) {
        var source = state.source;
        var queue = source.queue;
        var scheduler = state.scheduler;
        var destination = state.destination;
        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
            queue.shift().notification.observe(destination);
        }
        if (queue.length > 0) {
            var delay_1 = Math.max(0, queue[0].time - scheduler.now());
            this.schedule(state, delay_1);
        }
        else {
            source.active = false;
        }
    };
    DelaySubscriber.prototype._schedule = function (scheduler) {
        this.active = true;
        this.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
            source: this, destination: this.destination, scheduler: scheduler
        }));
    };
    DelaySubscriber.prototype.scheduleNotification = function (notification) {
        if (this.errored === true) {
            return;
        }
        var scheduler = this.scheduler;
        var message = new DelayMessage(scheduler.now() + this.delay, notification);
        this.queue.push(message);
        if (this.active === false) {
            this._schedule(scheduler);
        }
    };
    DelaySubscriber.prototype._next = function (value) {
        this.scheduleNotification(Notification_1.Notification.createNext(value));
    };
    DelaySubscriber.prototype._error = function (err) {
        this.errored = true;
        this.queue = [];
        this.destination.error(err);
    };
    DelaySubscriber.prototype._complete = function () {
        this.scheduleNotification(Notification_1.Notification.createComplete());
    };
    return DelaySubscriber;
}(Subscriber_1.Subscriber));
var DelayMessage = (function () {
    function DelayMessage(time, notification) {
        this.time = time;
        this.notification = notification;
    }
    return DelayMessage;
}());

},{"../Notification":8,"../Subscriber":15,"../scheduler/asap":230,"../util/isDate":247}],159:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Observable_1 = require('../Observable');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable that delays the emission of items from the source Observable
 * by a subscription delay and a delay selector function for each element.
 * @param {Function} selector function to retrieve a sequence indicating the delay for each given element.
 * @param {Observable} sequence indicating the delay for the subscription to the source.
 * @returns {Observable} an Observable that delays the emissions of the source Observable by the specified timeout or Date.
 */
function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
        return new SubscriptionDelayObservable(this, subscriptionDelay)
            .lift(new DelayWhenOperator(delayDurationSelector));
    }
    return this.lift(new DelayWhenOperator(delayDurationSelector));
}
exports.delayWhen = delayWhen;
var DelayWhenOperator = (function () {
    function DelayWhenOperator(delayDurationSelector) {
        this.delayDurationSelector = delayDurationSelector;
    }
    DelayWhenOperator.prototype.call = function (subscriber) {
        return new DelayWhenSubscriber(subscriber, this.delayDurationSelector);
    };
    return DelayWhenOperator;
}());
var DelayWhenSubscriber = (function (_super) {
    __extends(DelayWhenSubscriber, _super);
    function DelayWhenSubscriber(destination, delayDurationSelector) {
        _super.call(this, destination);
        this.delayDurationSelector = delayDurationSelector;
        this.completed = false;
        this.delayNotifierSubscriptions = [];
        this.values = [];
    }
    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(outerValue);
        this.removeSubscription(innerSub);
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        var value = this.removeSubscription(innerSub);
        if (value) {
            this.destination.next(value);
        }
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype._next = function (value) {
        try {
            var delayNotifier = this.delayDurationSelector(value);
            if (delayNotifier) {
                this.tryDelay(delayNotifier, value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DelayWhenSubscriber.prototype._complete = function () {
        this.completed = true;
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
        subscription.unsubscribe();
        var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
        var value = null;
        if (subscriptionIdx !== -1) {
            value = this.values[subscriptionIdx];
            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
            this.values.splice(subscriptionIdx, 1);
        }
        return value;
    };
    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
        var notifierSubscription = subscribeToResult_1.subscribeToResult(this, delayNotifier, value);
        this.add(notifierSubscription);
        this.delayNotifierSubscriptions.push(notifierSubscription);
        this.values.push(value);
    };
    DelayWhenSubscriber.prototype.tryComplete = function () {
        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
            this.destination.complete();
        }
    };
    return DelayWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
var SubscriptionDelayObservable = (function (_super) {
    __extends(SubscriptionDelayObservable, _super);
    function SubscriptionDelayObservable(source, subscriptionDelay) {
        _super.call(this);
        this.source = source;
        this.subscriptionDelay = subscriptionDelay;
    }
    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
    };
    return SubscriptionDelayObservable;
}(Observable_1.Observable));
var SubscriptionDelaySubscriber = (function (_super) {
    __extends(SubscriptionDelaySubscriber, _super);
    function SubscriptionDelaySubscriber(parent, source) {
        _super.call(this);
        this.parent = parent;
        this.source = source;
        this.sourceSubscribed = false;
    }
    SubscriptionDelaySubscriber.prototype._next = function (unused) {
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype._error = function (err) {
        this.unsubscribe();
        this.parent.error(err);
    };
    SubscriptionDelaySubscriber.prototype._complete = function () {
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
        if (!this.sourceSubscribed) {
            this.sourceSubscribed = true;
            this.unsubscribe();
            this.source.subscribe(this.parent);
        }
    };
    return SubscriptionDelaySubscriber;
}(Subscriber_1.Subscriber));

},{"../Observable":9,"../OuterSubscriber":12,"../Subscriber":15,"../util/subscribeToResult":256}],160:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that transforms Notification objects into the items or notifications they represent.
 * @returns {Observable} an Observable that emits items and notifications embedded in Notification objects emitted by the source Observable.
 */
function dematerialize() {
    return this.lift(new DeMaterializeOperator());
}
exports.dematerialize = dematerialize;
var DeMaterializeOperator = (function () {
    function DeMaterializeOperator() {
    }
    DeMaterializeOperator.prototype.call = function (subscriber) {
        return new DeMaterializeSubscriber(subscriber);
    };
    return DeMaterializeOperator;
}());
var DeMaterializeSubscriber = (function (_super) {
    __extends(DeMaterializeSubscriber, _super);
    function DeMaterializeSubscriber(destination) {
        _super.call(this, destination);
    }
    DeMaterializeSubscriber.prototype._next = function (value) {
        value.observe(this.destination);
    };
    return DeMaterializeSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],161:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
function distinctUntilChanged(compare, keySelector) {
    return this.lift(new DistinctUntilChangedOperator(compare, keySelector));
}
exports.distinctUntilChanged = distinctUntilChanged;
var DistinctUntilChangedOperator = (function () {
    function DistinctUntilChangedOperator(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    DistinctUntilChangedOperator.prototype.call = function (subscriber) {
        return new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector);
    };
    return DistinctUntilChangedOperator;
}());
var DistinctUntilChangedSubscriber = (function (_super) {
    __extends(DistinctUntilChangedSubscriber, _super);
    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
        _super.call(this, destination);
        this.keySelector = keySelector;
        this.hasKey = false;
        if (typeof compare === 'function') {
            this.compare = compare;
        }
    }
    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
        return x === y;
    };
    DistinctUntilChangedSubscriber.prototype._next = function (value) {
        var keySelector = this.keySelector;
        var key = value;
        if (keySelector) {
            key = tryCatch_1.tryCatch(this.keySelector)(value);
            if (key === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
            }
        }
        var result = false;
        if (this.hasKey) {
            result = tryCatch_1.tryCatch(this.compare)(this.key, key);
            if (result === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
            }
        }
        else {
            this.hasKey = true;
        }
        if (Boolean(result) === false) {
            this.key = key;
            this.destination.next(value);
        }
    };
    return DistinctUntilChangedSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../util/errorObject":245,"../util/tryCatch":259}],162:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var noop_1 = require('../util/noop');
/**
 * Returns a mirrored Observable of the source Observable, but modified so that the provided Observer is called
 * for every item emitted by the source.
 * This operator is useful for debugging your observables for the correct values or performing other side effects.
 * @param {Observer|function} [nextOrObserver] a normal observer callback or callback for onNext.
 * @param {function} [error] callback for errors in the source.
 * @param {function} [complete] callback for the completion of the source.
 * @reurns {Observable} a mirrored Observable with the specified Observer or callback attached for each item.
 */
function _do(nextOrObserver, error, complete) {
    var next;
    if (nextOrObserver && typeof nextOrObserver === 'object') {
        next = nextOrObserver.next;
        error = nextOrObserver.error;
        complete = nextOrObserver.complete;
    }
    else {
        next = nextOrObserver;
    }
    return this.lift(new DoOperator(next || noop_1.noop, error || noop_1.noop, complete || noop_1.noop));
}
exports._do = _do;
var DoOperator = (function () {
    function DoOperator(next, error, complete) {
        this.next = next;
        this.error = error;
        this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber) {
        return new DoSubscriber(subscriber, this.next, this.error, this.complete);
    };
    return DoOperator;
}());
var DoSubscriber = (function (_super) {
    __extends(DoSubscriber, _super);
    function DoSubscriber(destination, next, error, complete) {
        _super.call(this, destination);
        this.__next = next;
        this.__error = error;
        this.__complete = complete;
    }
    // NOTE: important, all try catch blocks below are there for performance
    // reasons. tryCatcher approach does not benefit this operator.
    DoSubscriber.prototype._next = function (value) {
        try {
            this.__next(value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(value);
    };
    DoSubscriber.prototype._error = function (err) {
        try {
            this.__error(err);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.error(err);
    };
    DoSubscriber.prototype._complete = function () {
        try {
            this.__complete();
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.complete();
    };
    return DoSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../util/noop":253}],163:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that emits whether or not every item of the source satisfies the condition specified.
 * @param {function} predicate a function for determining if an item meets a specified condition.
 * @param {any} [thisArg] optional object to use for `this` in the callback
 * @returns {Observable} an Observable of booleans that determines if all items of the source Observable meet the condition specified.
 */
function every(predicate, thisArg) {
    var source = this;
    return source.lift(new EveryOperator(predicate, thisArg, source));
}
exports.every = every;
var EveryOperator = (function () {
    function EveryOperator(predicate, thisArg, source) {
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
    }
    EveryOperator.prototype.call = function (observer) {
        return new EverySubscriber(observer, this.predicate, this.thisArg, this.source);
    };
    return EveryOperator;
}());
var EverySubscriber = (function (_super) {
    __extends(EverySubscriber, _super);
    function EverySubscriber(destination, predicate, thisArg, source) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
        this.index = 0;
        this.thisArg = thisArg || this;
    }
    EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
        this.destination.next(everyValueMatch);
        this.destination.complete();
    };
    EverySubscriber.prototype._next = function (value) {
        var result = false;
        try {
            result = this.predicate.call(this.thisArg, value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (!result) {
            this.notifyComplete(false);
        }
    };
    EverySubscriber.prototype._complete = function () {
        this.notifyComplete(true);
    };
    return EverySubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],164:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable where for each item in the source Observable, the supplied function is applied to each item,
 * resulting in a new value to then be applied again with the function.
 * @param {function} project the function for projecting the next emitted item of the Observable.
 * @param {number} [concurrent] the max number of observables that can be created concurrently. defaults to infinity.
 * @param {Scheduler} [scheduler] The Scheduler to use for managing the expansions.
 * @returns {Observable} an Observable containing the expansions of the source Observable.
 */
function expand(project, concurrent, scheduler) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    if (scheduler === void 0) { scheduler = undefined; }
    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
    return this.lift(new ExpandOperator(project, concurrent, scheduler));
}
exports.expand = expand;
var ExpandOperator = (function () {
    function ExpandOperator(project, concurrent, scheduler) {
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
    }
    ExpandOperator.prototype.call = function (subscriber) {
        return new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler);
    };
    return ExpandOperator;
}());
exports.ExpandOperator = ExpandOperator;
var ExpandSubscriber = (function (_super) {
    __extends(ExpandSubscriber, _super);
    function ExpandSubscriber(destination, project, concurrent, scheduler) {
        _super.call(this, destination);
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
        this.index = 0;
        this.active = 0;
        this.hasCompleted = false;
        if (concurrent < Number.POSITIVE_INFINITY) {
            this.buffer = [];
        }
    }
    ExpandSubscriber.dispatch = function (_a) {
        var subscriber = _a.subscriber, result = _a.result, value = _a.value, index = _a.index;
        subscriber.subscribeToProjection(result, value, index);
    };
    ExpandSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (destination.isUnsubscribed) {
            this._complete();
            return;
        }
        var index = this.index++;
        if (this.active < this.concurrent) {
            destination.next(value);
            var result = tryCatch_1.tryCatch(this.project)(value, index);
            if (result === errorObject_1.errorObject) {
                destination.error(errorObject_1.errorObject.e);
            }
            else if (!this.scheduler) {
                this.subscribeToProjection(result, value, index);
            }
            else {
                var state = { subscriber: this, result: result, value: value, index: index };
                this.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
            }
        }
        else {
            this.buffer.push(value);
        }
    };
    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
        this.active++;
        this.add(subscribeToResult_1.subscribeToResult(this, result, value, index));
    };
    ExpandSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    };
    ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._next(innerValue);
    };
    ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer && buffer.length > 0) {
            this._next(buffer.shift());
        }
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    };
    return ExpandSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.ExpandSubscriber = ExpandSubscriber;

},{"../OuterSubscriber":12,"../util/errorObject":245,"../util/subscribeToResult":256,"../util/tryCatch":259}],165:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Similar to the well-known `Array.prototype.filter` method, this operator filters values down to a set
 * allowed by a `select` function
 *
 * @param {Function} select a function that is used to select the resulting values
 *  if it returns `true`, the value is emitted, if `false` the value is not passed to the resulting observable
 * @param {any} [thisArg] an optional argument to determine the value of `this` in the `select` function
 * @returns {Observable} an observable of values allowed by the select function
 */
function filter(select, thisArg) {
    return this.lift(new FilterOperator(select, thisArg));
}
exports.filter = filter;
var FilterOperator = (function () {
    function FilterOperator(select, thisArg) {
        this.select = select;
        this.thisArg = thisArg;
    }
    FilterOperator.prototype.call = function (subscriber) {
        return new FilterSubscriber(subscriber, this.select, this.thisArg);
    };
    return FilterOperator;
}());
var FilterSubscriber = (function (_super) {
    __extends(FilterSubscriber, _super);
    function FilterSubscriber(destination, select, thisArg) {
        _super.call(this, destination);
        this.select = select;
        this.thisArg = thisArg;
        this.count = 0;
        this.select = select;
    }
    // the try catch block below is left specifically for
    // optimization and perf reasons. a tryCatcher is not necessary here.
    FilterSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.select.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    };
    return FilterSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],166:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Subscription_1 = require('../Subscription');
/**
 * Returns an Observable that mirrors the source Observable, but will call a specified function when
 * the source terminates on complete or error.
 * @param {function} finallySelector function to be called when source terminates.
 * @returns {Observable} an Observable that mirrors the source, but will call the specified function on termination.
 */
function _finally(finallySelector) {
    return this.lift(new FinallyOperator(finallySelector));
}
exports._finally = _finally;
var FinallyOperator = (function () {
    function FinallyOperator(finallySelector) {
        this.finallySelector = finallySelector;
    }
    FinallyOperator.prototype.call = function (subscriber) {
        return new FinallySubscriber(subscriber, this.finallySelector);
    };
    return FinallyOperator;
}());
var FinallySubscriber = (function (_super) {
    __extends(FinallySubscriber, _super);
    function FinallySubscriber(destination, finallySelector) {
        _super.call(this, destination);
        this.add(new Subscription_1.Subscription(finallySelector));
    }
    return FinallySubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../Subscription":16}],167:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var EmptyError_1 = require('../util/EmptyError');
/**
 * Returns an Observable that emits the first item of the source Observable that matches the specified condition.
 * Throws an error if matching element is not found.
 * @param {function} predicate function called with each item to test for condition matching.
 * @returns {Observable} an Observable of the first item that matches the condition.
 */
function first(predicate, resultSelector, defaultValue) {
    return this.lift(new FirstOperator(predicate, resultSelector, defaultValue, this));
}
exports.first = first;
var FirstOperator = (function () {
    function FirstOperator(predicate, resultSelector, defaultValue, source) {
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
    }
    FirstOperator.prototype.call = function (observer) {
        return new FirstSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source);
    };
    return FirstOperator;
}());
var FirstSubscriber = (function (_super) {
    __extends(FirstSubscriber, _super);
    function FirstSubscriber(destination, predicate, resultSelector, defaultValue, source) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
        this.index = 0;
        this.hasCompleted = false;
    }
    FirstSubscriber.prototype._next = function (value) {
        var index = this.index++;
        if (this.predicate) {
            this._tryPredicate(value, index);
        }
        else {
            this._emit(value, index);
        }
    };
    FirstSubscriber.prototype._tryPredicate = function (value, index) {
        var result;
        try {
            result = this.predicate(value, index, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this._emit(value, index);
        }
    };
    FirstSubscriber.prototype._emit = function (value, index) {
        if (this.resultSelector) {
            this._tryResultSelector(value, index);
            return;
        }
        this._emitFinal(value);
    };
    FirstSubscriber.prototype._tryResultSelector = function (value, index) {
        var result;
        try {
            result = this.resultSelector(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this._emitFinal(result);
    };
    FirstSubscriber.prototype._emitFinal = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
        this.hasCompleted = true;
    };
    FirstSubscriber.prototype._complete = function () {
        var destination = this.destination;
        if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
            destination.next(this.defaultValue);
            destination.complete();
        }
        else if (!this.hasCompleted) {
            destination.error(new EmptyError_1.EmptyError);
        }
    };
    return FirstSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../util/EmptyError":238}],168:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Subscription_1 = require('../Subscription');
var Observable_1 = require('../Observable');
var Operator_1 = require('../Operator');
var Subject_1 = require('../Subject');
var Map_1 = require('../util/Map');
var FastMap_1 = require('../util/FastMap');
/**
 * Groups the items emitted by an Observable according to a specified criterion,
 * and emits these grouped items as `GroupedObservables`, one `GroupedObservable` per group.
 *
 * <img src="./img/groupBy.png" width="100%">
 *
 * @param {Function} keySelector - a function that extracts the key for each item
 * @param {Function} elementSelector - a function that extracts the return element for each item
 * @returns {Observable} an Observable that emits GroupedObservables, each of which corresponds
 * to a unique key value and each of which emits those items from the source Observable that share
 * that key value.
 */
function groupBy(keySelector, elementSelector, durationSelector) {
    return this.lift(new GroupByOperator(this, keySelector, elementSelector, durationSelector));
}
exports.groupBy = groupBy;
var GroupByOperator = (function (_super) {
    __extends(GroupByOperator, _super);
    function GroupByOperator(source, keySelector, elementSelector, durationSelector) {
        _super.call(this);
        this.source = source;
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
    }
    GroupByOperator.prototype.call = function (subscriber) {
        return new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector);
    };
    return GroupByOperator;
}(Operator_1.Operator));
var GroupBySubscriber = (function (_super) {
    __extends(GroupBySubscriber, _super);
    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector) {
        _super.call(this);
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.groups = null;
        this.attemptedToUnsubscribe = false;
        this.count = 0;
        this.destination = destination;
        this.add(destination);
    }
    GroupBySubscriber.prototype._next = function (value) {
        var key;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    };
    GroupBySubscriber.prototype._group = function (value, key) {
        var groups = this.groups;
        if (!groups) {
            groups = this.groups = typeof key === 'string' ? new FastMap_1.FastMap() : new Map_1.Map();
        }
        var group = groups.get(key);
        if (!group) {
            groups.set(key, group = new Subject_1.Subject());
            var groupedObservable = new GroupedObservable(key, group, this);
            if (this.durationSelector) {
                this._selectDuration(key, group);
            }
            this.destination.next(groupedObservable);
        }
        if (this.elementSelector) {
            this._selectElement(value, group);
        }
        else {
            this.tryGroupNext(value, group);
        }
    };
    GroupBySubscriber.prototype._selectElement = function (value, group) {
        var result;
        try {
            result = this.elementSelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this.tryGroupNext(result, group);
    };
    GroupBySubscriber.prototype._selectDuration = function (key, group) {
        var duration;
        try {
            duration = this.durationSelector(new GroupedObservable(key, group));
        }
        catch (err) {
            this.error(err);
            return;
        }
        this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
    };
    GroupBySubscriber.prototype.tryGroupNext = function (value, group) {
        if (!group.isUnsubscribed) {
            group.next(value);
        }
    };
    GroupBySubscriber.prototype._error = function (err) {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    };
    GroupBySubscriber.prototype._complete = function () {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    };
    GroupBySubscriber.prototype.removeGroup = function (key) {
        this.groups.delete(key);
    };
    GroupBySubscriber.prototype.unsubscribe = function () {
        if (!this.isUnsubscribed && !this.attemptedToUnsubscribe) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                _super.prototype.unsubscribe.call(this);
            }
        }
    };
    return GroupBySubscriber;
}(Subscriber_1.Subscriber));
var GroupDurationSubscriber = (function (_super) {
    __extends(GroupDurationSubscriber, _super);
    function GroupDurationSubscriber(key, group, parent) {
        _super.call(this);
        this.key = key;
        this.group = group;
        this.parent = parent;
    }
    GroupDurationSubscriber.prototype._next = function (value) {
        this.tryComplete();
    };
    GroupDurationSubscriber.prototype._error = function (err) {
        this.tryError(err);
    };
    GroupDurationSubscriber.prototype._complete = function () {
        this.tryComplete();
    };
    GroupDurationSubscriber.prototype.tryError = function (err) {
        var group = this.group;
        if (!group.isUnsubscribed) {
            group.error(err);
        }
        this.parent.removeGroup(this.key);
    };
    GroupDurationSubscriber.prototype.tryComplete = function () {
        var group = this.group;
        if (!group.isUnsubscribed) {
            group.complete();
        }
        this.parent.removeGroup(this.key);
    };
    return GroupDurationSubscriber;
}(Subscriber_1.Subscriber));
var GroupedObservable = (function (_super) {
    __extends(GroupedObservable, _super);
    function GroupedObservable(key, groupSubject, refCountSubscription) {
        _super.call(this);
        this.key = key;
        this.groupSubject = groupSubject;
        this.refCountSubscription = refCountSubscription;
    }
    GroupedObservable.prototype._subscribe = function (subscriber) {
        var subscription = new Subscription_1.Subscription();
        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
        if (refCountSubscription && !refCountSubscription.isUnsubscribed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    };
    return GroupedObservable;
}(Observable_1.Observable));
exports.GroupedObservable = GroupedObservable;
var InnerRefCountSubscription = (function (_super) {
    __extends(InnerRefCountSubscription, _super);
    function InnerRefCountSubscription(parent) {
        _super.call(this);
        this.parent = parent;
        parent.count++;
    }
    InnerRefCountSubscription.prototype.unsubscribe = function () {
        var parent = this.parent;
        if (!parent.isUnsubscribed && !this.isUnsubscribed) {
            _super.prototype.unsubscribe.call(this);
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    };
    return InnerRefCountSubscription;
}(Subscription_1.Subscription));

},{"../Observable":9,"../Operator":11,"../Subject":14,"../Subscriber":15,"../Subscription":16,"../util/FastMap":239,"../util/Map":241}],169:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var noop_1 = require('../util/noop');
/**
 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
 *
 * <img src="./img/ignoreElements.png" width="100%">
 *
 * @returns {Observable} an empty Observable that only calls `complete`
 * or `error`, based on which one is called by the source Observable.
 */
function ignoreElements() {
    return this.lift(new IgnoreElementsOperator());
}
exports.ignoreElements = ignoreElements;
;
var IgnoreElementsOperator = (function () {
    function IgnoreElementsOperator() {
    }
    IgnoreElementsOperator.prototype.call = function (subscriber) {
        return new IgnoreElementsSubscriber(subscriber);
    };
    return IgnoreElementsOperator;
}());
var IgnoreElementsSubscriber = (function (_super) {
    __extends(IgnoreElementsSubscriber, _super);
    function IgnoreElementsSubscriber() {
        _super.apply(this, arguments);
    }
    IgnoreElementsSubscriber.prototype._next = function (unused) {
        noop_1.noop();
    };
    return IgnoreElementsSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../util/noop":253}],170:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function inspect(durationSelector) {
    return this.lift(new InspectOperator(durationSelector));
}
exports.inspect = inspect;
var InspectOperator = (function () {
    function InspectOperator(durationSelector) {
        this.durationSelector = durationSelector;
    }
    InspectOperator.prototype.call = function (subscriber) {
        return new InspectSubscriber(subscriber, this.durationSelector);
    };
    return InspectOperator;
}());
var InspectSubscriber = (function (_super) {
    __extends(InspectSubscriber, _super);
    function InspectSubscriber(destination, durationSelector) {
        _super.call(this, destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
    }
    InspectSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            var duration = tryCatch_1.tryCatch(this.durationSelector)(value);
            if (duration === errorObject_1.errorObject) {
                this.destination.error(errorObject_1.errorObject.e);
            }
            else {
                this.add(this.throttled = subscribeToResult_1.subscribeToResult(this, duration));
            }
        }
    };
    InspectSubscriber.prototype.clearThrottle = function () {
        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = null;
            this.hasValue = false;
            this.destination.next(value);
        }
    };
    InspectSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
        this.clearThrottle();
    };
    InspectSubscriber.prototype.notifyComplete = function () {
        this.clearThrottle();
    };
    return InspectSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/errorObject":245,"../util/subscribeToResult":256,"../util/tryCatch":259}],171:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var asap_1 = require('../scheduler/asap');
var Subscriber_1 = require('../Subscriber');
function inspectTime(delay, scheduler) {
    if (scheduler === void 0) { scheduler = asap_1.asap; }
    return this.lift(new InspectTimeOperator(delay, scheduler));
}
exports.inspectTime = inspectTime;
var InspectTimeOperator = (function () {
    function InspectTimeOperator(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    InspectTimeOperator.prototype.call = function (subscriber) {
        return new InspectTimeSubscriber(subscriber, this.delay, this.scheduler);
    };
    return InspectTimeOperator;
}());
var InspectTimeSubscriber = (function (_super) {
    __extends(InspectTimeSubscriber, _super);
    function InspectTimeSubscriber(destination, delay, scheduler) {
        _super.call(this, destination);
        this.delay = delay;
        this.scheduler = scheduler;
        this.hasValue = false;
    }
    InspectTimeSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.delay, this));
        }
    };
    InspectTimeSubscriber.prototype.clearThrottle = function () {
        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = null;
            this.hasValue = false;
            this.destination.next(value);
        }
    };
    return InspectTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchNext(subscriber) {
    subscriber.clearThrottle();
}

},{"../Subscriber":15,"../scheduler/asap":230}],172:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var EmptyError_1 = require('../util/EmptyError');
/**
 * Returns an Observable that emits only the last item emitted by the source Observable.
 * It optionally takes a predicate function as a parameter, in which case, rather than emitting
 * the last item from the source Observable, the resulting Observable will emit the last item
 * from the source Observable that satisfies the predicate.
 *
 * <img src="./img/last.png" width="100%">
 *
 * @param {function} predicate - the condition any source emitted item has to satisfy.
 * @returns {Observable} an Observable that emits only the last item satisfying the given condition
 * from the source, or an NoSuchElementException if no such items are emitted.
 * @throws - Throws if no items that match the predicate are emitted by the source Observable.
 */
function last(predicate, resultSelector, defaultValue) {
    return this.lift(new LastOperator(predicate, resultSelector, defaultValue, this));
}
exports.last = last;
var LastOperator = (function () {
    function LastOperator(predicate, resultSelector, defaultValue, source) {
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
    }
    LastOperator.prototype.call = function (observer) {
        return new LastSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source);
    };
    return LastOperator;
}());
var LastSubscriber = (function (_super) {
    __extends(LastSubscriber, _super);
    function LastSubscriber(destination, predicate, resultSelector, defaultValue, source) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
        this.hasValue = false;
        this.index = 0;
        if (typeof defaultValue !== 'undefined') {
            this.lastValue = defaultValue;
            this.hasValue = true;
        }
    }
    LastSubscriber.prototype._next = function (value) {
        var index = this.index++;
        if (this.predicate) {
            this._tryPredicate(value, index);
        }
        else {
            if (this.resultSelector) {
                this._tryResultSelector(value, index);
                return;
            }
            this.lastValue = value;
            this.hasValue = true;
        }
    };
    LastSubscriber.prototype._tryPredicate = function (value, index) {
        var result;
        try {
            result = this.predicate(value, index, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            if (this.resultSelector) {
                this._tryResultSelector(value, index);
                return;
            }
            this.lastValue = value;
            this.hasValue = true;
        }
    };
    LastSubscriber.prototype._tryResultSelector = function (value, index) {
        var result;
        try {
            result = this.resultSelector(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.lastValue = result;
        this.hasValue = true;
    };
    LastSubscriber.prototype._complete = function () {
        var destination = this.destination;
        if (this.hasValue) {
            destination.next(this.lastValue);
            destination.complete();
        }
        else {
            destination.error(new EmptyError_1.EmptyError);
        }
    };
    return LastSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../util/EmptyError":238}],173:[function(require,module,exports){
"use strict";
function letProto(func) {
    return func(this);
}
exports.letProto = letProto;

},{}],174:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the returned observable
 *
 * <img src="./img/map.png" width="100%">
 *
 * @param {Function} project the function to create projection
 * @param {any} [thisArg] an optional argument to define what `this` is in the project function
 * @returns {Observable} a observable of projected values
 */
function map(project, thisArg) {
    if (typeof project !== 'function') {
        throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
    }
    return this.lift(new MapOperator(project, thisArg));
}
exports.map = map;
var MapOperator = (function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber) {
        return new MapSubscriber(subscriber, this.project, this.thisArg);
    };
    return MapOperator;
}());
var MapSubscriber = (function (_super) {
    __extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        _super.call(this, destination);
        this.project = project;
        this.count = 0;
        this.thisArg = thisArg || this;
    }
    // NOTE: This looks unoptimized, but it's actually purposefully NOT
    // using try/catch optimizations.
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],175:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Maps every value to the same value every time.
 *
 * <img src="./img/mapTo.png" width="100%">
 *
 * @param {any} value the value to map each incoming value to
 * @returns {Observable} an observable of the passed value that emits everytime the source does
 */
function mapTo(value) {
    return this.lift(new MapToOperator(value));
}
exports.mapTo = mapTo;
var MapToOperator = (function () {
    function MapToOperator(value) {
        this.value = value;
    }
    MapToOperator.prototype.call = function (subscriber) {
        return new MapToSubscriber(subscriber, this.value);
    };
    return MapToOperator;
}());
var MapToSubscriber = (function (_super) {
    __extends(MapToSubscriber, _super);
    function MapToSubscriber(destination, value) {
        _super.call(this, destination);
        this.value = value;
    }
    MapToSubscriber.prototype._next = function (x) {
        this.destination.next(this.value);
    };
    return MapToSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],176:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Notification_1 = require('../Notification');
/**
 * Returns an Observable that represents all of the emissions and notifications
 * from the source Observable into emissions marked with their original types
 * within a `Notification` objects.
 *
 * <img src="./img/materialize.png" width="100%">
 *
 * @scheduler materialize does not operate by default on a particular Scheduler.
 * @returns {Observable} an Observable that emits items that are the result of
 * materializing the items and notifications of the source Observable.
 */
function materialize() {
    return this.lift(new MaterializeOperator());
}
exports.materialize = materialize;
var MaterializeOperator = (function () {
    function MaterializeOperator() {
    }
    MaterializeOperator.prototype.call = function (subscriber) {
        return new MaterializeSubscriber(subscriber);
    };
    return MaterializeOperator;
}());
var MaterializeSubscriber = (function (_super) {
    __extends(MaterializeSubscriber, _super);
    function MaterializeSubscriber(destination) {
        _super.call(this, destination);
    }
    MaterializeSubscriber.prototype._next = function (value) {
        this.destination.next(Notification_1.Notification.createNext(value));
    };
    MaterializeSubscriber.prototype._error = function (err) {
        var destination = this.destination;
        destination.next(Notification_1.Notification.createError(err));
        destination.complete();
    };
    MaterializeSubscriber.prototype._complete = function () {
        var destination = this.destination;
        destination.next(Notification_1.Notification.createComplete());
        destination.complete();
    };
    return MaterializeSubscriber;
}(Subscriber_1.Subscriber));

},{"../Notification":8,"../Subscriber":15}],177:[function(require,module,exports){
"use strict";
var ArrayObservable_1 = require('../observable/ArrayObservable');
var mergeAll_1 = require('./mergeAll');
var isScheduler_1 = require('../util/isScheduler');
/**
 * Creates a result Observable which emits values from every given input Observable.
 *
 * <img src="./img/merge.png" width="100%">
 *
 * @param {Observable} input Observables
 * @returns {Observable} an Observable that emits items that are the result of every input Observable.
 */
function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    observables.unshift(this);
    return mergeStatic.apply(this, observables);
}
exports.merge = merge;
function mergeStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var concurrent = Number.POSITIVE_INFINITY;
    var scheduler = null;
    var last = observables[observables.length - 1];
    if (isScheduler_1.isScheduler(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    }
    else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (observables.length === 1) {
        return observables[0];
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(concurrent));
}
exports.mergeStatic = mergeStatic;

},{"../observable/ArrayObservable":122,"../util/isScheduler":252,"./mergeAll":178}],178:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function mergeAll(concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return this.lift(new MergeAllOperator(concurrent));
}
exports.mergeAll = mergeAll;
var MergeAllOperator = (function () {
    function MergeAllOperator(concurrent) {
        this.concurrent = concurrent;
    }
    MergeAllOperator.prototype.call = function (observer) {
        return new MergeAllSubscriber(observer, this.concurrent);
    };
    return MergeAllOperator;
}());
exports.MergeAllOperator = MergeAllOperator;
var MergeAllSubscriber = (function (_super) {
    __extends(MergeAllSubscriber, _super);
    function MergeAllSubscriber(destination, concurrent) {
        _super.call(this, destination);
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
    }
    MergeAllSubscriber.prototype._next = function (observable) {
        if (this.active < this.concurrent) {
            this.active++;
            this.add(subscribeToResult_1.subscribeToResult(this, observable));
        }
        else {
            this.buffer.push(observable);
        }
    };
    MergeAllSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeAllSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeAllSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.MergeAllSubscriber = MergeAllSubscriber;

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],179:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var subscribeToResult_1 = require('../util/subscribeToResult');
var OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * Returns an Observable that emits items based on applying a function that you supply to each item emitted by the
 * source Observable, where that function returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger.
 *
 * <img src="./img/mergeMap.png" width="100%">
 *
 * @param {Function} a function that, when applied to an item emitted by the source Observable, returns an Observable.
 * @returns {Observable} an Observable that emits the result of applying the transformation function to each item
 * emitted by the source Observable and merging the results of the Observables obtained from this transformation
 */
function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
}
exports.mergeMap = mergeMap;
var MergeMapOperator = (function () {
    function MergeMapOperator(project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    MergeMapOperator.prototype.call = function (observer) {
        return new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent);
    };
    return MergeMapOperator;
}());
exports.MergeMapOperator = MergeMapOperator;
var MergeMapSubscriber = (function (_super) {
    __extends(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    MergeMapSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
        this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
    };
    MergeMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    };
    MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.MergeMapSubscriber = MergeMapSubscriber;

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],180:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function mergeMapTo(observable, resultSelector, concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return this.lift(new MergeMapToOperator(observable, resultSelector, concurrent));
}
exports.mergeMapTo = mergeMapTo;
// TODO: Figure out correct signature here: an Operator<Observable<T>, R2>
//       needs to implement call(observer: Subscriber<R2>): Subscriber<Observable<T>>
var MergeMapToOperator = (function () {
    function MergeMapToOperator(ish, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        this.ish = ish;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    MergeMapToOperator.prototype.call = function (observer) {
        return new MergeMapToSubscriber(observer, this.ish, this.resultSelector, this.concurrent);
    };
    return MergeMapToOperator;
}());
exports.MergeMapToOperator = MergeMapToOperator;
var MergeMapToSubscriber = (function (_super) {
    __extends(MergeMapToSubscriber, _super);
    function MergeMapToSubscriber(destination, ish, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        _super.call(this, destination);
        this.ish = ish;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    MergeMapToSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            var resultSelector = this.resultSelector;
            var index = this.index++;
            var ish = this.ish;
            var destination = this.destination;
            this.active++;
            this._innerSub(ish, destination, resultSelector, value, index);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeMapToSubscriber.prototype._innerSub = function (ish, destination, resultSelector, value, index) {
        this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
    };
    MergeMapToSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeMapToSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        if (resultSelector) {
            this.trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            destination.next(innerValue);
        }
    };
    MergeMapToSubscriber.prototype.trySelectResult = function (outerValue, innerValue, outerIndex, innerIndex) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        var result;
        try {
            result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        destination.next(result);
    };
    MergeMapToSubscriber.prototype.notifyError = function (err) {
        this.destination.error(err);
    };
    MergeMapToSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapToSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.MergeMapToSubscriber = MergeMapToSubscriber;

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],181:[function(require,module,exports){
"use strict";
var ConnectableObservable_1 = require('../observable/ConnectableObservable');
/**
 * Returns an Observable that emits the results of invoking a specified selector on items
 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
 *
 * <img src="./img/multicast.png" width="100%">
 *
 * @param {Function} selector - a function that can use the multicasted source stream
 * as many times as needed, without causing multiple subscriptions to the source stream.
 * Subscribers to the given source will receive all notifications of the source from the
 * time of the subscription forward.
 * @returns {Observable} an Observable that emits the results of invoking the selector
 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
 * the underlying stream.
 */
function multicast(subjectOrSubjectFactory) {
    var subjectFactory;
    if (typeof subjectOrSubjectFactory === 'function') {
        subjectFactory = subjectOrSubjectFactory;
    }
    else {
        subjectFactory = function subjectFactory() {
            return subjectOrSubjectFactory;
        };
    }
    return new ConnectableObservable_1.ConnectableObservable(this, subjectFactory);
}
exports.multicast = multicast;

},{"../observable/ConnectableObservable":125}],182:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Notification_1 = require('../Notification');
function observeOn(scheduler, delay) {
    if (delay === void 0) { delay = 0; }
    return this.lift(new ObserveOnOperator(scheduler, delay));
}
exports.observeOn = observeOn;
var ObserveOnOperator = (function () {
    function ObserveOnOperator(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        this.scheduler = scheduler;
        this.delay = delay;
    }
    ObserveOnOperator.prototype.call = function (subscriber) {
        return new ObserveOnSubscriber(subscriber, this.scheduler, this.delay);
    };
    return ObserveOnOperator;
}());
exports.ObserveOnOperator = ObserveOnOperator;
var ObserveOnSubscriber = (function (_super) {
    __extends(ObserveOnSubscriber, _super);
    function ObserveOnSubscriber(destination, scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        _super.call(this, destination);
        this.scheduler = scheduler;
        this.delay = delay;
    }
    ObserveOnSubscriber.dispatch = function (_a) {
        var notification = _a.notification, destination = _a.destination;
        notification.observe(destination);
    };
    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    };
    ObserveOnSubscriber.prototype._next = function (value) {
        this.scheduleMessage(Notification_1.Notification.createNext(value));
    };
    ObserveOnSubscriber.prototype._error = function (err) {
        this.scheduleMessage(Notification_1.Notification.createError(err));
    };
    ObserveOnSubscriber.prototype._complete = function () {
        this.scheduleMessage(Notification_1.Notification.createComplete());
    };
    return ObserveOnSubscriber;
}(Subscriber_1.Subscriber));
exports.ObserveOnSubscriber = ObserveOnSubscriber;
var ObserveOnMessage = (function () {
    function ObserveOnMessage(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
    return ObserveOnMessage;
}());

},{"../Notification":8,"../Subscriber":15}],183:[function(require,module,exports){
"use strict";
var not_1 = require('../util/not');
var filter_1 = require('./filter');
function partition(predicate, thisArg) {
    return [
        filter_1.filter.call(this, predicate),
        filter_1.filter.call(this, not_1.not(predicate, thisArg))
    ];
}
exports.partition = partition;

},{"../util/not":254,"./filter":165}],184:[function(require,module,exports){
"use strict";
var map_1 = require('./map');
/**
 * Retrieves the value of a specified nested property from all elements in
 * the Observable sequence. If a property can't be resolved, it will return
 * `undefined` for that value.
 *
 * @param {...args} properties the nested properties to pluck
 * @returns {Observable} Returns a new Observable sequence of property values
 */
function pluck() {
    var properties = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        properties[_i - 0] = arguments[_i];
    }
    var length = properties.length;
    if (length === 0) {
        throw new Error('List of properties cannot be empty.');
    }
    return map_1.map.call(this, plucker(properties, length));
}
exports.pluck = pluck;
function plucker(props, length) {
    var mapper = function (x) {
        var currentProp = x;
        for (var i = 0; i < length; i++) {
            var p = currentProp[props[i]];
            if (typeof p !== 'undefined') {
                currentProp = p;
            }
            else {
                return undefined;
            }
        }
        return currentProp;
    };
    return mapper;
}

},{"./map":174}],185:[function(require,module,exports){
"use strict";
var Subject_1 = require('../Subject');
var multicast_1 = require('./multicast');
/**
 * Returns a ConnectableObservable, which is a variety of Observable that waits until its connect method is called
 * before it begins emitting items to those Observers that have subscribed to it.
 *
 * <img src="./img/publish.png" width="100%">
 *
 * @returns a ConnectableObservable that upon connection causes the source Observable to emit items to its Observers.
 */
function publish() {
    return multicast_1.multicast.call(this, new Subject_1.Subject());
}
exports.publish = publish;

},{"../Subject":14,"./multicast":181}],186:[function(require,module,exports){
"use strict";
var BehaviorSubject_1 = require('../subject/BehaviorSubject');
var multicast_1 = require('./multicast');
function publishBehavior(value) {
    return multicast_1.multicast.call(this, new BehaviorSubject_1.BehaviorSubject(value));
}
exports.publishBehavior = publishBehavior;

},{"../subject/BehaviorSubject":233,"./multicast":181}],187:[function(require,module,exports){
"use strict";
var AsyncSubject_1 = require('../subject/AsyncSubject');
var multicast_1 = require('./multicast');
function publishLast() {
    return multicast_1.multicast.call(this, new AsyncSubject_1.AsyncSubject());
}
exports.publishLast = publishLast;

},{"../subject/AsyncSubject":232,"./multicast":181}],188:[function(require,module,exports){
"use strict";
var ReplaySubject_1 = require('../subject/ReplaySubject');
var multicast_1 = require('./multicast');
function publishReplay(bufferSize, windowTime, scheduler) {
    if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
    if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
    return multicast_1.multicast.call(this, new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler));
}
exports.publishReplay = publishReplay;

},{"../subject/ReplaySubject":234,"./multicast":181}],189:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isArray_1 = require('../util/isArray');
var ArrayObservable_1 = require('../observable/ArrayObservable');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable that mirrors the first source Observable to emit an item
 * from the combination of this Observable and supplied Observables
 * @param {...Observables} ...observables sources used to race for which Observable emits first.
 * @returns {Observable} an Observable that mirrors the output of the first Observable to emit an item.
 */
function race() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    // if the only argument is an array, it was most likely called with
    // `pair([obs1, obs2, ...])`
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
        observables = observables[0];
    }
    observables.unshift(this);
    return raceStatic.apply(this, observables);
}
exports.race = race;
/**
 * Returns an Observable that mirrors the first source Observable to emit an item.
 * @param {...Observables} ...observables sources used to race for which Observable emits first.
 * @returns {Observable} an Observable that mirrors the output of the first Observable to emit an item.
 */
function raceStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    // if the only argument is an array, it was most likely called with
    // `pair([obs1, obs2, ...])`
    if (observables.length === 1) {
        if (isArray_1.isArray(observables[0])) {
            observables = observables[0];
        }
        else {
            return observables[0];
        }
    }
    return new ArrayObservable_1.ArrayObservable(observables).lift(new RaceOperator());
}
exports.raceStatic = raceStatic;
var RaceOperator = (function () {
    function RaceOperator() {
    }
    RaceOperator.prototype.call = function (subscriber) {
        return new RaceSubscriber(subscriber);
    };
    return RaceOperator;
}());
exports.RaceOperator = RaceOperator;
var RaceSubscriber = (function (_super) {
    __extends(RaceSubscriber, _super);
    function RaceSubscriber(destination) {
        _super.call(this, destination);
        this.hasFirst = false;
        this.observables = [];
        this.subscriptions = [];
    }
    RaceSubscriber.prototype._next = function (observable) {
        this.observables.push(observable);
    };
    RaceSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                var subscription = subscribeToResult_1.subscribeToResult(this, observable, observable, i);
                this.subscriptions.push(subscription);
                this.add(subscription);
            }
            this.observables = null;
        }
    };
    RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (!this.hasFirst) {
            this.hasFirst = true;
            for (var i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                    var subscription = this.subscriptions[i];
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
            }
            this.subscriptions = null;
        }
        this.destination.next(innerValue);
    };
    return RaceSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.RaceSubscriber = RaceSubscriber;

},{"../OuterSubscriber":12,"../observable/ArrayObservable":122,"../util/isArray":246,"../util/subscribeToResult":256}],190:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that applies a specified accumulator function to the first item emitted by a source Observable,
 * then feeds the result of that function along with the second item emitted by the source Observable into the same
 * function, and so on until all items have been emitted by the source Observable, and emits the final result from
 * the final call to your function as its sole item.
 * This technique, which is called "reduce" here, is sometimes called "aggregate," "fold," "accumulate," "compress," or
 * "inject" in other programming contexts.
 *
 * <img src="./img/reduce.png" width="100%">
 *
 * @param {initialValue} the initial (seed) accumulator value
 * @param {accumulator} an accumulator function to be invoked on each item emitted by the source Observable, the
 * result of which will be used in the next accumulator call.
 * @returns {Observable} an Observable that emits a single item that is the result of accumulating the output from the
 * items emitted by the source Observable.
 */
function reduce(project, seed) {
    return this.lift(new ReduceOperator(project, seed));
}
exports.reduce = reduce;
var ReduceOperator = (function () {
    function ReduceOperator(project, seed) {
        this.project = project;
        this.seed = seed;
    }
    ReduceOperator.prototype.call = function (subscriber) {
        return new ReduceSubscriber(subscriber, this.project, this.seed);
    };
    return ReduceOperator;
}());
exports.ReduceOperator = ReduceOperator;
var ReduceSubscriber = (function (_super) {
    __extends(ReduceSubscriber, _super);
    function ReduceSubscriber(destination, project, seed) {
        _super.call(this, destination);
        this.hasValue = false;
        this.acc = seed;
        this.project = project;
        this.hasSeed = typeof seed !== 'undefined';
    }
    ReduceSubscriber.prototype._next = function (value) {
        if (this.hasValue || (this.hasValue = this.hasSeed)) {
            this._tryReduce(value);
        }
        else {
            this.acc = value;
            this.hasValue = true;
        }
    };
    ReduceSubscriber.prototype._tryReduce = function (value) {
        var result;
        try {
            result = this.project(this.acc, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.acc = result;
    };
    ReduceSubscriber.prototype._complete = function () {
        if (this.hasValue || this.hasSeed) {
            this.destination.next(this.acc);
        }
        this.destination.complete();
    };
    return ReduceSubscriber;
}(Subscriber_1.Subscriber));
exports.ReduceSubscriber = ReduceSubscriber;

},{"../Subscriber":15}],191:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var EmptyObservable_1 = require('../observable/EmptyObservable');
/**
 * Returns an Observable that repeats the stream of items emitted by the source Observable at most count times,
 * on a particular Scheduler.
 *
 * <img src="./img/repeat.png" width="100%">
 *
 * @param {Scheduler} [scheduler] the Scheduler to emit the items on.
 * @param {number} [count] the number of times the source Observable items are repeated, a count of 0 will yield
 * an empty Observable.
 * @returns {Observable} an Observable that repeats the stream of items emitted by the source Observable at most
 * count times.
 */
function repeat(count) {
    if (count === void 0) { count = -1; }
    if (count === 0) {
        return new EmptyObservable_1.EmptyObservable();
    }
    else if (count < 0) {
        return this.lift(new RepeatOperator(-1, this));
    }
    else {
        return this.lift(new RepeatOperator(count - 1, this));
    }
}
exports.repeat = repeat;
var RepeatOperator = (function () {
    function RepeatOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RepeatOperator.prototype.call = function (subscriber) {
        return new RepeatSubscriber(subscriber, this.count, this.source);
    };
    return RepeatOperator;
}());
var RepeatSubscriber = (function (_super) {
    __extends(RepeatSubscriber, _super);
    function RepeatSubscriber(destination, count, source) {
        _super.call(this, destination);
        this.count = count;
        this.source = source;
    }
    RepeatSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.complete.call(this);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            this.unsubscribe();
            this.isStopped = false;
            this.isUnsubscribed = false;
            source.subscribe(this);
        }
    };
    return RepeatSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../observable/EmptyObservable":127}],192:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that mirrors the source Observable, resubscribing to it if it calls `error` and the
 * predicate returns true for that specific exception and retry count.
 * If the source Observable calls `error`, this method will resubscribe to the source Observable for a maximum of
 * count resubscriptions (given as a number parameter) rather than propagating the `error` call.
 *
 * <img src="./img/retry.png" width="100%">
 *
 * Any and all items emitted by the source Observable will be emitted by the resulting Observable, even those emitted
 * during failed subscriptions. For example, if an Observable fails at first but emits [1, 2] then succeeds the second
 * time and emits: [1, 2, 3, 4, 5] then the complete stream of emissions and notifications
 * would be: [1, 2, 1, 2, 3, 4, 5, `complete`].
 * @param {number} number of retry attempts before failing.
 * @returns {Observable} the source Observable modified with the retry logic.
 */
function retry(count) {
    if (count === void 0) { count = -1; }
    return this.lift(new RetryOperator(count, this));
}
exports.retry = retry;
var RetryOperator = (function () {
    function RetryOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RetryOperator.prototype.call = function (subscriber) {
        return new RetrySubscriber(subscriber, this.count, this.source);
    };
    return RetryOperator;
}());
var RetrySubscriber = (function (_super) {
    __extends(RetrySubscriber, _super);
    function RetrySubscriber(destination, count, source) {
        _super.call(this, destination);
        this.count = count;
        this.source = source;
    }
    RetrySubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.error.call(this, err);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            this.unsubscribe();
            this.isStopped = false;
            this.isUnsubscribed = false;
            source.subscribe(this);
        }
    };
    return RetrySubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],193:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable that emits the same values as the source observable with the exception of an `error`.
 * An `error` will cause the emission of the Throwable that cause the error to the Observable returned from
 * notificationHandler. If that Observable calls onComplete or `error` then retry will call `complete` or `error`
 * on the child subscription. Otherwise, this Observable will resubscribe to the source observable, on a particular
 * Scheduler.
 *
 * <img src="./img/retryWhen.png" width="100%">
 *
 * @param {notificationHandler} receives an Observable of notifications with which a user can `complete` or `error`,
 * aborting the retry.
 * @param {scheduler} the Scheduler on which to subscribe to the source Observable.
 * @returns {Observable} the source Observable modified with retry logic.
 */
function retryWhen(notifier) {
    return this.lift(new RetryWhenOperator(notifier, this));
}
exports.retryWhen = retryWhen;
var RetryWhenOperator = (function () {
    function RetryWhenOperator(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    RetryWhenOperator.prototype.call = function (subscriber) {
        return new RetryWhenSubscriber(subscriber, this.notifier, this.source);
    };
    return RetryWhenOperator;
}());
var RetryWhenSubscriber = (function (_super) {
    __extends(RetryWhenSubscriber, _super);
    function RetryWhenSubscriber(destination, notifier, source) {
        _super.call(this, destination);
        this.notifier = notifier;
        this.source = source;
    }
    RetryWhenSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var errors = this.errors;
            var retries = this.retries;
            var retriesSubscription = this.retriesSubscription;
            if (!retries) {
                errors = new Subject_1.Subject();
                retries = tryCatch_1.tryCatch(this.notifier)(errors);
                if (retries === errorObject_1.errorObject) {
                    return _super.prototype.error.call(this, errorObject_1.errorObject.e);
                }
                retriesSubscription = subscribeToResult_1.subscribeToResult(this, retries);
            }
            else {
                this.errors = null;
                this.retriesSubscription = null;
            }
            this.unsubscribe();
            this.isUnsubscribed = false;
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            errors.next(err);
        }
    };
    RetryWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
        if (errors) {
            errors.unsubscribe();
            this.errors = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    };
    RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _a = this, errors = _a.errors, retries = _a.retries, retriesSubscription = _a.retriesSubscription;
        this.errors = null;
        this.retries = null;
        this.retriesSubscription = null;
        this.unsubscribe();
        this.isStopped = false;
        this.isUnsubscribed = false;
        this.errors = errors;
        this.retries = retries;
        this.retriesSubscription = retriesSubscription;
        this.source.subscribe(this);
    };
    return RetryWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../Subject":14,"../util/errorObject":245,"../util/subscribeToResult":256,"../util/tryCatch":259}],194:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable that, when the specified sampler Observable emits an item or completes, it then emits the most
 * recently emitted item (if any) emitted by the source Observable since the previous emission from the sampler
 * Observable.
 *
 * <img src="./img/sample.png" width="100%">
 *
 * @param {Observable} sampler - the Observable to use for sampling the source Observable.
 * @returns {Observable<T>} an Observable that emits the results of sampling the items emitted by this Observable
 * whenever the sampler Observable emits an item or completes.
 */
function sample(notifier) {
    return this.lift(new SampleOperator(notifier));
}
exports.sample = sample;
var SampleOperator = (function () {
    function SampleOperator(notifier) {
        this.notifier = notifier;
    }
    SampleOperator.prototype.call = function (subscriber) {
        return new SampleSubscriber(subscriber, this.notifier);
    };
    return SampleOperator;
}());
var SampleSubscriber = (function (_super) {
    __extends(SampleSubscriber, _super);
    function SampleSubscriber(destination, notifier) {
        _super.call(this, destination);
        this.hasValue = false;
        this.add(subscribeToResult_1.subscribeToResult(this, notifier));
    }
    SampleSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
    };
    SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    };
    SampleSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    SampleSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.value);
        }
    };
    return SampleSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],195:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var asap_1 = require('../scheduler/asap');
function sampleTime(delay, scheduler) {
    if (scheduler === void 0) { scheduler = asap_1.asap; }
    return this.lift(new SampleTimeOperator(delay, scheduler));
}
exports.sampleTime = sampleTime;
var SampleTimeOperator = (function () {
    function SampleTimeOperator(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    SampleTimeOperator.prototype.call = function (subscriber) {
        return new SampleTimeSubscriber(subscriber, this.delay, this.scheduler);
    };
    return SampleTimeOperator;
}());
var SampleTimeSubscriber = (function (_super) {
    __extends(SampleTimeSubscriber, _super);
    function SampleTimeSubscriber(destination, delay, scheduler) {
        _super.call(this, destination);
        this.delay = delay;
        this.scheduler = scheduler;
        this.hasValue = false;
        this.add(scheduler.schedule(dispatchNotification, delay, { subscriber: this, delay: delay }));
    }
    SampleTimeSubscriber.prototype._next = function (value) {
        this.lastValue = value;
        this.hasValue = true;
    };
    SampleTimeSubscriber.prototype.notifyNext = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.lastValue);
        }
    };
    return SampleTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchNotification(state) {
    var subscriber = state.subscriber, delay = state.delay;
    subscriber.notifyNext();
    this.schedule(state, delay);
}

},{"../Subscriber":15,"../scheduler/asap":230}],196:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that applies a specified accumulator function to each item emitted by the source Observable.
 * If a seed value is specified, then that value will be used as the initial value for the accumulator.
 * If no seed value is specified, the first item of the source is used as the seed.
 * @param {function} accumulator The accumulator function called on each item.
 *
 * <img src="./img/scan.png" width="100%">
 *
 * @param {any} [seed] The initial accumulator value.
 * @returns {Obervable} An observable of the accumulated values.
 */
function scan(accumulator, seed) {
    return this.lift(new ScanOperator(accumulator, seed));
}
exports.scan = scan;
var ScanOperator = (function () {
    function ScanOperator(accumulator, seed) {
        this.accumulator = accumulator;
        this.seed = seed;
    }
    ScanOperator.prototype.call = function (subscriber) {
        return new ScanSubscriber(subscriber, this.accumulator, this.seed);
    };
    return ScanOperator;
}());
var ScanSubscriber = (function (_super) {
    __extends(ScanSubscriber, _super);
    function ScanSubscriber(destination, accumulator, seed) {
        _super.call(this, destination);
        this.accumulator = accumulator;
        this.accumulatorSet = false;
        this.seed = seed;
        this.accumulator = accumulator;
        this.accumulatorSet = typeof seed !== 'undefined';
    }
    Object.defineProperty(ScanSubscriber.prototype, "seed", {
        get: function () {
            return this._seed;
        },
        set: function (value) {
            this.accumulatorSet = true;
            this._seed = value;
        },
        enumerable: true,
        configurable: true
    });
    ScanSubscriber.prototype._next = function (value) {
        if (!this.accumulatorSet) {
            this.seed = value;
            this.destination.next(value);
        }
        else {
            return this._tryNext(value);
        }
    };
    ScanSubscriber.prototype._tryNext = function (value) {
        var result;
        try {
            result = this.accumulator(this.seed, value);
        }
        catch (err) {
            this.destination.error(err);
        }
        this.seed = result;
        this.destination.next(result);
    };
    return ScanSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],197:[function(require,module,exports){
"use strict";
var multicast_1 = require('./multicast');
var Subject_1 = require('../Subject');
function shareSubjectFactory() {
    return new Subject_1.Subject();
}
/**
 * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
 * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
 * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
 * This is an alias for .publish().refCount().
 *
 * <img src="./img/share.png" width="100%">
 *
 * @returns {Observable<T>} an Observable that upon connection causes the source Observable to emit items to its Observers
 */
function share() {
    return multicast_1.multicast.call(this, shareSubjectFactory).refCount();
}
exports.share = share;
;

},{"../Subject":14,"./multicast":181}],198:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var EmptyError_1 = require('../util/EmptyError');
/**
 * Returns an Observable that emits the single item emitted by the source Observable that matches a specified
 * predicate, if that Observable emits one such item. If the source Observable emits more than one such item or no
 * such items, notify of an IllegalArgumentException or NoSuchElementException respectively.
 *
 * <img src="./img/single.png" width="100%">
 *
 * @param {Function} a predicate function to evaluate items emitted by the source Observable.
 * @returns {Observable<T>} an Observable that emits the single item emitted by the source Observable that matches
 * the predicate.
 .
 */
function single(predicate) {
    return this.lift(new SingleOperator(predicate, this));
}
exports.single = single;
var SingleOperator = (function () {
    function SingleOperator(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    SingleOperator.prototype.call = function (subscriber) {
        return new SingleSubscriber(subscriber, this.predicate, this.source);
    };
    return SingleOperator;
}());
var SingleSubscriber = (function (_super) {
    __extends(SingleSubscriber, _super);
    function SingleSubscriber(destination, predicate, source) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.source = source;
        this.seenValue = false;
        this.index = 0;
    }
    SingleSubscriber.prototype.applySingleValue = function (value) {
        if (this.seenValue) {
            this.destination.error('Sequence contains more than one element');
        }
        else {
            this.seenValue = true;
            this.singleValue = value;
        }
    };
    SingleSubscriber.prototype._next = function (value) {
        var predicate = this.predicate;
        this.index++;
        if (predicate) {
            this.tryNext(value);
        }
        else {
            this.applySingleValue(value);
        }
    };
    SingleSubscriber.prototype.tryNext = function (value) {
        try {
            var result = this.predicate(value, this.index, this.source);
            if (result) {
                this.applySingleValue(value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    SingleSubscriber.prototype._complete = function () {
        var destination = this.destination;
        if (this.index > 0) {
            destination.next(this.seenValue ? this.singleValue : undefined);
            destination.complete();
        }
        else {
            destination.error(new EmptyError_1.EmptyError);
        }
    };
    return SingleSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../util/EmptyError":238}],199:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that skips `n` items emitted by an Observable.
 *
 * <img src="./img/skip.png" width="100%">
 *
 * @param {Number} the `n` of times, items emitted by source Observable should be skipped.
 * @returns {Observable} an Observable that skips values emitted by the source Observable.
 *
 */
function skip(total) {
    return this.lift(new SkipOperator(total));
}
exports.skip = skip;
var SkipOperator = (function () {
    function SkipOperator(total) {
        this.total = total;
    }
    SkipOperator.prototype.call = function (subscriber) {
        return new SkipSubscriber(subscriber, this.total);
    };
    return SkipOperator;
}());
var SkipSubscriber = (function (_super) {
    __extends(SkipSubscriber, _super);
    function SkipSubscriber(destination, total) {
        _super.call(this, destination);
        this.total = total;
        this.count = 0;
    }
    SkipSubscriber.prototype._next = function (x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    };
    return SkipSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],200:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
* Returns an Observable that skips items emitted by the source Observable until a second Observable emits an item.
*
* <img src="./img/skipUntil.png" width="100%">
*
* @param {Observable} the second Observable that has to emit an item before the source Observable's elements begin to
* be mirrored by the resulting Observable.
* @returns {Observable<T>} an Observable that skips items from the source Observable until the second Observable emits
* an item, then emits the remaining items.
*/
function skipUntil(notifier) {
    return this.lift(new SkipUntilOperator(notifier));
}
exports.skipUntil = skipUntil;
var SkipUntilOperator = (function () {
    function SkipUntilOperator(notifier) {
        this.notifier = notifier;
    }
    SkipUntilOperator.prototype.call = function (subscriber) {
        return new SkipUntilSubscriber(subscriber, this.notifier);
    };
    return SkipUntilOperator;
}());
var SkipUntilSubscriber = (function (_super) {
    __extends(SkipUntilSubscriber, _super);
    function SkipUntilSubscriber(destination, notifier) {
        _super.call(this, destination);
        this.hasValue = false;
        this.isInnerStopped = false;
        this.add(subscribeToResult_1.subscribeToResult(this, notifier));
    }
    SkipUntilSubscriber.prototype._next = function (value) {
        if (this.hasValue) {
            _super.prototype._next.call(this, value);
        }
    };
    SkipUntilSubscriber.prototype._complete = function () {
        if (this.isInnerStopped) {
            _super.prototype._complete.call(this);
        }
        else {
            this.unsubscribe();
        }
    };
    SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.hasValue = true;
    };
    SkipUntilSubscriber.prototype.notifyComplete = function () {
        this.isInnerStopped = true;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    return SkipUntilSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],201:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that skips all items emitted by the source Observable as long as a specified condition holds
 * true, but emits all further source items as soon as the condition becomes false.
 *
 * <img src="./img/skipWhile.png" width="100%">
 *
 * @param {Function} predicate - a function to test each item emitted from the source Observable.
 * @returns {Observable<T>} an Observable that begins emitting items emitted by the source Observable when the
 * specified predicate becomes false.
 */
function skipWhile(predicate) {
    return this.lift(new SkipWhileOperator(predicate));
}
exports.skipWhile = skipWhile;
var SkipWhileOperator = (function () {
    function SkipWhileOperator(predicate) {
        this.predicate = predicate;
    }
    SkipWhileOperator.prototype.call = function (subscriber) {
        return new SkipWhileSubscriber(subscriber, this.predicate);
    };
    return SkipWhileOperator;
}());
var SkipWhileSubscriber = (function (_super) {
    __extends(SkipWhileSubscriber, _super);
    function SkipWhileSubscriber(destination, predicate) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.skipping = true;
        this.index = 0;
    }
    SkipWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (this.skipping) {
            this.tryCallPredicate(value);
        }
        if (!this.skipping) {
            destination.next(value);
        }
    };
    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
        try {
            var result = this.predicate(value, this.index++);
            this.skipping = Boolean(result);
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    return SkipWhileSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],202:[function(require,module,exports){
"use strict";
var ArrayObservable_1 = require('../observable/ArrayObservable');
var ScalarObservable_1 = require('../observable/ScalarObservable');
var EmptyObservable_1 = require('../observable/EmptyObservable');
var concat_1 = require('./concat');
var isScheduler_1 = require('../util/isScheduler');
/**
 * Returns an Observable that emits the items in a specified Iterable before it begins to emit items emitted by the
 * source Observable.
 *
 * <img src="./img/startWith.png" width="100%">
 *
 * @param {Values} an Iterable that contains the items you want the modified Observable to emit first.
 * @returns {Observable} an Observable that emits the items in the specified Iterable and then emits the items
 * emitted by the source Observable.
 */
function startWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        array[_i - 0] = arguments[_i];
    }
    var scheduler = array[array.length - 1];
    if (isScheduler_1.isScheduler(scheduler)) {
        array.pop();
    }
    else {
        scheduler = null;
    }
    var len = array.length;
    if (len === 1) {
        return concat_1.concatStatic(new ScalarObservable_1.ScalarObservable(array[0], scheduler), this);
    }
    else if (len > 1) {
        return concat_1.concatStatic(new ArrayObservable_1.ArrayObservable(array, scheduler), this);
    }
    else {
        return concat_1.concatStatic(new EmptyObservable_1.EmptyObservable(scheduler), this);
    }
}
exports.startWith = startWith;

},{"../observable/ArrayObservable":122,"../observable/EmptyObservable":127,"../observable/ScalarObservable":138,"../util/isScheduler":252,"./concat":150}],203:[function(require,module,exports){
"use strict";
var SubscribeOnObservable_1 = require('../observable/SubscribeOnObservable');
/**
 * Asynchronously subscribes Observers to this Observable on the specified Scheduler.
 *
 * <img src="./img/subscribeOn.png" width="100%">
 *
 * @param {Scheduler} the Scheduler to perform subscription actions on.
 * @returns {Observable<T>} the source Observable modified so that its subscriptions happen on the specified Scheduler
 .
 */
function subscribeOn(scheduler, delay) {
    if (delay === void 0) { delay = 0; }
    return new SubscribeOnObservable_1.SubscribeOnObservable(this, delay, scheduler);
}
exports.subscribeOn = subscribeOn;

},{"../observable/SubscribeOnObservable":139}],204:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Converts an Observable that emits Observables into an Observable that emits the items emitted by the most recently
 * emitted of those Observables.
 *
 * <img src="./img/switch.png" width="100%">
 *
 * Switch subscribes to an Observable that emits Observables. Each time it observes one of these emitted Observables,
 * the Observable returned by switchOnNext begins emitting the items emitted by that Observable. When a new Observable
 * is emitted, switchOnNext stops emitting items from the earlier-emitted Observable and begins emitting items from the
 * new one.
 *
 * @param {Function} a predicate function to evaluate items emitted by the source Observable.
 * @returns {Observable<T>} an Observable that emits the items emitted by the Observable most recently emitted by the
 * source Observable.
 */
function _switch() {
    return this.lift(new SwitchOperator());
}
exports._switch = _switch;
var SwitchOperator = (function () {
    function SwitchOperator() {
    }
    SwitchOperator.prototype.call = function (subscriber) {
        return new SwitchSubscriber(subscriber);
    };
    return SwitchOperator;
}());
var SwitchSubscriber = (function (_super) {
    __extends(SwitchSubscriber, _super);
    function SwitchSubscriber(destination) {
        _super.call(this, destination);
        this.active = 0;
        this.hasCompleted = false;
    }
    SwitchSubscriber.prototype._next = function (value) {
        this.unsubscribeInner();
        this.active++;
        this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, value));
    };
    SwitchSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0) {
            this.destination.complete();
        }
    };
    SwitchSubscriber.prototype.unsubscribeInner = function () {
        this.active = this.active > 0 ? this.active - 1 : 0;
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
            this.remove(innerSubscription);
        }
    };
    SwitchSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    SwitchSubscriber.prototype.notifyError = function (err) {
        this.destination.error(err);
    };
    SwitchSubscriber.prototype.notifyComplete = function () {
        this.unsubscribeInner();
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    };
    return SwitchSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],205:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns a new Observable by applying a function that you supply to each item emitted by the source Observable that
 * returns an Observable, and then emitting the items emitted by the most recently emitted of these Observables.
 *
 * <img src="./img/switchMap.png" width="100%">
 *
 * @param {Observable} a function that, when applied to an item emitted by the source Observable, returns an Observable.
 * @returns {Observable} an Observable that emits the items emitted by the Observable returned from applying func to
 * the most recently emitted item emitted by the source Observable.
 */
function switchMap(project, resultSelector) {
    return this.lift(new SwitchMapOperator(project, resultSelector));
}
exports.switchMap = switchMap;
var SwitchMapOperator = (function () {
    function SwitchMapOperator(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
    }
    SwitchMapOperator.prototype.call = function (subscriber) {
        return new SwitchMapSubscriber(subscriber, this.project, this.resultSelector);
    };
    return SwitchMapOperator;
}());
var SwitchMapSubscriber = (function (_super) {
    __extends(SwitchMapSubscriber, _super);
    function SwitchMapSubscriber(destination, project, resultSelector) {
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.index = 0;
    }
    SwitchMapSubscriber.prototype._next = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    };
    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, result, value, index));
    };
    SwitchMapSubscriber.prototype._complete = function () {
        var innerSubscription = this.innerSubscription;
        if (!innerSubscription || innerSubscription.isUnsubscribed) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype._unsubscribe = function () {
        this.innerSubscription = null;
    };
    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._tryNotifyNext(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    };
    SwitchMapSubscriber.prototype._tryNotifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return SwitchMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],206:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function switchMapTo(observable, resultSelector) {
    return this.lift(new SwitchMapToOperator(observable, resultSelector));
}
exports.switchMapTo = switchMapTo;
var SwitchMapToOperator = (function () {
    function SwitchMapToOperator(observable, resultSelector) {
        this.observable = observable;
        this.resultSelector = resultSelector;
    }
    SwitchMapToOperator.prototype.call = function (subscriber) {
        return new SwitchMapToSubscriber(subscriber, this.observable, this.resultSelector);
    };
    return SwitchMapToOperator;
}());
var SwitchMapToSubscriber = (function (_super) {
    __extends(SwitchMapToSubscriber, _super);
    function SwitchMapToSubscriber(destination, inner, resultSelector) {
        _super.call(this, destination);
        this.inner = inner;
        this.resultSelector = resultSelector;
        this.index = 0;
    }
    SwitchMapToSubscriber.prototype._next = function (value) {
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, this.inner, value, this.index++));
    };
    SwitchMapToSubscriber.prototype._complete = function () {
        var innerSubscription = this.innerSubscription;
        if (!innerSubscription || innerSubscription.isUnsubscribed) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapToSubscriber.prototype._unsubscribe = function () {
        this.innerSubscription = null;
    };
    SwitchMapToSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapToSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        if (resultSelector) {
            this.tryResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            destination.next(innerValue);
        }
    };
    SwitchMapToSubscriber.prototype.tryResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        var result;
        try {
            result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        destination.next(result);
    };
    return SwitchMapToSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],207:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var ArgumentOutOfRangeError_1 = require('../util/ArgumentOutOfRangeError');
var EmptyObservable_1 = require('../observable/EmptyObservable');
function take(total) {
    if (total === 0) {
        return new EmptyObservable_1.EmptyObservable();
    }
    else {
        return this.lift(new TakeOperator(total));
    }
}
exports.take = take;
var TakeOperator = (function () {
    function TakeOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
        }
    }
    TakeOperator.prototype.call = function (subscriber) {
        return new TakeSubscriber(subscriber, this.total);
    };
    return TakeOperator;
}());
var TakeSubscriber = (function (_super) {
    __extends(TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
        _super.call(this, destination);
        this.total = total;
        this.count = 0;
    }
    TakeSubscriber.prototype._next = function (value) {
        var total = this.total;
        if (++this.count <= total) {
            this.destination.next(value);
            if (this.count === total) {
                this.destination.complete();
            }
        }
    };
    return TakeSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../observable/EmptyObservable":127,"../util/ArgumentOutOfRangeError":237}],208:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var ArgumentOutOfRangeError_1 = require('../util/ArgumentOutOfRangeError');
var EmptyObservable_1 = require('../observable/EmptyObservable');
function takeLast(total) {
    if (total === 0) {
        return new EmptyObservable_1.EmptyObservable();
    }
    else {
        return this.lift(new TakeLastOperator(total));
    }
}
exports.takeLast = takeLast;
var TakeLastOperator = (function () {
    function TakeLastOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
        }
    }
    TakeLastOperator.prototype.call = function (subscriber) {
        return new TakeLastSubscriber(subscriber, this.total);
    };
    return TakeLastOperator;
}());
var TakeLastSubscriber = (function (_super) {
    __extends(TakeLastSubscriber, _super);
    function TakeLastSubscriber(destination, total) {
        _super.call(this, destination);
        this.total = total;
        this.count = 0;
        this.index = 0;
        this.ring = new Array(total);
    }
    TakeLastSubscriber.prototype._next = function (value) {
        var index = this.index;
        var ring = this.ring;
        var total = this.total;
        var count = this.count;
        if (total > 1) {
            if (count < total) {
                this.count = count + 1;
                this.index = index + 1;
            }
            else if (index === 0) {
                this.index = ++index;
            }
            else if (index < total) {
                this.index = index + 1;
            }
            else {
                this.index = index = 0;
            }
        }
        else if (count < total) {
            this.count = total;
        }
        ring[index] = value;
    };
    TakeLastSubscriber.prototype._complete = function () {
        var iter = -1;
        var _a = this, ring = _a.ring, count = _a.count, total = _a.total, destination = _a.destination;
        var index = (total === 1 || count < total) ? 0 : this.index - 1;
        while (++iter < count) {
            if (iter + index === total) {
                index = total - iter;
            }
            destination.next(ring[iter + index]);
        }
        destination.complete();
    };
    return TakeLastSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../observable/EmptyObservable":127,"../util/ArgumentOutOfRangeError":237}],209:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function takeUntil(notifier) {
    return this.lift(new TakeUntilOperator(notifier));
}
exports.takeUntil = takeUntil;
var TakeUntilOperator = (function () {
    function TakeUntilOperator(notifier) {
        this.notifier = notifier;
    }
    TakeUntilOperator.prototype.call = function (subscriber) {
        return new TakeUntilSubscriber(subscriber, this.notifier);
    };
    return TakeUntilOperator;
}());
var TakeUntilSubscriber = (function (_super) {
    __extends(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination, notifier) {
        _super.call(this, destination);
        this.notifier = notifier;
        this.add(subscribeToResult_1.subscribeToResult(this, notifier));
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    return TakeUntilSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],210:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
function takeWhile(predicate) {
    return this.lift(new TakeWhileOperator(predicate));
}
exports.takeWhile = takeWhile;
var TakeWhileOperator = (function () {
    function TakeWhileOperator(predicate) {
        this.predicate = predicate;
    }
    TakeWhileOperator.prototype.call = function (subscriber) {
        return new TakeWhileSubscriber(subscriber, this.predicate);
    };
    return TakeWhileOperator;
}());
var TakeWhileSubscriber = (function (_super) {
    __extends(TakeWhileSubscriber, _super);
    function TakeWhileSubscriber(destination, predicate) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.index = 0;
    }
    TakeWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        var result;
        try {
            result = this.predicate(value, this.index++);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this.nextOrComplete(value, result);
    };
    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
        var destination = this.destination;
        if (Boolean(predicateResult)) {
            destination.next(value);
        }
        else {
            destination.complete();
        }
    };
    return TakeWhileSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],211:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function throttle(durationSelector) {
    return this.lift(new ThrottleOperator(durationSelector));
}
exports.throttle = throttle;
var ThrottleOperator = (function () {
    function ThrottleOperator(durationSelector) {
        this.durationSelector = durationSelector;
    }
    ThrottleOperator.prototype.call = function (subscriber) {
        return new ThrottleSubscriber(subscriber, this.durationSelector);
    };
    return ThrottleOperator;
}());
var ThrottleSubscriber = (function (_super) {
    __extends(ThrottleSubscriber, _super);
    function ThrottleSubscriber(destination, durationSelector) {
        _super.call(this, destination);
        this.destination = destination;
        this.durationSelector = durationSelector;
    }
    ThrottleSubscriber.prototype._next = function (value) {
        if (!this.throttled) {
            this.tryDurationSelector(value);
        }
    };
    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
        var duration = null;
        try {
            duration = this.durationSelector(value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.emitAndThrottle(value, duration);
    };
    ThrottleSubscriber.prototype.emitAndThrottle = function (value, duration) {
        this.add(this.throttled = subscribeToResult_1.subscribeToResult(this, duration));
        this.destination.next(value);
    };
    ThrottleSubscriber.prototype._unsubscribe = function () {
        var throttled = this.throttled;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
    };
    ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._unsubscribe();
    };
    ThrottleSubscriber.prototype.notifyComplete = function () {
        this._unsubscribe();
    };
    return ThrottleSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],212:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var asap_1 = require('../scheduler/asap');
function throttleTime(delay, scheduler) {
    if (scheduler === void 0) { scheduler = asap_1.asap; }
    return this.lift(new ThrottleTimeOperator(delay, scheduler));
}
exports.throttleTime = throttleTime;
var ThrottleTimeOperator = (function () {
    function ThrottleTimeOperator(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    ThrottleTimeOperator.prototype.call = function (subscriber) {
        return new ThrottleTimeSubscriber(subscriber, this.delay, this.scheduler);
    };
    return ThrottleTimeOperator;
}());
var ThrottleTimeSubscriber = (function (_super) {
    __extends(ThrottleTimeSubscriber, _super);
    function ThrottleTimeSubscriber(destination, delay, scheduler) {
        _super.call(this, destination);
        this.delay = delay;
        this.scheduler = scheduler;
    }
    ThrottleTimeSubscriber.prototype._next = function (value) {
        if (!this.throttled) {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.delay, { subscriber: this }));
            this.destination.next(value);
        }
    };
    ThrottleTimeSubscriber.prototype.clearThrottle = function () {
        var throttled = this.throttled;
        if (throttled) {
            throttled.unsubscribe();
            this.remove(throttled);
            this.throttled = null;
        }
    };
    return ThrottleTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchNext(_a) {
    var subscriber = _a.subscriber;
    subscriber.clearThrottle();
}

},{"../Subscriber":15,"../scheduler/asap":230}],213:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var asap_1 = require('../scheduler/asap');
var isDate_1 = require('../util/isDate');
var Subscriber_1 = require('../Subscriber');
function timeout(due, errorToSend, scheduler) {
    if (errorToSend === void 0) { errorToSend = null; }
    if (scheduler === void 0) { scheduler = asap_1.asap; }
    var absoluteTimeout = isDate_1.isDate(due);
    var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
    return this.lift(new TimeoutOperator(waitFor, absoluteTimeout, errorToSend, scheduler));
}
exports.timeout = timeout;
var TimeoutOperator = (function () {
    function TimeoutOperator(waitFor, absoluteTimeout, errorToSend, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.errorToSend = errorToSend;
        this.scheduler = scheduler;
    }
    TimeoutOperator.prototype.call = function (subscriber) {
        return new TimeoutSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.errorToSend, this.scheduler);
    };
    return TimeoutOperator;
}());
var TimeoutSubscriber = (function (_super) {
    __extends(TimeoutSubscriber, _super);
    function TimeoutSubscriber(destination, absoluteTimeout, waitFor, errorToSend, scheduler) {
        _super.call(this, destination);
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.errorToSend = errorToSend;
        this.scheduler = scheduler;
        this.index = 0;
        this._previousIndex = 0;
        this._hasCompleted = false;
        this.scheduleTimeout();
    }
    Object.defineProperty(TimeoutSubscriber.prototype, "previousIndex", {
        get: function () {
            return this._previousIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeoutSubscriber.prototype, "hasCompleted", {
        get: function () {
            return this._hasCompleted;
        },
        enumerable: true,
        configurable: true
    });
    TimeoutSubscriber.dispatchTimeout = function (state) {
        var source = state.subscriber;
        var currentIndex = state.index;
        if (!source.hasCompleted && source.previousIndex === currentIndex) {
            source.notifyTimeout();
        }
    };
    TimeoutSubscriber.prototype.scheduleTimeout = function () {
        var currentIndex = this.index;
        this.scheduler.schedule(TimeoutSubscriber.dispatchTimeout, this.waitFor, { subscriber: this, index: currentIndex });
        this.index++;
        this._previousIndex = currentIndex;
    };
    TimeoutSubscriber.prototype._next = function (value) {
        this.destination.next(value);
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
    };
    TimeoutSubscriber.prototype._error = function (err) {
        this.destination.error(err);
        this._hasCompleted = true;
    };
    TimeoutSubscriber.prototype._complete = function () {
        this.destination.complete();
        this._hasCompleted = true;
    };
    TimeoutSubscriber.prototype.notifyTimeout = function () {
        this.error(this.errorToSend || new Error('timeout'));
    };
    return TimeoutSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15,"../scheduler/asap":230,"../util/isDate":247}],214:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var asap_1 = require('../scheduler/asap');
var isDate_1 = require('../util/isDate');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function timeoutWith(due, withObservable, scheduler) {
    if (scheduler === void 0) { scheduler = asap_1.asap; }
    var absoluteTimeout = isDate_1.isDate(due);
    var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
    return this.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
}
exports.timeoutWith = timeoutWith;
var TimeoutWithOperator = (function () {
    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    TimeoutWithOperator.prototype.call = function (subscriber) {
        return new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler);
    };
    return TimeoutWithOperator;
}());
var TimeoutWithSubscriber = (function (_super) {
    __extends(TimeoutWithSubscriber, _super);
    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        _super.call(this);
        this.destination = destination;
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
        this.timeoutSubscription = undefined;
        this.index = 0;
        this._previousIndex = 0;
        this._hasCompleted = false;
        destination.add(this);
        this.scheduleTimeout();
    }
    Object.defineProperty(TimeoutWithSubscriber.prototype, "previousIndex", {
        get: function () {
            return this._previousIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeoutWithSubscriber.prototype, "hasCompleted", {
        get: function () {
            return this._hasCompleted;
        },
        enumerable: true,
        configurable: true
    });
    TimeoutWithSubscriber.dispatchTimeout = function (state) {
        var source = state.subscriber;
        var currentIndex = state.index;
        if (!source.hasCompleted && source.previousIndex === currentIndex) {
            source.handleTimeout();
        }
    };
    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
        var currentIndex = this.index;
        var timeoutState = { subscriber: this, index: currentIndex };
        this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, timeoutState);
        this.index++;
        this._previousIndex = currentIndex;
    };
    TimeoutWithSubscriber.prototype._next = function (value) {
        this.destination.next(value);
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
    };
    TimeoutWithSubscriber.prototype._error = function (err) {
        this.destination.error(err);
        this._hasCompleted = true;
    };
    TimeoutWithSubscriber.prototype._complete = function () {
        this.destination.complete();
        this._hasCompleted = true;
    };
    TimeoutWithSubscriber.prototype.handleTimeout = function () {
        if (!this.isUnsubscribed) {
            var withObservable = this.withObservable;
            this.unsubscribe();
            this.destination.add(this.timeoutSubscription = subscribeToResult_1.subscribeToResult(this, withObservable));
        }
    };
    return TimeoutWithSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../scheduler/asap":230,"../util/isDate":247,"../util/subscribeToResult":256}],215:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
function toArray() {
    return this.lift(new ToArrayOperator());
}
exports.toArray = toArray;
var ToArrayOperator = (function () {
    function ToArrayOperator() {
    }
    ToArrayOperator.prototype.call = function (subscriber) {
        return new ToArraySubscriber(subscriber);
    };
    return ToArrayOperator;
}());
var ToArraySubscriber = (function (_super) {
    __extends(ToArraySubscriber, _super);
    function ToArraySubscriber(destination) {
        _super.call(this, destination);
        this.array = [];
    }
    ToArraySubscriber.prototype._next = function (x) {
        this.array.push(x);
    };
    ToArraySubscriber.prototype._complete = function () {
        this.destination.next(this.array);
        this.destination.complete();
    };
    return ToArraySubscriber;
}(Subscriber_1.Subscriber));

},{"../Subscriber":15}],216:[function(require,module,exports){
"use strict";
var root_1 = require('../util/root');
function toPromise(PromiseCtor) {
    var _this = this;
    if (!PromiseCtor) {
        if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
            PromiseCtor = root_1.root.Rx.config.Promise;
        }
        else if (root_1.root.Promise) {
            PromiseCtor = root_1.root.Promise;
        }
    }
    if (!PromiseCtor) {
        throw new Error('no Promise impl found');
    }
    return new PromiseCtor(function (resolve, reject) {
        var value;
        _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
    });
}
exports.toPromise = toPromise;

},{"../util/root":255}],217:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function window(closingNotifier) {
    return this.lift(new WindowOperator(closingNotifier));
}
exports.window = window;
var WindowOperator = (function () {
    function WindowOperator(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    WindowOperator.prototype.call = function (subscriber) {
        return new WindowSubscriber(subscriber, this.closingNotifier);
    };
    return WindowOperator;
}());
var WindowSubscriber = (function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination, closingNotifier) {
        _super.call(this, destination);
        this.destination = destination;
        this.closingNotifier = closingNotifier;
        this.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
        this.openWindow();
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow();
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
        this._complete();
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
    };
    WindowSubscriber.prototype.openWindow = function () {
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var destination = this.destination;
        var newWindow = this.window = new Subject_1.Subject();
        destination.add(newWindow);
        destination.next(newWindow);
    };
    return WindowSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../Subject":14,"../util/subscribeToResult":256}],218:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Subject_1 = require('../Subject');
function windowCount(windowSize, startWindowEvery) {
    if (startWindowEvery === void 0) { startWindowEvery = 0; }
    return this.lift(new WindowCountOperator(windowSize, startWindowEvery));
}
exports.windowCount = windowCount;
var WindowCountOperator = (function () {
    function WindowCountOperator(windowSize, startWindowEvery) {
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
    }
    WindowCountOperator.prototype.call = function (subscriber) {
        return new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery);
    };
    return WindowCountOperator;
}());
var WindowCountSubscriber = (function (_super) {
    __extends(WindowCountSubscriber, _super);
    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
        _super.call(this, destination);
        this.destination = destination;
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
        this.windows = [new Subject_1.Subject()];
        this.count = 0;
        var firstWindow = this.windows[0];
        destination.add(firstWindow);
        destination.next(firstWindow);
    }
    WindowCountSubscriber.prototype._next = function (value) {
        var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
        var destination = this.destination;
        var windowSize = this.windowSize;
        var windows = this.windows;
        var len = windows.length;
        for (var i = 0; i < len; i++) {
            windows[i].next(value);
        }
        var c = this.count - windowSize + 1;
        if (c >= 0 && c % startWindowEvery === 0) {
            windows.shift().complete();
        }
        if (++this.count % startWindowEvery === 0) {
            var window_1 = new Subject_1.Subject();
            windows.push(window_1);
            destination.add(window_1);
            destination.next(window_1);
        }
    };
    WindowCountSubscriber.prototype._error = function (err) {
        var windows = this.windows;
        while (windows.length > 0) {
            windows.shift().error(err);
        }
        this.destination.error(err);
    };
    WindowCountSubscriber.prototype._complete = function () {
        var windows = this.windows;
        while (windows.length > 0) {
            windows.shift().complete();
        }
        this.destination.complete();
    };
    return WindowCountSubscriber;
}(Subscriber_1.Subscriber));

},{"../Subject":14,"../Subscriber":15}],219:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Subject_1 = require('../Subject');
var asap_1 = require('../scheduler/asap');
function windowTime(windowTimeSpan, windowCreationInterval, scheduler) {
    if (windowCreationInterval === void 0) { windowCreationInterval = null; }
    if (scheduler === void 0) { scheduler = asap_1.asap; }
    return this.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, scheduler));
}
exports.windowTime = windowTime;
var WindowTimeOperator = (function () {
    function WindowTimeOperator(windowTimeSpan, windowCreationInterval, scheduler) {
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.scheduler = scheduler;
    }
    WindowTimeOperator.prototype.call = function (subscriber) {
        return new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.scheduler);
    };
    return WindowTimeOperator;
}());
var WindowTimeSubscriber = (function (_super) {
    __extends(WindowTimeSubscriber, _super);
    function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, scheduler) {
        _super.call(this, destination);
        this.destination = destination;
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.scheduler = scheduler;
        this.windows = [];
        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
            var window_1 = this.openWindow();
            var closeState = { subscriber: this, window: window_1, context: null };
            var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: this, scheduler: scheduler };
            this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
            this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
        }
        else {
            var window_2 = this.openWindow();
            var timeSpanOnlyState = { subscriber: this, window: window_2, windowTimeSpan: windowTimeSpan };
            this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
        }
    }
    WindowTimeSubscriber.prototype._next = function (value) {
        var windows = this.windows;
        var len = windows.length;
        for (var i = 0; i < len; i++) {
            var window_3 = windows[i];
            if (!window_3.isUnsubscribed) {
                window_3.next(value);
            }
        }
    };
    WindowTimeSubscriber.prototype._error = function (err) {
        var windows = this.windows;
        while (windows.length > 0) {
            windows.shift().error(err);
        }
        this.destination.error(err);
    };
    WindowTimeSubscriber.prototype._complete = function () {
        var windows = this.windows;
        while (windows.length > 0) {
            var window_4 = windows.shift();
            if (!window_4.isUnsubscribed) {
                window_4.complete();
            }
        }
        this.destination.complete();
    };
    WindowTimeSubscriber.prototype.openWindow = function () {
        var window = new Subject_1.Subject();
        this.windows.push(window);
        var destination = this.destination;
        destination.add(window);
        destination.next(window);
        return window;
    };
    WindowTimeSubscriber.prototype.closeWindow = function (window) {
        window.complete();
        var windows = this.windows;
        windows.splice(windows.indexOf(window), 1);
    };
    return WindowTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchWindowTimeSpanOnly(state) {
    var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
    if (window) {
        window.complete();
    }
    state.window = subscriber.openWindow();
    this.schedule(state, windowTimeSpan);
}
function dispatchWindowCreation(state) {
    var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
    var window = subscriber.openWindow();
    var action = this;
    var context = { action: action, subscription: null };
    var timeSpanState = { subscriber: subscriber, window: window, context: context };
    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
    action.add(context.subscription);
    action.schedule(state, windowCreationInterval);
}
function dispatchWindowClose(_a) {
    var subscriber = _a.subscriber, window = _a.window, context = _a.context;
    if (context && context.action && context.subscription) {
        context.action.remove(context.subscription);
    }
    subscriber.closeWindow(window);
}

},{"../Subject":14,"../Subscriber":15,"../scheduler/asap":230}],220:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var Subscription_1 = require('../Subscription');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function windowToggle(openings, closingSelector) {
    return this.lift(new WindowToggleOperator(openings, closingSelector));
}
exports.windowToggle = windowToggle;
var WindowToggleOperator = (function () {
    function WindowToggleOperator(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    WindowToggleOperator.prototype.call = function (subscriber) {
        return new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector);
    };
    return WindowToggleOperator;
}());
var WindowToggleSubscriber = (function (_super) {
    __extends(WindowToggleSubscriber, _super);
    function WindowToggleSubscriber(destination, openings, closingSelector) {
        _super.call(this, destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(this.openSubscription = subscribeToResult_1.subscribeToResult(this, openings, openings));
    }
    WindowToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        if (contexts) {
            var len = contexts.length;
            for (var i = 0; i < len; i++) {
                contexts[i].window.next(value);
            }
        }
    };
    WindowToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context = contexts[index];
                context.window.error(err);
                context.subscription.unsubscribe();
            }
        }
        _super.prototype._error.call(this, err);
    };
    WindowToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context = contexts[index];
                context.window.complete();
                context.subscription.unsubscribe();
            }
        }
        _super.prototype._complete.call(this);
    };
    WindowToggleSubscriber.prototype._unsubscribe = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context = contexts[index];
                context.window.unsubscribe();
                context.subscription.unsubscribe();
            }
        }
    };
    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (outerValue === this.openings) {
            var closingSelector = this.closingSelector;
            var closingNotifier = tryCatch_1.tryCatch(closingSelector)(innerValue);
            if (closingNotifier === errorObject_1.errorObject) {
                return this.error(errorObject_1.errorObject.e);
            }
            else {
                var window_1 = new Subject_1.Subject();
                var subscription = new Subscription_1.Subscription();
                var context = { window: window_1, subscription: subscription };
                this.contexts.push(context);
                var innerSubscription = subscribeToResult_1.subscribeToResult(this, closingNotifier, context);
                innerSubscription.context = context;
                subscription.add(innerSubscription);
                this.destination.next(window_1);
            }
        }
        else {
            this.closeWindow(this.contexts.indexOf(outerValue));
        }
    };
    WindowToggleSubscriber.prototype.notifyError = function (err) {
        this.error(err);
    };
    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
        if (inner !== this.openSubscription) {
            this.closeWindow(this.contexts.indexOf(inner.context));
        }
    };
    WindowToggleSubscriber.prototype.closeWindow = function (index) {
        var contexts = this.contexts;
        var context = contexts[index];
        var window = context.window, subscription = context.subscription;
        contexts.splice(index, 1);
        window.complete();
        subscription.unsubscribe();
    };
    return WindowToggleSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../Subject":14,"../Subscription":16,"../util/errorObject":245,"../util/subscribeToResult":256,"../util/tryCatch":259}],221:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function windowWhen(closingSelector) {
    return this.lift(new WindowOperator(closingSelector));
}
exports.windowWhen = windowWhen;
var WindowOperator = (function () {
    function WindowOperator(closingSelector) {
        this.closingSelector = closingSelector;
    }
    WindowOperator.prototype.call = function (subscriber) {
        return new WindowSubscriber(subscriber, this.closingSelector);
    };
    return WindowOperator;
}());
var WindowSubscriber = (function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination, closingSelector) {
        _super.call(this, destination);
        this.destination = destination;
        this.closingSelector = closingSelector;
        this.openWindow();
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
        if (this.closingNotification) {
            this.closingNotification.unsubscribe();
        }
    };
    WindowSubscriber.prototype.openWindow = function (innerSub) {
        if (innerSub === void 0) { innerSub = null; }
        if (innerSub) {
            this.remove(innerSub);
            innerSub.unsubscribe();
        }
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var window = this.window = new Subject_1.Subject();
        this.destination.next(window);
        var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject_1.errorObject) {
            var err = errorObject_1.errorObject.e;
            this.destination.error(err);
            this.window.error(err);
        }
        else {
            this.add(this.closingNotification = subscribeToResult_1.subscribeToResult(this, closingNotifier));
            this.add(window);
        }
    };
    return WindowSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../Subject":14,"../util/errorObject":245,"../util/subscribeToResult":256,"../util/tryCatch":259}],222:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * @param {Observable} observables the observables to get the latest values from.
 * @param {Function} [project] optional projection function for merging values together. Receives all values in order
 *  of observables passed. (e.g. `a.withLatestFrom(b, c, (a1, b1, c1) => a1 + b1 + c1)`). If this is not passed, arrays
 *  will be returned.
 * @description merges each value from an observable with the latest values from the other passed observables.
 * All observables must emit at least one value before the resulting observable will emit
 *
 * #### example
 * ```
 * A.withLatestFrom(B, C)
 *
 *  A:     ----a-----------------b---------------c-----------|
 *  B:     ---d----------------e--------------f---------|
 *  C:     --x----------------y-------------z-------------|
 * result: ---([a,d,x])---------([b,e,y])--------([c,f,z])---|
 * ```
 */
function withLatestFrom() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var project;
    if (typeof args[args.length - 1] === 'function') {
        project = args.pop();
    }
    var observables = args;
    return this.lift(new WithLatestFromOperator(observables, project));
}
exports.withLatestFrom = withLatestFrom;
/* tslint:enable:max-line-length */
var WithLatestFromOperator = (function () {
    function WithLatestFromOperator(observables, project) {
        this.observables = observables;
        this.project = project;
    }
    WithLatestFromOperator.prototype.call = function (subscriber) {
        return new WithLatestFromSubscriber(subscriber, this.observables, this.project);
    };
    return WithLatestFromOperator;
}());
var WithLatestFromSubscriber = (function (_super) {
    __extends(WithLatestFromSubscriber, _super);
    function WithLatestFromSubscriber(destination, observables, project) {
        _super.call(this, destination);
        this.observables = observables;
        this.project = project;
        this.toRespond = [];
        var len = observables.length;
        this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            this.toRespond.push(i);
        }
        for (var i = 0; i < len; i++) {
            var observable = observables[i];
            this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
        }
    }
    WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        var toRespond = this.toRespond;
        if (toRespond.length > 0) {
            var found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
    };
    WithLatestFromSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    WithLatestFromSubscriber.prototype._next = function (value) {
        if (this.toRespond.length === 0) {
            var args = [value].concat(this.values);
            if (this.project) {
                this._tryProject(args);
            }
            else {
                this.destination.next(args);
            }
        }
    };
    WithLatestFromSubscriber.prototype._tryProject = function (args) {
        var result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return WithLatestFromSubscriber;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../util/subscribeToResult":256}],223:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArrayObservable_1 = require('../observable/ArrayObservable');
var isArray_1 = require('../util/isArray');
var Subscriber_1 = require('../Subscriber');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
var SymbolShim_1 = require('../util/SymbolShim');
function zipProto() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    observables.unshift(this);
    return zipStatic.apply(this, observables);
}
exports.zipProto = zipProto;
/* tslint:enable:max-line-length */
function zipStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = observables[observables.length - 1];
    if (typeof project === 'function') {
        observables.pop();
    }
    return new ArrayObservable_1.ArrayObservable(observables).lift(new ZipOperator(project));
}
exports.zipStatic = zipStatic;
var ZipOperator = (function () {
    function ZipOperator(project) {
        this.project = project;
    }
    ZipOperator.prototype.call = function (subscriber) {
        return new ZipSubscriber(subscriber, this.project);
    };
    return ZipOperator;
}());
exports.ZipOperator = ZipOperator;
var ZipSubscriber = (function (_super) {
    __extends(ZipSubscriber, _super);
    function ZipSubscriber(destination, project, values) {
        if (values === void 0) { values = Object.create(null); }
        _super.call(this, destination);
        this.index = 0;
        this.iterators = [];
        this.active = 0;
        this.project = (typeof project === 'function') ? project : null;
        this.values = values;
    }
    ZipSubscriber.prototype._next = function (value) {
        var iterators = this.iterators;
        var index = this.index++;
        if (isArray_1.isArray(value)) {
            iterators.push(new StaticArrayIterator(value));
        }
        else if (typeof value[SymbolShim_1.SymbolShim.iterator] === 'function') {
            iterators.push(new StaticIterator(value[SymbolShim_1.SymbolShim.iterator]()));
        }
        else {
            iterators.push(new ZipBufferIterator(this.destination, this, value, index));
        }
    };
    ZipSubscriber.prototype._complete = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        this.active = len;
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (iterator.stillUnsubscribed) {
                this.add(iterator.subscribe(iterator, i));
            }
            else {
                this.active--; // not an observable
            }
        }
    };
    ZipSubscriber.prototype.notifyInactive = function () {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    };
    ZipSubscriber.prototype.checkIterators = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        var destination = this.destination;
        // abort if not all of them have values
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
            }
        }
        var shouldComplete = false;
        var args = [];
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            var result = iterator.next();
            // check to see if it's completed now that you've gotten
            // the next value.
            if (iterator.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        if (this.project) {
            this._tryProject(args);
        }
        else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    };
    ZipSubscriber.prototype._tryProject = function (args) {
        var result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return ZipSubscriber;
}(Subscriber_1.Subscriber));
exports.ZipSubscriber = ZipSubscriber;
var StaticIterator = (function () {
    function StaticIterator(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
    }
    StaticIterator.prototype.hasValue = function () {
        return true;
    };
    StaticIterator.prototype.next = function () {
        var result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    };
    StaticIterator.prototype.hasCompleted = function () {
        var nextResult = this.nextResult;
        return nextResult && nextResult.done;
    };
    return StaticIterator;
}());
var StaticArrayIterator = (function () {
    function StaticArrayIterator(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    StaticArrayIterator.prototype[SymbolShim_1.SymbolShim.iterator] = function () {
        return this;
    };
    StaticArrayIterator.prototype.next = function (value) {
        var i = this.index++;
        var array = this.array;
        return i < this.length ? { value: array[i], done: false } : { done: true };
    };
    StaticArrayIterator.prototype.hasValue = function () {
        return this.array.length > this.index;
    };
    StaticArrayIterator.prototype.hasCompleted = function () {
        return this.array.length === this.index;
    };
    return StaticArrayIterator;
}());
var ZipBufferIterator = (function (_super) {
    __extends(ZipBufferIterator, _super);
    function ZipBufferIterator(destination, parent, observable, index) {
        _super.call(this, destination);
        this.parent = parent;
        this.observable = observable;
        this.index = index;
        this.stillUnsubscribed = true;
        this.buffer = [];
        this.isComplete = false;
    }
    ZipBufferIterator.prototype[SymbolShim_1.SymbolShim.iterator] = function () {
        return this;
    };
    // NOTE: there is actually a name collision here with Subscriber.next and Iterator.next
    //    this is legit because `next()` will never be called by a subscription in this case.
    ZipBufferIterator.prototype.next = function () {
        var buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { done: true };
        }
        else {
            return { value: buffer.shift(), done: false };
        }
    };
    ZipBufferIterator.prototype.hasValue = function () {
        return this.buffer.length > 0;
    };
    ZipBufferIterator.prototype.hasCompleted = function () {
        return this.buffer.length === 0 && this.isComplete;
    };
    ZipBufferIterator.prototype.notifyComplete = function () {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        }
        else {
            this.destination.complete();
        }
    };
    ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    };
    ZipBufferIterator.prototype.subscribe = function (value, index) {
        return subscribeToResult_1.subscribeToResult(this, this.observable, this, index);
    };
    return ZipBufferIterator;
}(OuterSubscriber_1.OuterSubscriber));

},{"../OuterSubscriber":12,"../Subscriber":15,"../observable/ArrayObservable":122,"../util/SymbolShim":244,"../util/isArray":246,"../util/subscribeToResult":256}],224:[function(require,module,exports){
"use strict";
var zip_1 = require('./zip');
function zipAll(project) {
    return this.lift(new zip_1.ZipOperator(project));
}
exports.zipAll = zipAll;

},{"./zip":223}],225:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Immediate_1 = require('../util/Immediate');
var FutureAction_1 = require('./FutureAction');
var AsapAction = (function (_super) {
    __extends(AsapAction, _super);
    function AsapAction() {
        _super.apply(this, arguments);
    }
    AsapAction.prototype._schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay > 0) {
            return _super.prototype._schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        var scheduler = this.scheduler;
        scheduler.actions.push(this);
        if (!scheduler.scheduledId) {
            scheduler.scheduledId = Immediate_1.Immediate.setImmediate(function () {
                scheduler.scheduledId = null;
                scheduler.flush();
            });
        }
        return this;
    };
    AsapAction.prototype._unsubscribe = function () {
        var scheduler = this.scheduler;
        var scheduledId = scheduler.scheduledId, actions = scheduler.actions;
        _super.prototype._unsubscribe.call(this);
        if (actions.length === 0) {
            scheduler.active = false;
            if (scheduledId != null) {
                scheduler.scheduledId = null;
                Immediate_1.Immediate.clearImmediate(scheduledId);
            }
        }
    };
    return AsapAction;
}(FutureAction_1.FutureAction));
exports.AsapAction = AsapAction;

},{"../util/Immediate":240,"./FutureAction":227}],226:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsapAction_1 = require('./AsapAction');
var QueueScheduler_1 = require('./QueueScheduler');
var AsapScheduler = (function (_super) {
    __extends(AsapScheduler, _super);
    function AsapScheduler() {
        _super.apply(this, arguments);
    }
    AsapScheduler.prototype.scheduleNow = function (work, state) {
        return new AsapAction_1.AsapAction(this, work).schedule(state);
    };
    return AsapScheduler;
}(QueueScheduler_1.QueueScheduler));
exports.AsapScheduler = AsapScheduler;

},{"./AsapAction":225,"./QueueScheduler":229}],227:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1 = require('../util/root');
var Subscription_1 = require('../Subscription');
var FutureAction = (function (_super) {
    __extends(FutureAction, _super);
    function FutureAction(scheduler, work) {
        _super.call(this);
        this.scheduler = scheduler;
        this.work = work;
    }
    FutureAction.prototype.execute = function () {
        if (this.isUnsubscribed) {
            throw new Error('How did did we execute a canceled Action?');
        }
        this.work(this.state);
    };
    FutureAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (this.isUnsubscribed) {
            return this;
        }
        return this._schedule(state, delay);
    };
    FutureAction.prototype._schedule = function (state, delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        this.delay = delay;
        this.state = state;
        var id = this.id;
        if (id != null) {
            this.id = undefined;
            root_1.root.clearTimeout(id);
        }
        this.id = root_1.root.setTimeout(function () {
            _this.id = null;
            var scheduler = _this.scheduler;
            scheduler.actions.push(_this);
            scheduler.flush();
        }, delay);
        return this;
    };
    FutureAction.prototype._unsubscribe = function () {
        var _a = this, id = _a.id, scheduler = _a.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        if (id != null) {
            this.id = null;
            root_1.root.clearTimeout(id);
        }
        if (index !== -1) {
            actions.splice(index, 1);
        }
        this.work = null;
        this.state = null;
        this.scheduler = null;
    };
    return FutureAction;
}(Subscription_1.Subscription));
exports.FutureAction = FutureAction;

},{"../Subscription":16,"../util/root":255}],228:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FutureAction_1 = require('./FutureAction');
var QueueAction = (function (_super) {
    __extends(QueueAction, _super);
    function QueueAction() {
        _super.apply(this, arguments);
    }
    QueueAction.prototype._schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay > 0) {
            return _super.prototype._schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        var scheduler = this.scheduler;
        scheduler.actions.push(this);
        scheduler.flush();
        return this;
    };
    return QueueAction;
}(FutureAction_1.FutureAction));
exports.QueueAction = QueueAction;

},{"./FutureAction":227}],229:[function(require,module,exports){
"use strict";
var QueueAction_1 = require('./QueueAction');
var FutureAction_1 = require('./FutureAction');
var QueueScheduler = (function () {
    function QueueScheduler() {
        this.active = false;
        this.actions = [];
        this.scheduledId = null;
    }
    QueueScheduler.prototype.now = function () {
        return Date.now();
    };
    QueueScheduler.prototype.flush = function () {
        if (this.active || this.scheduledId) {
            return;
        }
        this.active = true;
        var actions = this.actions;
        for (var action = void 0; action = actions.shift();) {
            action.execute();
        }
        this.active = false;
    };
    QueueScheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) { delay = 0; }
        return (delay <= 0) ?
            this.scheduleNow(work, state) :
            this.scheduleLater(work, delay, state);
    };
    QueueScheduler.prototype.scheduleNow = function (work, state) {
        return new QueueAction_1.QueueAction(this, work).schedule(state);
    };
    QueueScheduler.prototype.scheduleLater = function (work, delay, state) {
        return new FutureAction_1.FutureAction(this, work).schedule(state, delay);
    };
    return QueueScheduler;
}());
exports.QueueScheduler = QueueScheduler;

},{"./FutureAction":227,"./QueueAction":228}],230:[function(require,module,exports){
"use strict";
var AsapScheduler_1 = require('./AsapScheduler');
exports.asap = new AsapScheduler_1.AsapScheduler();

},{"./AsapScheduler":226}],231:[function(require,module,exports){
"use strict";
var QueueScheduler_1 = require('./QueueScheduler');
exports.queue = new QueueScheduler_1.QueueScheduler();

},{"./QueueScheduler":229}],232:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var AsyncSubject = (function (_super) {
    __extends(AsyncSubject, _super);
    function AsyncSubject() {
        _super.apply(this, arguments);
        this.value = null;
        this.hasNext = false;
    }
    AsyncSubject.prototype._subscribe = function (subscriber) {
        if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
        }
        return _super.prototype._subscribe.call(this, subscriber);
    };
    AsyncSubject.prototype._next = function (value) {
        this.value = value;
        this.hasNext = true;
    };
    AsyncSubject.prototype._complete = function () {
        var index = -1;
        var observers = this.observers;
        var len = observers.length;
        // optimization to block our SubjectSubscriptions from
        // splicing themselves out of the observers list one by one.
        this.isUnsubscribed = true;
        if (this.hasNext) {
            while (++index < len) {
                var o = observers[index];
                o.next(this.value);
                o.complete();
            }
        }
        else {
            while (++index < len) {
                observers[index].complete();
            }
        }
        this.isUnsubscribed = false;
        this.unsubscribe();
    };
    return AsyncSubject;
}(Subject_1.Subject));
exports.AsyncSubject = AsyncSubject;

},{"../Subject":14}],233:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var throwError_1 = require('../util/throwError');
var ObjectUnsubscribedError_1 = require('../util/ObjectUnsubscribedError');
var BehaviorSubject = (function (_super) {
    __extends(BehaviorSubject, _super);
    function BehaviorSubject(_value) {
        _super.call(this);
        this._value = _value;
    }
    BehaviorSubject.prototype.getValue = function () {
        if (this.hasErrored) {
            throwError_1.throwError(this.errorValue);
        }
        else if (this.isUnsubscribed) {
            throwError_1.throwError(new ObjectUnsubscribedError_1.ObjectUnsubscribedError());
        }
        else {
            return this._value;
        }
    };
    Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function () {
            return this.getValue();
        },
        enumerable: true,
        configurable: true
    });
    BehaviorSubject.prototype._subscribe = function (subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        if (subscription && !subscription.isUnsubscribed) {
            subscriber.next(this._value);
        }
        return subscription;
    };
    BehaviorSubject.prototype._next = function (value) {
        _super.prototype._next.call(this, this._value = value);
    };
    BehaviorSubject.prototype._error = function (err) {
        this.hasErrored = true;
        _super.prototype._error.call(this, this.errorValue = err);
    };
    return BehaviorSubject;
}(Subject_1.Subject));
exports.BehaviorSubject = BehaviorSubject;

},{"../Subject":14,"../util/ObjectUnsubscribedError":243,"../util/throwError":257}],234:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var queue_1 = require('../scheduler/queue');
var observeOn_1 = require('../operator/observeOn');
var ReplaySubject = (function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
        if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
        _super.call(this);
        this.events = [];
        this.scheduler = scheduler;
        this.bufferSize = bufferSize < 1 ? 1 : bufferSize;
        this._windowTime = windowTime < 1 ? 1 : windowTime;
    }
    ReplaySubject.prototype._next = function (value) {
        var now = this._getNow();
        this.events.push(new ReplayEvent(now, value));
        this._trimBufferThenGetEvents(now);
        _super.prototype._next.call(this, value);
    };
    ReplaySubject.prototype._subscribe = function (subscriber) {
        var events = this._trimBufferThenGetEvents(this._getNow());
        var scheduler = this.scheduler;
        if (scheduler) {
            subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
        }
        var index = -1;
        var len = events.length;
        while (++index < len && !subscriber.isUnsubscribed) {
            subscriber.next(events[index].value);
        }
        return _super.prototype._subscribe.call(this, subscriber);
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || queue_1.queue).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function (now) {
        var bufferSize = this.bufferSize;
        var _windowTime = this._windowTime;
        var events = this.events;
        var eventsCount = events.length;
        var spliceCount = 0;
        // Trim events that fall out of the time window.
        // Start at the front of the list. Break early once
        // we encounter an event that falls within the window.
        while (spliceCount < eventsCount) {
            if ((now - events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount += 1;
        }
        if (eventsCount > bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - bufferSize);
        }
        if (spliceCount > 0) {
            events.splice(0, spliceCount);
        }
        return events;
    };
    return ReplaySubject;
}(Subject_1.Subject));
exports.ReplaySubject = ReplaySubject;
var ReplayEvent = (function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}());

},{"../Subject":14,"../operator/observeOn":182,"../scheduler/queue":231}],235:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = require('../Subscription');
var SubjectSubscription = (function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, observer) {
        _super.call(this);
        this.subject = subject;
        this.observer = observer;
        this.isUnsubscribed = false;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.isUnsubscribed) {
            return;
        }
        this.isUnsubscribed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isUnsubscribed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.observer);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription_1.Subscription));
exports.SubjectSubscription = SubjectSubscription;

},{"../Subscription":16}],236:[function(require,module,exports){
"use strict";
var SymbolShim_1 = require('../util/SymbolShim');
/**
 * rxSubscriber symbol is a symbol for retreiving an "Rx safe" Observer from an object
 * "Rx safety" can be defined as an object that has all of the traits of an Rx Subscriber,
 * including the ability to add and remove subscriptions to the subscription chain and
 * guarantees involving event triggering (can't "next" after unsubscription, etc).
 */
exports.rxSubscriber = SymbolShim_1.SymbolShim.for('rxSubscriber');

},{"../util/SymbolShim":244}],237:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArgumentOutOfRangeError = (function (_super) {
    __extends(ArgumentOutOfRangeError, _super);
    function ArgumentOutOfRangeError() {
        _super.call(this, 'argument out of range');
        this.name = 'ArgumentOutOfRangeError';
    }
    return ArgumentOutOfRangeError;
}(Error));
exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;

},{}],238:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EmptyError = (function (_super) {
    __extends(EmptyError, _super);
    function EmptyError() {
        _super.call(this, 'no elements in sequence');
        this.name = 'EmptyError';
    }
    return EmptyError;
}(Error));
exports.EmptyError = EmptyError;

},{}],239:[function(require,module,exports){
"use strict";
var FastMap = (function () {
    function FastMap() {
        this.values = {};
    }
    FastMap.prototype.delete = function (key) {
        this.values[key] = null;
        return true;
    };
    FastMap.prototype.set = function (key, value) {
        this.values[key] = value;
        return this;
    };
    FastMap.prototype.get = function (key) {
        return this.values[key];
    };
    FastMap.prototype.forEach = function (cb, thisArg) {
        var values = this.values;
        for (var key in values) {
            if (values.hasOwnProperty(key) && values[key] !== null) {
                cb.call(thisArg, values[key], key);
            }
        }
    };
    FastMap.prototype.clear = function () {
        this.values = {};
    };
    return FastMap;
}());
exports.FastMap = FastMap;

},{}],240:[function(require,module,exports){
/**
Some credit for this helper goes to http://github.com/YuzuJS/setImmediate
*/
"use strict";
var root_1 = require('./root');
var ImmediateDefinition = (function () {
    function ImmediateDefinition(root) {
        this.root = root;
        if (root.setImmediate && typeof root.setImmediate === 'function') {
            this.setImmediate = root.setImmediate.bind(root);
            this.clearImmediate = root.clearImmediate.bind(root);
        }
        else {
            this.nextHandle = 1;
            this.tasksByHandle = {};
            this.currentlyRunningATask = false;
            // Don't get fooled by e.g. browserify environments.
            if (this.canUseProcessNextTick()) {
                // For Node.js before 0.9
                this.setImmediate = this.createProcessNextTickSetImmediate();
            }
            else if (this.canUsePostMessage()) {
                // For non-IE10 modern browsers
                this.setImmediate = this.createPostMessageSetImmediate();
            }
            else if (this.canUseMessageChannel()) {
                // For web workers, where supported
                this.setImmediate = this.createMessageChannelSetImmediate();
            }
            else if (this.canUseReadyStateChange()) {
                // For IE 6–8
                this.setImmediate = this.createReadyStateChangeSetImmediate();
            }
            else {
                // For older browsers
                this.setImmediate = this.createSetTimeoutSetImmediate();
            }
            var ci = function clearImmediate(handle) {
                delete clearImmediate.instance.tasksByHandle[handle];
            };
            ci.instance = this;
            this.clearImmediate = ci;
        }
    }
    ImmediateDefinition.prototype.identify = function (o) {
        return this.root.Object.prototype.toString.call(o);
    };
    ImmediateDefinition.prototype.canUseProcessNextTick = function () {
        return this.identify(this.root.process) === '[object process]';
    };
    ImmediateDefinition.prototype.canUseMessageChannel = function () {
        return Boolean(this.root.MessageChannel);
    };
    ImmediateDefinition.prototype.canUseReadyStateChange = function () {
        var document = this.root.document;
        return Boolean(document && 'onreadystatechange' in document.createElement('script'));
    };
    ImmediateDefinition.prototype.canUsePostMessage = function () {
        var root = this.root;
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `root.postMessage` means something completely different and can't be used for this purpose.
        if (root.postMessage && !root.importScripts) {
            var postMessageIsAsynchronous_1 = true;
            var oldOnMessage = root.onmessage;
            root.onmessage = function () {
                postMessageIsAsynchronous_1 = false;
            };
            root.postMessage('', '*');
            root.onmessage = oldOnMessage;
            return postMessageIsAsynchronous_1;
        }
        return false;
    };
    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    ImmediateDefinition.prototype.partiallyApplied = function (handler) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var fn = function result() {
            var _a = result, handler = _a.handler, args = _a.args;
            if (typeof handler === 'function') {
                handler.apply(undefined, args);
            }
            else {
                (new Function('' + handler))();
            }
        };
        fn.handler = handler;
        fn.args = args;
        return fn;
    };
    ImmediateDefinition.prototype.addFromSetImmediateArguments = function (args) {
        this.tasksByHandle[this.nextHandle] = this.partiallyApplied.apply(undefined, args);
        return this.nextHandle++;
    };
    ImmediateDefinition.prototype.createProcessNextTickSetImmediate = function () {
        var fn = function setImmediate() {
            var instance = setImmediate.instance;
            var handle = instance.addFromSetImmediateArguments(arguments);
            instance.root.process.nextTick(instance.partiallyApplied(instance.runIfPresent, handle));
            return handle;
        };
        fn.instance = this;
        return fn;
    };
    ImmediateDefinition.prototype.createPostMessageSetImmediate = function () {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
        var root = this.root;
        var messagePrefix = 'setImmediate$' + root.Math.random() + '$';
        var onGlobalMessage = function globalMessageHandler(event) {
            var instance = globalMessageHandler.instance;
            if (event.source === root &&
                typeof event.data === 'string' &&
                event.data.indexOf(messagePrefix) === 0) {
                instance.runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };
        onGlobalMessage.instance = this;
        root.addEventListener('message', onGlobalMessage, false);
        var fn = function setImmediate() {
            var _a = setImmediate, messagePrefix = _a.messagePrefix, instance = _a.instance;
            var handle = instance.addFromSetImmediateArguments(arguments);
            instance.root.postMessage(messagePrefix + handle, '*');
            return handle;
        };
        fn.instance = this;
        fn.messagePrefix = messagePrefix;
        return fn;
    };
    ImmediateDefinition.prototype.runIfPresent = function (handle) {
        // From the spec: 'Wait until any invocations of this algorithm started before this one have completed.'
        // So if we're currently running a task, we'll need to delay this invocation.
        if (this.currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // 'too much recursion' error.
            this.root.setTimeout(this.partiallyApplied(this.runIfPresent, handle), 0);
        }
        else {
            var task = this.tasksByHandle[handle];
            if (task) {
                this.currentlyRunningATask = true;
                try {
                    task();
                }
                finally {
                    this.clearImmediate(handle);
                    this.currentlyRunningATask = false;
                }
            }
        }
    };
    ImmediateDefinition.prototype.createMessageChannelSetImmediate = function () {
        var _this = this;
        var channel = new this.root.MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            _this.runIfPresent(handle);
        };
        var fn = function setImmediate() {
            var _a = setImmediate, channel = _a.channel, instance = _a.instance;
            var handle = instance.addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
        fn.channel = channel;
        fn.instance = this;
        return fn;
    };
    ImmediateDefinition.prototype.createReadyStateChangeSetImmediate = function () {
        var fn = function setImmediate() {
            var instance = setImmediate.instance;
            var root = instance.root;
            var doc = root.document;
            var html = doc.documentElement;
            var handle = instance.addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement('script');
            script.onreadystatechange = function () {
                instance.runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
        fn.instance = this;
        return fn;
    };
    ImmediateDefinition.prototype.createSetTimeoutSetImmediate = function () {
        var fn = function setImmediate() {
            var instance = setImmediate.instance;
            var handle = instance.addFromSetImmediateArguments(arguments);
            instance.root.setTimeout(instance.partiallyApplied(instance.runIfPresent, handle), 0);
            return handle;
        };
        fn.instance = this;
        return fn;
    };
    return ImmediateDefinition;
}());
exports.ImmediateDefinition = ImmediateDefinition;
exports.Immediate = new ImmediateDefinition(root_1.root);

},{"./root":255}],241:[function(require,module,exports){
"use strict";
var root_1 = require('./root');
var MapPolyfill_1 = require('./MapPolyfill');
exports.Map = root_1.root.Map || (function () { return MapPolyfill_1.MapPolyfill; })();

},{"./MapPolyfill":242,"./root":255}],242:[function(require,module,exports){
"use strict";
var MapPolyfill = (function () {
    function MapPolyfill() {
        this.size = 0;
        this._values = [];
        this._keys = [];
    }
    MapPolyfill.prototype.get = function (key) {
        var i = this._keys.indexOf(key);
        return i === -1 ? undefined : this._values[i];
    };
    MapPolyfill.prototype.set = function (key, value) {
        var i = this._keys.indexOf(key);
        if (i === -1) {
            this._keys.push(key);
            this._values.push(value);
            this.size++;
        }
        else {
            this._values[i] = value;
        }
        return this;
    };
    MapPolyfill.prototype.delete = function (key) {
        var i = this._keys.indexOf(key);
        if (i === -1) {
            return false;
        }
        this._values.splice(i, 1);
        this._keys.splice(i, 1);
        this.size--;
        return true;
    };
    MapPolyfill.prototype.clear = function () {
        this._keys.length = 0;
        this._values.length = 0;
        this.size = 0;
    };
    MapPolyfill.prototype.forEach = function (cb, thisArg) {
        for (var i = 0; i < this.size; i++) {
            cb.call(thisArg, this._values[i], this._keys[i]);
        }
    };
    return MapPolyfill;
}());
exports.MapPolyfill = MapPolyfill;

},{}],243:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * an error thrown when an action is invalid because the object
 * has been unsubscribed
 */
var ObjectUnsubscribedError = (function (_super) {
    __extends(ObjectUnsubscribedError, _super);
    function ObjectUnsubscribedError() {
        _super.call(this, 'object unsubscribed');
        this.name = 'ObjectUnsubscribedError';
    }
    return ObjectUnsubscribedError;
}(Error));
exports.ObjectUnsubscribedError = ObjectUnsubscribedError;

},{}],244:[function(require,module,exports){
"use strict";
var root_1 = require('./root');
function polyfillSymbol(root) {
    var Symbol = ensureSymbol(root);
    ensureIterator(Symbol, root);
    ensureObservable(Symbol);
    ensureFor(Symbol);
    return Symbol;
}
exports.polyfillSymbol = polyfillSymbol;
function ensureFor(Symbol) {
    if (!Symbol.for) {
        Symbol.for = symbolForPolyfill;
    }
}
exports.ensureFor = ensureFor;
var id = 0;
function ensureSymbol(root) {
    if (!root.Symbol) {
        root.Symbol = function symbolFuncPolyfill(description) {
            return "@@Symbol(" + description + "):" + id++;
        };
    }
    return root.Symbol;
}
exports.ensureSymbol = ensureSymbol;
function symbolForPolyfill(key) {
    return '@@' + key;
}
exports.symbolForPolyfill = symbolForPolyfill;
function ensureIterator(Symbol, root) {
    if (!Symbol.iterator) {
        if (typeof Symbol.for === 'function') {
            Symbol.iterator = Symbol.for('iterator');
        }
        else if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
            // Bug for mozilla version
            Symbol.iterator = '@@iterator';
        }
        else if (root.Map) {
            // es6-shim specific logic
            var keys = Object.getOwnPropertyNames(root.Map.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (key !== 'entries' && key !== 'size' && root.Map.prototype[key] === root.Map.prototype['entries']) {
                    Symbol.iterator = key;
                    break;
                }
            }
        }
        else {
            Symbol.iterator = '@@iterator';
        }
    }
}
exports.ensureIterator = ensureIterator;
function ensureObservable(Symbol) {
    if (!Symbol.observable) {
        if (typeof Symbol.for === 'function') {
            Symbol.observable = Symbol.for('observable');
        }
        else {
            Symbol.observable = '@@observable';
        }
    }
}
exports.ensureObservable = ensureObservable;
exports.SymbolShim = polyfillSymbol(root_1.root);

},{"./root":255}],245:[function(require,module,exports){
"use strict";
// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };

},{}],246:[function(require,module,exports){
"use strict";
exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });

},{}],247:[function(require,module,exports){
"use strict";
function isDate(value) {
    return value instanceof Date && !isNaN(+value);
}
exports.isDate = isDate;

},{}],248:[function(require,module,exports){
"use strict";
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;

},{}],249:[function(require,module,exports){
"use strict";
var isArray_1 = require('../util/isArray');
function isNumeric(val) {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    // adding 1 corrects loss of precision from parseFloat (#15100)
    return !isArray_1.isArray(val) && (val - parseFloat(val) + 1) >= 0;
}
exports.isNumeric = isNumeric;
;

},{"../util/isArray":246}],250:[function(require,module,exports){
"use strict";
function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;

},{}],251:[function(require,module,exports){
"use strict";
function isPromise(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
exports.isPromise = isPromise;

},{}],252:[function(require,module,exports){
"use strict";
function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
exports.isScheduler = isScheduler;

},{}],253:[function(require,module,exports){
"use strict";
/* tslint:disable:no-empty */
function noop() { }
exports.noop = noop;

},{}],254:[function(require,module,exports){
"use strict";
function not(pred, thisArg) {
    function notPred() {
        return !(notPred.pred.apply(notPred.thisArg, arguments));
    }
    notPred.pred = pred;
    notPred.thisArg = thisArg;
    return notPred;
}
exports.not = not;

},{}],255:[function(require,module,exports){
(function (global){
"use strict";
var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
};
exports.root = (objectTypes[typeof self] && self) || (objectTypes[typeof window] && window);
/* tslint:disable:no-unused-variable */
var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
var freeGlobal = objectTypes[typeof global] && global;
if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    exports.root = freeGlobal;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],256:[function(require,module,exports){
"use strict";
var root_1 = require('./root');
var isArray_1 = require('./isArray');
var isPromise_1 = require('./isPromise');
var Observable_1 = require('../Observable');
var SymbolShim_1 = require('../util/SymbolShim');
var InnerSubscriber_1 = require('../InnerSubscriber');
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.isUnsubscribed) {
        return;
    }
    if (result instanceof Observable_1.Observable) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return;
        }
        else {
            return result.subscribe(destination);
        }
    }
    if (isArray_1.isArray(result)) {
        for (var i = 0, len = result.length; i < len && !destination.isUnsubscribed; i++) {
            destination.next(result[i]);
        }
        if (!destination.isUnsubscribed) {
            destination.complete();
        }
    }
    else if (isPromise_1.isPromise(result)) {
        result.then(function (value) {
            if (!destination.isUnsubscribed) {
                destination.next(value);
                destination.complete();
            }
        }, function (err) { return destination.error(err); })
            .then(null, function (err) {
            // Escaping the Promise trap: globally throw unhandled errors
            root_1.root.setTimeout(function () { throw err; });
        });
        return destination;
    }
    else if (typeof result[SymbolShim_1.SymbolShim.iterator] === 'function') {
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var item = result_1[_i];
            destination.next(item);
            if (destination.isUnsubscribed) {
                break;
            }
        }
        if (!destination.isUnsubscribed) {
            destination.complete();
        }
    }
    else if (typeof result[SymbolShim_1.SymbolShim.observable] === 'function') {
        var obs = result[SymbolShim_1.SymbolShim.observable]();
        if (typeof obs.subscribe !== 'function') {
            destination.error('invalid observable');
        }
        else {
            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
        }
    }
    else {
        destination.error(new TypeError('unknown type returned'));
    }
}
exports.subscribeToResult = subscribeToResult;

},{"../InnerSubscriber":7,"../Observable":9,"../util/SymbolShim":244,"./isArray":246,"./isPromise":251,"./root":255}],257:[function(require,module,exports){
"use strict";
function throwError(e) { throw e; }
exports.throwError = throwError;

},{}],258:[function(require,module,exports){
"use strict";
var Subscriber_1 = require('../Subscriber');
var rxSubscriber_1 = require('../symbol/rxSubscriber');
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver && typeof nextOrObserver === 'object') {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        else if (typeof nextOrObserver[rxSubscriber_1.rxSubscriber] === 'function') {
            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
        }
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;

},{"../Subscriber":15,"../symbol/rxSubscriber":236}],259:[function(require,module,exports){
"use strict";
var errorObject_1 = require('./errorObject');
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
;

},{"./errorObject":245}],260:[function(require,module,exports){
"use strict";
var boa_vdom_1 = require('boa-vdom');
var init = boa_vdom_1.DOM.init;
var DOM = (function () {
    function DOM(rootSelector) {
        var root = document.querySelector(rootSelector);
        this.render = init({ root: root });
    }
    DOM.prototype.renderToDOM = function (vtree) {
        this.render = this.render(vtree).render;
    };
    return DOM;
}());
exports.DOM = DOM;

},{"boa-vdom":265}],261:[function(require,module,exports){
// RenderAction -> render -> render to DOM
"use strict";
var dom_1 = require('./dom');
var boa_vdom_1 = require('boa-vdom');
var init = function (domOptions) {
    var handler = function (action$, options) {
        var root = domOptions.root, render = domOptions.render, renderActionType = domOptions.renderActionType;
        var type = renderActionType ? renderActionType : 'render';
        var dom = new dom_1.DOM(root);
        var re = options.re;
        return action$
            .map(function (action) {
            if (action.type !== type)
                return action;
            var state = action.data;
            var vtree = render(state, { create: boa_vdom_1.create, e: re });
            dom.renderToDOM(vtree);
            return; // return undefined
        })
            .filter(function (a) { return !!a; }) // remove undefined
            .share();
    };
    return { handler: handler };
};
exports.init = init;

},{"./dom":260,"boa-vdom":265}],262:[function(require,module,exports){
"use strict";
var virtual_dom_1 = require('virtual-dom');
var create = virtual_dom_1.h;
exports.create = create;

},{"virtual-dom":284}],263:[function(require,module,exports){
"use strict";
var originalParse = require('vdom-virtualize');
var virtual_dom_1 = require('virtual-dom');
var vdom_1 = require('./vdom');
var parse = function (rdom) { return originalParse(rdom); };
var patch = function (rdom, patches) {
    return virtual_dom_1.patch(rdom, patches);
};
var makeRender = function (r, v) {
    return function (vdom) {
        var patches = vdom_1.diff(v, vdom);
        var newVDOM = vdom;
        var newRDOM = patch(r, patches);
        return {
            result: newRDOM,
            render: makeRender(newRDOM, newVDOM)
        };
    };
};
var init = function (options) {
    var root = options.root;
    var rdom = root;
    var vdom = parse(rdom);
    return makeRender(rdom, vdom);
};
exports.init = init;
 // Render, RDOM

},{"./vdom":266,"vdom-virtualize":279,"virtual-dom":284}],264:[function(require,module,exports){
"use strict";
var originalRender = require('vdom-to-html');
var render = function (vdom) { return originalRender(vdom); };
var makeRender = function () {
    return function (vdom) {
        var html = render(vdom);
        return {
            result: html,
            render: makeRender()
        };
    };
};
var init = function () {
    return makeRender();
};
exports.init = init;
 // HTML, Render

},{"vdom-to-html":268}],265:[function(require,module,exports){
"use strict";
var create_1 = require('./create');
exports.create = create_1.create;
var DOM = require('./dom');
exports.DOM = DOM;
var HTML = require('./html');
exports.HTML = HTML;

},{"./create":262,"./dom":263,"./html":264}],266:[function(require,module,exports){
"use strict";
var virtual_dom_1 = require('virtual-dom');
var diff = function (current, next) {
    return virtual_dom_1.diff(current, next);
};
exports.diff = diff;
 // Patches, VDOM

},{"virtual-dom":284}],267:[function(require,module,exports){
var escape = require('escape-html');
var propConfig = require('./property-config');
var types = propConfig.attributeTypes;
var properties = propConfig.properties;
var attributeNames = propConfig.attributeNames;

var prefixAttribute = memoizeString(function (name) {
  return escape(name) + '="';
});

module.exports = createAttribute;

/**
 * Create attribute string.
 *
 * @param {String} name The name of the property or attribute
 * @param {*} value The value
 * @param {Boolean} [isAttribute] Denotes whether `name` is an attribute.
 * @return {?String} Attribute string || null if not a valid property or custom attribute.
 */

function createAttribute(name, value, isAttribute) {
  if (properties.hasOwnProperty(name)) {
    if (shouldSkip(name, value)) return '';
    name = (attributeNames[name] || name).toLowerCase();
    var attrType = properties[name];
    // for BOOLEAN `value` only has to be truthy
    // for OVERLOADED_BOOLEAN `value` has to be === true
    if ((attrType === types.BOOLEAN) ||
        (attrType === types.OVERLOADED_BOOLEAN && value === true)) {
      return escape(name);
    }
    return prefixAttribute(name) + escape(value) + '"';
  } else if (isAttribute) {
    if (value == null) return '';
    return prefixAttribute(name) + escape(value) + '"';
  }
  // return null if `name` is neither a valid property nor an attribute
  return null;
}

/**
 * Should skip false boolean attributes.
 */

function shouldSkip(name, value) {
  var attrType = properties[name];
  return value == null ||
    (attrType === types.BOOLEAN && !value) ||
    (attrType === types.OVERLOADED_BOOLEAN && value === false);
}

/**
 * Memoizes the return value of a function that accepts one string argument.
 *
 * @param {function} callback
 * @return {function}
 */

function memoizeString(callback) {
  var cache = {};
  return function(string) {
    if (cache.hasOwnProperty(string)) {
      return cache[string];
    } else {
      return cache[string] = callback.call(this, string);
    }
  };
}
},{"./property-config":277,"escape-html":269}],268:[function(require,module,exports){
var escape = require('escape-html');
var extend = require('xtend');
var isVNode = require('virtual-dom/vnode/is-vnode');
var isVText = require('virtual-dom/vnode/is-vtext');
var isThunk = require('virtual-dom/vnode/is-thunk');
var isWidget = require('virtual-dom/vnode/is-widget');
var softHook = require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook');
var attrHook = require('virtual-dom/virtual-hyperscript/hooks/attribute-hook');
var paramCase = require('param-case');
var createAttribute = require('./create-attribute');
var voidElements = require('./void-elements');

module.exports = toHTML;

function toHTML(node, parent) {
  if (!node) return '';

  if (isThunk(node)) {
    node = node.render();
  }

  if (isWidget(node) && node.render) {
    node = node.render();
  }

  if (isVNode(node)) {
    return openTag(node) + tagContent(node) + closeTag(node);
  } else if (isVText(node)) {
    if (parent && parent.tagName.toLowerCase() === 'script') return String(node.text);
    return escape(String(node.text));
  }

  return '';
}

function openTag(node) {
  var props = node.properties;
  var ret = '<' + node.tagName.toLowerCase();

  for (var name in props) {
    var value = props[name];
    if (value == null) continue;

    if (name == 'attributes') {
      value = extend({}, value);
      for (var attrProp in value) {
        ret += ' ' + createAttribute(attrProp, value[attrProp], true);
      }
      continue;
    }

    if (name == 'style') {
      var css = '';
      value = extend({}, value);
      for (var styleProp in value) {
        css += paramCase(styleProp) + ': ' + value[styleProp] + '; ';
      }
      value = css.trim();
    }

    if (value instanceof softHook || value instanceof attrHook) {
      ret += ' ' + createAttribute(name, value.value, true);
      continue;
    }

    var attr = createAttribute(name, value);
    if (attr) ret += ' ' + attr;
  }

  return ret + '>';
}

function tagContent(node) {
  var innerHTML = node.properties.innerHTML;
  if (innerHTML != null) return innerHTML;
  else {
    var ret = '';
    if (node.children && node.children.length) {
      for (var i = 0, l = node.children.length; i<l; i++) {
        var child = node.children[i];
        ret += toHTML(child, node);
      }
    }
    return ret;
  }
}

function closeTag(node) {
  var tag = node.tagName.toLowerCase();
  return voidElements[tag] ? '' : '</' + tag + '>';
}
},{"./create-attribute":267,"./void-elements":278,"escape-html":269,"param-case":275,"virtual-dom/virtual-hyperscript/hooks/attribute-hook":299,"virtual-dom/virtual-hyperscript/hooks/soft-set-hook":301,"virtual-dom/vnode/is-thunk":305,"virtual-dom/vnode/is-vnode":307,"virtual-dom/vnode/is-vtext":308,"virtual-dom/vnode/is-widget":309,"xtend":276}],269:[function(require,module,exports){
/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */

'use strict';

/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Module exports.
 * @public
 */

module.exports = escapeHtml;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}

},{}],270:[function(require,module,exports){
/**
 * Special language-specific overrides.
 *
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 *
 * @type {Object}
 */
var LANGUAGES = {
  tr: {
    regexp: /\u0130|\u0049|\u0049\u0307/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  az: {
    regexp: /[\u0130]/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  lt: {
    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
    map: {
      '\u0049': '\u0069\u0307',
      '\u004A': '\u006A\u0307',
      '\u012E': '\u012F\u0307',
      '\u00CC': '\u0069\u0307\u0300',
      '\u00CD': '\u0069\u0307\u0301',
      '\u0128': '\u0069\u0307\u0303'
    }
  }
}

/**
 * Lowercase a string.
 *
 * @param  {String} str
 * @return {String}
 */
module.exports = function (str, locale) {
  var lang = LANGUAGES[locale]

  str = str == null ? '' : String(str)

  if (lang) {
    str = str.replace(lang.regexp, function (m) { return lang.map[m] })
  }

  return str.toLowerCase()
}

},{}],271:[function(require,module,exports){
var lowerCase = require('lower-case')

var NON_WORD_REGEXP = require('./vendor/non-word-regexp')
var CAMEL_CASE_REGEXP = require('./vendor/camel-case-regexp')
var TRAILING_DIGIT_REGEXP = require('./vendor/trailing-digit-regexp')

/**
 * Sentence case a string.
 *
 * @param  {String} str
 * @param  {String} locale
 * @param  {String} replacement
 * @return {String}
 */
module.exports = function (str, locale, replacement) {
  if (str == null) {
    return ''
  }

  replacement = replacement || ' '

  function replace (match, index, string) {
    if (index === 0 || index === (string.length - match.length)) {
      return ''
    }

    return replacement
  }

  str = String(str)
    // Support camel case ("camelCase" -> "camel Case").
    .replace(CAMEL_CASE_REGEXP, '$1 $2')
    // Support digit groups ("test2012" -> "test 2012").
    .replace(TRAILING_DIGIT_REGEXP, '$1 $2')
    // Remove all non-word characters and replace with a single space.
    .replace(NON_WORD_REGEXP, replace)

  // Lower case the entire string.
  return lowerCase(str, locale)
}

},{"./vendor/camel-case-regexp":272,"./vendor/non-word-regexp":273,"./vendor/trailing-digit-regexp":274,"lower-case":270}],272:[function(require,module,exports){
module.exports = /([\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])([\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g

},{}],273:[function(require,module,exports){
module.exports = /[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g

},{}],274:[function(require,module,exports){
module.exports = /([\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([^\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g

},{}],275:[function(require,module,exports){
var sentenceCase = require('sentence-case')

/**
 * Param case a string.
 *
 * @param  {String} string
 * @param  {String} [locale]
 * @return {String}
 */
module.exports = function (string, locale) {
  return sentenceCase(string, locale, '-')
}

},{"sentence-case":271}],276:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],277:[function(require,module,exports){
/**
 * Attribute types.
 */

var types = {
  BOOLEAN: 1,
  OVERLOADED_BOOLEAN: 2
};

/**
 * Properties.
 *
 * Taken from https://github.com/facebook/react/blob/847357e42e5267b04dd6e297219eaa125ab2f9f4/src/browser/ui/dom/HTMLDOMPropertyConfig.js
 *
 */

var properties = {
  /**
   * Standard Properties
   */
  accept: true,
  acceptCharset: true,
  accessKey: true,
  action: true,
  allowFullScreen: types.BOOLEAN,
  allowTransparency: true,
  alt: true,
  async: types.BOOLEAN,
  autocomplete: true,
  autofocus: types.BOOLEAN,
  autoplay: types.BOOLEAN,
  cellPadding: true,
  cellSpacing: true,
  charset: true,
  checked: types.BOOLEAN,
  classID: true,
  className: true,
  cols: true,
  colSpan: true,
  content: true,
  contentEditable: true,
  contextMenu: true,
  controls: types.BOOLEAN,
  coords: true,
  crossOrigin: true,
  data: true, // For `<object />` acts as `src`.
  dateTime: true,
  defer: types.BOOLEAN,
  dir: true,
  disabled: types.BOOLEAN,
  download: types.OVERLOADED_BOOLEAN,
  draggable: true,
  enctype: true,
  form: true,
  formAction: true,
  formEncType: true,
  formMethod: true,
  formNoValidate: types.BOOLEAN,
  formTarget: true,
  frameBorder: true,
  headers: true,
  height: true,
  hidden: types.BOOLEAN,
  href: true,
  hreflang: true,
  htmlFor: true,
  httpEquiv: true,
  icon: true,
  id: true,
  label: true,
  lang: true,
  list: true,
  loop: types.BOOLEAN,
  manifest: true,
  marginHeight: true,
  marginWidth: true,
  max: true,
  maxLength: true,
  media: true,
  mediaGroup: true,
  method: true,
  min: true,
  multiple: types.BOOLEAN,
  muted: types.BOOLEAN,
  name: true,
  noValidate: types.BOOLEAN,
  open: true,
  pattern: true,
  placeholder: true,
  poster: true,
  preload: true,
  radiogroup: true,
  readOnly: types.BOOLEAN,
  rel: true,
  required: types.BOOLEAN,
  role: true,
  rows: true,
  rowSpan: true,
  sandbox: true,
  scope: true,
  scrolling: true,
  seamless: types.BOOLEAN,
  selected: types.BOOLEAN,
  shape: true,
  size: true,
  sizes: true,
  span: true,
  spellcheck: true,
  src: true,
  srcdoc: true,
  srcset: true,
  start: true,
  step: true,
  style: true,
  tabIndex: true,
  target: true,
  title: true,
  type: true,
  useMap: true,
  value: true,
  width: true,
  wmode: true,

  /**
   * Non-standard Properties
   */
  // autoCapitalize and autoCorrect are supported in Mobile Safari for
  // keyboard hints.
  autocapitalize: true,
  autocorrect: true,
  // itemProp, itemScope, itemType are for Microdata support. See
  // http://schema.org/docs/gs.html
  itemProp: true,
  itemScope: types.BOOLEAN,
  itemType: true,
  // property is supported for OpenGraph in meta tags.
  property: true
};

/**
 * Properties to attributes mapping.
 *
 * The ones not here are simply converted to lower case.
 */

var attributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
};

/**
 * Exports.
 */

module.exports = {
  attributeTypes: types,
  properties: properties,
  attributeNames: attributeNames
};
},{}],278:[function(require,module,exports){

/**
 * Void elements.
 *
 * https://github.com/facebook/react/blob/v0.12.0/src/browser/ui/ReactDOMComponent.js#L99
 */

module.exports = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
};
},{}],279:[function(require,module,exports){
/*!
* vdom-virtualize
* Copyright 2014 by Marcel Klehr <mklehr@gmx.net>
*
* (MIT LICENSE)
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
var VNode = require("virtual-dom/vnode/vnode")
  , VText = require("virtual-dom/vnode/vtext")
  , VComment = require("./vcomment")

module.exports = createVNode

function createVNode(domNode, key) {
  key = key || null // XXX: Leave out `key` for now... merely used for (re-)ordering

  if(domNode.nodeType == 1) return createFromElement(domNode, key)
  if(domNode.nodeType == 3) return createFromTextNode(domNode, key)
  if(domNode.nodeType == 8) return createFromCommentNode(domNode, key)
  return
}

createVNode.fromHTML = function(html, key) {
  var rootNode = null;

  try {
    // Everything except iOS 7 Safari, IE 8/9, Andriod Browser 4.1/4.3
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    rootNode = doc.documentElement;
  } catch(e) {
    // Old browsers
    var ifr = document.createElement('iframe');
    ifr.setAttribute('data-content', html);
    ifr.src = 'javascript: window.frameElement.getAttribute("data-content");';
    document.head.appendChild(ifr);
    rootNode = ifr.contentDocument.documentElement;
    setTimeout(function() {
      ifr.remove(); // Garbage collection
    }, 0);
  }

  return createVNode(rootNode, key);
};

function createFromTextNode(tNode) {
  return new VText(tNode.nodeValue)
}


function createFromCommentNode(cNode) {
  return new VComment(cNode.nodeValue)
}


function createFromElement(el) {
  var tagName = el.tagName
  , namespace = el.namespaceURI == 'http://www.w3.org/1999/xhtml'? null : el.namespaceURI
  , properties = getElementProperties(el)
  , children = []

  for (var i = 0; i < el.childNodes.length; i++) {
    children.push(createVNode(el.childNodes[i]/*, i*/))
  }

  return new VNode(tagName, properties, children, null, namespace)
}


function getElementProperties(el) {
  var obj = {}

  for(var i=0; i<props.length; i++) {
    var propName = props[i]
    if(!el[propName]) continue

    // Special case: style
    // .style is a DOMStyleDeclaration, thus we need to iterate over all
    // rules to create a hash of applied css properties.
    //
    // You can directly set a specific .style[prop] = value so patching with vdom
    // is possible.
    if("style" == propName) {
      var css = {}
        , styleProp
      if ('undefined' !== typeof el.style.length) {
        for(var j=0; j<el.style.length; j++) {
          styleProp = el.style[j]
          css[styleProp] = el.style.getPropertyValue(styleProp) // XXX: add support for "!important" via getPropertyPriority()!
        }
      } else { // IE8
        for (var styleProp in el.style) {
          if (el.style[styleProp] && el.style.hasOwnProperty(styleProp)) {
            css[styleProp] = el.style[styleProp];
          }
        }
      }

      if(Object.keys(css).length) obj[propName] = css
      continue
    }

    // https://msdn.microsoft.com/en-us/library/cc848861%28v=vs.85%29.aspx
    // The img element does not support the HREF content attribute.
    // In addition, the href property is read-only for the img Document Object Model (DOM) object
    if (el.tagName.toLowerCase() === 'img' && propName === 'href') {
      continue;
    }

    // Special case: dataset
    // we can iterate over .dataset with a simple for..in loop.
    // The all-time foo with data-* attribs is the dash-snake to camelCase
    // conversion.
    //
    // *This is compatible with h(), but not with every browser, thus this section was removed in favor
    // of attributes (specified below)!*
    //
    // .dataset properties are directly accessible as transparent getters/setters, so
    // patching with vdom is possible.
    /*if("dataset" == propName) {
      var data = {}
      for(var p in el.dataset) {
        data[p] = el.dataset[p]
      }
      obj[propName] = data
      return
    }*/

    // Special case: attributes
    // these are a NamedNodeMap, but we can just convert them to a hash for vdom,
    // because of https://github.com/Matt-Esch/virtual-dom/blob/master/vdom/apply-properties.js#L57
    if("attributes" == propName){
      var atts = Array.prototype.slice.call(el[propName]);
      var hash = {}
      for(var k=0; k<atts.length; k++){
        var name = atts[k].name;
        if(obj[name] || obj[attrBlacklist[name]]) continue;
        hash[name] = el.getAttribute(name);
      }
      obj[propName] = hash;
      continue
    }
    if("tabIndex" == propName && el.tabIndex === -1) continue

    // Special case: contentEditable
    // browser use 'inherit' by default on all nodes, but does not allow setting it to ''
    // diffing virtualize dom will trigger error
    // ref: https://github.com/Matt-Esch/virtual-dom/issues/176
    if("contentEditable" == propName && el[propName] === 'inherit') continue

    if('object' === typeof el[propName]) continue

    // default: just copy the property
    obj[propName] = el[propName]
  }

  return obj
}

/**
 * DOMNode property white list
 * Taken from https://github.com/Raynos/react/blob/dom-property-config/src/browser/ui/dom/DefaultDOMPropertyConfig.js
 */
var props =

module.exports.properties = [
 "accept"
,"accessKey"
,"action"
,"alt"
,"async"
,"autoComplete"
,"autoPlay"
,"cellPadding"
,"cellSpacing"
,"checked"
,"className"
,"colSpan"
,"content"
,"contentEditable"
,"controls"
,"crossOrigin"
,"data"
//,"dataset" removed since attributes handles data-attributes
,"defer"
,"dir"
,"download"
,"draggable"
,"encType"
,"formNoValidate"
,"href"
,"hrefLang"
,"htmlFor"
,"httpEquiv"
,"icon"
,"id"
,"label"
,"lang"
,"list"
,"loop"
,"max"
,"mediaGroup"
,"method"
,"min"
,"multiple"
,"muted"
,"name"
,"noValidate"
,"pattern"
,"placeholder"
,"poster"
,"preload"
,"radioGroup"
,"readOnly"
,"rel"
,"required"
,"rowSpan"
,"sandbox"
,"scope"
,"scrollLeft"
,"scrolling"
,"scrollTop"
,"selected"
,"span"
,"spellCheck"
,"src"
,"srcDoc"
,"srcSet"
,"start"
,"step"
,"style"
,"tabIndex"
,"target"
,"title"
,"type"
,"value"

// Non-standard Properties
,"autoCapitalize"
,"autoCorrect"
,"property"

, "attributes"
]

var attrBlacklist =
module.exports.attrBlacklist = {
  'class': 'className'
}
},{"./vcomment":280,"virtual-dom/vnode/vnode":311,"virtual-dom/vnode/vtext":313}],280:[function(require,module,exports){
module.exports = VirtualComment

function VirtualComment(text) {
  this.text = String(text)
}

VirtualComment.prototype.type = 'Widget'

VirtualComment.prototype.init = function() {
  return document.createComment(this.text)
}

VirtualComment.prototype.update = function(previous, domNode) {
  if(this.text === previous.text) return
  domNode.nodeValue = this.text
}

},{}],281:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":294}],282:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":315}],283:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":302}],284:[function(require,module,exports){
var diff = require("./diff.js")
var patch = require("./patch.js")
var h = require("./h.js")
var create = require("./create-element.js")
var VNode = require('./vnode/vnode.js')
var VText = require('./vnode/vtext.js')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}

},{"./create-element.js":281,"./diff.js":282,"./h.js":283,"./patch.js":292,"./vnode/vnode.js":311,"./vnode/vtext.js":313}],285:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],286:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":288}],287:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],288:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":287}],289:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":316}],290:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],291:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],292:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":297}],293:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":306,"is-object":290}],294:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":304,"../vnode/is-vnode.js":307,"../vnode/is-vtext.js":308,"../vnode/is-widget.js":309,"./apply-properties":293,"global/document":289}],295:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],296:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":309,"../vnode/vpatch.js":312,"./apply-properties":293,"./update-widget":298}],297:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":294,"./dom-index":295,"./patch-op":296,"global/document":289,"x-is-array":291}],298:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":309}],299:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],300:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":286}],301:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],302:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":305,"../vnode/is-vhook":306,"../vnode/is-vnode":307,"../vnode/is-vtext":308,"../vnode/is-widget":309,"../vnode/vnode.js":311,"../vnode/vtext.js":313,"./hooks/ev-hook.js":300,"./hooks/soft-set-hook.js":301,"./parse-tag.js":303,"x-is-array":291}],303:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":285}],304:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":305,"./is-vnode":307,"./is-vtext":308,"./is-widget":309}],305:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],306:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],307:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":310}],308:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":310}],309:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],310:[function(require,module,exports){
module.exports = "2"

},{}],311:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":305,"./is-vhook":306,"./is-vnode":307,"./is-widget":309,"./version":310}],312:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":310}],313:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":310}],314:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":306,"is-object":290}],315:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":304,"../vnode/is-thunk":305,"../vnode/is-vnode":307,"../vnode/is-vtext":308,"../vnode/is-widget":309,"../vnode/vpatch":312,"./diff-props":314,"x-is-array":291}],316:[function(require,module,exports){

},{}]},{},[1]);
