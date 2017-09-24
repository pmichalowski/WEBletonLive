import Tone from 'tone';
import $ from 'jquery';
import 'jquery-knob';
import Knob from './Knob';

export default class Mixer {

  constructor() {
    this.inputChannels = {
      kick: this.createChannel('kick'),
      hihat: this.createChannel('hihat'),
      bass: this.createChannel('bass'),
      synth: this.createChannel('synth')
    };
  }

  createChannel(channelName) {
    this.createKnob(channelName);
    return new Tone.Volume().toMaster();
  }

  createKnob(channelName) {
    let knobSettings = new Knob();
    knobSettings.min = 0;
    knobSettings.max = 50;
    knobSettings.step = 0.1;
    knobSettings.change = this.handleVolumeChange.bind(this, channelName);
    $(`.mixer .${channelName}`).knob(knobSettings);
  }

  handleVolumeChange(channelName, value) {
    this.inputChannels[channelName].volume.value = (Math.floor((50 - value) * -1));
  }

}