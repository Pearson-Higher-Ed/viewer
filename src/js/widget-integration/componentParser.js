class componentParser {

  parse(componentElement) {
    this.data = { type: componentElement.getAttribute( 'data-type' ), uri: componentElement.getAttribute( 'data-uri' ) };
  };

};

export class AudioParser extends componentParser {
  getData(figure) {
    const title = figure.getElementsByClassName('heading4AudioTitle')[0].nodeValue;
    const action = figure.getElementsByClassName('heading4AudioNumberLabel')[0].nodeValue;
    const componentElement = figure.getElementsByClassName("pearson-component")[0];
    super.parse(componentElement);
    var audioElement = componentElement.getElementsByTagName( 'audio' )[0];
    var source = audioElement.getElementsByTagName('source')[0];

    var data = { source: source.src, title: (title ? title : 'Audio'), action: (action ? action : '') };
    return data;
  };
};
