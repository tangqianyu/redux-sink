# Redux-Sink
Redux-Sink is redux for less boilerplate, no action, no seprated logic, also natively support redux to be loaded by code split.    
    
[![travis](https://travis-ci.org/JiarongGu/redux-sink.svg?branch=master)](https://travis-ci.org/JiarongGu/redux-sink)
[![npm version](https://badge.fury.io/js/redux-sink.svg)](https://www.npmjs.com/package/redux-sink)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ee58187b2e794033aeb4296f128fd3ee)](https://app.codacy.com/app/JiarongGu/redux-sink?utm_source=github.com&utm_medium=referral&utm_content=JiarongGu/redux-sink&utm_campaign=Badge_Grade_Dashboard)

## Index
- [Getting started](#getting-started)
  * [Step 1: create store](#step-1-create-store)
  * [Step 2: create sink](#step-2-create-sink)
  * [Step 3: sinking](#step-3-sinking)
- [Advanced Usages](#advanced-usages)
  * [create trigger](#create-trigger)
  * [create reloader](#create-reloader)
  * [use deepsking](#use-deepsking)
  * [sink outside of component](#sink-outside-of-component)
  * [create store with configs](#create-store-with-configs)
- [Api References](#api-references)

## Getting started
```npm i redux-sink```   

### Step 1: create store
create store use `SinkFactory.createStore`.   

#### index.js
```javascript
import { SinkFactory } from 'redux-sink';
const store = SinkFactory.createStore();
```

### Step 2: create sink
logic block of state called `sink`, includes state, reducer, effect, configured by decorators.

```javascript
import { sink, state, reducer, effect, connect } from 'redux-sink'

@sink('counter')
class CounterSink {
  @state
  state = 0;

  @reducer
  increment(value: number) {
    return this.state + value;
  }

  @reducer
  decrement(value: number) {
    return this.state - value;
  }

  @effect
  async updateAll(increase: number, decrease: number) {
    this.increment(increase);
    this.decrement(decrease);
  }
}
```

### Step 3: sinking
use `sinking` instead of `connect`, to connect sinks to component

```javascript
@sinking(CounterSink)
class Counter extends React.Component {
  render() {
    const counter = this.props.counter;
    return (
      <div>
        <p>Current Count: <strong>{counter.state}</strong></p>
        <button onClick={() => counter.increment(1)}>Increment</button>
        <button onClick={() => counter.decrement(1)}>Decrement</button>
        <button onClick={() => counter.updateAll(1, 2)}>All</button>
      </div>
    )
  }
}
```
or   
```javascript
sinking(CounterSink, OtherSink1)(Component)
```

## Advanced Usages
### create trigger
`@trigger` is used to trigger when effect or reducer action fired, the action name will be `{sink}/{function}`. the parameters should be the same as the orginal action.
```javascript
class CounterSink {
    ...
    @trigger('counter/updateAll')
    updateAllTrigger(increase: number, decrease: number) {
      this.decrement(decrease);
      this.increment(increase);
    }
}
```

### create reloader
`@reloader` or `SinkFactory.addReloader` is used for fire a trigger event when trigger just been dynamically added. 
```javascript
class CounterSink {
  ...
  @effect
  @reloader
  async updateAll(increase: number, decrease: number) {
    this.increment(increase);
    this.decrement(decrease);
  }
}
```
or   
```javascript
SinkFactory.addReloader('counter/updateAll', [inital paramters]);
```

### use deepsking
`@deepsinking` allow you to use any function or property in sink when connect to component, which `@sinking` will only allowed to use effect and reducer
```javascript
@deepsking(CounterSink, OtherSink1, OtherSink2)
class Counter extends React.Component {
 ...
}
```

### sink outside of component
redux-sink allowed you to use sinks without connect to component
```javascript
const counterSink = new CounterSink();
const counterState = counterSink.increment(10);
```

### create store with configs
`SinkFactory.createStore` is able to take reducers, middlewares and devtoolOptions along with store creation
```javascript
import { SinkFactory } from 'redux-sink';

// its also possible to add reducers and middlewares through this api
const store = SinkFactory.createStore({ 
  reducers, // static reducers, built without creator
  preloadedState, // inital state
  middlewares, // addtional middlewares
  devtoolOptions: { devToolCompose: composeWithDevTools } // required compose function from redux-dev-tool
});
```

## Api References
- [@sink](#sink)
- [@state](#state)
- [@reducer](#reducer)
- [@effect](#effect)
- [@trigger](#trigger)
- [@SinkFactory](#sinkFactory)
- [@SinkBuilder](#sinkBuilder)

### @sink
mark the class as redux-sink class, the sink name use to locate the sink in store

### @state
configure state property, state will be sync when reducer updates the store state, inital state created based on this property or preloadedState from store.   
warning: only one state in each sink

### @reducer
use to update state, will trigger component update.   
warning: do not call reducer or effect function inside reducer, use effect to do it

### @effect
use to process side-effects and aysnc calls, will run inside effect middleware

### @trigger
use to bind extra event when action fires

### @reloader
use to fire trigger event when trigger dynamic loaded

### SinkFactory
main registry class for all sinks, manage the store and all loaded sinks

### SinkBuilder
build class embadded inside sink's protoype, which collect the sink configuration and build sink use `SinkFactory`
