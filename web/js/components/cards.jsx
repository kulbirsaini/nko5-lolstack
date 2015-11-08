'use strict';

import React from 'react';

import { renderCard } from '../utils';

import './cards.scss';

export default class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.renderCards = this.renderCards.bind(this);
  }

  initialState() {
    return { renderedCards: [] };
  }

  componentDidMount() {
    this.renderCards(this.props.cards);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cards !== this.props.cards;
  }

  componentDidUpdate() {
    this.renderCards(this.props.cards);
  }

  renderCards(cards) {
    if (!cards || cards.length === 0) {
      return;
    }
    cards.forEach((card) => {
      if (this.state.renderedCards.indexOf(card.elementId) > -1) {
        return;
      }
      renderCard(card, this.props.boardId);
      this.setState({ renderedCards: this.state.renderedCards.concat(card.elementId) });
    });
    if (cards.filter((card) => card.type === 'instagram').length !== 0) {
      instgrm.Embeds.process();
    }
  }

  render() {
    let boardId = '';
    if (this.props.boardId) {
      boardId = '-' + this.props.boardId;
    }
    const divs = this.props.cards.map((card) => {
      return (
        <div className={`card-content card-content-${card.type}`} key={'card-content-' + card.elementId}>
          <div key={card.elementId} id={`${card.elementId}${boardId}`} />
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
