
gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

window.addEventListener('DOMContentLoaded', () => {
    preventAnchorBounce();
    initScrolla();
    initSplitting();
    headerScrollEvent();
    startStarCanvasAnimation();
    observeBlackSection();
    svg();
    initIntroTextScrollTrigger();
    initOverviewHoverVideo();
    VideoSectionScrollTrigger();
    strengthScrollAnimation();
    hobbyImages();
    skillMouse();
    skillCounting();
    marquee();
    cloneCodingList();
    workIntro();
    footerMarquee();
    
});

window.addEventListener('load', () => {
  workList();      // ← 여기서 전역 scrollTween 세팅
  slick();
  nuvieVideo();    // ← workList 이후 호출 필수
  attachImageCursor();
  introCard();
  process();
});

document.querySelectorAll('path').forEach((p, i) => {
  console.log(`#svgAni${i.toString().padStart(3, '0')} 길이:`, p.getTotalLength());
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

function svg() {
  $(function(){
    $('.svgAni path').each(function(i, path){
      const len = path.getTotalLength();
      console.log(`#svgAni0${i} 길이:`, len);
    });
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
  const wrap = document.querySelector('.videoWrap');
  const vid  = document.querySelector('.videoWrap video');
  if (!wrap || !vid) return;  // ✅ 가드

  gsap.timeline({
    scrollTrigger: {
      trigger: '.myvideo',
      start: 'top 80%',
      end: 'bottom 80%',
      scrub: 2,
      //markers:true
    }
  })
  .to('.videoWrap', { backgroundColor:'#fff', color:'#0D0D0D', ease:'none', duration:5 }, 0)
  .fromTo('.videoWrap video',
    { 'clip-path': 'inset(60% round 30%)' },
    { 'clip-path': 'inset(0% round 0%)', ease:'none', duration:10 }, 0
  );
}

function initOverviewHoverVideo() {
  document.querySelectorAll('.overview-img').forEach((el) => {
    const img = el.querySelector('img');
    const video = el.querySelector('video');
    if (!img || !video) return;

    // 모바일 자동재생 정책 대비
    video.muted = true;
    video.playsInline = true;

    const showVideo = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
      el.classList.add('is-playing');
    };

    const hideVideo = () => {
      video.pause();
      video.currentTime = 0;
      el.classList.remove('is-playing');
    };

    el.addEventListener('mouseenter', showVideo);
    el.addEventListener('mouseleave', hideVideo);

    // 터치 대응(원하면 유지)
    el.addEventListener('touchstart', showVideo, {passive: true});
    el.addEventListener('touchend', hideVideo, {passive: true});
  });
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
  }, "<+=2.5"); // 화면 줄이기 시작 후 1초 후에

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

  tl.to(".strength-section, .strength-right",{
    backgroundColor: "#0D0D0D", // 검정
    duration: 1
  }, "<"); // 마지막 텍스트 사라질 타이밍과 맞춰

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
  .to(imgs[0], { x: -650, y: -300, duration: 1 }, 0)
  .to(imgs[1], { x: 400, y: -290, duration: 1 }, 0)
  .to(imgs[2], { x: -700, y: 150, duration: 1 }, 0)
  .to(imgs[3], { x: 400, y: 150, duration: 1 }, 0)
  .to(imgs[4], { x: -100, y: -500, duration: 1 }, 0)
  .to(imgs[5], { x: -130, y: 250, duration: 1 }, 0)
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

function marquee(){
  const track = document.querySelector(".marquee-track");
  if (!track) return;

  const line  = track.querySelector(".intro-text2.warp");
  const big   = document.querySelector("#bigCurve");
  const squ   = document.querySelector("#squiggle");
  const noise = document.querySelector("#noise");
  const disp  = document.querySelector("#disp");

  const chars = track.querySelectorAll(".intro-text2 .char");
  let trackWidth = track.offsetWidth || 1000;
  addEventListener('resize', () => trackWidth = track.offsetWidth || 1000);

  // 시작 상태
  gsap.set(track,{ opacity:0, x: innerWidth, y: innerHeight });

  // 글자 한글자씩 위로(원하면 유지, 아니면 제거)
  gsap.set(chars, { opacity:0, y:i=>120+i*14, rotate:10, transformOrigin:"50% 100%" });

  const tl = gsap.timeline({
    scrollTrigger:{
      trigger: ".marquee-intro",
      start: "top 30%",
      end: "+=200%",
      scrub: 1,
      pin: true,
      //markers: true,
      onLeave: startMarquee
    }
  });

  // A) 큰 곡선 경로
  tl.to(track, {
    opacity: 1,
    duration: 2,
    ease: "none",
    motionPath: { path: big, align:false, autoRotate:false }
  }, 0);

  // 글자 등장(옵션)
  if (chars.length){
    tl.to(chars, { opacity:1, y:0, rotate:0, ease:"none", stagger:{ each:0.08 } }, 0);
  }

  // B) S자 + 왜곡 0으로 수렴
  tl.to(track, {
    duration: 0.8,
    ease: "none",
    motionPath: { path: squ, align:false, autoRotate:false }
  }, ">-0.1");

  tl.to(disp,  { attr:{ scale:0 },             duration:0.8, ease:"power2.out" }, "<");
  tl.to(noise, { attr:{ baseFrequency:0.004 },  duration:0.8, ease:"power2.out" }, "<");
  tl.set(line, { filter:"none" }, ">+0.05");

  function startMarquee(){
    gsap.set(track, { clearProps:"all", position:"fixed", top:"50%", left:"50%", xPercent:0, yPercent:0 });
    gsap.to(track, {
      x: `-=${trackWidth}px`,
      duration: 10,
      ease: "linear",
      repeat: -1,
      modifiers: { x: gsap.utils.unitize(v => parseFloat(v) % trackWidth) }
    });
  }
}



function cloneCodingList() {
  // 02.가로로 스크롤되기	
  let list = gsap.utils.toArray('.cloneCoding-section ul li');
  let scrollTween = gsap.to(list, {
      xPercent: -100 * (list.length -1),
      ease:'none',
      scrollTrigger:{
          trigger:'.cloneCoding-section',
          pin:true,
          scrub:1,
          start:'top 10%',
          end:'300%',
          //markers:true
      }
  });
  


  // 03.imgBox모션
  gsap.utils.toArray('.cloneCoding-section ul li .imgBox').forEach(function(imgBox){

      // 03-1 : imgBox가 커지게 -> imgBox가 화면 오른쪽에서 커지기 시작해서 중앙에서 끝
      gsap.timeline({
          scrollTrigger:{
              trigger:imgBox,
              containerAnimation:scrollTween, //가로스크롤에서 트리거 시점을 잡아주려면 필수
              start:'center right', //가로스크롤에서 left는 top으로 간주 left가 0%, right가 100%
              end:'center center',
              scrub:true,
              //markers:true
          }
      })
      .to(imgBox, {'clip-path':'inset(0%)', ease:'none', duration:1},0)


      // 03-2. imgBox작아지게 -> 화면 중앙에서 작아지기 시작해서 왼쪽에서 끝
      gsap.timeline({
          scrollTrigger:{
              trigger: imgBox,
              containerAnimation: scrollTween,
              start:'center center',
              end:'center left',
              scrub:true,
              //markers:true
          }
      })
      .to(imgBox, {'clip-path':'inset(40%)', ease:'none', duration:1},0)
      })
  // imgBox 애니 끝


  // 04.textBox모션
  gsap.utils.toArray('.cloneCoding-section ul li .textBox').forEach(function(textBox){

      // 04-1 : textBox 애니 -> textBox가 화면 중앙에서 투명도 1, x축으로 이동
      gsap.timeline({
          scrollTrigger:{
              trigger:textBox,
              containerAnimation:scrollTween, //가로스크롤에서 트리거 시점을 잡아주려면 필수
              start:'center 70%', //가로스크롤에서 right는 top으로 간주
              end:'center 40%',
              scrub:true,
              //markers:true
          }
      })
      .to(textBox, {opacity:1, x:-100},0)


      // 04-2. textBox 애니 -> 화면 중앙에서 왼쪽으로 이동시 다시 투명도 0
      gsap.timeline({
          scrollTrigger:{
              trigger: textBox,
              containerAnimation: scrollTween,
              start:'center 30%',
              end:'center 20%',
              scrub:true,
              //markers:true
          }
      })
      .to(textBox, {opacity:0},0)
      
  })
  // textBox 애니 끝
  gsap.utils.toArray('.cloneCoding-section ul li .btnBox').forEach(function(btnBox){
      // 04-1 : textBox 애니 -> textBox가 화면 중앙에서 투명도 1, x축으로 이동
      gsap.timeline({
          scrollTrigger:{
              trigger:btnBox,
              containerAnimation:scrollTween, //가로스크롤에서 트리거 시점을 잡아주려면 필수
              start:'center 70%', //가로스크롤에서 right는 top으로 간주
              end:'center 40%',
              scrub:true,
              //markers:true
          }
      })
      .to(btnBox, {opacity:1, x:-100},0)


      // 04-2. textBox 애니 -> 화면 중앙에서 왼쪽으로 이동시 다시 투명도 0
      gsap.timeline({
          scrollTrigger:{
              trigger: btnBox,
              containerAnimation: scrollTween,
              start:'center 50%',
              end:'center 0%',
              scrub:true,
              //
              // markers:true
          }
      })
      .to(btnBox, {opacity:0},0)
      
  })


  // 05.counter text변경
  gsap.utils.toArray('.num').forEach(function(text){
      let num = text.getAttribute('data-text');
      let counter = document.querySelector('.counter .now');

      ScrollTrigger.create({
          trigger: text,
          start:'0 center',
          end:'100% center',
          scrub:true,
          containerAnimation:scrollTween,
          //markers:true,
          onEnter:self => counter.innerText = num,
          //스크롤 위치가 start를 지나 앞으로 이동할 때 .counter .now에 적어준다.(마우스 휠 아래로 스크롤)
          onEnterBack:self => counter.innerText = num
          //스크롤 위치가 end를 지나 뒤로 이동할 때 self는 window객체 자신을 반환. (마우스 휠 위로 스크롤)
      })
      
      })
}
            

// work-intro
function workIntro() {

  const sec = document.querySelector(".work-intro");
  const circle = sec.querySelector(".intro_circle");

  const tl = gsap.timeline({
    scrollTrigger:{
      trigger: sec,
      start: "top top",
      end: "+=150%",
      scrub: 1.2,
      pin: true,
      //markers:true
    }
  });

  tl.to(circle, {scale:0, duration:2.6, ease:"power1.inOut"}, ">+=0.3");
}


let workScrollTween = null; // ✅ 전역으로

function workList() {
  const list   = document.querySelector(".work-list");
  const track  = document.querySelector(".work-track");
  const slides = gsap.utils.toArray(".work-slide");
  if (!list || !track || !slides.length) return;

  workScrollTween = gsap.to(slides, {
    xPercent: -100 * (slides.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: list,
      pin: true,
      scrub: 1,
      end: () => "+=" + (track.scrollWidth - document.documentElement.clientWidth),
      invalidateOnRefresh: true
      // ,markers:true
    }
  });

  // 초기 색
  gsap.set(list, { backgroundColor: slides[0].dataset.bg || "#ffffff" });
  list.style.setProperty("--ink", slides[0].dataset.ink || "#0D0D0D");

  // 슬라이드 진입 시 색 전환
  slides.forEach((slide) => {
    ScrollTrigger.create({
      trigger: slide,
      containerAnimation: workScrollTween,     // ✅ 전역 트윈 사용
      start: "left center",
      end: "right center",
      onEnter: () => setColors(slide),
      onEnterBack: () => setColors(slide)
    });
  });

  function setColors(slide) {
    gsap.to(list, { backgroundColor: slide.dataset.bg || "#000", duration: 0.6, ease: "power1.out" });
    list.style.setProperty("--ink", slide.dataset.ink || "#fff");
  }
}


 function slick() {
  $('.work-slick').not('.slick-initialized').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 1000,
    speed: 500,
    cssEase: 'ease',
    pauseOnHover: true,
    lazyLoad: 'ondemand',
    adaptiveHeight: false
  });
};

function nuvieVideo() {
  const video = document.querySelector('.slide3 .work-video');
  if (!video || !workScrollTween) return;

  // 모바일 자동재생 보장용 속성(HTML에도 넣어두면 더 좋음)
  video.muted = true; video.playsInline = true;

  ScrollTrigger.create({
    trigger: '.slide3',
    containerAnimation: workScrollTween,   // ✅ 정의된 트윈
    start: 'left center',
    end: 'right center',
    onEnter:     () => video.play(),
    onEnterBack: () => video.play(),
    onLeave:     () => video.pause(),
    onLeaveBack: () => video.pause()
  });
}

function attachImageCursor() {
  document.querySelectorAll('.work-img').forEach(box => {
    if (box.dataset.cursorInit) return; // 중복 방지
    box.dataset.cursorInit = '1';

    const cursor = document.createElement('div');
    cursor.className = 'img-cursor';
    cursor.textContent = 'Click!';
    box.appendChild(cursor);

    box.addEventListener('mouseenter', () => {
      box.classList.add('cursor-visible');
    });

    box.addEventListener('mousemove', (e) => {
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      cursor.style.left = x + 'px';
      cursor.style.top  = y + 'px';
    });

    box.addEventListener('mouseleave', () => {
      box.classList.remove('cursor-visible');
    });

    box.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    box.addEventListener('mouseup',   () => cursor.classList.remove('is-down'));
  });
}



function introCard() {
  const track = document.querySelector('.processIntro .question .questionBox');
  if (!track) return;

  // f가 트랙 안에 있으면 트랙 밖으로 이동(고정용)
  const f = track.querySelector('.img.f');
  if (f) track.parentElement.appendChild(f);

  // 트랙의 카드들(a~e 등)
  const items = Array.from(track.querySelectorAll('.img'));

  // 화면 크기에 따라 살짝 다른 패턴(원하면 하나만 써도 됨)
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // 각 카드의 x 오프셋과 세로 간격(원하는 대로 수정)
  const offsets = isMobile
    ? ['-1vw','14vw','-10vw','16vw','-12vw']
    : ['-26vw','18vw','-8vw','26vw','-20vw'];

  const gaps = isMobile
    ? ['36px','64px','40px','56px','44px']
    : ['40px','90px','56px','72px','60px'];

  const applyPattern = (els) => {
    els.forEach((el, i) => {
      el.style.setProperty('--x', offsets[i % offsets.length]);
      el.style.setProperty('--gapY', gaps[i % gaps.length]);
    });
  };

  applyPattern(items);

  // 무한 루프용 복제(원본과 동일한 패턴 → 이음새 매끈)
  if (!track.dataset.duped) {
    items.forEach(el => track.appendChild(el.cloneNode(true)));
    track.dataset.duped = '1';
  }

  const clones = Array.from(track.children).slice(items.length);
  applyPattern(clones);

}



function process() {
  // con02
    gsap.timeline({
        scrollTrigger:{
            trigger:'.con02',
            start:'0% 100%',
            end:'0% 20%',
            scrub:1,
            //markers:true
        }
    })
    .fromTo('.con02 .title .a', {x:'-100%'}, {x:'0%', ease:'none', duration:5},0)
    .fromTo('.con02 .title .b', {x:'100%'}, {x:'0%', ease:'none', duration:5},0)

    
    //worklist가 나타날때
    gsap.timeline({
        scrollTrigger:{
            trigger:'.worklist',
            start:'0% 100%',
            end:'0% 100%',
            scrub:1,
            //markers:true
        }
    })
    .to('.wrap',{backgroundColor:'#fff', color:'#0D0D0D', ease:'none', duration:5},0)
    .to('.con02 .title', {position:'fixed', ease:'none', left:0, top:0, width:'100%', duration:5},0)
    .fromTo('.worklist', {margin:'0 auto'},{margin:'100vh auto 0', position:'relative', zIndex:'10', duration:1},0)

    // .worklist가 끝날때 title글자가 화면 밖으로 사라지도록 애니적용
    gsap.timeline({
        scrollTrigger:{
            trigger:'.worklist',
            start:'100% 50%',
            end:'100% 0%',
            scrub:1,
            //markers:true
        }
    })
    .to('.con02 .title .a', {x:'-100%', ease:'none', duration:5},0)
    .to('.con02 .title .b', {x:'100%', ease:'none', duration:5},0)

    gsap.timeline({
    scrollTrigger:{
      trigger: '.con02',
      start: '70% top',
      end:   '70% top',   // 끝 영역에서만 서서히 전환
      scrub: 1,
      //markers: true,
      invalidateOnRefresh: true
    }
  })
  .to('.wrap', { backgroundColor:'#0D0D0D', color:'#fff', ease:'none', duration:1 }, 0);

}

function footerMarquee() {
   const el = document.querySelector('.footer-intro .marquee__inner');
    if (!el) return;
    el.innerHTML += el.innerHTML; // 한 번 더 이어붙이기(총 2배)
}