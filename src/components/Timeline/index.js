'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import d3 from 'd3';

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
  }

  render() {
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

    /* We add the ticks for the report */
    d3Axis.selectAll('.tick')
      .append('rect')
      .attr('width', 6)
      .attr('height', 6)
      .attr('x', -3)
      .attr('y', -3)
      .attr('transform', 'rotate(45)')
      .attr('class', 'report');

    /* We slightly move the ticks' text to the top and center it */
    d3Axis.selectAll('.tick text')
      .attr('y', -15)
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
    this.d3Cursor = d3Axis
      .append('circle')
      .attr('cx', d => this.scale(this.cursorPosition))
      .attr('cy', 0)
      .attr('r', 10)
      .attr('class', 'cursor');
  }

  togglePlay() {
    this.playing = !this.playing;
    this.buttonIcon.setAttribute('xlink:href', `#icon-${this.playing ? 'pause' : 'play'}`);
    if(this.playing) {
      this.play();
    } else {
      this.stop();
    }
  }

  play() {
    /* TODO: use the real dates insteaf of these */
    if(!this.options.data) {
      this.options.data = this.scale.ticks(d3.time.week, 2).map(date => {
        return { date };
      })
    }

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
    if(this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;

      /* We place the cursor at the end of the timeline if we reached the end */
      if(this.currentDataIndex === this.options.data.length - 1) {
        this.cursorPosition = this.options.domain[1];
        this.moveCursor(this.cursorPosition);
      }
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
      this.togglePlay();
    }
  }

  moveCursor(date) {
    this.d3Cursor.attr('cx', this.scale(date));
  }

  /* TODO */
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

};

export default TimelineView;
