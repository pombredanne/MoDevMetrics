ProductFilter = function(){
	this.Refresh();
};


ProductFilter.makeFilter = function(){
	return ES.makeFilter("product", state.selectedProducts);
};//method


ProductFilter.makeQuery = function(filters){
	var output = {
		"query" : {
			"filtered" : {
				"query": {
					"match_all":{}
				},
				"filter" : {
					"and":[
						{ "range" : { "expires_on" : { "gt" : Date.now().getMilli() } } },
						{"not" : {"terms" : { "bug_status" : ["resolved", "verified", "closed"] }}}
					]
				}
			}
		},
		"from": 0,
		"size": 0,
		"sort": [],
		"facets":{
			"Products": {
				"terms": {
					"field": "product",
					"size": 100000
				}
			}
		}
	};

	var and = output.query.filtered.filter.and;
	for(var f=0;f<filters.length;f++) and.push(filters[f]);

	return output;
};//method


ProductFilter.prototype.Refresh = function(){
	this.query = ProductFilter.makeQuery([
//		ProgramFilter.makeFilter(state.selectedPrograms)
	]);

	this.ElasticSearchQuery = OldElasticSearchQuery(this, 0, this.query);
	this.results = null;
	this.ElasticSearchQuery.Run();
};


ProductFilter.prototype.injectHTML = function(products){
	var html = '<ul id="productsList" class="menu ui-selectable">';
	var item = '<li class="{class}" id="product_{name}">{name} ({count})</li>';

	//GIVE USER OPTION TO SELECT ALL PRODUCTS
	var total = 0;
	for(var i = 0; i < products.length; i++) total += products[i].count;
	html += item.replaceVars({
		"class" : ((state.selectedProducts.length == 0) ? "ui-selectee ui-selected" : "ui-selectee"),
		"name" : "ALL",
		"count" : total
	});

	//LIST SPECIFIC PRODUCTS
	for(var i = 0; i < products.length; i++){
		html += item.replaceVars({
			"class" : (include(state.selectedProducts, products[i].term) ? "ui-selectee ui-selected" : "ui-selectee"),
			"name" : products[i].term,
			"count" : products[i].count
		});
	}//for

	html += '</ul>';

	$("#products").html(html);
};


ProductFilter.prototype.success = function(data){

	var products = data.facets.Products.terms;

	//REMOVE ANY FILTERS THAT DO NOT APPLY ANYMORE (WILL START ACCUMULATING RESULTING IN NO MATCHES)
	var terms = [];
	for(var i = 0; i < products.length; i++) terms.push(products[i].term);
	state.selectedProducts = List.intersect(state.selectedProducts, terms);

	var self=this;

	aThread.run(function(){
		self.injectHTML(products);

		$("#productsList").selectable({
			selected: function(event, ui){
				var didChange = false;
				if (ui.selected.id == "product_ALL"){
					if (state.selectedProducts / length > 0) didChange = true;
					state.selectedProducts = [];
					state.selectedClassifications=[];
				} else{
					if (!include(state.selectedProducts, ui.selected.id.rightBut("product_".length))){
						state.selectedProducts.push(ui.selected.id.rightBut("product_".length));
						didChange = true;
					}//endif
				}//endif

				if (didChange){
					GUI.State2URL();
					state.programFilter.Refresh();
					state.classificationFilter.Refresh();
					state.productFilter.Refresh();
					state.componentFilter.Refresh();
				}//endif
			},
			unselected: function(event, ui){
				var i = state.selectedProducts.indexOf(ui.unselected.id.rightBut("product_".length));
				if (i != -1){
					state.selectedProducts.splice(i, 1);
					state.selectedClassifications=[];
					GUI.State2URL();
					state.programFilter.Refresh();
					state.classificationFilter.Refresh();
					state.productFilter.Refresh();
					state.componentFilter.Refresh();
				}
			}
		});

		yield (null);
	});
	
};

