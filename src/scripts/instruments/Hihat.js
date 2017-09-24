import Tone from 'tone';
import hihat from '../../assets/samples/hihat.mp3';
import $ from 'jquery';
import 'jquery-knob';
import Knob from '../Knob';

export default class Hihat {

  constructor(mixerInput) {
    this.mixerInput = mixerInput;
    this.instrument = new Tone.Player(hihat);
    this.instrument.fadeOut = '64n';
    this.pingPongDelay = new Tone.PingPongDelay('3n', 0.5);
    this.pingPongDelay.wet.value = 0;
    this.highPassFilter = new Tone.Filter(0, 'highpass');
    this.instrument.chain(this.highPassFilter, this.pingPongDelay, this.mixerInput);
    this.createPitchKnob();
    this.createPingPongDelayKnob();
    this.createHPFKnob();
  }

  createPitchKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 0.5;
    knobSettings.max = 1.5;
    knobSettings.step = 0.05;
    knobSettings.change = (val) => {
      this.instrument.playbackRate = val;
      if (val == 2) {
        this.instrument.reverse = true;
      }
    };
    $('.hihat-controls .pitch input').knob(knobSettings);
  }

  createPingPongDelayKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 0;
    knobSettings.max = 1;
    knobSettings.step = 0.01;
    knobSettings.change = (val) => {
      this.pingPongDelay.wet.value = val;
    };
    $('.hihat-controls .ping-pong-delay input').knob(knobSettings);
  }

  createHPFKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 1;
    knobSettings.max = 142;
    knobSettings.step = 1;
    knobSettings.change = (val) => {
      this.highPassFilter.frequency.value = Math.pow(val, 2);
    };
    $('.hihat-controls .hpf input').knob(knobSettings);
  }


}