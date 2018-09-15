import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './GameArea.css';
import FallingElement from './GameObjects/FallingElement/FallingElement';
import challengeList from '../../../gamedata/challenges/Challenges';

class GameArea extends Component {
  buffer = '';
  nextId = 0;
  chances = 0;
  score = 0;
  maxChances = 3;
  loop = null;
  redirect = false;

  gameObjects = {
    elements: []
  };

  getNextChallenge() {
    return challengeList[
      parseInt(Math.random() * 1000000) % challengeList.length
    ];
  }

  processAns(ans) {
    for (let i in this.gameObjects.elements) {
      if (ans == this.gameObjects.elements[i].answer) {
        this.updateScore(this.gameObjects.elements[i].score);
        delete this.gameObjects.elements[i];
        this.setState(this.gameObjects);
        break;
      }
    }
  }

  handleKeyPress(e) {
    console.log(e);
    let ans = '';
    if (e.key == 'Enter') {
      ans = this.buffer;
      this.processAns(ans);
      this.buffer = '';
    } else {
      this.buffer += e.key;
    }
  }

  updateScore(score) {
    this.score += score;
    this.props.updateScore(this.score);
  }

  removeElement(item) {
    this.chances++;
    this.props.updateChances(this.chances);
    if (this.chances < this.maxChances) {
      for (let i in this.gameObjects.elements) {
        if (item == this.gameObjects.elements[i].id) {
          delete this.gameObjects.elements[i];
          this.setState(this.gameObjects);
          break;
        }
      }
    } else {
      this.redirect = true;
      this.setState(this.gameObjects);
    }
  }

  getNewFallingElement() {
    let id = this.nextId++;
    let chal = this.getNextChallenge();
    let elem = {
      id: id,
      answer: chal.ans,
      score: chal.score,
      dom: (
        <FallingElement
          key={id}
          id={id}
          challenge={chal.q}
          removeElement={this.removeElement.bind(this)}
        />
      )
    };
    return elem;
  }

  componentWillMount() {
    this.setState(this.gameObjects);
  }

  componentDidMount() {
    this.startGameLoop();
    window.onkeypress = this.handleKeyPress.bind(this);
  }

  startGameLoop() {
    let self = this;
    this.loop = setInterval(() => {
      this.gameObjects.elements.push(this.getNewFallingElement());
      this.setState(this.gameObjects);
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.loop);
  }

  render() {
    console.log(this.state);
    if (this.redirect) {
      return <Redirect to="/end" />;
    }
    return (
      <div className="GameArea">
        {this.state.elements.map(elem => {
          return elem.dom;
        })}
      </div>
    );
  }
}

export default GameArea;
