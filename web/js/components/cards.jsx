'use strict';

import React from 'react';

import { renderCard } from '../utils';

const cardsStyle = {
  width: '100%',
  float: 'left',
};

const cardStyle = {
  float: 'left',
  width: '24%',
  minHeight: '400px',
  margin: '5px'
};

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
    console.log(cards.length);
    cards.forEach((card) => {
      console.log(card.type, card.elementId);
      if (this.state[card.elementId] && this.state[card.elementId].rendered === true) {
        return;
      }
      try {
        renderCard(card);
      } catch(error) {
        console.log(error);
      }
      this.setState({ [card.elementId]: { rendered: true } });
      return;
    });
    if (cards.filter((card) => card.type === 'instagram').length !== 0) {
      instgrm.Embeds.process();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.cards !== nextProps.cards;
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    this.renderCards(this.props.cards);
  }

  render() {
    const divs = this.props.cards.map((card) => {
      return (
        <div className='card-content' key={'card-content-' + card.elementId} style={cardStyle}>
          <div key={card.elementId} id={card.elementId} />
        </div>
      );
    });
    return (
      <div id='cards' style={cardsStyle}>
        {divs}
      </div>
    );
  }
};
