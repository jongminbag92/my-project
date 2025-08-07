window.addEventListener('DOMContentLoaded', () => {
    preventAnchorBounce();
    initScrolla();
    initSplitting();
    headerScrollEvent();
    startStarCanvasAnimation();
    observeBlackSection();

    gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);
    initIntroTextScrollTrigger();
    VideoSectionScrollTrigger();
    strengthScrollAnimation();
    hobbyImages();
    skillMouse();
    skillCounting();
    marquee();
});


// 1. a[href="#"] 스크롤 튕김 방지
function preventAnchorBounce() {
    $(document).on('click', 'a[href="#"]', function (e) {
        e.preventDefault();
    });
}

// 2. Scrolla 애니메이션 초기화
function initScrolla() {
    $('.animate').scrolla({
        mobile: true,
        once: false
    });
}

// 2. Splitting.js 초기화
function initSplitting() {
  Splitting(); // ✅ 반드시 대문자로
}

// 헤더 스크롤 시 hide/show
function headerScrollEvent() {
    let lastY = window.scrollY;
    const header = document.querySelector('header');
    header.classList.add('show');

    window.addEventListener('scroll', () => {
        const cur = window.scrollY;
        if (cur > lastY && cur > 100) {
        header.classList.replace('show', 'hide');
        } else {
        header.classList.replace('hide', 'show');
        }
        lastY = cur;
    });
}


// 3. 캔버스 리사이즈
function resizeCanvas(canvas, stars) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars(canvas, stars);
}

// 4. 별 초기화
function initStars(canvas, stars) {
    stars.length = 0;
    for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.2
    });
    }
}
// 5. 별 애니메이션
function animateStars(ctx, canvas, stars) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';

    stars.forEach(star => {
    star.x += star.speedX;
    star.y += star.speedY;

    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    });

    requestAnimationFrame(() => animateStars(ctx, canvas, stars));
}


// 6. 별 애니메이션 시작
function startStarCanvasAnimation() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const stars = [];

    const resizeHandler = () => resizeCanvas(canvas, stars);
    window.addEventListener('resize', resizeHandler);
    resizeHandler(); // 최초 실행
    animateStars(ctx, canvas, stars);
}

// 검정배경에서만 별이 보이게
function observeBlackSection() {
  const canvas = document.getElementById('starCanvas');
  const targets = document.querySelectorAll('.black-section');
  if (!canvas || targets.length === 0) return;

  let sectionStates = new Map(); // 각 섹션별 상태 저장

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionStates.set(entry.target, entry.isIntersecting);

        const anyVisible = Array.from(sectionStates.values()).some(v => v === true);

        if (anyVisible) {
          canvas.classList.add('active');
        } else {
          canvas.classList.remove('active');
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  targets.forEach((target) => {
    sectionStates.set(target, false); // 초기화
    observer.observe(target);
  });
}


// 인트로 텍스트
function initIntroTextScrollTrigger() {
  ScrollTrigger.create({
    trigger: ".intro",
    start: "center 30%",
    end: "center 30%",
    onEnter: () => {
      requestAnimationFrame(() => {
        document.querySelector(".intro-text").classList.add("active");
      });
    },
    onLeaveBack: () => {
      document.querySelector(".intro-text").classList.remove("active");
    },
    //markers: true
  });
}

// video-section
function VideoSectionScrollTrigger() {
  gsap.timeline({
    scrollTrigger: {
        trigger: '.myvideo',
        start: 'top 50%',
        end: 'center 50%',
        scrub:2,
        //markers:true
    }
})
.to('.videowrap', {backgroundColor:'#fff', color:'#0D0D0D', ease:'none', duration:5},0)
.fromTo('.videoWrap video', {'clip-path': 'inset(60% round 30%)'},
    {'clip-path': 'inset(0% round 0%)', ease:'none', duration:10},0)
}


function strengthScrollAnimation() {

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".strength-section",
      start: "top top",
      end: "+=400%",
      scrub: true,
      pin: true,
      //markers: true,
    }
  });

  // 1. 첫 번째 텍스트 등장 (초기)
  tl.to(".strength-text:nth-child(1)", {
    opacity: 1,
    y: 0,
    duration: 0.3
  });

  // 2. 화면 줄이기 (100 → 50vw)
  tl.to(".strength-left", {
    width: "50vw",
    duration: 3,
    ease: "none"
  }, "<"); // ← 동시에 시작

  // 3. 텍스트 1 → 2 교체 (같은 시간축에 넣기)
  tl.to(".strength-text:nth-child(1)", {
    opacity: 0,
    duration: 0.3
  }, "<+=2.0"); // 화면 줄이기 시작 후 1초 후에

  tl.to(".strength-text:nth-child(2)", {
    opacity: 1,
    y: 0,
    duration: 0.3
  }, "<+=0.3");

  // 4. 텍스트 2 → 3 교체 (조금 더 뒤에)
  tl.to(".strength-text:nth-child(2)", {
    opacity: 0,
    duration: 0.3
  }, "<+=1.0");

  tl.to(".strength-text:nth-child(3)", {
    opacity: 1,
    y: 0,
    duration: 0.3
  }, "<+=0.3");

  // 5. 마지막 흰 배경 opacity 0 처리
  tl.to(".strength-left", {
    opacity: 0,
    duration: 1
  }, "+=0.5");
  
  tl.to(".strength-text:nth-child(3)", {
    opacity: 0,
    duration: 1
  }, "<");
}

function hobbyImages() {
  const imgs = gsap.utils.toArray('.hobby-img');

  gsap.set(imgs, { opacity: 1 });

  gsap.timeline({
    scrollTrigger: {
      trigger: '.hobby',
      start: 'top 30%',
      toggleActions: 'play none none reverse',
      //markers:true
    }
  })
  .to(imgs[0], { x: -550, y: -200, duration: 1 }, 0)
  .to(imgs[1], { x: 400, y: -200, duration: 1 }, 0)
  .to(imgs[2], { x: -450, y: 150, duration: 1 }, 0)
  .to(imgs[3], { x: 350, y: 150, duration: 1 }, 0)
  .to(imgs[4], { x: -100, y: -350, duration: 1 }, 0)
  .to(imgs[5], { x: 50, y: 250, duration: 1 }, 0)
  .to(imgs[6], { x: -200, y: 250, duration: 1 }, 0);


}

// skill-mouse
function skillMouse() {
  const grid = document.querySelector('.skill-grid');
const glow = document.querySelector('.cursor-glow');

grid.addEventListener('mousemove', (e) => {
  const rect = grid.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  glow.style.left = `${x}px`;
  glow.style.top = `${y}px`;
  glow.style.opacity = 1;
});

grid.addEventListener('mouseleave', () => {
  glow.style.opacity = 0;
});
}

// 스킬 카운팅
function skillCounting() {
  document.querySelectorAll('.count-num').forEach((el) => {
  const target = +el.dataset.target;

  gsap.fromTo(el, 
    { textContent: 0 }, 
    {
      scrollTrigger: {
        trigger: el,
        start: "top 90%", // 섹션이 들어올 때
        toggleActions: "play none none none",
        //markers:true
      },
      duration: 1.5,
      textContent: target,
      roundProps: "textContent",
      ease: "power1.inOut"
    }
  );
});
}

function marquee() {
  gsap.to(".floating-text", {
    scrollTrigger: {
      trigger: ".marquee-section",
      start: "top center",
      end: "bottom top",
      scrub: 1,
      markers: true
    },
    motionPath: {
      path: "#gPath",
      align: "#gPath",
      alignOrigin: [0.5, 0.5],
      autoRotate: false
    },
    opacity: 1,
    duration: 3,
    ease: "power2.out"
  });

  ScrollTrigger.create({
    trigger: ".cloneCoding-section",
    start: "top center",
    end: "bottom center",
    onEnter: () => {
      document.querySelector(".floating-text").classList.add("marquee");
    },
    onLeaveBack: () => {
      document.querySelector(".floating-text").classList.remove("marquee");
    }
  });
}

window.addEventListener("load", marquee);



