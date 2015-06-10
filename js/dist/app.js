"use strict";

(function(global, $) {
    var githubProfileUrl = "https://api.github.com/users/Eartz";
    var githubReleasesUrl = "https://api.github.com/repos/Eartz/animatePaper.js/releases";
    var $avatar = undefined;
    var $latestRelease = undefined;
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
    });
})(window, jQuery);