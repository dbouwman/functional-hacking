interface IRequestOptions {
  token: string;
}

interface IItem {
  id: string;
  type: string;
}

type IDependencyFunction = (param: any, ro: IRequestOptions) => Promise<string[]>;

interface IFunctionLookup {
  [name: string]: IDependencyFunction;
}

// Get the depenedencies, in a functional style...
export function getDependencies(
  item: IItem,
  requestOptions?: IRequestOptions,
): Promise<string[]> {
  // get and execute a partially applied, type-specific function
  return typeSpecificFn(item.type, requestOptions)(item);
}

// Given a type, return a partially applied function, that has the requestOptions
// While not needed in this scenario, it's an example how to use partial application
// and then have more chainable function to work with...
export function typeSpecificFn(
  type: string,
  requestOptions?: IRequestOptions,
  ): any {
    // return the type specific function, with the requestOptions partially-applied
    return applyRequestOptions(getByType(type), requestOptions);
}

// Partial application of request options
// Note! Completely non-generic, assumes two args, ro being the second.
function applyRequestOptions(
  fn: (param: any, ro: IRequestOptions) => Promise<string[]>,
  ro?: IRequestOptions) {
  return (param: any) => fn(param, ro);
}

/**
 * I'd really like to not use this structure... Tried using
 * a has of functions and getting the fn via a key, but typescript
 * was NOT ok with that at all...
 * @param type String that is the type of the item
 */
export function getByType(type: string): IDependencyFunction {
  let fn = unknownTypeHandler;
  switch (type) {
    case 'Bar Type':
      fn = getBarDependencies;
      break;
    case 'Baz Type':
      fn = getBazDependencies;
      break;
    case 'Foo Type':
      fn =  getFooDependencies;
      break;
  }
  return fn;
}

// /**
//  * Return a function that can extract dependencies from an Item
//  * or a function that just resolves
//  * @param type item type
//  */
// export function getDepsFunction(
//   type: string,
//   ): () => Promise<any> {
//   // tslint:disable-next-line
//   const fn = typeLookup[type]; // could not get TS to like this although js would be fine
//   return fn
//     ? fn
//     : () => Promise.resolve([]);
// }

// /**
//  * Return a hash of functions accessible by the type name
//  */
// export function typeLookup(): IFunctionLookup {
//   return {
//     'Bar Type': getBarDependencies as IDependencyFunction,
//     'Baz Type': getBazDependencies as IDependencyFunction,
//     'Foo Type': getFooDependencies as IDependencyFunction,
//   };
// }
/**
 * These are worker functions - they would do some "type specific"
 * async work... but for our example, we just return some junk data
 */

export function getFooDependencies(
  item: IItem,
  ro: IRequestOptions,
): Promise<string[]> {
  // generate some junk, but show what fn this is, as well as that we have ro
  return Promise.resolve(cookResponse('Foo', ro.token));
}

export function getBarDependencies(
  item: IItem,
  ro: IRequestOptions,
): Promise<string[]> {
  return Promise.resolve(cookResponse('Bar', ro.token));
}

export function getBazDependencies(
  item: IItem,
  ro: IRequestOptions,
): Promise<string[]> {
  return Promise.resolve(cookResponse('Baz', ro.token));
}

export function unknownTypeHandler(
  item: IItem,
  ro: IRequestOptions,
): Promise<string[]> {
  console.warn(`No depenency function exists for item type ${item.type}`);
  return Promise.resolve([]);
}
// Junk function to return some data so we can see that the type and token
// are used, and we do it 3 times do we have an array
function cookResponse(name: string, token: string) {
  return [1, 2, 3].map((i) => {
    return `${name}:${i}:${token}`;
  });
}
