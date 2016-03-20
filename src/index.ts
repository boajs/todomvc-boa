import { run, O, A } from 'b-o-a';
import { init as dom } from 'b-o-a/handlers/dom';

// types/

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  editing: boolean;
};

type State = {
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
  create: render
} = makeAction<State>('render');

const {
  create: addTodo,
  filter: addTodo$
} = makeAction<Todo>('add-todo');

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

// actions/views/

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

// views/

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

const mainView = (state: State, helpers: any): any => {
  if (state.todos.length === 0) return null;
  const { create: h, e } = helpers;
  return h('section.main', [
    h('input.toggle-all', {
      type: 'checkbox'
    }),
    h('label', {
      attributes: { for: 'toggle-all' }
    }, ['Mark all as complete']),
    h('ul.todo-list', state.todos.map(todo => {
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
        h('a.selected', { href: '#/' }, ['All'])
      ]),
      h('li', [
        h('a', { href: '#/active' }, ['Active'])
      ]),
      h('li', [
        h('a', { href: '#/completed' }, ['Completed'])
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

const view = (state: State, helpers: any): any => {
  const { create: h } = helpers;
  return h('section.todoapp', [
    headerView(state, helpers),
    mainView(state, helpers),
    footerView(state, helpers)
  ]);
};

// props/

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
    todo$(action$, state.todo),
    todos$(action$, state.todos),
    (todo, todos) => ({ todo, todos })
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
    state$
      .map(render)
  );
};

// app

const handler = (action$: O<A<any>>, options: any): O<A<any>> => {
  const id1 = id();
  const state: State = {
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
    const dom$ = dom({
      render: view,
      root: '.todoapp'
    }).handler(log$, options);
    return handler(dom$, options);
  });
};

main();
