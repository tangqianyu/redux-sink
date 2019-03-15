# Redux-Sink
redux sink for less boilerplate, also allow redux to be loaded by code split.    

## Install
```npm i redux-sink```  

## Getting started
create a redux sink store
```javascript
import { configureSinkStore } from 'redux-sink';

// its also possible to add reducers and middlewares through this api
const store = configureCreatorStore({ 
  reducers, // static reducers, built without creator
  preloadedState, // inital state
  middlewares, // addtional middlewares
  devTool: true // enable redux-dev-tool
});
```
    
## Configure Reducers
using decorators to create redux service class, can access redux state using class from everywhere you want.
- decorators: `@sink`, `@state`, `@reducer`, `@effect`, `@trigger`, `@sinking`, `@deepsinking`.  

hint: all instance created by service class will shared in the same scope of its prototype.

## @sink
```javascript
@sink('CounterService')
class CounterService { ... }
```
set the class as redux service, the name of service use to locate the service in props

## @state
```javascript
@state
state = { 
  increment: 0, 
  decrement: 0, 
  total: 0 
};
```
configure inital state, can access state in service class by `this.state`,
inital state created based on this property or inheritant from current store

## @reducer
`@reducer` use to update state, will trigger component update
```javascript
@reducer
increment(value: number) {
  return { ...this.state, increment: this.state.increment + number };
}
```
warning: do not call reducer function in side reducer, use effect to do it

## @effect
`@effect` use to process side-effects and aysnc calls, will run inside effect middleware
```javascript
@effect
updateAll(value: number) {
  this.decrement(value);
  this.increment(value);
}
```

## @trigger
`@trigger` is used to trigger multiple reducer functions, will run inside effect middleware
```javascript
@trigger
updateAll(value: number) {
  this.decrement(value);
  this.increment(value);
}
```


## @sinking / @deepsinking
use `@sinking` to connect sinks to component, `@deepsinking` allow you to use any function in sink when connect to component, `@sinking` will only allowed to use effect and reducer in component
```javascript
@sinking(CounterService, OtherService1, OtherService2)
class Counter extends React.Component {
 ...
}

sinking(CounterService, OtherService1, OtherService2)(Component)
```

## Properties
properties can be used and shared between sink, but will not trigger component refreash
```javascript
class CounterService { 
  property1 = 0;
  property2 = 'property2 string';
}
```


## Example
### Create ReduxService class
```javascript
import { sink, state, reducer, effect, connect } from 'redux-sink'

@sink('CounterService')
class CounterService {
  @state
  state = { 
    increment: 0, 
    decrement: 0, 
    total: 0 
  };

  @reducer
  increment(value: number) {
    const increment = this.state.increment + value;
    const total = this.state.total + value;
    return { ...this.state, increment, total };
  }

  @reducer
  decrement(value: number) {
    const decrement = this.state.decrement - value;
    const total = this.state.total - value;
    return { ...this.state, decrement, total };
  }

  @effect
  updateAll(value: number) {
    this.decrement(value);
    this.increment(value);
  }
}
```

### Connect to component
```javascript
@sinking(CounterService)
class Counter extends React.Component {
  render() {
    const counterService = this.props.CounterService;
    return (
      <div>
        <h1>Counter</h1>
        <p>Current Increment: <strong>{counterService.state.increment}</strong></p>
        <p>Current Decrement: <strong>{counterService.state.decrement}</strong></p>
        <p>Current Total: <strong>{counterService.state.total}</strong></p>
        <button onClick={() => counterService.increment(2)}>Increment</button>
        <button onClick={() => counterService.decrement(2)}>Decrement</button>
      </div>
    )
  }
}
```

### Use outside of component
```javascript
const counterService = new CounterService();
const counterState = counterService.increment(10);
```
