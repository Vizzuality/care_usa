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
import HistoryHeader from './HistoryHeader';
import Retooling from './Retooling';
import Donation from './Donation';
import Footer from './Footer';

class ModalAnniversary extends Modal {

  constructor(props) {
    super(props);
  }

  getClassName() {
    return 'm-anniversary-modal';
  }

  getContent() {
    return (
      <section id="anniversary">
        <HistoryHeader
          onClose = {this.props.onClose.bind(this)}
          toggleMenuFn = {this.props.toggleMenuFn}
        />
        <CaresPackage />
        <PowerBox />
        <Retooling />
        <CaresEvolution />
        <CatalystWomen />
        <Slider />
        <BoxVideo openModalVideo={this.props.openModalVideo} />
        <Donation />
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
