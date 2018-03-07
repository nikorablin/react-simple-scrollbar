// flow
import React, { PureComponent } from 'react';
import styles from './Scrollbar.css';

export default class SimpleScrollbar extends PureComponent {
  props: {
    children: React.Node
  };

  render() {
    return <div className={styles.container}>{this.props.children}</div>;
  }
}
