import Tone from 'tone';
import kick from '../../assets/samples/kick.mp3';
import $ from 'jquery';
import 'jquery-knob';
import Knob from '../Knob';

export default class Kick {

  constructor(mixerInput) {
    this.mixerInput = mixerInput;
    this.instrument = new Tone.Player(kick);
    this.instrument.fadeOut = '64n';
    this.distortion = new Tone.Distortion(0);
    this.bitcrusher = new Tone.BitCrusher(8);
    this.bitcrusher.wet.value = 0;
    this.instrument.chain(this.distortion, this.bitcrusher, this.mixerInput);
    this.createPitchKnob();
    this.createDistortionKnob();
    this.createBitCrusherKnob();
  }

  createPitchKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 0.01;
    knobSettings.max = 2;
    knobSettings.step = 0.05;
    knobSettings.change = (val) => {
      this.instrument.playbackRate = val;
    };
    $('.kick-controls .pitch input').knob(knobSettings);
  }

  createDistortionKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 0;
    knobSettings.max = 1;
    knobSettings.step = 0.01;
    knobSettings.change = (val) => {
      this.distortion.distortion = val;
    };
    $('.kick-controls .distortion input').knob(knobSettings);
  }

  createBitCrusherKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 0;
    knobSettings.max = 1;
    knobSettings.step = 0.01;
    knobSettings.change = (val) => {
      this.bitcrusher.wet.value = val;
    };
    $('.kick-controls .bitcrusher input').knob(knobSettings);
  }


}