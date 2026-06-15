(function() {
  var template = Handlebars.template, templates = OCA.CustomGroups.Templates = OCA.CustomGroups.Templates || {};
templates['membersInput'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div>\r\n	<input class=\"member-input-field\" type=\"text\" placeholder=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"placeholderText") || (depth0 != null ? lookupProperty(depth0,"placeholderText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholderText","hash":{},"data":data,"loc":{"start":{"line":2,"column":60},"end":{"line":2,"column":79}}}) : helper)))
    + "\" aria-label=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"placeholderText") || (depth0 != null ? lookupProperty(depth0,"placeholderText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholderText","hash":{},"data":data,"loc":{"start":{"line":2,"column":93},"end":{"line":2,"column":112}}}) : helper)))
    + "\" />\r\n	<span class=\"loading icon-loading-small hidden\"></span>\r\n</div>\r\n\r\n";
},"useData":true});
})();
