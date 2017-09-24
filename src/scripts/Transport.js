import Tone from 'tone';
import $ from 'jquery';

export default class Transport {
  constructor() {
    this.playButton = $('.play-button');
    this.stopButton = $('.stop-button');
    this.playButton.on('click', this.play.bind(this));
    this.stopButton.on('click', this.stop.bind(this));
  }

  play() {
    this.playButton.addClass('pressed');
    Tone.Transport.start();
  }

  stop() {
    this.playButton.removeClass('pressed');
    this.stopButton.addClass('pressed');
    setTimeout(() => {
      this.stopButton.removeClass('pressed');
    }, 100);
    Tone.Transport.stop();
  }
}