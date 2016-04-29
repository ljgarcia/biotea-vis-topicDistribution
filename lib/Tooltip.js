/*jslint node: true */
/*jshint laxbreak: true */
"use strict";
/*
 * Copyright (c) 2015 ljgarcia
 * Licensed under the Apache 2 license.
 */

var d3 = require('d3');

var Tooltip = function() {
    return {
        create: function(container, datum, prefix) {
            d3.select('.biotea_annot_tooltip').remove();
            var tooltipContainer = container.append("div")
                .attr("class", "biotea_annot_tooltip");

            tooltipContainer
                .style('left', (d3.event.pageX + 10) + 'px')
                .style('top', (d3.event.pageY) + 'px')
                .transition(200)
                .style('opacity', 1)
                .style('display','block');

            var table = tooltipContainer.append('table').classed('biotea_annot_tooltip_table', true);

            var headRow = table.append('tr').classed('biotea_annot_tooltip_header', true);
            headRow.append('th').attr('colspan', '2').text('Article');

            var rowTerm = table.append('tr').classed('biotea_annot_tooltip_body', true);
            rowTerm.append('td').text('Id');
            rowTerm.append('td').text(function() {
                return prefix ? prefix + ':' + datum.id : datum.id;
            });

            var headRow = table.append('tr').classed('biotea_annot_tooltip_header', true);
            headRow.append('td').text('Title');
            headRow.append('td').text(datum.display);

            if (datum.score) {
                var rowCui = table.append('tr').classed('biotea_annot_tooltip_body', true);
                rowCui.append('td').text('Score');
                rowCui.append('td').text(datum.score.toFixed(3));
            }
        },
        remove: function() {
            var tooltipContainer = d3.select('.biotea_annot_tooltip');
            tooltipContainer.transition(20)
                .style('opacity',0)
                .style('display','none');
            tooltipContainer.remove();
        }
    };
}();

module.exports = Tooltip;