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

// views/

const headerView = (state: State, helpers: any): any => {
  const { create: h, e } = helpers;
  return h('header.header', [
    h('h1', ['todos']),
    h('input.new-todo', {
      placeholder: 'What needs to be done?',
      autofocus: true
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

const props = (action$: O<A<any>>, options: any): O<A<any>> => {
  const { state }: { state: State; } = options;
  return O.empty();
};

// maps/

const maps = (action$: O<A<any>>, options: any): O<A<any>> => {
  const { state$ }: { state$: O<State> } = options;
  return O.empty();
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
