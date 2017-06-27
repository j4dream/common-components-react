import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Desktop extends React.Component {

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
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
      refDom.parentElement.style.height = refDom.contentDocument.body.offsetHeight;
      refDom.style.height = refDom.contentDocument.body.offsetHeight;
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
      <div className="preview-scroll">
        <div className="preview-main">
          <div className="preview-header">
            <ul className="op-menu">
              <li onClick={this.hide} title="Close"><i className="icon-remove" /></li>
              <li onClick={() => this.switchView('mobile')} title="Switch To Mobile View"><i className="icon-retweet" /></li>
            </ul>
          </div>
          <div className="preview-content">
            <iframe title="ifx" ref={node => (this.ifNode = node)} />
          </div>
        </div>
      </div>
    );
  }
}

Desktop.contextTypes = {
  component: PropTypes.any
};
