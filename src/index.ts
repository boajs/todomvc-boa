import { run, O, A } from 'b-o-a';
import { init as dom } from 'b-o-a/handlers/dom';

// types/

type State = {};

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

// app

const handler = (action$: O<A<any>>, options: any): O<A<any>> => {
  return O.empty();
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
