/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './main.css';

export default class AutoComplete extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listData: this.props.dataSource,
      isFocus: false,
      dataSource: this.props.dataSource,
      selectedData: this.props.selectedData.map(item => Object.assign(item, { check: true }))
    };
  }

  componentDidMount() {
    this.fixBoxPadding();
  }

  getCurrentList() {
    const clist = [],
          sdata = this.state.selectedData,
          fdata = this.state.listData;
    if (this.props.excludeExist) { 
      for (let i = 0; i < fdata.length; i++) {
        let fdataItem = fdata[i];
        let isSame = false;
        for (let j = 0; j < sdata.length; j++) {
          let sdataItem = sdata[j];
          if (sdataItem.id === fdataItem.id) {
            isSame = true;
            break;
          }
        }
        if (!isSame) {
          clist.push(fdataItem);
        }
      }
    } else { 
      for (let i = 0; i < fdata.length; i++) {
        let fdataItem = fdata[i];
        let isSame = false;
        for (let j = 0; j < sdata.length; j++) {
          let sdataItem = sdata[j];
          if (sdataItem.id === fdataItem.id) {
            isSame = true;
            break;
          }
        }
        if (isSame) {
          fdataItem.check = true;
        } else {
          fdataItem.check = false;
        }
        clist.push(fdataItem);
      }
    }
    return clist;
  }

  blurTimer: null;

  fixBoxPadding() {
    let boxReference = ReactDOM.findDOMNode(this.boxNode);
    let inputReference = ReactDOM.findDOMNode(this.inputNode);
    let lastBoxChild = boxReference.lastElementChild;
    if (lastBoxChild && boxReference instanceof HTMLElement) {
      inputReference.style.paddingLeft = lastBoxChild.offsetLeft + lastBoxChild.offsetWidth + 2;
      inputReference.style.paddingTop = lastBoxChild.offsetTop + 8;
      inputReference.style.height = lastBoxChild.offsetTop + lastBoxChild.offsetHeight + 2;
      boxReference.style.maxWidth = inputReference.offsetWidth - 18;
    } else {
      inputReference.style.paddingLeft = 12;
    }
  }

  handleFocus() {
    this.setState({
      isFocus: true
    });
  }

  handleBlur() {
    // 防止在点击的时候隐藏列表
    this.blurTimer = setTimeout(() => {
      this.setState((preState) => {
        return {
          isFocus: false,
          listData: preState.dataSource
        }
      }, () => ReactDOM.findDOMNode(this.inputNode).value = '');
    }, 200);
  }

  handleKeyUp(evt) {
    let filterData = this.state.dataSource.filter((item) => item.name.indexOf(evt.target.value) > -1);
    this.setState({
      listData: filterData
    });
  }

  syncSelectedItem() {
    return (
      <div
        ref={ node => this.boxNode = node }
        className="auto-complete-rich-box-list"
        onClick={ () => ReactDOM.findDOMNode(this.inputNode).focus() }
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          maxWidth: this.props.width
        }}
      >
        {
          this.state.selectedData.map(item => {
            return (
              <span
                title={ item.name }
                key={ `box_item_${item.id}` }
                className="auto-complete-rich-item"
                style={{
                  maxWidth: `calc(${this.props.width} - 30px)`
                }}
              >
                { item.name }
                <i onClick={ this.toggleSelectItem.bind(this, item) } className="icon-remove"></i>
              </span>);
          })
        }
      </div>
    );
  }

  toggleSelectItem(item) {
    clearTimeout(this.blurTimer);
    let selectedData = this.state.selectedData;
    item.check = !item.check;
    if (item.check) {
      selectedData.push(item);
    } else {
      selectedData = selectedData.filter(d => d.id !== item.id);
    }
    ReactDOM.findDOMNode(this.inputNode).focus();
    this.setState({
      selectedData
    }, this.fixBoxPadding);
  }

  render() {
    let selectItem = this.syncSelectedItem();

    return (
      <div
        style={{
          "width": this.props.width,
          "position": "relative"
        }}
      >
        <input 
          className="auto-input-mark"
          type="text"
          maxLength="80"
          style={{
            "maxWidth": this.props.width,
          }}
          placeholder={ this.state.selectedData ? '' : this.props.placeholder }
          ref={ node => this.inputNode = node }
          onFocus={ this.handleFocus.bind(this) }
          onBlur={ this.handleBlur.bind(this) }
          onKeyUp={ this.handleKeyUp.bind(this) }
        />
        { 
          this.props.richSelectionResult && <div className="clearfix"> { selectItem } </div>
        }
        <ul
          className="dropdown-menu"
          style={{
            display: this.state.isFocus ? 'block' : 'none',
          }}
        >
          { 
            this.getCurrentList().map(item => {
              return (
                <li
                  key={ `list_item_${item.id}` }
                  title={ item.name }
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden"
                  }}
                  onClick={this.toggleSelectItem.bind(this, item)}
                >
                  <a href="javascript:void(0);">
                    <label className="auto-complete-mockup-checkbox-label">
                      <label className={classnames("auto-complete-mockup-checkbox", { on: item.check })}>
                        <span><i className="icon-ok"/></span>
                      </label>
                      <span>{ item.name }</span>
                    </label>
                  </a>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}

AutoComplete.PropTypes = {
  richSelectionResult: PropTypes.bool,
  excludeExist: PropTypes.bool,
  selectedData: PropTypes.array,
  dataSource: PropTypes.array,
  placeholder: PropTypes.string,
  width: PropTypes.string
}

AutoComplete.defaultProps = {
  selectedData: [],
  richSelectionResult: true,
  width: "100%"
}