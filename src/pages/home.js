import React, { Component } from 'react';
import Button from "@/components/Button"

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  tabTo(index){
    this.setState(function (prevState, props) {
      return {
       };
    })
  }
  render() {
    return (
        <header className="App-header">
          <p>
            xxxxxxxxxxx
          </p>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn Reactdddddddd
          </a>
          <Button type="button" color="primary" round={true}>开 始</Button>
        </header>
    );
  }
}

export default Home;
