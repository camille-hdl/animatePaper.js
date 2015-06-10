((global,$) => {
    const githubProfileUrl = "https://api.github.com/users/Eartz";
    const githubReleasesUrl = "https://api.github.com/repos/Eartz/animatePaper.js/releases";

    let $avatar;
    let $latestRelease;

    $(function() {
        $.getJSON(githubProfileUrl,(data) => {
            const imgSrc = data.avatar_url;
            $avatar = $('<img />', {
                src: imgSrc
            }).appendTo("#githubPic").css('opacity',0).load(() => {
                $avatar.animate({
                    top: "15px",
                    opacity: 1
                },300);
            });
            $avatar.on('mouseenter',() => {
                $avatar.stop().animate({
                    top: "0px"
                },200);
            });
            $avatar.on('mouseleave',() => {
                $avatar.stop().animate({
                    top: "15px"
                },200);
            });
        });
        $.getJSON(githubReleasesUrl,(data) => {
           if(data.length>0) {
            const semver = data[0].tag_name;
            const releaseName = data[0].name;
            const releaseDate = data[0].published_at;
            const zipUrl = data[0].zipball_url;
            $('#latestRelease').html('Download: ').append($('<a></a>',{
                href: zipUrl,
                title: "zipball"
            }).append(semver)).removeClass("none").addClass("animate fade-in-right");
            $('#latestReleaseName').append("Latest release : "+releaseName).removeClass("none").addClass("animate fade-in-right");
           }
           
        });
    });
})(window,jQuery);