'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import d3 from 'd3';
import moment from 'moment';

import utils from '../../scripts/helpers/utils';
import './styles.postcss';

const defaults = {
  milestones: [
    // { date: new Date(2012, 3, 15) },
    // { date: new Date(2012, 4, 27) },
    // { date: new Date(2013, 2, 21) },
    // { date: new Date(2014, 8, 2)  }
  ],
  svgPadding: {
    top: 0,
    right: 15,
    bottom: 0,
    left: 15
  },
  ticksAtExtremities: false
};

class TimelineView extends Backbone.View {

  events() {
    return {
      'click .js-button': 'togglePlay'
    };
  }

  initialize(options) {
    this.options = _.extend(defaults, options);

    /* Cache */
    this.svgContainer = this.el.querySelector('.js-svg-container');
    this.button = this.el.querySelector('.js-button');
    this.buttonIcon = this.el.querySelector('.js-button-icon');

    /* Position of the cursor
     * NOTE: doesn't contain a position in pixels but a date */
    if(this.options.cursorPosition) {
      this.cursorPosition = this.options.cursorPosition
    } else {
      this.cursorPosition = this.options.domain[this.options.domain.length - 1];
    }

    this.render();
    this.setListeners();
  }

  setListeners() {
    $(window).resize(_.debounce(this.render, 50).bind(this));
    Backbone.Events.on('popUp:open', _.bind(this._pauseTimeline, this))
    Backbone.Events.on('popUp:close', _.bind(this._rePlayTimeline, this))
  }

  _pauseTimeline() {
    if(!this.playing) return;
    this.paused = true;
    this.stop();
  }

  _rePlayTimeline() {
    if(!this.paused) return;
    this.paused = false;
    this.play();
  }

  render() {
    const smallScreen = utils.checkDevice().mobile ||
      utils.checkDevice().tablet;

    const svgContainerDimensions = this.svgContainer.getBoundingClientRect();

    const svgPadding = Object.assign({}, this.options.svgPadding);

    /* When we have ticks at the extremities (whose format is longer), we add
     * more padding */
    if(this.options.ticksAtExtremities) {
      svgPadding.left  += 15;
      svgPadding.right += 15;
    }

    const svgWidth = svgContainerDimensions.width - svgPadding.left
      - svgPadding.right;
    const svgHeight = svgContainerDimensions.height - svgPadding.top
      - svgPadding.bottom;

    /* Because d3 doesn't display the first tick, we subtract 1 day to it.
     ** I removed this solution because it was showing 31-12-2010, that is not an existing date when aplying filters and it draws final points anyway.
     * NOTE: concat and clone are used to not modify the original array */
    const domain = this.options.domain.concat([]);
    domain[0] = moment.utc(domain[0]).clone().toDate();
    /* We force the cursor to be within the domain */
    if(+this.cursorPosition > +this.options.domain[1]) this.cursorPosition = this.options.domain[1];
    if(+this.cursorPosition < +this.options.domain[0]) this.cursorPosition = this.options.domain[0];

    this.scale = d3.time.scale.utc()
      .domain(domain)
      .range([0, svgWidth]);

    /* List of the dates for which we want ticks */
    let ticksDates = d3.time.year.utc.range(domain[0], domain[1], 1);

    if(this.options.ticksAtExtremities) {
      ticksDates = ticksDates.concat(domain)
        .sort((a, b) => (+a) - (+b)); /* Compulsory */
    }

    this.axis = d3.svg.axis()
      .scale(this.scale)
      .orient('top')
      .tickValues(ticksDates)
      .tickFormat((d, i) => {
        /* The ticks at the extremities are the whole date and not just the
         * year */
        if(this.options.ticksAtExtremities) {
          if(i === 0 || i === ticksDates.length - 1) {
            return moment.utc(d).format('MM·DD·YYYY');
          }
          return;
        }
        return d.getUTCFullYear();
      })
      .outerTickSize(0);

    this.svgContainer.innerHTML = '';

    this.svg = d3.select(this.svgContainer)
      .append('svg')
        .attr('width', svgContainerDimensions.width)
        .attr('height', svgContainerDimensions.height)
        .append('g')
          .attr('transform', `translate(${svgPadding.left}, ${svgPadding.top})`);

    this.d3Axis = this.svg
        .append('g')
          .attr('class', 'axis')
          .style('stroke-dasharray', '6, 6')
          .attr('transform', 'translate(0, ' + (svgContainerDimensions.height / 2 + 4) + ')')
          .call(this.axis);

    /* We need it to calculate the position of the brush */
    this.axis = this.d3Axis[0][0];

    this.brush = d3.svg.brush()
      .x(this.scale)
      .extent([this.options.domain[1], this.options.domain[1]])
      .clamp(true)
      .on('brushstart', this.onCursorStartDrag.bind(this))
      .on('brush', this.onCursorDrag.bind(this))
      .on('brushend', this.onCursorEndDrag.bind(this));

    /* Cursor line - needs to be under the ticks */
    this.d3CursorLine = this.d3Axis
      .append('line')
      .attr('x1', 0)
      .attr('x2', this.scale(this.cursorPosition))
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke-dasharray', 'none')
      .attr('class', 'cursor-line');

    /* We add the ticks for the report */
    this.d3Axis.selectAll('.tick')
      .append('rect')
      .attr('width', smallScreen ? 5 : 8)
      .attr('height', smallScreen ? 5 : 8)
      .attr('x', smallScreen ? -2.5 : -4)
      .attr('y', smallScreen ? -2.5 : -4)
      .attr('transform', 'rotate(45)')
      .attr('class', 'report');

    /* We slightly move the ticks' text to the top and center it */
    this.d3Axis.selectAll('.tick text')
      .attr('y', smallScreen ? -11 : -15)
      .style('text-anchor', 'middle');

    /* We add the milestones */
    this.d3Axis.selectAll('.milestone')
      .data(this.options.milestones)
      .enter()
        .append('rect')
        .attr('x', d => this.scale(d.date))
        .attr('y', -4)
        .attr('width', 8)
        .attr('height', 8)
        .attr('class', 'milestone');

    /* We add the cursor */
    const d3Slider = this.d3Axis
      .append('g')
      .attr('class', 'slider')
      .call(this.brush);

    d3Slider.selectAll('.extent, .resize, .background')
      .remove();

    this.d3Cursor = d3Slider
      .attr('transform', () => `translate(${this.scale(this.cursorPosition)})`);

    /* We add the blurred shadow of the cursor */
    this.svg
      .append('defs')
        .append('filter')
        .attr('id', 'cursorShadow')
          .append('feGaussianBlur')
          .attr('stdDeviation', !~navigator.userAgent.toLowerCase().indexOf('firefox') ? 2 : 1);

    this.cursorShadow = this.d3Cursor
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', smallScreen ? 6 : 10)
      .attr('fill', '#686354')
      .attr('class', 'cursor-shadow');

    /* We add the real cursor */
    this.d3Cursor
      .append('circle')
      .on('mouseover', () => this.cursorShadow.attr('filter', 'url(#cursorShadow)'))
      .on('mouseout', () => this.cursorShadow.attr('filter', ''))
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', smallScreen ? 6 : 10)
      .attr('class', 'cursor')
      .call(this.brush.event);

    this.options.data = this.options.interval.unit.utc.range.apply(null, this.options.domain.concat(this.options.interval.count))
      .map(date => ({ date }));

    this.currentDataIndex = this.getClosestDataIndex(this.cursorPosition);
    this.triggerDate()
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

    /* Google Analytics */
    ga('send', 'event', 'Timeline', 'Play', this.options.layerName);

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

    /* This functionality has been removed because it was looking weird on
     * the projects mode */
    // /* We place the cursor at the end of the timeline if we reached the end */
    // if(this.currentDataIndex === this.options.data.length - 1) {
    //   this.cursorPosition = this.options.domain[1];
    //   this.moveCursor(this.cursorPosition);
    // }
  }

  renderAnimationFrame() {
    /* The first time the animation is requested, we place the cursor at the
     * beginning of the timeline */
    if(this.currentDataIndex === null || this.currentDataIndex === undefined ||
      this.cursorPosition === this.options.domain[1]) {
      this.currentDataIndex = -1;
      this.cursorPosition = this.options.domain[0];
      this.triggerDate();
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
      this.triggerDate();
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
    this.d3Cursor.attr('transform', () => `translate(${this.scale(date)})`);
    this.d3CursorLine.attr('x2', this.scale(date));
  }

  /* Compute and return date with the passed offset
   * NOTE: d3.time.day.offset can't be used because the use of float numbers are
   * not crossbrowser-standardized yet on d3 3.5.16:
   * https://github.com/mbostock/d3/issues/2790 */
  dayOffset(date, offset) {
    return new Date(+date + offset * 24 * 60 * 60 * 1000);
  }

  onCursorStartDrag() {
    if(!d3.event.sourceEvent) return;

    this.stop();
    document.body.classList.add('-grabbing');
  }

  onCursorEndDrag() {
    if(!d3.event.sourceEvent) return;

    this.cursorShadow.attr('filter', '')
    document.body.classList.remove('-grabbing');

    if(this.currentDataIndex) {
      /* Google Analytics */
      const date = moment.utc(this.options.data[this.currentDataIndex].date)
        .format('MM:DD:YYYY');
      ga && ga('send', 'event', 'Timeline', 'Drag', date);
    }
  }

  onCursorDrag() {
    if(!d3.event.sourceEvent) return;

    this.cursorShadow.attr('filter', 'url(#cursorShadow)')

    let date = this.scale.invert(d3.mouse(this.axis)[0]);
    if(date > this.options.domain[1]) date = this.options.domain[1];
    if(date < this.options.domain[0]) date = this.options.domain[0];

    const dataIndex = this.getClosestDataIndex(date);
    if(dataIndex !== this.currentDataIndex) {
      this.currentDataIndex = this.getClosestDataIndex(date);
      /* We trigger the range of the currently available data */
      this.triggerDate();
    }

    this.cursorPosition = date;
    this.moveCursor(date);
  }

  /* Return the index of the data item with the closest date to the one passed
   * as argument */
  getClosestDataIndex(date) {
    var current = 0;
    while(current <= this.options.data.length - 1) {
      if(this.options.data[current].date > date) {
        if(current === 0) return -1;
        return current - 1;
      }
      current++;
    }
    return this.options.data.length - 1;
  }

  setCursorPosition(date) {
    if(!moment.utc(this.cursorPosition).isSame(date)) {
      this.cursorPosition = date;
      this.render();
      this.currentDataIndex = this.getClosestDataIndex(this.cursorPosition);
      this.triggerDate()
    }
  }

};

TimelineView.prototype.triggerDate = (function() {
  /* Do not pass true as third argument (immediate argument) otherwise the
   * trigger will be done on the leading edge instead of the trailing edge. This
   * implies that when moving really fast the cursor we'll still trigger its
   * last position. */
  const trigger = _.debounce(function(date) {
    this.options.triggerDate(date);
  }, 100);

  return function() {
    if(this.currentDataIndex < 0) {
      trigger.call(this, this.options.domain[0]);
    } else {
      trigger.call(this, this.options.data[this.currentDataIndex].date);
    }
  };

})();

export default TimelineView;
