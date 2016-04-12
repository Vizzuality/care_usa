'use strict';

import './styles.postcss';
import React from 'react';

class Modal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: this.props.isOpen
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.isOpen });
  }

  close(e) {
    let node = e.target
    while(node) {
      if(node === this.refs.closeButton) break;
      if(node === this.refs.content) return;
      node = node.parentNode;
    }

    this.setState({ open: false });
  }



  render() {
    return (
      <div className={ 'm-modal ' + ( this.state.open ? '' : '-hidden') } onClick={this.close.bind(this)}>
        <div className="content" ref="content">
          <svg className="close-button" onClick={this.close.bind(this)} ref="closeButton">
            <use xlinkHref="#icon-close"></use>
          </svg>
          {this.props.children}
        </div>
      </div>
    )
  }

}

Modal.propTypes = {
  isOpen: React.PropTypes.bool.isRequired
};

export default Modal;
