const sections = document.querySelectorAll("section");
const images = document.querySelectorAll(".bg");
const outerWrappers = gsap.utils.toArray(".outer");
// const innerWrappers = gsap.utils.toArray('.inner')
document.addEventListener("wheel", handleWheel);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("touchend", handleTouchEnd);
let listening = false, direction = "down", current, next = 0;
const touch = {
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    startTime: 0,
    dt: 0
};
const tlDefaults = {
    ease: "slow.inOut",
    duration: 1.25
};
gsap.set(outerWrappers, {
    yPercent: 100
});
// Slides a section in on scroll down
function slideIn() {
    // The first time this function runs, current is undefined
    if (current !== undefined) gsap.set(sections[current], {
        zIndex: 0
    });
    gsap.set(sections[next], {
        autoAlpha: 1,
        zIndex: 1
    });
    gsap.set(images[next], {
        yPercent: 0
    });
    const tl = gsap.timeline({
        paused: true,
        defaults: tlDefaults,
        onComplete: ()=>{
            listening = true;
            current = next;
        }
    }).to([
        outerWrappers[next]
    ], {
        yPercent: 0
    }, 0).from(images[next], {
        yPercent: 15
    }, 0);
    if (current !== undefined) tl.add(gsap.to(images[current], {
        yPercent: -15,
        ...tlDefaults
    }), 0).add(gsap.timeline().set(outerWrappers[current], {
        yPercent: 100
    }).set(images[current], {
        yPercent: 0
    }).set(sections[current], {
        autoAlpha: 0
    }));
    tl.play(0);
}
// Slides a section out on scroll up
function slideOut() {
    gsap.set(sections[current], {
        zIndex: 1
    });
    gsap.set(sections[next], {
        autoAlpha: 1,
        zIndex: 0
    });
    gsap.set([
        outerWrappers[next]
    ], {
        yPercent: 0
    });
    gsap.set(images[next], {
        yPercent: 0
    });
    gsap.timeline({
        defaults: tlDefaults,
        onComplete: ()=>{
            listening = true;
            current = next;
        }
    }).to(outerWrappers[current], {
        yPercent: 100
    }, 0).to(images[current], {
        yPercent: 15
    }, 0).from(images[next], {
        yPercent: -15
    }, 0).set(images[current], {
        yPercent: 0
    });
}
function handleDirection() {
    listening = false;
    if (direction === "down") {
        if (current !== sections.length - 1) {
            next = current + 1;
            slideIn();
        } else listening = true;
    }
    if (direction === "up") {
        if (current !== 0) {
            next = current - 1;
            slideOut();
        } else listening = true;
    }
}
function handleWheel(e) {
    if (!listening) return;
    direction = e.wheelDeltaY < 0 ? "down" : "up";
    handleDirection();
}
function handleTouchStart(e) {
    if (!listening) return;
    const t = e.changedTouches[0];
    touch.startX = t.pageX;
    touch.startY = t.pageY;
}
function handleTouchMove(e) {
    if (!listening) return;
    e.preventDefault();
}
function handleTouchEnd(e) {
    if (!listening) return;
    const t = e.changedTouches[0];
    touch.dx = t.pageX - touch.startX;
    touch.dy = t.pageY - touch.startY;
    if (touch.dy > 10) direction = "up";
    if (touch.dy < -10) direction = "down";
    handleDirection();
}
slideIn();

//# sourceMappingURL=index.c36f364e.js.map
