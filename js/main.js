$(function(){
	var AboutMyInfo = Backbone.View.extend({
		tagName: "div",
		template: _.template($("#content").html()),
		render: function(eventName){
			$(this.el).html(this.template(JSON.stringify(content)));
			return this;
		}
	});
	var AppRouter = Backbone.Router.extend({
		routes:{
			"about": "showAbout"
		},
		showAbout: function(){
			this.myInfo = new AboutMyInfo();
			$("#content").html(this.myInfo.render().el);
		}
	});
	var app = new AppRouter();
	Backbone.history.start();
});