/// Google Analytics code
// If the user is online
if (navigator.onLine !== false) {
	if (!/^(?:localhost|(\d+\.){3}\d+)$/i.test(location.hostname)) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	} else {
		ga = function() {
			var arguments_str = new Array();
			for (var x = 0, y = arguments.length; x < y; ++ x) {
				var a = arguments[x];
				switch (typeof a) {
					case "string": arguments_str.push('"' + a + '"'); break;
					case "object": arguments_str.push(JSON.stringify(a).replace(
						/(?:({)|(",)(")|(}))/g, '$1$2\n$3$4')); break;
					default: arguments_str.push(a.toString()); break;
				}
			}
			console.log("ga(" + arguments_str.join(', ') + ")");
		}
	}
	ga('create', 'UA-67546854-4', 'auto');
	document.on('DOMContentLoaded', () => ga('send', 'pageview'));
} else {
	ga = () => {};
}