(function() {
  var template = Handlebars.template, templates = OCA.CustomGroups.Templates = OCA.CustomGroups.Templates || {};
templates['membersInput'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"oco-feldpaar\">\n	<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"inputId") || (depth0 != null ? lookupProperty(depth0,"inputId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputId","hash":{},"data":data,"loc":{"start":{"line":3,"column":13},"end":{"line":3,"column":24}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"labelText") || (depth0 != null ? lookupProperty(depth0,"labelText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"labelText","hash":{},"data":data,"loc":{"start":{"line":3,"column":26},"end":{"line":3,"column":39}}}) : helper)))
    + "</label>\n	<div class=\"oco-feldreihe\">\n		<input id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"inputId") || (depth0 != null ? lookupProperty(depth0,"inputId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputId","hash":{},"data":data,"loc":{"start":{"line":5,"column":13},"end":{"line":5,"column":24}}}) : helper)))
    + "\" class=\"member-input-field\" type=\"text\" />\n		<span class=\"loading icon-loading-small hidden\"></span>\n	</div>\n</div>\n\n";
},"useData":true});
})();