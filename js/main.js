---
layout: null
sitemap:
  exclude: 'yes'
---
function toggleMobileMenu() {
  $('.navigation-wrapper').toggleClass('visible');
  $('.btn-mobile-menu__icon').toggleClass('hidden');
  $('.btn-mobile-close__icon').toggleClass('hidden');
}

$(document).ready(function () {
  // central cleanup: remove any injected panel content left by scripts
  function cleanupInjectedPanels() {
    try {
      var gh = document.getElementById('gh-repos-injected');
      if (gh && gh.parentNode) gh.parentNode.removeChild(gh);
    } catch(e){}
    try {
      var blog = document.getElementById('blog-panel-injected');
      if (blog && blog.parentNode) blog.parentNode.removeChild(blog);
    } catch(e){}
    try { if (window.restoreOriginalTimeline) window.restoreOriginalTimeline(); } catch(e){}
  }

  // run once on load to remove any stale injected content
  cleanupInjectedPanels();

  // expose cleanup for other scripts to call
  try { window.cleanupInjectedPanels = cleanupInjectedPanels; } catch(e){}

  $('a.panel-button').click(function (e) {
    // If this is the blog button linking to the blog page (not a hash), allow normal navigation
    try {
      var _href = $(this).attr('href') || '';
      if ($(this).hasClass('blog-button') && _href && _href.indexOf('#') !== 0 && _href.indexOf('#blog') === -1) {
        // let the browser follow the link; do not open the side panel
        return;
      }
    } catch(e){}

    // ensure we remove any injected fragments before toggling to avoid mixups
    cleanupInjectedPanels();

    if ($('.content-wrapper').hasClass('showing')){
      $('.content-wrapper').removeClass('animated slideInRight')
      $('.panel-cover').removeClass('panel-cover--collapsed')
      $('.panel-cover').css('max-width', '100%')
      $('.panel-cover').animate({'width': '100%'}, 400, swing = 'swing', function () {})
      $('.content-wrapper').removeClass('showing')
      history.pushState("", document.title, window.location.pathname + window.location.search);
      //window.location.hash = '' // leaves #
      e.preventDefault();
      return;
    }
    $('.panel-cover').addClass('panel-cover--collapsed');
    currentWidth = $('.panel-cover').width()
    if (currentWidth < 960) {
      $('.panel-cover').addClass('panel-cover--collapsed')
      $('.content-wrapper').addClass('animated slideInRight')
    } else {
      $('.panel-cover').css('max-width', currentWidth)
      $('.panel-cover').animate({'max-width': '530px', 'width': '40%'}, 400, swing = 'swing', function () {})
    }
    $('.content-wrapper').addClass('showing');
  })

  if (window.location.hash && window.location.hash == '#projects') {
    $('a.panel-button').click();
  }

  if (window.location.pathname !== '{{ site.baseurl }}/' && window.location.pathname !== '{{ site.baseurl }}/index.html') {
    $('.panel-cover').addClass('panel-cover--collapsed')
  }

  $('.btn-mobile-menu').click(function () {
    if (!$('.navigation-wrapper').hasClass('animated bounceInDown')){
        $('.navigation-wrapper').addClass('animated bounceInDown');
    }
    toggleMobileMenu();
  })

  $('.navigation-wrapper .projects-button').click(function () {
    toggleMobileMenu();
  })
})
