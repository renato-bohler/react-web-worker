import React from 'react';
import './App.css';

import WebWorker from './WebWorker';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.worker = new WebWorker();
  }

  componentDidMount() {
    this.worker.addCallback(event => {
      console.log('[REACT] Callback received:', event.data);
      this.setState({ count: event.data });
    });

    this.worker.stop();
  }

  render() {
    const { count } = this.state;

    console.timeEnd('Render');
    console.time('Render');
    console.log('[REACT] Rendering...', {
      props: this.props,
      state: this.state,
    });

    return (
      <div className="App">
        <main>
          <header>
            <p>This countup is being executed by a Web Worker.</p>
            <p>
              It counts to infinity and synchronizes it before every
              browser render.
            </p>
          </header>
          <p>{count}</p>
          <button
            type="button"
            onClick={() => this.worker.start()}
            disabled={this.worker.isRunning()}
          >
            Start
          </button>
          <button
            type="button"
            onClick={() => this.worker.pause()}
            disabled={!this.worker.isRunning()}
          >
            Pause
          </button>
          <button
            type="button"
            onClick={() => this.worker.stop()}
            disabled={this.worker.isStopped()}
          >
            Stop
          </button>
        </main>
      </div>
    );
  }
}
