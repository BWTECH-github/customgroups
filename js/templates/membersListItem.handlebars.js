(function() {
  var template = Handlebars.template, templates = OCA.CustomGroups.Templates = OCA.CustomGroups.Templates || {};
templates['membersListItem'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<a href=\"#\" role=\"button\" class=\"action-change-member-role icon icon-rename\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"changeMemberRoleLabel") || (depth0 != null ? lookupProperty(depth0,"changeMemberRoleLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"changeMemberRoleLabel","hash":{},"data":data,"loc":{"start":{"line":10,"column":85},"end":{"line":10,"column":110}}}) : helper)))
    + "\"><span class=\"hidden-visually\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"changeMemberRoleLabel") || (depth0 != null ? lookupProperty(depth0,"changeMemberRoleLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"changeMemberRoleLabel","hash":{},"data":data,"loc":{"start":{"line":10,"column":142},"end":{"line":10,"column":167}}}) : helper)))
    + "</span></a>\r\n	<span class=\"loading icon-loading-small hidden\"></span>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href=\"#\" role=\"button\" class=\"action action-delete-member\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"deleteLabel") || (depth0 != null ? lookupProperty(depth0,"deleteLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"deleteLabel","hash":{},"data":data,"loc":{"start":{"line":14,"column":90},"end":{"line":14,"column":105}}}) : helper)))
    + "\"><span class=\"icon icon-delete\"></span><span class=\"hidden-visually\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"deleteLabel") || (depth0 != null ? lookupProperty(depth0,"deleteLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"deleteLabel","hash":{},"data":data,"loc":{"start":{"line":14,"column":175},"end":{"line":14,"column":190}}}) : helper)))
    + "</span></a>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<tr class=\"group-member\" data-id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":4,"column":34},"end":{"line":4,"column":40}}}) : helper)))
    + "\" tabindex=\"0\">\r\n	<td class=\"avatar-column\"><div class=\"avatar\" aria-hidden=\"true\"></div></td>\r\n	<td class=\"user-display-name\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"displayName") || (depth0 != null ? lookupProperty(depth0,"displayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data,"loc":{"start":{"line":7,"column":38},"end":{"line":7,"column":53}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"displayName") || (depth0 != null ? lookupProperty(depth0,"displayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data,"loc":{"start":{"line":7,"column":55},"end":{"line":7,"column":70}}}) : helper)))
    + "</td>\r\n	<td><span class=\"role-display-name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"roleDisplayName") || (depth0 != null ? lookupProperty(depth0,"roleDisplayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"roleDisplayName","hash":{},"data":data,"loc":{"start":{"line":8,"column":37},"end":{"line":8,"column":56}}}) : helper)))
    + "</span>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"canAdmin") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":1},"end":{"line":12,"column":8}}})) != null ? stack1 : "")
    + "	</td>\r\n	<td>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"canAdmin") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":5},"end":{"line":14,"column":208}}})) != null ? stack1 : "")
    + "</td>\r\n</tr>\r\n";
},"useData":true});
})();