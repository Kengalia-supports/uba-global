/* =====================================
Site JS — DE-Blessed Uba Global
Based on the Mediplus template, trimmed to the features actually used:
  * Sticky Header
  * Mobile Menu (SlickNav)
  * Hero Slider (Owl Carousel)
  * Scroll Up
  * Stellar (parallax backgrounds)
  * Preloader
========================================*/
(function ($) {
	"use strict";

	$(function () {

		/*====================================
			Sticky Header
		======================================*/
		$(window).on('scroll', function () {
			var scrolled = $(this).scrollTop();
			$('.header').toggleClass('sticky', scrolled > 100);
			$('#header .header-inner').toggleClass('sticky', scrolled > 200);
		});

		/*====================================
			Mobile Menu
		======================================*/
		$('.menu').slicknav({
			prependTo: ".mobile-nav",
			duration: 300,
			closeOnClick: true
		});

		/*====================================
			Hero Slider
		======================================*/
		$(".hero-slider").owlCarousel({
			loop: true,
			autoplay: true,
			smartSpeed: 500,
			autoplayTimeout: 3500,
			autoplayHoverPause: true,
			items: 1,
			nav: true,
			navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
			dots: false
		});

		/*====================================
			Scroll Up
		======================================*/
		$.scrollUp({
			scrollText: '<span><i class="fa fa-angle-up"></i></span>',
			easingType: 'easeInOutExpo',
			scrollSpeed: 900,
			animation: 'fade'
		});

		/*====================================
			Stellar (parallax backgrounds)
		======================================*/
		$.stellar({
			horizontalOffset: 0,
			verticalOffset: 0
		});

	});

	/*====================================
		Preloader
	======================================*/
	$(window).on('load', function () {
		$('.preloader').addClass('preloader-deactivate');
	});

})(jQuery);
