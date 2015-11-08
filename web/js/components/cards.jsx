'use strict';

import React from 'react';

import { renderCard } from '../utils';


export default class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.renderCards = this.renderCards.bind(this);
  }

  initialState() {
    return { renderedCards: [] };
  }

  renderCards(cards) {
    cards.forEach((card) => {
      if (this.state.renderedCards.indexOf(card.elementId) > -1) {
        return;
      }
      renderCard(card);
      this.setState({ renderedCards: this.state.renderedCards.concat(card.elementId) });
    });
    if (cards.filter((card) => card.type === 'instagram').length !== 0) {
      instgrm.Embeds.process();
    }
  }

  componentDidUpdate() {
    this.renderCards(this.props.cards);
  }

  render() {
    const divs = this.props.cards.map((card) => {
      return (
        <div className='card-content' key={'card-content-' + card.elementId} >
          <div key={card.elementId} id={card.elementId} />
        </div>
      );
    });
    return (
      <div id='cards'>
        {divs}
      </div>
    );
  }
};
