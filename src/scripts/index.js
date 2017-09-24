'use strict';
if (module.hot) {
  module.hot.accept();
}
import '../styles/index.scss';
import 'babel-polyfill';
import $ from 'jquery';
import Tone from 'tone';

import Mixer from './Mixer';
import Transport from './Transport';
import Sequencer from './Sequencer';
import InstrumentControls from './InstrumentControls';

import Kick from './instruments/Kick';
import Hihat from './instruments/Hihat';
import Bass from './instruments/Bass';
import Synth from './instruments/Synth';

class App {
  constructor() {
    Tone.Transport.bpm.value = 120;
    const mixer = new Mixer();
    const transport = new Transport();
    const instrumentsControls = new InstrumentControls();
    let instruments = {
      kick: new Kick(mixer.inputChannels.kick),
      hihat: new Hihat(mixer.inputChannels.hihat),
      bass: new Bass(mixer.inputChannels.bass),
      synth: new Synth(mixer.inputChannels.synth)
    };

    const sequencer = new Sequencer(instruments, transport);
  }
}


$(document).ready(() => {
  const app = new App();
});