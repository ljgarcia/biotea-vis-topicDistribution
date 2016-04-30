// if you don't specify a html file, the sniper will generate a div
var app = require("biotea-vis-topicDistribution");

var data =
[{"id":"13914","display":"art PMC:13914","data":[{"group":"ACTI","score":0.04356778319035927},
{"group":"ANAT","score":0.04356173312957109},{"group":"CHEM","score":0.043561631407068924},
{"group":"CONC","score":0.13500256561572108},{"group":"DEVI","score":0.04356154912376192},
{"group":"DISO","score":0.044992692591424154},{"group":"DRUG","score":0.043561493702304825},
{"group":"GENE","score":0.04356817857834065},{"group":"GEOG","score":0.043561474259248154},
{"group":"GNPT","score":0.0692692054082814},{"group":"OBJC","score":0.04356176915978535},
{"group":"OBSV","score":0.0485693702222183},{"group":"OCCU","score":0.043561482195267176},
{"group":"ORGA","score":0.04356147060230869},{"group":"PEOP","score":0.04442762163817625},
{"group":"PHEN","score":0.04356272089558198},{"group":"PHYS","score":0.04356644152189481},
{"group":"PROC","score":0.047415740148008},{"group":"SYMP","score":0.04400338389007021},
{"group":"TAXA","score":0.0435616927206079}]},
{"id":"32300","display":"art PMC:32300","data":[{"group":"ACTI","score":0.048066543290029407},
{"group":"ANAT","score":0.047076707109397965},{"group":"CHEM","score":0.04708821513213022},
{"group":"CONC","score":0.04792212726324992},{"group":"DEVI","score":0.047079991076602504},
{"group":"DISO","score":0.04708621881990344},{"group":"DRUG","score":0.04707673783847239},
{"group":"GENE","score":0.04791619225370252},{"group":"GEOG","score":0.04707628325518388},
{"group":"GNPT","score":0.06421473829913124},{"group":"OBJC","score":0.0500361881198701},
{"group":"OBSV","score":0.04707638524684271},{"group":"OCCU","score":0.04707628285027504},
{"group":"ORGA","score":0.04707628154907158},{"group":"PEOP","score":0.047076298286077935},
{"group":"PHEN","score":0.054267500232177905},{"group":"PHYS","score":0.06322829588038062},
{"group":"PROC","score":0.05940585192680586},{"group":"SYMP","score":0.047076733872664075},
{"group":"TAXA","score":0.047076427698030936}]}];

var instance = new app({
    el: yourDiv,
    data: data
});

instance.getDispatcher().on('ready', function(d) {
    console.log('ready');
    console.log(d);
});



