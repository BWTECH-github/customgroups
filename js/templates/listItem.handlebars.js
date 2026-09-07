(function() {
  var template = Handlebars.template, templates = OCA.CustomGroups.Templates = OCA.CustomGroups.Templates || {};
templates['listItem'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "			<a href=\"#\" role=\"button\" class=\"action-rename-group icon icon-rename\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"renameLabel") || (depth0 != null ? lookupProperty(depth0,"renameLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"renameLabel","hash":{},"data":data,"loc":{"start":{"line":14,"column":81},"end":{"line":14,"column":96}}}) : helper)))
    + "\"><span class=\"hidden-visually\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"renameLabel") || (depth0 != null ? lookupProperty(depth0,"renameLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"renameLabel","hash":{},"data":data,"loc":{"start":{"line":14,"column":128},"end":{"line":14,"column":143}}}) : helper)))
    + "</span></a>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href=\"#\" role=\"button\" class=\"action-delete-group icon icon-delete\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"deleteLabel") || (depth0 != null ? lookupProperty(depth0,"deleteLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"deleteLabel","hash":{},"data":data,"loc":{"start":{"line":19,"column":99},"end":{"line":19,"column":114}}}) : helper)))
    + "\"><span class=\"hidden-visually\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"deleteLabel") || (depth0 != null ? lookupProperty(depth0,"deleteLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"deleteLabel","hash":{},"data":data,"loc":{"start":{"line":19,"column":146},"end":{"line":19,"column":161}}}) : helper)))
    + "</span></a>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<tr class=\"group select\" data-id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":6,"column":34},"end":{"line":6,"column":40}}}) : helper)))
    + "\" tabindex=\"0\">\r\n	<td class=\"avatar-column\"><div class=\"avatar\" aria-hidden=\"true\"></div></td>\r\n	<td class=\"display-name\">\r\n		<span class=\"display-name-container\">\r\n			<span class=\"group-display-name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"displayName") || (depth0 != null ? lookupProperty(depth0,"displayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data,"loc":{"start":{"line":12,"column":36},"end":{"line":12,"column":51}}}) : helper)))
    + "</span>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"canAdmin") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":3},"end":{"line":15,"column":10}}})) != null ? stack1 : "")
    + "		</span>\r\n	</td>\r\n	<td class=\"role-display-name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"roleDisplayName") || (depth0 != null ? lookupProperty(depth0,"roleDisplayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"roleDisplayName","hash":{},"data":data,"loc":{"start":{"line":18,"column":31},"end":{"line":18,"column":50}}}) : helper)))
    + "</td>\r\n	<td>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"canAdmin") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":5},"end":{"line":19,"column":179}}})) != null ? stack1 : "")
    + "</td>\r\n</tr>\r\n";
},"useData":true});
})();