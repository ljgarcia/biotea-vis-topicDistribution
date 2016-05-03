/*jslint node: true */
/*jshint laxbreak: true */
'use strict';
/*
 * Licensed under the Apache 2 license.
 */
var d3 = require('d3');
var _ = require('underscore');
var BiolinksParser = require('biotea-io-parser');
var Tooltip = require('biotea-vis-tooltip');

/**
 * Private Methods
 */
var defaultOpts = {
    width: 600,
    height: 400,
    prefixID: 'PMC',
    path: undefined,
    ids: [],
    display: []
};

var displayTopics = function(viewer) {
    var labels = viewer.svg.append('g');
    labels.selectAll('.biotea_dist-topic-label')
        .data(viewer.topics)
        .enter().append('text')
        .text(function (d) { return d; })
        .attr('x', 0)
        .attr('y', function (d, i) { return i * viewer.gridSizeY; })
        .style('text-anchor', 'start')
        .attr('transform', 'translate(0,' + viewer.gridSizeY / 1.5 + ')')
        .classed('biotea_dist-topic-label', true)
        .attr('stroke', function(d) {
            return viewer.parser.getModel().model[d].color;
        })
        .on('mouseover', function(d) {
            Tooltip.create(d3.select(viewer.options.el), viewer.parser.getModel().model[d].desc, []);
        })
        .on('mouseout', function() {
            Tooltip.remove();
        });
};

var displayLegend = function(viewer) {
    var legendData = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    var legendX = Math.floor((viewer.options.width - viewer.margin.left) / legendData.length);

    var legend = viewer.svg.selectAll('.biotea_dist-legend')
        .data(legendData)
        .enter().append('g')
        .classed('biotea_dist-legend', true)
        .attr('transform', function(d, i) {
            return 'translate('
                + (viewer.margin.left + (legendX * i)) + ', '
                + (viewer.options.height - viewer.margin.bottom + 10) + ')';
        })
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', legendX)
        .attr('height', 10)
        .attr('fill', function(d) {
            return viewer.useColorArray ? viewer.options.colorArray[Math.floor(d * 10)]
                    : viewer.colorScale(d);
        });
    legend.append('text')
        .classed('biotea_dist-legend-label', true)
        .text(function(d) { return '≥ ' + d; })
        .attr('x', 0)
        .attr('y', 22);
};

var addShadow = function(viewer) {
    viewer.selection = viewer.svg.append('g').attr('class', 'biotea_dist_shadow_group');
    viewer.selection.append('rect')
        .attr('transform', 'translate(0,0)')
        .attr('class','biotea_dist_shadow')
        .attr('x', viewer.margin.left)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', 0)
    ;
};

var createTooltip = function(viewer, dist, datum) {
    var prefixedId = viewer.options.prefixID ? viewer.options.prefixID + ':' + dist.id : dist.id;
    if (datum.score) {
        Tooltip.create(d3.select(viewer.options.el), 'Article',
            [['Id', prefixedId], ['Title', dist.display], ['Score', datum.score.toFixed(3)]]);
    } else {
        Tooltip.create(d3.select(viewer.options.el), 'Article',
            [['Id', prefixedId], ['Title', dist.display]]);
    }
};

var initMatrix = function(viewer, dist) {
    var cards = viewer.svg.append('g')
        .attr('transform', 'translate(' + viewer.margin.left + ', 0)')
        .attr('class', 'biotea_dist_group')
        .selectAll('.biotea_dist')
        .data(dist.data).enter().append('rect')
        .attr('x', function() {
            return _.indexOf(viewer.options.ids, dist.id) * viewer.gridSizeX;
        })
        .attr('y', function(d) {
            return _.indexOf(viewer.topics, d.group) * viewer.gridSizeY;
        })
        .attr('class', 'biotea_dist')
        .attr('width', viewer.gridSizeX)
        .attr('height', viewer.gridSizeY)
        .style('stroke', 'white')
        .style('fill', function(d) {
            return d.score ? viewer.useColorArray
                ? viewer.options.colorArray[Math.floor(d.score * 10)] : viewer.colorScale(d.score)
                : 'white';
        })
        .on('mouseover', function(d) {
            createTooltip(viewer, dist, d);
        })
        .on('mousemove', function(d) {
            createTooltip(viewer, dist, d);
        })
        .on('mouseout', function() {
            Tooltip.remove();
        })
        .on('click', function(d) {
            if (!viewer.selection) {
                addShadow(viewer);
            }
            d3.selectAll('.biotea_dist_shadow')
                .attr('transform', 'translate(' + _.indexOf(viewer.options.ids, dist.id) * viewer.gridSizeX + ',0)')
                .attr('width', viewer.gridSizeX)
                .attr('height', viewer.gridSizeY * viewer.topics.length);
            viewer.parser.getDispatcher().selected({
                type: 'distribution',
                article: dist.id,
                group: d.group,
                score: d.score ? d.score.toFixed(3) : d.score
            });
        });
    ;
};

var cleanView = function(viewer) {
    d3.select(viewer.options.el).selectAll('.biotea_dist_group').remove();
    d3.select(viewer.options.el).selectAll('.biotea_dist_shadow_group').remove();
    viewer.selection = undefined;
};

var TopicDistributionViewer = function(opts){
    var viewer = this;
    viewer.parser = new BiolinksParser();
    viewer.data = [];
    viewer.options = _.extend({}, defaultOpts, opts);
    viewer.topics = _.keys(viewer.parser.getModel().model);
    viewer.useColorArray = viewer.options.colorArray ? true : false;
    viewer.colorScale = d3.scale.linear()
        .domain([0, 1])
        .range(['#ccffcc', '#000099'])
        .clamp(true);

    viewer.margin = {left: 40, bottom: 40};
    viewer.gridSizeX = Math.floor((viewer.options.width-viewer.margin.left) / viewer.options.ids.length);
    viewer.gridSizeY = Math.floor((viewer.options.height-viewer.margin.bottom) / viewer.topics.length);
    viewer.selection = undefined;

    d3.select(viewer.options.el).selectAll('*').remove();
    viewer.svg = d3.select(viewer.options.el).append('svg')
        .attr('width', viewer.options.width)
        .attr('height', viewer.options.height);

    viewer.loadURL = function() {
        cleanView(viewer);
        _.each(viewer.options.ids, function(id, index) {
            var loader = viewer.parser.loadDistribution(viewer.options.path, id, viewer.options.display[index]);
            loader.done(function(loadedData) {
                initMatrix(viewer, loadedData.dist);
            }).fail( function(e) {
                console.log(e);
            });
        });
    };

    viewer.loadData = function(distArray) {
        cleanView(viewer);
        viewer.options.ids = _.pluck(distArray, 'id');
        viewer.gridSizeX = Math.floor((viewer.options.width-viewer.margin.left) / viewer.options.ids.length);
        _.each(distArray, function(dist) {
            initMatrix(viewer, dist);
        });
    };

    viewer.render = function() {
        var viewer = this;
        if (viewer.options.path && viewer.options.ids) {
            displayTopics(viewer);
            displayLegend(viewer);
            viewer.loadURL();
        } else if (viewer.options.data) {
            displayTopics(viewer);
            displayLegend(viewer);
            viewer.loadData(viewer.options.data);
        }
    };

    viewer.setPath = function(path) {
        this.options.path = path;
    };

    viewer.setIds = function(ids, displays) {
        this.options.ids = ids;
        this.options.display = displays ? displays : [];
        viewer.gridSizeX = Math.floor((viewer.options.width-viewer.margin.left) / viewer.options.ids.length);
        viewer.gridSizeY = Math.floor((viewer.options.height-viewer.margin.bottom) / viewer.topics.length);
    };

    viewer.setPrefix = function(prefix) {
        this.options.prefixID = prefix;
    };

    viewer.setData = function(distArray) {
        viewer.options.ids = _.pluck(distArray, 'id');
        viewer.gridSizeX = Math.floor((viewer.options.width-viewer.margin.left) / viewer.options.ids.length);
        this.options.data = distArray;
    };

    viewer.getDispatcher = function() {
        return this.parser.getDispatcher();
    };

    viewer.render();
};

module.exports = TopicDistributionViewer;