"use strict";

(function(global, $) {
    var githubProfileUrl = "https://api.github.com/users/Eartz";
    var githubReleasesUrl = "https://api.github.com/repos/Eartz/animatePaper.js/releases";
    var topDemoScope = undefined;
    var throttle = function throttle(func) {
        var ms = arguments[1] === undefined ? 50 : arguments[1];
        var context = arguments[2] === undefined ? window : arguments[2];
        var to = undefined;
        var wait = false;
        return function() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }
            var later = function later() {
                func.apply(context, args);
            };
            if (!wait) {
                later();
                wait = true;
                to = setTimeout(function() {
                    wait = false;
                }, ms);
            }
        };
    };
    var $avatar = undefined;
    var $latestRelease = undefined;
    function setTopDemo() {
        topDemoScope = paper.setup("topCanvas");
        var line = new paper.Path.Line(new paper.Point(0, 0), new paper.Point(topDemoScope.view.size.width, 0));
        line.strokeColor = "green";
        line.strokeWidth = 4;
        line.opacity = 0;
        var loop = function loop() {
            line.animate({
                properties: {
                    strokeColor: {
                        hue: "+1000"
                    }
                },
                settings: {
                    duration: 1e4,
                    easing: "swing",
                    complete: loop
                }
            });
        };
        animatePaper.fx.fadeIn(line, {
            duration: 2e3
        });
        loop();
    }
    $(function() {
        $.getJSON(githubProfileUrl, function(data) {
            var imgSrc = data.avatar_url;
            $avatar = $("<img />", {
                src: imgSrc
            }).appendTo("#githubPic").css("opacity", 0).load(function() {
                $avatar.animate({
                    top: "15px",
                    opacity: 1
                }, 300);
            });
            $avatar.on("mouseenter", function() {
                $avatar.stop().animate({
                    top: "0px"
                }, 200);
            });
            $avatar.on("mouseleave", function() {
                $avatar.stop().animate({
                    top: "15px"
                }, 200);
            });
        });
        $.getJSON(githubReleasesUrl, function(data) {
            if (data.length > 0) {
                var semver = data[0].tag_name;
                var releaseName = data[0].name;
                var releaseDate = data[0].published_at;
                var zipUrl = data[0].zipball_url;
                $("#latestRelease").html("Download: ").append($("<a></a>", {
                    href: zipUrl,
                    title: "zipball"
                }).append(semver)).removeClass("none").addClass("animate fade-in-right");
                $("#latestReleaseName").append("Latest release : " + releaseName).removeClass("none").addClass("animate fade-in-right");
            }
        });
        var windowResizeCallback = function windowResizeCallback() {};
        setTopDemo();
        $(window).on("resize", throttle(windowResizeCallback));
    });
})(window, jQuery);