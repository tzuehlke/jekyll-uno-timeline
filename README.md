# Jekyll-Uno with Projects as Timeline
A Jekyll Theme, based on the Uno-Theme with a list of projects as Timeline.

## How does is look
[Demo](https://www.zuehlke.cloud/)
![Screenshot](screenshot-overview.png)
![jekyll-theme-desktop](https://user-images.githubusercontent.com/32843441/72224870-5451ff00-357f-11ea-8fc2-bfbd4499bc63.gif)
![jekyll-theme-mobil](https://user-images.githubusercontent.com/32843441/72224877-6a5fbf80-357f-11ea-920b-dfae72bf2fbe.gif)

## Installation/Setup
1. Download or clone repo `git clone https://github.com/tzuehlke/jekyll-uno-timeline.git`
2. Enter the folder: `cd jekyll-uno-timeline/`
3. Build it: `jekyll build`
4. Start Jekyll server: `jekyll serve`
5. Configure: `_config.yml`
   * at least set `font_awesome` or download and add the font in `head.html`

Access via: [http://localhost:4000/](http://localhost:4000/)

## Details/Features/Changes
* based on the [Uno-Theme](https://github.com/joshgerdes/jekyll-uno), but:
  * removed everything with posts
  * `content-wrapper` can be shown or hidden with button
  * changed all icons to [Font-Awesome](https://fontawesome.com/)
  * updated google-analytics snipped
  * added [Meetup-Link](https://www.meetup.com/)
  * removed RSS
  * removed Disqus
  * using a Timeline-Design instead of posts, therefore no pagination anymore
* using Timeline ([CSS](https://github.com/le4ker/personal-jekyll-theme/blob/master/css/timeline.scss), [HTML](https://github.com/le4ker/personal-jekyll-theme/blob/master/_includes/timeline.html) ) from [{ Personal } Jekyll Theme](https://github.com/le4ker/personal-jekyll-theme) for a list of projects, but:
  * still with 3 layouts for different screen-width, but without images on small screens
  * timeline information source is now `_data/projects.yaml`
  * always using the `timeline-inverted`-class, for text on the right side of the images
* using [github_api.js](https://github.com/jarrekk/Jalpc/blob/master/static/js/github_api.js) from [Jalpc.](https://github.com/jarrekk/Jalpc), but:
  * changed the GitHub-URL for using with persons and organisations
  * added watchers number