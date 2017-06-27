import React from 'react';
import PropTypes from 'prop-types';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { Transition, View } from '../../libs';
import './main.css';

export default class Preview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      view: this.props.view
    };
    this.hide = this.hide.bind(this);
  }

  getChildContext() {
    return {
      component: this
    };
  }

  switchView(view) {
    this.setState({ view });
  }

  hide(e) {
    if (this.props.onClose) {
      this.props.onClose();
      return;
    }
    this.props.hide(e);
  }

  render() {
    const { show, htmlContent } = this.props;
    return (
      <Transition name="preview">
        <View key={show} show={show}>
          <div className="preview-modal">
            {
              this.state.view === 'desktop' ? (
                <Desktop
                  htmlContent={htmlContent}
                />
              ) : (
                <Mobile
                  htmlContent={htmlContent}
                />
              )
            }
          </div>
        </View>
      </Transition>
    );
  }
}
// 慎用 contex，api 可能废弃。尽量使用 props 传递。
Preview.childContextTypes = {
  component: PropTypes.any
};

