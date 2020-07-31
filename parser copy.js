/* eslint-disable prefer-const */
// has parsing for all previous versions
let parser = {};

parser.parse = function(opts, ref, wheelNumber, sprite) {
  if (opts === undefined) {
    return alert('Could not parse: Undefined parameter');
  }
  if (opts.string === undefined) {
    return alert('Could not parse: Empty string');
  }

  let lines = opts.string.split('\n');

  if (parser[lines[0]] === undefined) {
    return alert(
        'Could not parse: Unsupported version and/or invalid format'
    );
  }

  parser[lines[0]](opts, ref, lines, wheelNumber, sprite);
};

parser['rw v0.0.1'] = function(opts, ref, lines, wheelNumber, sprite) {
  throw new Error("Cannot import v0.0.1, please import v0.0.2!");
};

parser['rw v0.0.2'] = function(opts, ref, lines, wheelNumber, sprite) {
  let data = JSON.parse(lines[1]);
  let soundArray = sprite.sounds.asArray()
  // check if wheel Number is valid
  if (wheelNumber < 1 || wheelNumber > data['wheelCount']){
    throw new Error("Wheel Number is invalid! Please enter positive number or valid wheel number (can't be more than 3)");
  }

  let chosenWheel = data['wheels'][wheelNumber-1];

  for (let i = 0; i < chosenWheel['size']; ++i){
    let nodeName = chosenWheel['nodes'][i];
    let sound = detect(soundArray, function(s){return s.name == nodeName});
    if (sound){
      ref.push(sound);
    }
  }
};
