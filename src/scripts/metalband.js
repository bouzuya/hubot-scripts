// Description
//  metalband
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot metalband me - display bran new Metal Band name
//
// Notes:
//   None
//
// Author:
//   Hideaki Miyake
//
module.exports = function(robot) {
  // pattern 1 : put two band words
  // pattern 2 : put three band words

  // http://www.invisibleoranges.com/2014/02/the-100-most-overused-metal-band-name-words-according-to-metal-archives/
  var getBandWord = function(res) {
    var bandWords1 = [
      "Death",
      "Black",
      "Dark",
      "Blood",
      "Dead",
      "Hell",
      "War",
      "Necro",
      "Soul",
      "Night",
      "Fall",
      "Hate",
      "God",
      "Evil",
      "Kill",
      "Fire",
      "Storm",
      "Rain",
      "Lord",
      "Head",
      "Metal",
      "Human",
      "Light",
      "Moon",
      "Winter"
    ];

    var bandWords2 = [
      "Shadow",
      "Demon",
      "Satan",
      "Pain",
      "Eternal",
      "Dream",
      "Burn",
      "Witch",
      "Chaos",
      "Flesh",
      "Cult",
      "Goat",
      "Rage",
      "Terror",
      "Force",
      "Fear",
      "Throne",
      "Wolf",
      "Stone",
      "Christ",
      "Steel",
      "Rot",
      "Funeral",
      "Torment",
      "Ritual"
    ];

    var bandWords3 = [
      "Cross",
      "Gate",
      "Frost",
      "Gore",
      "Doom",
      "Corpse",
      "Beyond",
      "Crypt",
      "Infernal",
      "Wind",
      "Brain",
      "Lost",
      "Grim",
      "Ash",
      "Iron",
      "Face",
      "Raven",
      "Spirit",
      "Morbid",
      "Forest",
      "Sick",
      "Cold",
      "Skull",
      "Anger"
    ];

    var bandWords4 = [
      "Fuck",
      "Fallen",
      "Grind",
      "Devil",
      "Ruin",
      "Thrash",
      "Suffer",
      "Murder",
      "Divine",
      "Slaughter",
      "Brutal",
      "Child",
      "Nocturnal",
      "Sorrow",
      "Psycho",
      "Torture",
      "Wrath",
      "Serpent",
      "Agony",
      "Slave",
      "Heaven",
      "Circle",
      "Grace",
      "Noise",
      "Ancient",
      "Dragon",
      "Hand"
    ];

    var rand = Math.random();
    var word = "";
    if (rand <= 0.1) {
      // 10%
      word = res.random(bandWords4);
    } else if (rand <= 0.3) {
      // 20%
      word = res.random(bandWords3);
    } else if (rand <= 0.6) {
      // 30%
      word = res.random(bandWords2);
    } else {
      // 40%
      word = res.random(bandWords1);
    }
    return word;
  };

  robot.respond(/metalband\s+me/i, function(res) {
    var rand = Math.random();
    var bandName = "";
    if (rand <= 0.4) {
      // pattern 2
      bandName = getBandWord(res) + " " + getBandWord(res) + " " + getBandWord(res);
    } else {
      // pattern 1
      bandName = getBandWord(res) + " " + getBandWord(res);
    }

    res.send(bandName);
  });
};

