export const sprites = {
  branch: [0, 0, 1354, 656],
  flower: [44, 846, 262, 236],
  profile: [368, 847, 229, 224],
  pair: [651, 850, 291, 232],
  cluster: [971, 900, 246, 168],
  bud: [122, 1115, 82, 110],
  fullBud: [420, 1108, 100, 119],
  petal: [722, 1124, 122, 94],
  petalAngled: [1002, 1122, 95, 99],
  petalSmall: [1125, 1134, 77, 84],
};

// These atlas coordinates identify the stems' bases or the face-on flower's center.
export const spriteAnchors = {
  flower: [174, 970],
  profile: [377, 1051],
  pair: [807, 1054],
  cluster: [1097, 1054],
  bud: [132, 1214],
  fullBud: [430, 1216],
};

// Each entry is a point on the unmirrored branch, followed by its sprite, width, and rotation.
export const growth = [
  [226, 336, "profile", 45, 9],
  [254, 424, "flower", 39, -17],
  [281, 500, "pair", 60, -68],
  [259, 557, "profile", 50, -96],
  [303, 603, "fullBud", 32, 131],
  [338, 555, "cluster", 62, 105],
  [378, 567, "fullBud", 31, 99],

  [368, 393, "flower", 54, 9],
  [401, 376, "pair", 71, -15],
  [435, 374, "profile", 47, 5],
  [438, 413, "cluster", 60, 93],
  [476, 410, "bud", 19, 67],
  [477, 533, "profile", 44, 98],
  [527, 499, "flower", 47, 7],
  [567, 445, "cluster", 60, -29],
  [599, 432, "profile", 55, 14],
  [645, 532, "flower", 55, -18],
  [680, 561, "pair", 71, -115],
  [703, 600, "profile", 53, -82],
  [751, 589, "flower", 45, 15],
  [793, 606, "cluster", 59, 103],

  [670, 401, "flower", 58, -6],
  [707, 376, "cluster", 76, -25],
  [719, 450, "profile", 50, 97],
  [756, 433, "fullBud", 36, 56],
  [776, 337, "pair", 72, -27],
  [782, 304, "profile", 53, -30],
  [819, 298, "fullBud", 34, 27],
  [845, 341, "flower", 55, 22],
  [882, 323, "pair", 72, 14],
  [920, 313, "fullBud", 31, 47],
  [895, 357, "profile", 55, 84],
  [817, 474, "cluster", 66, 14],
  [779, 495, "flower", 46, -23],
  [876, 554, "pair", 62, 147],
  [926, 491, "flower", 50, -9],
  [1000, 510, "profile", 52, 94],

  [1001, 456, "cluster", 64, -27],
  [1050, 445, "flower", 59, 14],
  [1106, 474, "profile", 54, 99],
  [1097, 369, "pair", 76, -26],
  [1147, 376, "flower", 58, 13],
  [1196, 349, "profile", 57, -16],
  [1217, 379, "fullBud", 33, 14],
  [1247, 414, "pair", 69, 147],
  [1270, 321, "cluster", 66, -14],
  [1305, 335, "fullBud", 31, 50],
  [1281, 421, "profile", 50, 91],
  [1331, 429, "bud", 19, 84],

  [448, 369, "bud", 17, 53],
  [464, 418, "bud", 18, 104],
  [484, 538, "bud", 18, 125],
  [713, 613, "bud", 17, 130],

  [821, 619, "bud", 18, 102],
  [938, 317, "bud", 18, 77],

  [912, 549, "bud", 18, 80],

  [1139, 460, "bud", 18, 64],
  [1222, 335, "bud", 17, 46],

  [1321, 344, "bud", 17, 92],
];

export const petals = [
  [104, 340, "petalSmall", 18, 8, -3, -75],
  [252, 278, "petal", 19, 9, -7, -116],
  [378, 385, "petalAngled", 16, 8.5, -1, -94],
  [511, 312, "petalSmall", 15, 9, -3, -65],
  [620, 406, "petal", 22, 10, -6, -115],
  [816, 362, "petalAngled", 19, 9.5, -2, -105],
  [1050, 385, "petal", 20, 8.5, -5, -120],
];
