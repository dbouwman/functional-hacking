import { getDependencies } from './polymorphics';
const ro = {token: '3dhysTOKEN2929'};
getDependencies({id: '3ef', type: 'Foo Type'}, ro).then(logResult);
getDependencies({id: 'fef', type: 'Baz Type'}, ro).then(logResult);
getDependencies({id: 'eef', type: 'Bar Type'}, ro).then(logResult);
getDependencies({id: 'eef', type: 'Web Map'}, ro).then(logResult);

function logResult(result: string[]) {
  // we call unary on console.log so we limit the args passed into
  // console.log to one, otherwise, the three args from forEach(entry, idx, arry)
  // get passed into the three args for .info, and we get unexpected
  // output
  result.forEach(unary(console.info));
}

/**
 * Helper that restricts a function to a single argument
 * @param fn Function that takes more than one argument
 */
function unary(
  fn: any,
): any {
    return function onlyOneArg(arg: any) {
      return fn(arg);
    };
  }
