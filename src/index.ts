import { run, O, A } from 'b-o-a';
import { init as dom } from 'b-o-a/handlers/dom';

// types/

type State = {};

// views/

const view = (state: State, helpers: any): any => {
  const { create: h } = helpers;
  return h('div');
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
