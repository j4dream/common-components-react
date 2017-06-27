import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Mobile extends React.Component {

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.switchView = this.switchView.bind(this);
  }

  componentDidMount() {
    this.setIframe();
  }

  componentDidUpdate() {
    this.setIframe();
  }

  setIframe() {
    const refDom = ReactDOM.findDOMNode(this.ifNode);
    if (this.props.src) {
      refDom.src = this.props.src;
      return;
    }
    if (!this.props.src && this.props.htmlContent) {
      refDom.contentDocument.open();
      refDom.contentDocument.write(this.props.htmlContent);
      refDom.contentDocument.close();
    }
  }

  parent() {
    return this.context.component;
  }

  hide() {
    this.parent().hide();
  }

  switchView(view) {
    this.parent().switchView(view);
  }

  render() {
    return (
      <div className="mobile-scroll">
        <div className="mobile-height-limit">
          <div className="preview-mobile">
            <div className="mobile-inner">
              <div className="mobile-menu">
                <ul className="op-menu">
                  <li onClick={this.hide} title="Close"><i className="icon-remove" /></li>
                  <li onClick={() => this.switchView('desktop')} title="Switch To Desktop View"><i className="icon-retweet" /></li>
                </ul>
              </div>
              <iframe title="mobile" ref={node => (this.ifNode = node)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Mobile.contextTypes = {
  component: PropTypes.any
};
