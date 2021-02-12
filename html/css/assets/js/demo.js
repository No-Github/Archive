$(document).ready(function() {

  // Controller
	var controller = new ScrollMagic.Controller({loglevel: 3});
  
  // Set Variables
  TweenMax.set(".grid-item .image", { perspective: 500 });
  TweenMax.set(".grid-item .image .overlay", { z: 150 })
  TweenMax.set(".grid-item .image .content h2", { z: 151, autoAlpha: 0 })

  // grid-item with effect-first
  var timelineEffectFirst = new TimelineMax({ paused: true });
  timelineEffectFirst.fromTo( '.effect-first .image .overlay', 1, { skewX: -10, scale: 1.15 }, { delay: 1, skewX: 20, xPercent: 85, transformOrigin: "0% 100%", ease: Power2.easeOut })
                     .from(".effect-first .image img", 1, { z: 100, transformOrigin: "50% 0%", ease: Power3.easeOut }, '-=1')
                     .fromTo( '.effect-first .content > h2', 0.75, { autoAlpha: 0, x: -128 }, { autoAlpha: 1, x: 0 }, '-=0.75' );
  new ScrollMagic.Scene({ triggerElement: '.effect-first', triggerHook: 'onEnter', offset: 60 })
  .addTo(controller)
  .setTween(timelineEffectFirst.play());

  // grid-item with effect-second
  var timelineEffectSecond = new TimelineMax({ paused: true });
  timelineEffectSecond.fromTo( '.effect-second .image .overlay1', 1, { scale: 1.15 }, { xPercent: 90, ease: Power2.easeOut })
                      .fromTo( '.effect-second .image .overlay2', 1, { scale: 1.15 }, { xPercent: 90, ease: Power2.easeOut }, '-=0.85')
                      .fromTo( '.effect-second .image .overlay3', 1, { scale: 1.15 }, { xPercent: 90, ase: Power2.easeOut }, '-=0.75')
                      .from(".effect-second .image img", 1, { z: 100, transformOrigin: "50% 0%", ease: Power3.easeOut }, '-=1.25')
                      .fromTo( '.effect-second .content > h2', 0.75, { autoAlpha: 0, x: -128 }, { autoAlpha: 1, x: 0 }, '-=0.75' );
  new ScrollMagic.Scene({ triggerElement: '.effect-second', triggerHook: 'onEnter', offset: 480 })
  .addTo(controller)
  .setTween(timelineEffectSecond.play());

  // grid-item with effect-third
  var timelineEffectThird = new TimelineMax({ paused: true });
  timelineEffectThird.fromTo( '.effect-third .image .overlay1', 1, { scale: 1.15 }, { yPercent: 100, ease: Power2.easeOut })
                      .fromTo( '.effect-third .image .overlay2', 1, { scale: 1.15 }, { yPercent: 100, ease: Power2.easeOut }, '-=0.85')
                      .fromTo( '.effect-third .image .overlay3', 1, { scale: 1.15 }, { yPercent: 100, ase: Power2.easeOut }, '-=0.75')
                      .from(".effect-third .image img", 1, { z: 100, transformOrigin: "50% 0%", ease: Power3.easeOut }, '-=1.25')
                      .fromTo( '.effect-third .content > h2', 0.75, { autoAlpha: 0, y: -128 }, { autoAlpha: 1, y: 0 }, '-=0.75' );
  new ScrollMagic.Scene({ triggerElement: '.effect-third', triggerHook: 'onEnter', offset: 480 })
  .addTo(controller)
  .setTween(timelineEffectThird.play());

  // grid-item with effect-fourth
  var timelineEffectFourth = new TimelineMax({ paused: true });
  timelineEffectFourth.fromTo( '.effect-fourth .image .overlay1', 1, { scale: 3.25 }, { scale: 0, ease: Power2.easeOut })
                      .from(".effect-fourth .image img", 1, { z: 100, transformOrigin: "50% 0%", ease: Power3.easeOut }, '-=1')
                      .fromTo( '.effect-fourth .content > h2', 0.75, { autoAlpha: 0, x: 64, y: 64 }, { autoAlpha: 1, x: 0, y: 0 }, '-=0.75' );
  new ScrollMagic.Scene({ triggerElement: '.effect-fourth', triggerHook: 'onEnter', offset: 480 })
  .addTo(controller)
  .setTween(timelineEffectFourth.play());

});
