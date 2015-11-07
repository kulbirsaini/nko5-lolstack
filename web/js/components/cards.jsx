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

  getTweetWidget(tweetId, elementId) {
    twttr.widgets.createTweet(tweetId, document.getElementById(elementId), { align: 'left' });
  }

  renderCards(cards) {
    cards.forEach((card) => {
      if (this.state[card.elementId] && this.state[card.elementId].rendered === true) {
        return;
      }
      switch(card.type) {
        case 'twitter':
          this.getTweetWidget(card.tweetId, card.elementId);
          this.setState({ [card.elementId]: { rendered: true } });
          return;
        default:
          console.log('Unknown card type', card.type);
      };
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
