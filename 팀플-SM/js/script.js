//1.스크립트 위로 튕기는것
$(document).on('click', 'a[href="#"]', function(e){
    e.preventDefault();
});


// slick.js
$(function(){
    $('.visual .slide').slick({
        arrows: false,
        dots: true,
        fade: true,
        slidesToShow:1,
        slidesToScroll:1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        pauseOnFocus: false
    });
});


// 
window.addEventListener('load', () => {
  const intro = document.querySelector('.header-intro-logo');
  const logoImg = intro.querySelector('img');
  const logoTarget = document.querySelector('.logo-target');

   // ★ 초기: 멀리서 작게 시작
   intro.style.transform = 'translateZ(-2000px) scale(0.1)';
   intro.style.opacity = 0;

   setTimeout(() => {
    intro.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
    intro.style.transform = 'translateZ(0) scale(1)';
    intro.style.opacity = 1;
  }, 50);

  // ★ 1단계: 화면 가운데에서 축소
  setTimeout(() => {
    intro.style.transition = 'transform 0.8s ease-in-out';
    intro.style.transform = 'scale(0.1)';
  }, 300);

  // ★ 2단계: 이동 + 스케일 조정
  setTimeout(() => {
    const logoRect = logoImg.getBoundingClientRect();
    const targetRect = logoTarget.getBoundingClientRect();

    const offsetX = (targetRect.left + targetRect.width / 2) - (logoRect.left + logoRect.width / 2);
    const offsetY = (targetRect.top + targetRect.height / 2) - (logoRect.top + logoRect.height / 2);

    const finalWidth = 30; // 로고 목표 너비
    const scale = finalWidth / (logoRect.width * 2.5); // 현재 0.3배 축소되어 있으므로 다시 보정

    intro.style.transition = 'transform 0.8s ease-in-out';
    intro.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }, 1000); // 1단계 끝난 후

  // ★ 3단계: 페이드 아웃
  setTimeout(() => {
    intro.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    intro.style.opacity = 0;
    intro.style.transform += ' scale(0.9)'; // 살짝 더 작아지며 사라짐
    intro.style.filter = 'blur(2px)';       // 흐릿해지면서 사라지는 느낌 (선택)
  }, 2200);

  // ★ 4단계: 로고 교체 및 텍스트 등장
  setTimeout(() => {
    intro.style.display = 'none';
    const logo = document.querySelector('.logo');
    logo.innerHTML = `
      <span class="ent-mask">
        <span class="logo-target"></span>
        <span class="ent-text">SM ENTERTAINMENT</span>
      </span>
    `;

    setTimeout(() => {
      document.querySelector('.ent-text').style.transform = 'translateY(0)';
      document.querySelector('.ent-text').style.opacity = '1';
    }, 100);
  }, 2000);
});




document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(".intro .top .subTxt",
    {
      y: 50,
      opacity: 0
    },
    {
      scrollTrigger: {
        trigger: ".intro",
        start: "center 90%",
        toggleActions: "play reverse play reverse", // 👈 요게 핵심
        //markers: true
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }
  );
  

  const elements = document.querySelectorAll(".intro .left, .intro .right, .intro .en, .intro .icon");

  // 초기 상태: 좌/우 랜덤 또는 아래에서 등장
  elements.forEach(el => {
    if (el.classList.contains("icon")) {
      // 아이콘은 아래에서 위로
      gsap.set(el, { y: 50, opacity: 0 });
    } else {
      // 텍스트는 좌우 랜덤 등장
      const randX = Math.random() > 0.5 ? 100 : -100;
      gsap.set(el, { x: randX, opacity: 0 });
    }
  });

  // 타임라인 생성 + pin 효과
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".intro",
      start: "top top",
      end: "+=100%", // 1 화면 고정 후 스크롤 해제
      pin: true,
      scrub: 1,
      // markers: true // 디버깅용
    }
  });

  // 애니메이션 실행
  elements.forEach((el, i) => {
    const animProps = el.classList.contains("icon")
      ? { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      : { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" };

    tl.to(el, animProps, i * 0.1); // 순차 등장
  });


  // section-artist
  const items = document.querySelectorAll('.artist ul li');
  const highlightBox = document.querySelector('.center-highlight');
  

  function updateHighlight() {
    const centerY = window.innerHeight / 2;
    let closestItem = null;
    let closestDistance = Infinity;

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenterY = rect.top + rect.height / 2;
      const distance = Math.abs(centerY - itemCenterY);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      items.forEach(item => item.classList.remove('active'));
      closestItem.classList.add('active');

      const leftText = closestItem.querySelector('.left')?.innerHTML || '';
      const rightText = closestItem.querySelector('.right')?.innerHTML || '';

      highlightLeft.innerHTML = leftText;
      highlightRight.innerHTML = rightText;
    }
  }

  function onScrollInArtistSection() {
    const artistSection = document.querySelector('.artist');
    const rect = artistSection.getBoundingClientRect();
  
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
  
    const threshold = 700; // 이 범위 안에서만 표시되도록 허용 (선택 조절)
  
    if (Math.abs(sectionCenter - viewportCenter) < threshold) {
      highlightBox.classList.add('visible');
      updateHighlight();
    } else {
      highlightBox.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScrollInArtistSection);
  window.addEventListener('resize', onScrollInArtistSection);
  window.addEventListener('DOMContentLoaded', () => {
    insertMembers?.(); // 이 함수가 정의돼 있으면 실행
    updateHighlight();
  });

  //스케쥴 섹션
  document.querySelectorAll('.parallax').forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 1;

    gsap.to(el, {
      y: () => -(window.innerHeight * speed),
      ease: 'none',
      scrollTrigger: {
        trigger: ".schedule",
        start: "top top",
        end: "bottom top",
        scrub: true,
        //markers:true
      }
    });
  });
  
  //스케줄-마우스 튕기는 효과
  document.querySelectorAll('.schedule .artist li img').forEach((img) => {
  img.addEventListener('pointerleave', (e) => {
    const rect = img.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const toX = e.clientX - centerX;
    const toY = e.clientY - centerY;

    // 방향 벡터 정규화
    const distance = Math.sqrt(toX * toX + toY * toY);
    const dirX = toX / distance;
    const dirY = toY / distance;

    const force = 40;
    const rotationForce = 10;

    gsap.killTweensOf(img); // 연속 트리거 방지

    // 🔁 나간 방향으로 튕기기
    gsap.to(img, {
      x: dirX * force,
      y: dirY * force,
      rotationZ: dirX * rotationForce,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        // 🌪 복귀
        gsap.to(img, {
          x: 0,
          y: 0,
          rotationZ: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    });
  });
});




});











  
  
  
  
  
  
    