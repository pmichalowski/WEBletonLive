import $ from 'jquery';

export default class InstrumentControls {
  constructor() {
    this.instrumentControlScreens = $('.control-screen');
    this.trackSelectors = $('.track-selectors button');
    this.trackSelectors.on('click',(event) => {
      let clickedButton = $(event.currentTarget);
      let activeControlScreen = $(`.instrument-controls .${clickedButton.data('controls')}-controls`);
      this.trackSelectors.removeClass('active');
      clickedButton.addClass('active');
      this.instrumentControlScreens.addClass('hidden');
      activeControlScreen.removeClass('hidden');
    });
  }
}