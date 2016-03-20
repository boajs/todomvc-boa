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

// actions/props/todo/

const {
  create: propsTodoChange,
  filter: propsTodoChange$
} = makeAction<string>('props/todo/change');

// actions/views/

const {
  create: viewsNewTodoChange,
  filter: viewsNewTodoChange$
} = makeAction<Event>('views/new-todo/change');
const {
  create: viewsNewTodoKeyup,
  filter: viewsNewTodoKeyup$
} = makeAction<KeyboardEvent>('views/new-todo/keyup');

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
  return null;
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

// props/index

const props = (action$: O<A<any>>, options: any): O<State> => {
  const { state }: { state: State; } = options;
  return O.combineLatest(
    todo$(action$, state.todo),
    (todo) => Object.assign({}, state, { todo })
  )
    .do(console.log.bind(console)) // TODO: state logger for debug
    .publishReplay(1)
    .refCount();
};

// maps/

const maps = (action$: O<A<any>>, options: any): O<A<any>> => {
  const { state$ }: { state$: O<State> } = options;
  return O.merge(
    viewsNewTodoChange$(action$)
      .map(({ target }) => (<any>target).value)
      .map(propsTodoChange),
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
