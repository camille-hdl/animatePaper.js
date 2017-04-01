"use strict";

(function(global, $) {
    var $avatar = undefined;
    var githubProfileUrl = "https://api.github.com/users/Eartz", githubReleasesUrl = "https://api.github.com/repos/Eartz/animatePaper.js/releases";
    var topDemoScope = undefined;
    var moveDemoScope = undefined;
    var splashDemoScope = undefined;
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
    function setTopDemo() {
        topDemoScope = paper.setup("topCanvas");
        topDemoScope.project.activate();
        var line = new paper.Path.Line(new paper.Point(0, 0), new paper.Point(topDemoScope.view.size.width, 0));
        line.strokeColor = "green";
        line.strokeWidth = 4;
        line.opacity = 1;
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
            topDemoScope.project.view.update();
        };
        loop();
        topDemoScope.project.view.update();
    }
    function setMoveDemo() {
        moveDemoScope = paper.setup("demoMoveItem");
        moveDemoScope.project.activate();
        var circle = new paper.Shape.Circle(moveDemoScope.view.center, 20);
        circle.fillColor = "green";
        var position = "center";
        circle.onClick = function() {
            var newX = (position === "center" ? "-" : "+") + moveDemoScope.view.center.x;
            circle.animate({
                properties: {
                    position: {
                        x: newX
                    }
                },
                settings: {
                    duration: 500,
                    repeat: 2,
                    easing: "swing"
                }
            });
            moveDemoScope.project.view.update();
            position = position === "center" ? "left" : "center";
        };
        moveDemoScope.project.view.update();
    }
    function setSplashDemo() {
        splashDemoScope = paper.setup("demoSplashItem");
        splashDemoScope.project.activate();
        var square = new paper.Shape.Rectangle(splashDemoScope.view.center, new paper.Size(30, 30));
        square.fillColor = "green";
        square.opacity = 0;
        var splashed = false;
        $("#demoSplashItemBtn").on("click", function() {
            if (!splashed) {
                animatePaper.fx.splash(square);
                splashed = true;
            }
        });
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
        setMoveDemo();
        setSplashDemo();
        $(window).on("resize", throttle(windowResizeCallback));
    });
})(window, jQuery);