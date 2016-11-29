import React from 'react';
import AudioWidget from './widgets/audioWidget';
import { AudioParser} from './componentParser';
const mapper = {
  audio: { widget: AudioWidget, parser: new AudioParser() }
};

export default class WidgetFactory {
  getData(figure) {
    const componentElement = figure.getElementsByClassName("pearson-component")[0];
    this.type = componentElement.getAttribute('data-type');
    return mapper[this.type].parser.getData(figure);
  }

  getWidget(widgetData) {
    return React.createElement( mapper[this.type].widget, { data: widgetData });
  };
};
