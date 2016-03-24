import { run, O, A } from 'b-o-a';
import { init as dom } from 'b-o-a/handlers/dom';
import { init as history } from 'b-o-a/handlers/history';

// types/

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  editing: boolean;
};

type State = {
  filter: string;
  todo: string;
  todos: Todo[];
};

// utils/

class FocusHook {
  private focus: boolean;

  constructor(focus: boolean) {
    this.focus = focus;
  }

  hook(e: any) {
    if (focus) e.focus();
  }
}

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

const id = (): string => {
  return String(new Date().getTime());
};

// actions/

const makeAction = <T>(type: string) => {
  const create = (data: T) => ({ type, data });
  const filter = (action$: O<A<any>>): O<T> => {
    return action$
      .filter(action => action.type === type)
      .map(({ data }) => data);
  };
  return { create, filter };
};

const {
  create: addTodo,
  filter: addTodo$
} = makeAction<Todo>('add-todo');

const {
  create: render
} = makeAction<State>('render');

// actions/props/filter/

const {
  create: propsFilterChange,
  filter: propsFilterChange$
} = makeAction<string>('props/filter/change');

// actions/props/todo/

const {
  create: propsTodoChange,
  filter: propsTodoChange$
} = makeAction<string>('props/todo/change');

// actions/props/todos/

const {
  create: propsTodosAdd,
  filter: propsTodosAdd$
} = makeAction<Todo>('props/todos/add');
const {
  create: propsTodosChange,
  filter: propsTodosChange$
} = makeAction<{ id: string; title: string; }>('props/todos/change');
const {
  create: propsTodosClearCompleted,
  filter: propsTodosClearCompleted$
} = makeAction<void>('props/todos/clear-completed');
const {
  create: propsTodosDestroy,
  filter: propsTodosDestroy$
} = makeAction<string>('props/todos/destroy');
const {
  create: propsTodosEdit,
  filter: propsTodosEdit$
} = makeAction<string>('props/todos/edit');
const {
  create: propsTodosSave,
  filter: propsTodosSave$
} = makeAction<string>('props/todos/save');
const {
  create: propsTodosToggle,
  filter: propsTodosToggle$
} = makeAction<string>('props/todos/toggle');
const {
  create: propsTodosToggleAll,
  filter: propsTodosToggleAll$
} = makeAction<boolean>('props/todos/toggle-all');

// actions/route/

const {
  filter: route$
} = makeAction<State>('route');
const routeActive$ = (action$: O<A<any>>): O<{}> =>
  route$(action$)
    .filter((data: any) => data.route.name === 'active')
    .map(() => void 0);
const routeCompleted$ = (action$: O<A<any>>): O<{}> =>
  route$(action$)
    .filter((data: any) => data.route.name === 'completed')
    .map(() => void 0);
const routeAll$ = (action$: O<A<any>>): O<{}> =>
  route$(action$)
    .filter((data: any) => data.route.name === 'all')
    .map(() => void 0);

// actions/views/

const {
  create: goTo
} = makeAction<string>('views/go-to');
const {
  create: viewsClearCompletedClick,
  filter: viewsClearCompletedClick$
} = makeAction<void>('views/clear-completed/click');
const {
  create: viewsNewTodoChange,
  filter: viewsNewTodoChange$
} = makeAction<Event>('views/new-todo/change');
const {
  create: viewsNewTodoKeyup,
  filter: viewsNewTodoKeyup$
} = makeAction<KeyboardEvent>('views/new-todo/keyup');
const {
  create: viewsTodoBlur,
  filter: viewsTodoBlur$
} = makeAction<string>('views/todo/blur');
const {
  create: viewsTodoChange,
  filter: viewsTodoChange$
} = makeAction<{ event: Event; id: string; }>('views/todo/change');
const {
  create: viewsTodoKeyup,
  filter: viewsTodoKeyup$
} = makeAction<{ event: KeyboardEvent; id: string; }>('views/todo/keyup');
const {
  create: viewsTodoDestroy,
  filter: viewsTodoDestroy$
} = makeAction<string>('views/todo/destroy');
const {
  create: viewsTodoEdit,
  filter: viewsTodoEdit$
} = makeAction<string>('views/todo/edit');
const {
  create: viewsTodoToggle,
  filter: viewsTodoToggle$
} = makeAction<string>('views/todo/toggle');
const {
  create: viewsToggleAllChange,
  filter: viewsToggleAllChange$
} = makeAction<Event>('views/toggle-all/change');

// views/

// views/header

const headerView = (state: State, helpers: any): any => {
  const { create: h, e } = helpers;
  return h('header.header', [
    h('h1', ['todos']),
    h('input.new-todo', {
      placeholder: 'What needs to be done?',
      autofocus: true,
      onchange: data => e(viewsNewTodoChange(data)),
      onkeyup: data => e(viewsNewTodoKeyup(data)),
      value: state.todo
    })
  ]);
};

// views/main

const mainView = (state: State, helpers: any): any => {
  if (state.todos.length === 0) return null;
  const { create: h, e } = helpers;
  const filtered = state.todos.filter(todo => {
    if (state.filter === 'all') return true;
    return todo.completed === (state.filter === 'completed');
  });
  return h('section.main', [
    h('input.toggle-all', {
      type: 'checkbox',
      onchange: data => e(viewsToggleAllChange(data)),
      checked: state.todos.every(({ completed }) => completed)
    }),
    h('label', {
      attributes: { for: 'toggle-all' }
    }, ['Mark all as complete']),
    h('ul.todo-list', filtered.map(todo => {
      const classes = ''
        + (todo.completed ? '.completed' : '')
        + (todo.editing ? '.editing' : '');
      return h('li' + classes, [
        h('div.view', [
          h('input.toggle', {
            type: 'checkbox',
            checked: todo.completed,
            onchange: () => e(viewsTodoToggle(todo.id))
          }),
          h('label', {
            ondblclick: () => e(viewsTodoEdit(todo.id))
          }, [todo.title]),
          h('button.destroy', {
            onclick: () => e(viewsTodoDestroy(todo.id))
          })
        ]),
        h('input.edit', {
          'ev-focus': new FocusHook(todo.editing),
          onblur: () => e(viewsTodoBlur(todo.id)),
          onchange: event => e(viewsTodoChange({ event, id: todo.id })),
          onkeyup: event => e(viewsTodoKeyup({ event, id: todo.id })),
          value: todo.title
        })
      ]);
    }))
  ]);
};

// views/footer

const footerView = (state: State, helpers: any): any => {
  if (state.todos.length === 0) return null;
  const { create: h, e } = helpers;
  const items = state.todos.filter(i => !i.completed).length;
  const hasCompleted = state.todos.filter(i => i.completed).length > 0;
  return h('footer.footer', [
    h('span.todo-count', [
      h('strong', [String(items)]),
      ' item' + (items === 1 ? '' : 's') + ' left'
    ]),
    h('ul.filters', [
      h('li', [
        h('a' + (state.filter === 'all' ? '.selected' : ''), {
          href: '#/',
          onclick: event => {
            event.preventDefault();
            e(goTo('/'));
          }
        }, ['All'])
      ]),
      h('li', [
        h('a' + (state.filter === 'active' ? '.selected' : ''), {
          href: '#/active',
          onclick: event => {
            event.preventDefault();
            e(goTo('/active'));
          }
        }, ['Active'])
      ]),
      h('li', [
        h('a' + (state.filter === 'completed' ? '.selected' : ''), {
          href: '#/completed',
          onclick: event => {
            event.preventDefault();
            e(goTo('/completed'));
          }
        }, ['Completed'])
      ])
    ]),
    (
      hasCompleted
        ? h('button.clear-completed', {
          onclick: () => e(viewsClearCompletedClick(null))
        }, ['Clear completed'])
        : null
    )
  ]);
};

// views/index

const view = (state: State, helpers: any): any => {
  const { create: h } = helpers;
  return h('section.todoapp', [
    headerView(state, helpers),
    mainView(state, helpers),
    footerView(state, helpers)
  ]);
};

// props/

// props/filter

const filter$ = (action$: O<A<any>>, state: string): O<string> => {
  const filterUpdater$ = propsFilterChange$(action$).map(value => () => value);
  const filter$: O<string> = O
    .of(state)
    .merge(filterUpdater$)
    .scan((state, updater) => updater(state));
  return filter$;
};

// props/todo

const todo$ = (action$: O<A<any>>, state: string): O<string> => {
  const todoUpdater$ = propsTodoChange$(action$).map(value => () => value);
  const todo$: O<string> = O
    .of(state)
    .merge(todoUpdater$)
    .scan((state, updater) => updater(state));
  return todo$;
};

// props/todos

const todos$ = (action$: O<A<any>>, state: Todo[]): O<Todo[]> => {
  const todosUpdater$ = O.merge(
    propsTodosAdd$(action$)
      .map(value => state => state.concat([value])),
    propsTodosChange$(action$)
      .map(({ id, title }) => state => {
        const index = state.findIndex(i => i.id === id);
        if (index < 0) return state;
        const newTodo = Object.assign({}, state[index], { title });
        return state
          .slice(0, index)
          .concat([newTodo])
          .concat(state.slice(index + 1));
      }),
    propsTodosClearCompleted$(action$)
      .map(() => state => state.filter(i => !i.completed)),
    propsTodosDestroy$(action$)
      .map(id => state => {
        const index = state.findIndex(i => i.id === id);
        if (index < 0) return state;
        return state.slice(0, index).concat(state.slice(index + 1));
      }),
    propsTodosEdit$(action$)
      .map(id => state => {
        const index = state.findIndex(i => i.id === id);
        if (index < 0) return state;
        const newTodo = Object.assign({}, state[index], { editing: true });
        return state
          .slice(0, index)
          .concat([newTodo])
          .concat(state.slice(index + 1));
      }),
    propsTodosSave$(action$)
      .map(id => state => {
        const index = state.findIndex(i => i.id === id);
        if (index < 0) return state;
        const newTodo = Object.assign({}, state[index], { editing: false });
        return newTodo.title.trim().length > 0
          ? state
            .slice(0, index)
            .concat([newTodo])
            .concat(state.slice(index + 1))
          : state.slice(0, index).concat(state.slice(index + 1));
      }),
    propsTodosToggle$(action$)
      .map(id => state => {
        const index = state.findIndex(i => i.id === id);
        if (index < 0) return state;
        const completed = !state[index].completed;
        const newTodo = Object.assign({}, state[index], { completed });
        return state
          .slice(0, index)
          .concat([newTodo])
          .concat(state.slice(index + 1));
      }),
    propsTodosToggleAll$(action$)
      .map(value => state => {
        return state.map(todo => {
          return Object.assign({}, todo, { completed: value });
        });
      })
  );
  const todos$: O<Todo[]> = O
    .of(state)
    .merge(todosUpdater$)
    .scan((state, updater) => updater(state));
  return todos$;
};

// props/index

const props = (action$: O<A<any>>, options: any): O<State> => {
  const { state }: { state: State; } = options;
  return O.combineLatest(
    filter$(action$, state.filter),
    todo$(action$, state.todo),
    todos$(action$, state.todos),
    (filter, todo, todos) => ({ filter, todo, todos })
  )
    .do(console.log.bind(console)) // TODO: state logger for debug
    .publishReplay(1)
    .refCount();
};

// maps/

const maps = (action$: O<A<any>>, options: any): O<A<any>> => {
  const { state$ }: { state$: O<State> } = options;
  return O.merge(
    addTodo$(action$)
      .map(propsTodosAdd),
    addTodo$(action$)
      .map(() => propsTodoChange('')),
    routeActive$(action$)
      .map(() => propsFilterChange('active')),
    routeCompleted$(action$)
      .map(() => propsFilterChange('completed')),
    routeAll$(action$)
      .map(() => propsFilterChange('all')),
    viewsClearCompletedClick$(action$)
      .map(data => propsTodosClearCompleted(null)),
    viewsNewTodoChange$(action$)
      .map(({ target }) => (<any>target).value)
      .map(propsTodoChange),
    viewsNewTodoKeyup$(action$)
      .filter(({ keyCode }) => keyCode === ENTER_KEY)
      .withLatestFrom(state$, (_, { todo: title }) => title)
      .filter(title => title.trim().length > 0)
      .map(title => ({ id: id(), completed: false, editing: false, title }))
      .map(addTodo),
    viewsTodoBlur$(action$)
      .map(propsTodosSave),
    viewsTodoChange$(action$)
      .map(({ event: { target }, id }) => ({ id, title: (<any>target).value }))
      .map(data => propsTodosChange(data)),
    viewsTodoDestroy$(action$)
      .map(propsTodosDestroy),
    viewsTodoEdit$(action$)
      .map(propsTodosEdit),
    viewsTodoKeyup$(action$)
      .filter(({ event: { keyCode } }) => {
        return keyCode === ENTER_KEY || keyCode == ESCAPE_KEY;
      })
      .map(({ id }) => id)
      .map(propsTodosSave),
    viewsTodoToggle$(action$)
      .map(propsTodosToggle),
    viewsToggleAllChange$(action$)
      .map(({ target }) => (<any>target).checked)
      .map(propsTodosToggleAll),
    state$
      .map(render)
  );
};

// app

const handler = (action$: O<A<any>>, options: any): O<A<any>> => {
  const id1 = id();
  const state: State = {
    filter: 'all',
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
    ].map(i => Object.assign(i, { editing: false }))
  };
  const state$ = props(action$, { state });
  const map$ = maps(action$, { state$ });
  return map$;
};

// client

const main = () => {
  run((action$, options) => {
    const log$ = action$
      .do(console.log.bind(console)) // action logger for debug
      .share();
    const history$ = history({
      goToActionType: 'views/go-to',
      historyType: 'hash',
      routes: [
        { path: '/active', name: 'active' },
        { path: '/completed', name: 'completed' },
        { path: '/', name: 'all' }
      ],
      routeActionType: 'route'
    }).handler(log$, options);
    const dom$ = dom({
      render: view,
      root: '.todoapp'
    }).handler(history$, options);
    return handler(dom$, options);
  });
};

main();
