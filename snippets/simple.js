// if you don't specify a html file, the sniper will generate a div
var app = require("biotea-vis-topicDistribution");
var instance = new app({
    el: yourDiv,
    path: 'http://localhost:9090/snippets/data/',
    ids: [13914, 32300]
    //, colorArray: ['#FFFF99', '#FFECB3', '#C6FFB3', '#99FF99', '#118882', '#3D4DA8', '#141B9F', '#471188', '#710E45', '#7B0F15']
    , display: ['art1 dfsdf asfds sdfds asdfds fasdfds asfddsfa dsfds f adsfadsf dsfds sfdsf afdsfads afdsfdsa ' +
        'dsfdsfads dsfdsaf asdfdsf asf', 'art2']
    //[3054140,3054057,3053896,2134811,2141630,3054328,2150137,2212285,2150417,3054509,2149344,2133073,2133187,2133138,2156123,2174229,2174811,2174559,13914,2174359,2196003,2185520,2174343,32300,55328,2150807,2198828,59472,59693,60307,64840,2375280,138716,115254,115224,2174057,117238,2173124,2173840,122059,126238,126242,126873,130049,133446,244923,151173,2172646,2376773,2173363,153502,2172872,165429,166151,194174,200968,212256,222958,2173966,2173440,2394332,2173538]
});

instance.getDispatcher().on('ready', function(d) {
    console.log('ready');
    console.log(d);
});