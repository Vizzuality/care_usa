'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import d3 from 'd3';

import utils from '../../scripts/helpers/utils';
import './styles.postcss';

const defaults = {
  domain: [new Date(2012, 0, 1), new Date(2015, 0, 1)],
  milestones: [
    { date: new Date(2012, 3, 15) },
    { date: new Date(2012, 4, 27) },
    { date: new Date(2013, 2, 21) },
    { date: new Date(2014, 8, 2)  }
  ],
  svgPadding: {
    top: 0,
    right: 15,
    bottom: 0,
    left: 15
  },
  cursor: {
    speed: 10 /* seconds per year */
  }
};

class TimelineView extends Backbone.View {

  events() {
    return {
      'click .js-button': 'togglePlay'
    };
  }

  initialize(options) {
    this.options = _.extend(options, defaults);

    /* Cache */
    this.svgContainer = this.el.querySelector('.js-svg-container');
    this.button = this.el.querySelector('.js-button');
    this.buttonIcon = this.el.querySelector('.js-button-icon');

    /* Position of the cursor
     * NOTE: doesn't contain a position in pixels but a date */
    this.cursorPosition = this.options.domain[this.options.domain.length - 1];

    this.render();
    this.setListeners();
  }

  setListeners() {
    $(window).resize(_.debounce(this.render, 50).bind(this));
  }

  render() {
    const smallScreen = utils.checkDevice().mobile ||
      utils.checkDevice().tablet;

    const svgContainerDimensions = this.svgContainer.getBoundingClientRect();

    const svgWidth = svgContainerDimensions.width - this.options.svgPadding.left
      - this.options.svgPadding.right;
    const svgHeight = svgContainerDimensions.height - this.options.svgPadding.top
      - this.options.svgPadding.bottom;

    this.scale = d3.time.scale()
      .domain(this.options.domain)
      .range([0, svgWidth]);

    this.axis = d3.svg.axis()
      .scale(this.scale)
      .orient('top')
      /* TODO: should accept non yearly domains */
      .ticks(this.options.domain[1].getYear() - this.options.domain[0].getYear())
      .outerTickSize(0);

    this.svgContainer.innerHTML = null;

    this.svg = d3.select(this.svgContainer)
      .append('svg')
        .attr('width', svgContainerDimensions.width)
        .attr('height', svgContainerDimensions.height)
        .append('g')
          .attr('transform', `translate(${this.options.svgPadding.left}, ${this.options.svgPadding.top})`);

    const d3Axis = this.svg
        .append('g')
          .attr('class', 'axis')
          .style('stroke-dasharray', '6, 6')
          .attr('transform', 'translate(0, ' + (svgContainerDimensions.height / 2 + 4) + ')')
          .call(this.axis);

    /* We need it to calculate the position of the brush */
    this.axis = d3Axis[0][0];

    this.brush = d3.svg.brush()
      .x(this.scale)
      .extent([this.options.domain[1], this.options.domain[1]])
      .clamp(true)
      .on('brushstart', this.onCursorStartDrag.bind(this))
      .on('brush', this.onCursorDrag.bind(this))
      .on('brushend', this.onCursorEndDrag.bind(this));

    /* Cursor line - needs to be under the ticks */
    this.d3CursorLine = d3Axis
      .append('line')
      .attr('x1', 0)
      .attr('x2', this.scale(this.options.domain[1]))
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke-dasharray', '0, 0')
      .attr('class', 'cursor-line');

    /* We add the ticks for the report */
    d3Axis.selectAll('.tick')
      .append('rect')
      .attr('width', smallScreen ? 5 : 6)
      .attr('height', smallScreen ? 5 : 6)
      .attr('x', smallScreen ? -2.5 : -3)
      .attr('y', smallScreen ? -2.5 : -3)
      .attr('transform', 'rotate(45)')
      .attr('class', 'report');

    /* We slightly move the ticks' text to the top and center it */
    d3Axis.selectAll('.tick text')
      .attr('y', smallScreen ? -11 : -15)
      .style('text-anchor', 'middle');

    /* We add the milestones */
    d3Axis.selectAll('.milestone')
      .data(this.options.milestones)
      .enter()
        .append('rect')
        .attr('x', d => this.scale(d.date))
        .attr('y', -4)
        .attr('width', 8)
        .attr('height', 8)
        .attr('class', 'milestone');

    /* We add the cursor */
    const d3Slider = d3Axis
      .append('g')
      .attr('class', 'slider')
      .call(this.brush);

    d3Slider.selectAll('.extent, .resize, .background')
      .remove();

    this.d3Cursor = d3Slider
      .append('circle')
      .attr('cx', d => this.scale(this.cursorPosition))
      .attr('cy', 0)
      .attr('r', smallScreen ? 6 : 10)
      .attr('class', 'cursor');

    this.cursor = this.d3Cursor[0][0];

    this.d3Cursor
      .call(this.brush.event);

    /* TODO: use the real dates insteaf of these */
    if(!this.options.data) {
      this.options.data = this.scale.ticks(d3.time.week, 2).map(date => {
        return { date };
      })
    }
  }

  togglePlay() {
    if(!this.playing) {
      this.play();
    } else {
      this.stop();
    }
  }

  play() {
    if(this.playing) return;

    this.playing = true;
    this.buttonIcon.setAttribute('xlink:href', '#icon-pause');

    /* We move the cursor at the beginning if it's at the end */
    if(this.cursorPosition === this.options.domain[1]) {
      this.moveCursor(this.options.domain[0]);
    }

    /* We compute the number of day we need to jump for each animation frame,
     * assuming that the animation loop is called at 60 FPS
     * We prefer this methods than taking into account the position of the
     * cursor (in pixels) as on small screen the approximation of one pixel
     * can represent a greater error/jump. */
    this.dayPerFrame = 0.017 * 360 / this.options.cursor.speed;

    this.animationFrame = requestAnimationFrame(this.renderAnimationFrame.bind(this));
  }

  stop() {
    if(!this.playing) return;

    this.playing = false;
    this.buttonIcon.setAttribute('xlink:href', '#icon-play');

    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;

    /* We place the cursor at the end of the timeline if we reached the end */
    if(this.currentDataIndex === this.options.data.length - 1) {
      this.cursorPosition = this.options.domain[1];
      this.moveCursor(this.cursorPosition);
    }
  }

  renderAnimationFrame() {
    /* The first time the animation is requested, we place the cursor on the
     * first date we have data for */
    if(this.currentDataIndex === null || this.currentDataIndex === undefined ||
      this.cursorPosition === this.options.domain[1]) {
      this.currentDataIndex = 0;
      this.cursorPosition = this.options.data[this.currentDataIndex].date;
      this.moveCursor(this.cursorPosition);
    } else {
      this.cursorPosition = this.dayOffset(this.cursorPosition, this.dayPerFrame);

      /* We don't want to overpass the domain */
      if(this.cursorPosition > this.options.domain[1]) {
        this.cursorPosition = this.options.domain[1];
      }

      this.moveCursor(this.cursorPosition);
    }

    /* If the cursor has been moved above the next date with data, we set the
     * next data as the current ones and trigger them */
    if(this.currentDataIndex < this.options.data.length - 1 &&
      this.cursorPosition >= this.options.data[this.currentDataIndex + 1].date) {
      this.currentDataIndex++;
      this.triggerCurrentData();
    }

    /* If we don't reach the end, we request another animation, otherwise we move
     * the cursor to its last position on the timeline */
    if(this.cursorPosition < this.options.domain[1]) {
      this.animationFrame = requestAnimationFrame(this.renderAnimationFrame.bind(this));
    } else {
      this.stop();
    }
  }

  moveCursor(date) {
    this.brush.extent([date, date]);
    this.d3Cursor.attr('cx', this.scale(date));
    this.d3CursorLine.attr('x2', this.scale(date));
  }

  /* TODO */
  /* TODO: should absolutely be debounced because of the brush */
  triggerCurrentData() {
    console.log('Trigger data for', this.options.data[this.currentDataIndex]);
  }

  /* Compute and return date with the passed offset
   * NOTE: d3.time.day.offset can't be used because the use of float numbers are
   * not crossbrowser-standardized yet on d3 3.5.16:
   * https://github.com/mbostock/d3/issues/2790 */
  dayOffset(date, offset) {
    return new Date(+date + offset * 24 * 60 * 60 * 1000);
  }

  onCursorStartDrag() {
    this.stop();
    document.body.classList.add('-grabbing');
  }

  onCursorEndDrag() {
    document.body.classList.remove('-grabbing');
  }

  onCursorDrag() {
    if(!d3.event.sourceEvent) return;

    let date = this.scale.invert(d3.mouse(this.axis)[0]);
    if(date > this.options.domain[1]) date = this.options.domain[1];
    if(date < this.options.domain[0]) date = this.options.domain[0];

    const dataIndex = this.getClosestDataIndex(date);
    if(dataIndex !== this.currentDataIndex) {
      this.currentDataIndex = this.getClosestDataIndex(date);
      this.triggerCurrentData();
    }

    this.cursorPosition = date;
    this.moveCursor(date);
  }

  /* Return the index of the data item with the closest date to the one passed
   * as argument */
  getClosestDataIndex(date) {
    var current = 0;
    while(current < this.options.data.length - 1) {
      if(this.options.data[current].date > date) {
        if(current === 0) return current;
        const previousDiff = +date - (+this.options.data[current - 1].date);
        const nextDiff = +this.options.data[current].date - (+date);
        if(previousDiff <= nextDiff) return current - 1;
        return current;
      }
      current++;
    }
    return this.options.data.length - 1;
  }

};

export default TimelineView;
