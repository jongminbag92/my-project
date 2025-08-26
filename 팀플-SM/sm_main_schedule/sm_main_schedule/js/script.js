// script.js
$(function () {
  Splitting();  // 대문자 맞고 OK!

  $('.animate').scrolla({
    mobile: true,
    once: true,
    animateClass: 'fade-in'  // 클래스 이름 명시
  });
});
$(function () {
  $('.schedule .artist img').on('mouseenter', function () {
    const $img = $(this);
    $img.removeClass('replay');

    // 강제로 리플로우 발생시켜 animation 재실행 가능하게 함
    void this.offsetWidth;

    $img.addClass('replay');
  });
});