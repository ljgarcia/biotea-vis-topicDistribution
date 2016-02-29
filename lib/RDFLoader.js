var jQuery = require('jquery');
var _ = require('underscore');
var EventController = require('./EventController');

var RDFLoader = function() {
    return {
        get: function(path, id) {
            return jQuery.ajax({
                url: path + id + '_distribution.json',
                dataType: 'json'
            }).done(function(d) {
                d.data = [];
                _.each(d['@graph'], function(elem) {
                    if (elem['@type'] === 'biotea:Topic') {
                        d.data.push({
                            id: id,
                            group: elem['rdfs:label'],
                            score: elem['biotea:score']
                        });
                    }
                });
                EventController.dispatcher.ready({
                    request: path + id + '_distribution.json',
                    data: d.data
                });
                return d;
            }).fail(function(e) {
                console.log('Error loading: ' + id);
                EventController.dispatcher.failed({
                    request: path + id + '_distribution.json'
                });
                return e;
            });
        }
    };
}();

module.exports = RDFLoader;