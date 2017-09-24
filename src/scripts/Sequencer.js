import Tone from 'tone';
import $ from 'jquery';
import {
  kickSequences,
  hihatSequences,
  bassSequences,
  synthSequences
} from './sequences';

export default class Sequencer {

  constructor(instruments, transport) {
    this.instruments = instruments;
    this.transport = transport;
    this.quantization = '@1n';
    this.buttonStateChangesQueue = [];

    this.initSequences();
    this.initHandlers();
  }

  initSequences() {
    this.sequences = {
      kick: [
        new Tone.Sequence(this.sampleTriggerHandler.bind(this, 'kick'), kickSequences[0], '16n'),
        new Tone.Sequence(this.sampleTriggerHandler.bind(this, 'kick'), kickSequences[1], '16n'),
        new Tone.Sequence(this.sampleTriggerHandler.bind(this, 'kick'), kickSequences[2], '16n'),
        new Tone.Sequence(this.sampleTriggerHandler.bind(this, 'kick'), kickSequences[3], '16n')
      ],
      hihat: [
        new Tone.Sequence(this.sampleTriggerHandler.bind(this, 'hihat'), hihatSequences[0], '16n'),
        new Tone.Sequence(this.sampleTriggerHandler.bind(this, 'hihat'), hihatSequences[1], '16n'),
        new Tone.Sequence(this.sampleTriggerHandler.bind(this, 'hihat'), hihatSequences[2], '16n'),
        new Tone.Sequence(this.sampleTriggerHandler.bind(this, 'hihat'), hihatSequences[3], '16n')
      ],
      bass: [
        new Tone.Sequence(this.noteTriggerHandler.bind(this, 'bass', '16n'), bassSequences[0], '16n'),
        new Tone.Sequence(this.noteTriggerHandler.bind(this, 'bass', '16n'), bassSequences[1], '16n'),
        new Tone.Sequence(this.noteTriggerHandler.bind(this, 'bass', '16n'), bassSequences[2], '16n'),
        new Tone.Sequence(this.noteTriggerHandler.bind(this, 'bass', '16n'), bassSequences[3], '16n')
      ],
      synth: [
        new Tone.Sequence(this.noteTriggerHandler.bind(this, 'synth', '4n'), synthSequences[0], '4n'),
        new Tone.Sequence(this.noteTriggerHandler.bind(this, 'synth', '4n'), synthSequences[1], '4n'),
        new Tone.Sequence(this.noteTriggerHandler.bind(this, 'synth', '4n'), synthSequences[2], '4n'),
        new Tone.Sequence(this.noteTriggerHandler.bind(this, 'synth', '4n'), synthSequences[3], '4n')
      ]
    };
  }

  initHandlers() {
    this.clips = $('.clip').on('click', this.clipChangeHandler.bind(this));

    this.queueHandler = new Tone.Event(this.handleStateChangeQueue.bind(this))
      .set({
        loop: true,
        loopEnd: '1n'
      }).start();

    Tone.Transport.on('stop',() => {
      for (let instrumentName in this.sequences) {
        if (this.sequences.hasOwnProperty(instrumentName)){
          let instrument = this.sequences[instrumentName];
          instrument.forEach((sequence) => {
            sequence.stop();
          });
        }
      }
      let clipsIcons = $('.clip i');
      clipsIcons.removeClass('play');
      clipsIcons.removeClass('stop');
      clipsIcons.removeClass('awaiting');
      clipsIcons.addClass('play');
    });
  }

  getCurrentlyPlayingSequence(instrument) {
    for (var i = 0; i < this.sequences[instrument].length; i++) {
      let sequence = this.sequences[instrument][i];
      if (sequence.state === 'started') {
        return i;
      }
    }
  }

  clipChangeHandler(event) {
    let clipButton = $(event.currentTarget);
    let clipButtonIcon = $('i', clipButton);
    let instrument = clipButton.data('instrument');
    let pattern = Number(clipButton.data('pattern')) - 1;
    let currentlyPlaying = this.getCurrentlyPlayingSequence(instrument);
    if (currentlyPlaying === pattern) {
      this.addElementToStateChangeQueue(clipButtonIcon, 'stop');
      return this.sequences[instrument][currentlyPlaying].stop(this.quantization);
    }
    if (typeof currentlyPlaying !== 'undefined') {
      let selector = `.clip[data-pattern="${currentlyPlaying + 1}"][data-instrument="${instrument}"] i`;
      this.addElementToStateChangeQueue($(selector), 'stop');
      this.sequences[instrument][currentlyPlaying].stop(this.quantization);
    }
    this.sequences[instrument][pattern].start(this.quantization);
    this.addElementToStateChangeQueue(clipButtonIcon, 'play');
    if (Tone.Transport.state === 'stopped') {
      this.transport.play();
    }
  }

  sampleTriggerHandler(sampler, time, trigger) {
    if (trigger) {
      this.instruments[sampler].instrument.start();
    }
  }

  noteTriggerHandler(synth, length, time, note) {
    if (note) {
      this.instruments[synth].instrument.triggerAttackRelease(note, length);
    }
  }

  addElementToStateChangeQueue(element, newState) {
    element.addClass('awaiting');
    this.buttonStateChangesQueue.push({element, newState});
  }

  handleStateChangeQueue() {
    this.buttonStateChangesQueue.forEach((stateChange) => {
      this.changeButtonState(stateChange.element, stateChange.newState);
    });
    this.buttonStateChangesQueue = [];
  }

  changeButtonState(element, newState) {
    element.removeClass('awaiting');
    switch(newState) {
      case 'play':
        element.removeClass('play');
        element.addClass('stop');
        break;
      case 'stop':
      default:
        element.removeClass('stop');
        element.addClass('play');
        break;
    }
  }
}