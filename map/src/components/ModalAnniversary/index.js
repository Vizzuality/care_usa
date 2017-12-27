'use strict';

import './styles.postcss';
import React from 'react';
import Modal from '../Modal';
import CaresPackage from './CaresPackage';
import PowerBox from './PowerBox';
import CaresEvolution from './CaresEvolution';
import CatalystWomen from './CatalystWomen';
import BoxVideo from './BoxVideo';
import Slider from './Slider';
import Header from '../Header';
import Retooling from './Retooling';
import Donation from './Donation';
import Footer from './Footer';

class ModalAnniversary extends Modal {

  constructor(props) {
    super(props);
    const showBack = window.location.href.indexOf('hideBack') === -1;
    this.state = {
      showBack
    };
  }

  getClassName() {
    return 'm-anniversary-modal';
  }

  getContent() {
    return (
      <section id="anniversary">
        <Header
          showBack={this.state.showBack}
          onClose = {this.props.onClose.bind(this)}
        />
        <CaresPackage />
        <PowerBox />
        <Retooling />
        <CaresEvolution />
        <Donation />
        <CatalystWomen />
        <Footer />
      </section>
    )
  }
}

ModalAnniversary.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired,
  openModalVideo: React.PropTypes.func
};

export default ModalAnniversary;
