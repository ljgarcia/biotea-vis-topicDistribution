var jQuery = require('jquery');
var _ = require('underscore');

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
                return d;
            }).fail(function(e) {
                console.log('Error loading: ' + id);
                return e;
            });
        }
    };
}();

module.exports = RDFLoader;