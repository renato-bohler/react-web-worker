import React from 'react';
import './App.css';

import worker from './app.worker.js';
import WebWorker from './WebWorker';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    this.worker = new WebWorker(worker);

    this.worker.addEventListener('message', event => {
      console.log('[REACT] Message received:', event.data);
      this.setState({ count: event.data });
    });

    setTimeout(
      () =>
        this.worker.postMessage('react => worker message content'),
      1000,
    );
  }

  render() {
    console.timeEnd('Render');
    console.time('Render');
    console.log('[REACT] Rendering...', {
      props: this.props,
      state: this.state,
    });

    return (
      <div className="App">
        <header className="App-header">
          <p>{this.state.count}</p>
        </header>
      </div>
    );
  }
}
