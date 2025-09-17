// Fetch GitHub repos and render them into the content-wrapper projects area
(function(){
  console.log('projects-fetch loaded');
  function fetchRepo(fullName) {
    return fetch('https://api.github.com/repos/' + fullName)
      .then(function(res){ if (!res.ok) throw new Error('GitHub API error: ' + res.status); return res.json(); });
  }

  function hideOriginalTimeline() {
    var timelines = document.querySelectorAll('.content-wrapper__inner .timeline, .timeline');
    timelines.forEach(function(t){
      // store previous inline style to restore later
      t._prevDisplay = t.style.display || '';
      t.style.display = 'none';
      t.classList.add('gh-hidden');
    });
  }

  function restoreOriginalTimeline() {
    var timelines = document.querySelectorAll('.content-wrapper__inner .timeline.gh-hidden, .timeline.gh-hidden');
    timelines.forEach(function(t){
      t.style.display = t._prevDisplay || '';
      t.classList.remove('gh-hidden');
      delete t._prevDisplay;
    });
  }

  function fetchAndRenderRepos() {
    var cfg = window._siteConfig || {};
    var user = cfg.githubUser || null;
    var featured = Array.isArray(cfg.featuredRepos) ? cfg.featuredRepos.slice(0) : [];

    var container = document.querySelector('.content-wrapper__inner');
    if (!container) return;

    // Remove previous injected gallery if exists (idempotent)
    var prev = document.getElementById('gh-repos-injected');
    if (prev) prev.parentNode.removeChild(prev);

    // Create wrapper early (even if fetch fails we won't break layout)
  var wrapper = document.createElement('div');
    wrapper.id = 'gh-repos-injected';

    var gallery = document.createElement('div');
    gallery.className = 'projects-gallery-view';
    var grid = document.createElement('div');
    grid.className = 'projects-gallery-grid';
    gallery.appendChild(grid);
    wrapper.appendChild(gallery);

    container.appendChild(wrapper);

    // If we're in featured mode, hide the original timeline entries so only featured repos show
    if (featured.length > 0) {
      hideOriginalTimeline();
    }

    var fetchPromises = [];

    if (featured.length > 0) {
      // featured repo list provided: fetch each specific repo
      featured.forEach(function(fullName){
        // expect format owner/repo
        fetchPromises.push(fetchRepo(fullName).catch(function(err){ console.error('Failed fetching', fullName, err); return null; }));
      });
    } else if (user) {
      // fallback: fetch all user repos
      fetchPromises.push(fetch('https://api.github.com/users/' + encodeURIComponent(user) + '/repos?per_page=100&sort=pushed')
        .then(function(res){ if (!res.ok) throw new Error('GitHub API error: ' + res.status); return res.json(); })
        .catch(function(err){ console.error('Failed fetching user repos', err); return [];}));
    } else {
      console.warn('No GitHub user or featured repos configured');
      return;
    }

    Promise.all(fetchPromises).then(function(results){
      var repos = [];
      // flatten results: if featured mode each item is an object or null; if user mode results[0] is an array
      results.forEach(function(r){ if (Array.isArray(r)) { repos = repos.concat(r); } else if (r) { repos.push(r); } });

      // render cards
      repos.forEach(function(r){
        var card = document.createElement('a');
        card.className = 'project-card';
        card.href = r.html_url;
        card.target = '_blank';
        card.rel = 'noopener';
        var img = document.createElement('img');
        img.className = 'project-card__img';
        img.alt = r.name;
        // Use GitHub OpenGraph preview for repository visual (avoids showing account profile photo)
        // format: https://opengraph.githubassets.com/1/owner/repo
        if (r.full_name) {
          img.src = 'https://opengraph.githubassets.com/1/' + encodeURIComponent(r.full_name);
        } else if (r.owner && r.owner.avatar_url) {
          img.src = r.owner.avatar_url;
        } else {
          img.src = '';
        }
        card.appendChild(img);

        var meta = document.createElement('div');
        meta.className = 'project-card__meta';
        var title = document.createElement('h3');
        title.className = 'project-card__title';
        title.textContent = r.name;
        meta.appendChild(title);
        var desc = document.createElement('p');
        desc.className = 'project-card__desc';
        desc.textContent = r.description || '';
        meta.appendChild(desc);

        var stats = document.createElement('p');
        stats.className = 'project-card__stats';
        stats.innerHTML = '★ ' + (r.stargazers_count || 0) + ' • 🍴 ' + (r.forks_count || 0);
        meta.appendChild(stats);

        card.appendChild(meta);
        grid.appendChild(card);
      });
    }).catch(function(err){ console.error('Failed to load repos', err); });
  }

  // Hook into existing behavior: when panel-button is clicked (side panel opens), call fetch
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.panel-button').forEach(function(btn){
        btn.addEventListener('click', function(e){
          var content = document.querySelector('.content-wrapper');
          var willClose = content && content.classList.contains('showing');
          if (willClose) {
            // panel is closing -> cleanup injected content and restore timeline
            var prev = document.getElementById('gh-repos-injected');
            if (prev) prev.parentNode.removeChild(prev);
            restoreOriginalTimeline();
            return;
          }
          // panel is opening: wait a bit and then fetch if panel still visible
          setTimeout(function(){
            if (document.querySelector('.content-wrapper') && document.querySelector('.content-wrapper').classList.contains('showing')) {
              fetchAndRenderRepos();
            }
          }, 500);
        });
    });

    // If page loaded with #projects hash, fetch as well
      if (window.location.hash && window.location.hash === '#projects') {
        setTimeout(function(){
          fetchAndRenderRepos();
        }, 600);
      }
  });
})();
