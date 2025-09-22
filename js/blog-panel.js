(function(){
  console.log('blog-panel loaded');
  function openFull(url){
    // Close side panel and cleanup injected blog preview before navigating
    try {
      var content = document.querySelector('.content-wrapper');
      if (content && content.classList.contains('showing')) {
        content.classList.remove('showing');
      }
      var prev = document.getElementById('blog-panel-injected');
      if (prev) prev.parentNode.removeChild(prev);
      // restore timeline if projects hid it
      if (window.restoreOriginalTimeline) {
        try { window.restoreOriginalTimeline(); } catch(e){}
      }
      // call global cleanup if provided by main.js
      if (window.cleanupInjectedPanels) {
        try { window.cleanupInjectedPanels(); } catch(e){}
      }
    } catch(e) {}

    // Navigate in the same tab to the full post
    window.location.assign(url);
  }

  function renderPanel(){
    console.debug('[blog-panel] renderPanel start', { time: Date.now() });
    var contentWrapper = document.querySelector('.content-wrapper');
    // if panel is not currently visible, abort (prevents stale scheduled renders)
    if (!contentWrapper || !contentWrapper.classList.contains('showing')) return;
    var container = document.querySelector('.content-wrapper__inner');
    if (!container) return;
    // remove previous if exists
    var prev = document.getElementById('blog-panel-injected');
    if (prev) prev.parentNode.removeChild(prev);

    // when rendering blog panel, ensure any injected projects gallery is removed and timeline restored
    var ghPrev = document.getElementById('gh-repos-injected');
    if (ghPrev) ghPrev.parentNode.removeChild(ghPrev);
    // try to restore timeline in case projects hid it
    try { if (window.restoreOriginalTimeline) window.restoreOriginalTimeline(); } catch(e){}

    var wrapper = document.createElement('div');
    wrapper.id = 'blog-panel-injected';
    wrapper.className = 'blog-panel-wrap';

    var header = document.createElement('div');
    header.className = 'blog-panel-header';
    header.innerHTML = '<h3>Blog Preview</h3><button class="blog-panel-full">Open full</button>';
    wrapper.appendChild(header);

    var list = document.createElement('div');
    list.className = 'blog-panel-list';

    var posts = window._sitePosts || [];
    if (!posts.length) {
      list.innerHTML = '<p>No posts available.</p>';
    }

    posts.forEach(function(p,index){
      var item = document.createElement('div');
      item.className = 'blog-panel-item';

      var title = document.createElement('a');
      title.href = p.url;
      title.textContent = p.title;
      title.className = 'blog-panel-item-title';
  title.addEventListener('click', function(e){ e.preventDefault(); openFull(p.url); });

      var meta = document.createElement('div');
      meta.className = 'blog-panel-item-meta';
      meta.textContent = new Date(p.date).toLocaleDateString();

      var excerpt = document.createElement('div');
      excerpt.className = 'blog-panel-item-excerpt';
      excerpt.textContent = p.excerpt || '';

      item.appendChild(title);
      item.appendChild(meta);
      item.appendChild(excerpt);
      list.appendChild(item);
    });

    wrapper.appendChild(list);
    // Only append if panel is still open
    if (contentWrapper && contentWrapper.classList.contains('showing')) {
      console.debug('[blog-panel] appending wrapper', { time: Date.now() });
      container.appendChild(wrapper);
    }

    // wire full button
    var fullBtn = wrapper.querySelector('.blog-panel-full');
    if (fullBtn) fullBtn.addEventListener('click', function(){
      if (posts.length) openFull(posts[0].url);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    // when blog panel triggered, render
    document.querySelectorAll('a.panel-button.blog-button').forEach(function(btn){
      btn.addEventListener('click', function(e){
        // If the blog button is a normal link to the blog index, allow navigation
        try {
          var href = btn.getAttribute('href') || '';
          if (href && href.indexOf('#') !== 0 && href.indexOf('#blog') === -1) {
            // do not open side panel; let browser handle navigation
            return;
          }
        } catch(err){}

        // Defer slightly so main toggle runs first; then decide open/close
        setTimeout(function(){
          var content = document.querySelector('.content-wrapper');
          var isShowing = content && content.classList.contains('showing');
          if (!isShowing) {
            // panel closed: ensure cleanup
            var prev = document.getElementById('blog-panel-injected');
            if (prev) prev.parentNode.removeChild(prev);
            try { if (window.restoreOriginalTimeline) window.restoreOriginalTimeline(); } catch(e){}
            return;
          }
          // panel open: remove any gh repos and render our blog preview
          var ghPrev = document.getElementById('gh-repos-injected');
          if (ghPrev) ghPrev.parentNode.removeChild(ghPrev);
          try { if (window.restoreOriginalTimeline) window.restoreOriginalTimeline(); } catch(e){}
          setTimeout(renderPanel, 300);
        }, 40);
      });
    });

    // if page loaded with #blog
    if (window.location.hash && window.location.hash === '#blog'){
      setTimeout(renderPanel, 600);
    }
  });
})();
