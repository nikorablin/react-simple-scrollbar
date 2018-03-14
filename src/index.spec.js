import React from 'react';
import { mount } from 'enzyme';

import SimpleScrollbar from './';

describe('Scrollbar tests', () => {
  it('should render, with given classnames, without throwing error', () => {
    const wrapper = (
      <SimpleScrollbar className="outer" contentClassName="inner">
        Hello
      </SimpleScrollbar>
    );
    expect(
      mount(wrapper).contains(
        <div className="outer">
          <div className="inner">Hello</div>
        </div>
      )
    ).toBe(true);
  });

  it('if polyfilled, render a scrollbar', () => {
    const wrapper = mount(<SimpleScrollbar isPolyfilled>Hello</SimpleScrollbar>);
    const track = wrapper.find('#track');
    expect(track.length).toEqual(1);
  });

  it('update() updates the scrollbar state and call callback', () => {
    const wrapper = mount(<SimpleScrollbar isPolyfilled>Hello</SimpleScrollbar>);
    const instance = wrapper.instance();
    const spy = jest.fn();
    instance.container = {
      scrollHeight: 500,
      offsetHeight: 250,
      scrollTop: 100
    };
    instance.update(spy);

    expect(spy.mock.calls.length).toBe(1);
    expect(wrapper.state('scrollHeight')).toBe(500);
    expect(wrapper.state('offsetHeight')).toBe(250);
    expect(wrapper.state('scrollTop')).toBe(100);
  });

  describe('scroll events', () => {
    it('updates state scrollTop on scroll', () => {
      const wrapper = mount(<SimpleScrollbar isPolyfilled>Hello</SimpleScrollbar>);
      const instance = wrapper.instance();
      wrapper.setState({
        scrollHeight: 500,
        offsetHeight: 250,
        scrollTop: 100
      });
      instance.container = {
        scrollTop: 150
      };
      instance.handleScroll();
      expect(wrapper.state('scrollTop')).toBe(150);
    });

    it('calls onScrollUp prop when provided and scrolled up', () => {
      const onScrollUp = jest.fn();
      const wrapper = mount(
        <SimpleScrollbar onScrollUp={onScrollUp} isPolyfilled>
          Hello
        </SimpleScrollbar>
      );
      const instance = wrapper.instance();
      wrapper.setState({
        scrollHeight: 500,
        offsetHeight: 250,
        scrollTop: 100
      });
      instance.container = {
        scrollTop: 50
      };
      instance.handleScroll();
      expect(onScrollUp.mock.calls.length).toBe(1);
      expect(onScrollUp.mock.calls[0][0]).toBe(200);
    });

    it('calls onScrollDown prop when provided and scrolled down', () => {
      const onScrollDown = jest.fn();
      const wrapper = mount(
        <SimpleScrollbar onScrollDown={onScrollDown} isPolyfilled>
          Hello
        </SimpleScrollbar>
      );
      const instance = wrapper.instance();
      wrapper.setState({
        scrollHeight: 500,
        offsetHeight: 250,
        scrollTop: 100
      });
      instance.container = {
        scrollTop: 150
      };
      instance.handleScroll();
      expect(onScrollDown.mock.calls.length).toBe(1);
      expect(onScrollDown.mock.calls[0][0]).toBe(100);
    });

    it('calls onYStart prop when provided and scrolled to top', () => {
      const onYStart = jest.fn();
      const wrapper = mount(
        <SimpleScrollbar onYStart={onYStart} isPolyfilled>
          Hello
        </SimpleScrollbar>
      );
      const instance = wrapper.instance();
      wrapper.setState({
        scrollHeight: 500,
        offsetHeight: 250,
        scrollTop: 100
      });
      instance.container = {
        scrollTop: 0
      };
      instance.handleScroll();
      expect(onYStart.mock.calls.length).toBe(1);
    });

    it('calls onYEnd prop when provided and scrolled to bottom', () => {
      const onYEnd = jest.fn();
      const wrapper = mount(
        <SimpleScrollbar onYEnd={onYEnd} isPolyfilled>
          Hello
        </SimpleScrollbar>
      );
      const instance = wrapper.instance();
      wrapper.setState({
        scrollHeight: 500,
        offsetHeight: 250,
        scrollTop: 100
      });
      instance.container = {
        scrollTop: 250
      };
      instance.handleScroll();
      expect(onYEnd.mock.calls.length).toBe(1);
    });

    it('handleTrackClick() scrolls container to y event', () => {
      const wrapper = mount(<SimpleScrollbar isPolyfilled>Hello</SimpleScrollbar>);
      const instance = wrapper.instance();
      instance.handleTrackClick({ nativeEvent: { offsetY: 100 } });
      expect(instance.container.scrollTop).toBe(100);
    });

    it('handleTrackClick() does nothing when dragging', () => {
      const wrapper = mount(<SimpleScrollbar isPolyfilled>Hello</SimpleScrollbar>);
      wrapper.setState({
        scrollHeight: 500,
        offsetHeight: 250,
        scrollTop: 100,
        dragging: true
      });
      const instance = wrapper.instance();
      instance.container.scrollTop = 100;
      instance.handleTrackClick({ nativeEvent: { offsetY: 150 } });
      expect(instance.container.scrollTop).toBe(100);
    });
  });
});
