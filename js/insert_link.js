/*
	sole purpose for this code is to add link to images without messing with the bootstrap css
*/

(function(){
	
	$(function(){
		$(".nav li img").each(function(index){
			$(this).on("click", function(){
				var redirect;
				switch($(this).attr("src"))
				{
					case "images/FB.png": redirect = "https://www.facebook.com/allenliuzihao"; break;
					case "images/wordpress.png": redirect = "http://zliu224.wordpress.com/"; break;
					case "images/linkedin.png": redirect = "http://www.linkedin.com/pub/zihao-liu/42/a16/83b"; break;
					case "images/github.png": redirect = "http://www.github.com/ZihaoAllen"; break;
				}
				window.open(redirect);
			});
		});
	});
})();


