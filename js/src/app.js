((global, $) => {
    // github info
    let $avatar;
    const githubProfileUrl = "https://api.github.com/users/Eartz",
        githubReleasesUrl = "https://api.github.com/repos/Eartz/animatePaper.js/releases";

    // paper scopes
    let topDemoScope;
    let moveDemoScope;
    let splashDemoScope;
    // paper projects

    // utils
    const throttle = (func, ms = 50, context = window) => {
        let to;
        let wait = false;
        return (...args) => {
            let later = () => {
                func.apply(context, args);
            };
            if (!wait)  {
                later();
                wait = true;
                to = setTimeout(() => {
                    wait = false;
                }, ms);
            }
        };
    };


    // start the top animation (line under the title)
    function setTopDemo() {
        topDemoScope = paper.setup('topCanvas');
        topDemoScope.project.activate();

        let line = new paper.Path.Line(new paper.Point(0, 0), new paper.Point(topDemoScope.view.size.width, 0));
        line.strokeColor = 'green';
        line.strokeWidth = 4;
        line.opacity = 1;
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
                    complete: loop
                }
            });
            topDemoScope.project.view.update();
        };

        loop();
        topDemoScope.project.view.update();
    }

    function setMoveDemo() {
        moveDemoScope = paper.setup('demoMoveItem');
        moveDemoScope.project.activate();
        let circle = new paper.Shape.Circle(moveDemoScope.view.center, 20);
        circle.fillColor = 'green';

        let position = "center";
        circle.onClick = function () {
            const newX = (position === "center" ? "-" : "+") + moveDemoScope.view.center.x;
            circle.animate({
                properties: {
                    position: {
                        x: newX
                    }
                },
                settings: {
                    duration: 500,
                    easing: "swing"
                }
            });
            moveDemoScope.project.view.update();
            position = position === "center" ? "left" : "center";
        };
        moveDemoScope.project.view.update();
    }

    function setSplashDemo() {
        splashDemoScope = paper.setup('demoSplashItem');
        splashDemoScope.project.activate();

        let square = new paper.Shape.Rectangle(splashDemoScope.view.center, new paper.Size(30, 30));
        square.fillColor = "green";
        square.opacity = 0;

        let splashed = false;
        $('#demoSplashItemBtn').on('click', () => {
            if (!splashed) {
                animatePaper.fx.splash(square);
                splashed = true;
            }
        });
    }

    $(function () {
        // load github info
        $.getJSON(githubProfileUrl, (data) => {
            const imgSrc = data.avatar_url;
            $avatar = $('<img />', {
                src: imgSrc
            }).appendTo("#githubPic").css('opacity', 0).load(() => {
                $avatar.animate({
                    top: "15px",
                    opacity: 1
                }, 300);
            });
            $avatar.on('mouseenter', () => {
                $avatar.stop().animate({
                    top: "0px"
                }, 200);
            });
            $avatar.on('mouseleave', () => {
                $avatar.stop().animate({
                    top: "15px"
                }, 200);
            });
        });
        $.getJSON(githubReleasesUrl, (data) => {
            if (data.length > 0) {
                const semver = data[0].tag_name;
                const releaseName = data[0].name;
                const zipUrl = data[0].zipball_url;
                $('#latestRelease').html('Download: ').append($('<a></a>', {
                    href: zipUrl,
                    title: "zipball"
                }).append(semver)).removeClass("none").addClass("animate fade-in-right");
                $('#latestReleaseName').append("Latest release : " + releaseName).removeClass("none").addClass("animate fade-in-right");
            }
        });


        const windowResizeCallback = () => {

        };

        // start paper animations
        setTopDemo();
        setMoveDemo();
        setSplashDemo();

        $(window).on('resize', throttle(windowResizeCallback));
    });

})(window, jQuery);
