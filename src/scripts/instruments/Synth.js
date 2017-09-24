import Tone from 'tone';
import $ from 'jquery';
import 'jquery-knob';
import Knob from '../Knob';

export default class Synth {

  constructor(mixerInput) {
    this.mixerInput = mixerInput;
    this.instrument = new Tone.FMSynth({
      harmonicity: 0.5,
      oscillator: {
        type: 'sawtooth'
      },
      modulationIndex: 1,
      envelope: {
        attack: 0.5,
        sustain: 0.8,
        release: 1
      }
    });
    this.instrument.volume.value = 2;
    //this.instrument.envelope.sustain = 0.2;
    this.filter = new Tone.Filter(2500, 'bandpass');
    this.reverb = new Tone.JCReverb(0.5);
    this.reverb.wet.value = 0;
    this.instrument.chain(this.filter, this.reverb, this.mixerInput);
    this.createModulationKnob();
    this.createBPFKnob();
    this.createReverbKnob();
  }

  createModulationKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 1;
    knobSettings.max = 20;
    knobSettings.step = 1;
    knobSettings.change = (val) => {
      this.instrument.modulationIndex.value = val;
    };
    $('.synth-controls .modulation input').knob(knobSettings);
  }

  createBPFKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 10;
    knobSettings.max = 130;
    knobSettings.step = 1;
    knobSettings.change = (val) => {
      this.filter.frequency.value = Math.pow(val, 2);
    };
    $('.synth-controls .bpf input').knob(knobSettings);
  }

  createReverbKnob() {
    let knobSettings = new Knob();
    knobSettings.min = 0;
    knobSettings.max = 1;
    knobSettings.step = 0.01;
    knobSettings.change = (val) => {
      this.reverb.wet.value = val;
      this.reverb.roomSize.value = val * 0.8;
    };
    $('.synth-controls .reverb input').knob(knobSettings);
  }


}