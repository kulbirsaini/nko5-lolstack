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
    return {};
  }

  renderCards(cards) {
    cards.forEach((card) => {
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
