// flow
import React, { PureComponent } from 'react';
import cx from 'classnames';
import bowser from 'bowser';
import styles from './Scrollbar.css';

export default class SimpleScrollbar extends PureComponent {
  props: {
    children: React.Node,
    autoHide: boolean,
    className?: string,
    isPolyfilled?: boolean
  };

  state = {
    dragging: false,
    scrollTop: 0,
    scrollHeight: 0,
    offsetHeight: 0
  };

  static defaultProps = {
    isPolyfilled: !bowser.webkit && !bowser.blink,
    className: null
  };

  componentDidMount() {
    this.container.addEventListener('scroll', this.handleScroll);
    this.updateScrollbar();
  }

  componentWillUnmount() {
    this.container.removeEventListener('scroll', this.handleScroll);
  }

  updateScrollbar = callback => {
    const { scrollHeight, offsetHeight, scrollTop } = this.container;
    this.setState(
      {
        scrollHeight,
        offsetHeight,
        scrollTop
      },
      callback
    );
  };

  handleScroll = () => {
    this.setState({
      scrollTop: this.container.scrollTop
    });
  };

  scrollYTo = position => {
    this.container.scrollTop = position;
  };

  handleTrackClick = event => {
    if (this.state.dragging) return;
    const y = event.nativeEvent.offsetY;
    this.scrollYTo(y);
  };

  thumbMouseDown = event => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.thumbMouseUp);
    const { target, clientY } = event;
    const { offsetHeight } = target;
    const { top } = target.getBoundingClientRect();
    this.setState({
      dragging: true,
      positionY: offsetHeight - (clientY - top),
      trackTop: this.trackVertical.getBoundingClientRect().top
    });
  };

  thumbMouseUp = event => {
    event.preventDefault();
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.thumbMouseUp);
    this.setState({
      dragging: false,
      positionY: 0
    });
  };

  onDrag = event => {
    if (!this.state.dragging) return;
    const { clientY } = event;
    const { positionY, trackTop, offsetHeight } = this.state;
    const thumbHeight = this.getThumbHeight();
    const clickPosition = thumbHeight - positionY;
    const offset = -trackTop + clientY - clickPosition;
    const scrollTop = this.getScrollTopForOffset(offset);
    if (scrollTop < 0) return;
    if (offset + thumbHeight >= offsetHeight) return;
    this.setState({
      scrollTop
    });
    this.scrollYTo(scrollTop);
  };

  getScrollTopForOffset(offset) {
    const { scrollHeight, offsetHeight } = this.state;
    const thumbHeight = this.getThumbHeight();
    return offset / (offsetHeight - thumbHeight) * (scrollHeight - offsetHeight);
  }

  getThumbHeight = () => {
    const { offsetHeight, scrollHeight } = this.state;
    return offsetHeight / scrollHeight * offsetHeight;
  };

  getThumbOffset = () => {
    const { offsetHeight, scrollHeight, scrollTop } = this.state;
    const difference = scrollHeight - offsetHeight;
    const offset = difference === 0 ? 0 : scrollTop / difference;
    return (offsetHeight - this.getThumbHeight()) * offset;
  };

  getThumbStyle = () => {
    if (this.container === undefined) return {};
    const height = this.getThumbHeight();
    const top = this.getThumbOffset();
    return {
      height,
      top
    };
  };

  render() {
    const { autoHide, className, isPolyfilled } = this.props;
    const { dragging, scrollTop, scrollHeight } = this.state;
    return (
      <div className={cx(styles.wrapper, { [styles.wrapperDragging]: dragging })}>
        <div
          ref={container => {
            this.container = container;
          }}
          className={cx(styles.container, className, {
            [styles['container--hideOnInactive']]: autoHide,
            [styles.polyfilled]: isPolyfilled
          })}
        >
          {this.props.children}
        </div>
        {isPolyfilled && (
          <div
            id="track"
            role="scrollbar"
            aria-controls="track"
            aria-orientation="vertical"
            aria-valuemax={scrollHeight}
            aria-valuemin={0}
            aria-valuenow={scrollTop}
            ref={trackVertical => {
              this.trackVertical = trackVertical;
            }}
            className={styles.track}
            onMouseDown={this.handleTrackClick}
          >
            <div
              id="thumb"
              role="scrollbar"
              aria-controls="thumb"
              aria-orientation="vertical"
              aria-valuemax={scrollHeight}
              aria-valuemin={0}
              aria-valuenow={scrollTop}
              ref={thumbVertical => {
                this.thumbVertical = thumbVertical;
              }}
              className={cx(styles.thumb, {
                [styles['thumb--hideOnInactive']]: autoHide,
                [styles.thumbActive]: dragging
              })}
              onMouseDown={this.thumbMouseDown}
              style={this.getThumbStyle()}
            />
          </div>
        )}
      </div>
    );
  }
}
