/*jslint node: true */
/*jshint laxbreak: true */
'use strict';
/*
 * Licensed under the Apache 2 license.
 */
var d3 = require('d3');
var _ = require('underscore');
var jQuery = require('jquery');
var RDFLoader = require('./RDFLoader');
var EventController = require('./EventController');

/**
 * Private Methods
 */
var defaultOpts = {
    width: 600,
    height: 400,
    path: undefined,
    ids: []
};

var displayTopics = function(viewer, gridSizeY) {
    var labels = viewer.svg.append('g');
    labels.selectAll('.biotea-topic-label')
      .data(viewer.topics)
      .enter().append('text')
        .text(function (d) { return d; })
        .attr('x', 0)
        .attr('y', function (d, i) { return i * gridSizeY; })
        .style('text-anchor', 'start')
        .attr('transform', 'translate(0,' + gridSizeY / 1.5 + ')')
        .classed('biotea-topic-label', true);
};

var displayLegend = function(viewer, margin) {
    var legendData = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    var legendX = Math.floor((viewer.options.width - margin.left) / legendData.length);
    var legend = viewer.svg.selectAll('.biotea-legend')
        .data(legendData)
        .enter().append('g')
        .classed('biotea-legend', true)
        .attr('transform', function(d, i) {
            return 'translate('
                + (margin.left + legendX*i) + ', '
                + (viewer.options.height - margin.bottom + 10) + ')';
        })
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', legendX)
        .attr('height', 10)
        .attr('fill', function(d) {
            return viewer.colorScale[Math.floor(d*10)];
        });
    legend.append('text')
        .classed('biotea-legend-label', true)
        .text(function(d) { return '≥ ' + d; })
        .attr('x', 0)
        .attr('y', 22);
};

var addShadow = function(viewer) {
    viewer.selection = viewer.svg.append('g');
    viewer.selection.append('rect')
        .attr('transform', 'translate(0,0)')
        .attr('class','biotea_score_shadow')
        .attr('x', viewer.margin.left)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', 0)
    ;
};

var TopicDistributionViewer = function(opts){
    var viewer = this;
    viewer.data = [];
    viewer.options = _.extend({}, defaultOpts, opts);
    viewer.topics = ['ACTI', 'ANAT', 'CHEM', 'CONC', 'DEVI', 'DISO', 'DRUG', 'GENE', 'GEOG', 'GNPT', 'OBJC', 'OBSV',
        'OCCU', 'ORGA', 'PEOP', 'PHEN', 'PHYS', 'PROC', 'SYMP', 'TAXA'];
    viewer.colorScale = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'];

    viewer.margin = {left: 40, bottom: 40};
    viewer.gridSizeX = Math.floor((viewer.options.width-viewer.margin.left) / viewer.options.ids.length);
    viewer.gridSizeY = Math.floor((viewer.options.height-viewer.margin.bottom) / viewer.topics.length);

    d3.select(viewer.options.el).selectAll('*').remove();
    viewer.svg = d3.select(viewer.options.el).append('svg')
        .attr('width', viewer.options.width)
        .attr('height', viewer.options.height);

    viewer.load = function() {
        d3.select(viewer.options.el).selectAll('.biotea_score_group').remove();
        d3.select(viewer.options.el).selectAll('.biotea_score').remove();
        d3.select(viewer.options.el).selectAll('.biotea_score_shadow').remove();
        _.each(viewer.options.ids, function(id) {
            var loader = RDFLoader.get(viewer.options.path, id);
            loader.done(function(loadedData) {
                var cards = viewer.svg.append('g')
                    .attr('transform', 'translate(' + viewer.margin.left + ', 0)')
                    .attr('class', 'biotea_score_group')
                    .selectAll('.biotea_score')
                    .data(loadedData.data).enter().append('rect')
                    .attr('x', function(d) {
                        return _.indexOf(viewer.options.ids, d.id) * viewer.gridSizeX;
                    })
                    .attr('y', function(d) {
                        return _.indexOf(viewer.topics, d.group) * viewer.gridSizeY;
                    })
                    .attr('class', 'biotea_score')
                    .attr('width', viewer.gridSizeX)
                    .attr('height', viewer.gridSizeY)
                    .style('stroke', 'white')
                    .style('fill', function(d) {return viewer.colorScale[Math.floor(d.score*10)];})
                    .attr('title', function(d) {return 'Article: ' + d.id + ', score: ' + d.score.toFixed(3)})
                    .on('click', function(d) {
                        if (!viewer.selection) {
                            addShadow(viewer);
                        }
                        d3.selectAll('.biotea_score_shadow')
                            .attr('transform', 'translate(' + _.indexOf(viewer.options.ids, d.id) * viewer.gridSizeX + ',0)')
                            .attr('width', viewer.gridSizeX)
                            .attr('height', viewer.gridSizeY * viewer.topics.length);
                        EventController.dispatcher.selected({
                            article: d.id,
                            group: d.group,
                            score: d.score.toFixed(3)
                        });
                    });
                ;
            }).fail( function(e) {
                console.log(e);
            });
        });
    };

    viewer.render = function() {
        var viewer = this;
        if (viewer.options.path && viewer.options.ids) {
            displayTopics(viewer, viewer.gridSizeY);
            displayLegend(viewer, viewer.margin);
            viewer.load();
        }
    };

    viewer.setPath = function(path) {
        this.options.path = path;
    };

    viewer.setIds = function(ids) {
        this.options.ids = ids;
        viewer.gridSizeX = Math.floor((viewer.options.width-viewer.margin.left) / viewer.options.ids.length);
        viewer.gridSizeY = Math.floor((viewer.options.height-viewer.margin.bottom) / viewer.topics.length);
    };

    viewer.getDispatcher = function() {
        return EventController.dispatcher;
    };

    viewer.render();
};

module.exports = TopicDistributionViewer;