'use strict';

import React from 'react';

export default class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.renderCards = this.renderCards.bind(this);
  }

  initialState() {
    return {};
  }

  renderCards(cards) {
    cards.forEach((card) => {
      if (this.state[card.elementId] && this.state[card.elementId].rendered === true) {
        return;
      }
      card.render();
      this.setState({ [card.elementId]: { rendered: true } });
      return;
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.cards != nextProps.cards;
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    this.renderCards(this.props.cards);
  }

  render() {
    const divs = this.props.cards.map((card) => <div key={card.elementId} id={card.elementId} />);
    return (
      <div id='cards'>
        {divs}
      </div>
    );
  }
};
