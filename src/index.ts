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
  create: propsTodosDestroy,
  filter: propsTodosDestroy$
} = makeAction<string>('props/todos/destroy');
const {
  create: propsTodosEdit,
  filter: propsTodosEdit$
} = makeAction<string>('props/todos/edit');

// actions/views/

const {
  create: viewsNewTodoChange,
  filter: viewsNewTodoChange$
} = makeAction<Event>('views/new-todo/change');
const {
  create: viewsNewTodoKeyup,
  filter: viewsNewTodoKeyup$
} = makeAction<KeyboardEvent>('views/new-todo/keyup');
const {
  create: viewsTodoDestroy,
  filter: viewsTodoDestroy$
} = makeAction<string>('views/todo/destroy');
const {
  create: viewsTodoEdit,
  filter: viewsTodoEdit$
} = makeAction<string>('views/todo/edit');

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
            checked: todo.completed
          }),
          h('label', {
            ondblclick: () => e(viewsTodoEdit(todo.id))
          }, [todo.title]),
          h('button.destroy', {
            onclick: () => e(viewsTodoDestroy(todo.id))
          })
        ]),
        h('input.edit', {
          value: todo.title
        })
      ]);
    }))
  ]);
};

const footerView = (state: State, helpers: any): any => {
  return null;
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
    viewsNewTodoChange$(action$)
      .map(({ target }) => (<any>target).value)
      .map(propsTodoChange),
    viewsNewTodoKeyup$(action$)
      .filter(({ keyCode }) => keyCode === ENTER_KEY)
      .withLatestFrom(state$, (_, { todo: title }) => title)
      .filter(title => title.trim().length > 0)
      .map(title => ({ id: id(), completed: false, editing: false, title }))
      .map(addTodo),
    viewsTodoDestroy$(action$)
      .map(propsTodosDestroy),
    viewsTodoEdit$(action$)
      .map(propsTodosEdit),
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
