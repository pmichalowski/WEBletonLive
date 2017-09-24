import Tone from 'tone';
import $ from 'jquery';
import 'jquery-knob';
import Knob from '../Knob';

export default class Bass {

  constructor(mixerInput) {
    this.mixerInput = mixerInput;
    this.instrument = new Tone.MonoSynth({
      oscillator: {
        type: 'square'
      }
    });
    this.instrument.volume.value = -8;
    this.instrument.envelope.sustain = 0.2;
    this.filter = new Tone.Filter(100, 'lowpass');
    this.chorus = new Tone.Chorus();
    this.chorus.depth = 0;
    this.instrument.chain(this.filter, this.chorus, this.mixerInput);
    this.createLPFKnob();
    this.createAttackKnob();
    this.createChorusKnob();
  }

  createLPFKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 1;
    knobSettings.max = 142;
    knobSettings.step = 1;
    knobSettings.change = (val) => {
      this.filter.frequency.value = Math.pow(val, 2);
    };
    $('.bass-controls .lpf input').knob(knobSettings);
  }

  createAttackKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 0;
    knobSettings.max = 1;
    knobSettings.step = 0.01;
    knobSettings.change = (val) => {
      this.instrument.envelope.sustain = val;
    };
    $('.bass-controls .sustain input').knob(knobSettings);
  }

  createChorusKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 0;
    knobSettings.max = 1;
    knobSettings.step = 0.01;
    knobSettings.change = (val) => {
      this.chorus.depth = val;
    };
    $('.bass-controls .chorus input').knob(knobSettings);
  }


}