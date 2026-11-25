(function() {
  var template = Handlebars.template, templates = OCA.CustomGroups.Templates = OCA.CustomGroups.Templates || {};
templates['list'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<form name=\"customGroupsCreationForm\" novalidate>\n	<div class=\"oco-feldpaar\">\n		<label for=\"customgroups-new-group-name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"groupNameLabel") || (depth0 != null ? lookupProperty(depth0,"groupNameLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupNameLabel","hash":{},"data":data,"loc":{"start":{"line":8,"column":43},"end":{"line":8,"column":61}}}) : helper)))
    + "</label>\n		<div class=\"oco-feldreihe\">\n			<input type=\"text\" id=\"customgroups-new-group-name\" name=\"groupName\" required autocomplete=\"off\" autocapitalize=\"off\" autocorrect=\"off\">\n			<input type=\"submit\" value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"newGroupSubmitLabel") || (depth0 != null ? lookupProperty(depth0,"newGroupSubmitLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"newGroupSubmitLabel","hash":{},"data":data,"loc":{"start":{"line":11,"column":31},"end":{"line":11,"column":54}}}) : helper)))
    + "\" />\n		</div>\n	</div>\n</form>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = "";

  stack1 = ((helper = (helper = lookupProperty(helpers,"canCreate") || (depth0 != null ? lookupProperty(depth0,"canCreate") : depth0)) != null ? helper : alias2),(options={"name":"canCreate","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":0},"end":{"line":15,"column":14}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"canCreate")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "<form name=\"customGroupsRenameForm\" class=\"hidden group-rename-form oco-feldpaar\" novalidate>\n	<label for=\"customgroups-rename-group-name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"groupNameLabel") || (depth0 != null ? lookupProperty(depth0,"groupNameLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupNameLabel","hash":{},"data":data,"loc":{"start":{"line":17,"column":45},"end":{"line":17,"column":63}}}) : helper)))
    + "</label>\n	<input type=\"text\" id=\"customgroups-rename-group-name\" value=\"\" required />\n</form>\n<table class=\"grid hidden\">\n<thead>\n	<tr>\n		<td></td>\n		<th scope=\"col\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"groupLabel") || (depth0 != null ? lookupProperty(depth0,"groupLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupLabel","hash":{},"data":data,"loc":{"start":{"line":26,"column":18},"end":{"line":26,"column":32}}}) : helper)))
    + "</th>\n		<th scope=\"col\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"yourRoleLabel") || (depth0 != null ? lookupProperty(depth0,"yourRoleLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"yourRoleLabel","hash":{},"data":data,"loc":{"start":{"line":27,"column":18},"end":{"line":27,"column":35}}}) : helper)))
    + "</th>\n		<td></td>\n	</tr>\n</thead>\n<tbody class=\"group-list\">\n</tbody>\n</table>\n<div class=\"empty hidden\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"emptyMessage") || (depth0 != null ? lookupProperty(depth0,"emptyMessage") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"emptyMessage","hash":{},"data":data,"loc":{"start":{"line":34,"column":26},"end":{"line":34,"column":42}}}) : helper)))
    + "</div>\n<div class=\"loading hidden\" style=\"height: 50px\"></div>\n";
},"useData":true});
})();