// if you don't specify a html file, the sniper will generate a div
var app = require("biotea-vis-topicDistribution");

var instance = new app({
    el: yourDiv,
    path: 'http://localhost:9090/snippets/data/',
    ids: [13914, 32300]
    //, colorArray: ['#FFFF99', '#FFECB3', '#C6FFB3', '#99FF99', '#118882', '#3D4DA8', '#141B9F', '#471188', '#710E45', '#7B0F15']
    , display: ['art1 dfsdf asfds sdfds asdfds fasdfds asfddsfa dsfds f adsfadsf dsfds sfdsf afdsfads afdsfdsa ' +
    //    'dsfdsfads dsfdsaf asdfdsf asf', 'art2']
});

instance.getDispatcher().on('ready', function(d) {
    console.log('ready');
    console.log(d);
});



