((global,$) => {
    // github info
    let $avatar;
    let $latestRelease;
    const githubProfileUrl = "https://api.github.com/users/Eartz";
    const githubReleasesUrl = "https://api.github.com/repos/Eartz/animatePaper.js/releases";

    // paper scopes
    let topDemoScope;

    // utils
    const throttle = (func,ms=50,context=window) => {
        let to;
        let wait=false;
        return (...args) => {
          let later = () => {
              func.apply(context,args);
          };
          if(!wait)  {
              later();
              wait = true;
              to = setTimeout(() => {
                wait = false;
              },ms);
          }
        };
    };


    // start the top animation (line under the title)
    function setTopDemo() {
        topDemoScope = paper.setup('topCanvas');
        var line = new paper.Path.Line(new paper.Point(0,0),new paper.Point(topDemoScope.view.size.width,0));
        line.strokeColor = 'green';
        line.strokeWidth = 4;
        line.opacity = 0;
        
        const loop = function loop() {
            line.animate({
                properties: {
                    strokeColor: {
                        hue: "+1000"
                    }
                },
                settings: {
                    duration: 10000,
                    easing: "swing",
                    complete:loop
                }
            });
        };
        animatePaper.fx.fadeIn(line,{
            duration: 2000
        });
        loop();
    }

    $(function() {
        // load github info
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


        const windowResizeCallback = () => {
            
        };

        // start paper animations
        setTopDemo();
        
        $(window).on('resize',throttle(windowResizeCallback));
    });
    

})(window,jQuery);