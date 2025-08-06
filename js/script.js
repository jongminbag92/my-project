window.addEventListener('DOMContentLoaded', () => {
    preventAnchorBounce();
    initScrolla();
    initSplitting();
    headerScrollEvent();
    startStarCanvasAnimation();
    observeBlackSection();
    gsap.registerPlugin(ScrollTrigger);

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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

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

$(function () {

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".intro",
      start: "center top",
      end: "center center",
      toggleActions: "play none none reverse",
      markers: true // 테스트용
    }
  });

  tl.fromTo(".intro-text .char", {
    yPercent: 100,
    opacity: 0
  }, {
    yPercent: 0,
    opacity: 1,
    stagger: 0.03,
    duration: 0.5,
    ease: "power2.out"
  });
});


