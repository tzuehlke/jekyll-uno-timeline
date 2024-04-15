console.log("github_api loaded");
$(document).ready(function() {
  users = []
  repos = []
  $(".ghbtn").each( function () {
    var user = $(this).attr('user');
    var repo = $(this).attr('repo');
    repos.push(user + '/' + repo);
      if (users.indexOf($(this).attr('user')) === -1) {
        users.push($(this).attr('user'))
      }
  })
  //console.log(1, repos)
  for (var i = 0; i < repos.length; i++) {
    //console.log("URL: "+"https://api.github.com/repos/" + repos[i]);
    $.ajax({
    type: "GET",
    url: "https://api.github.com/repos/" + repos[i],
    tryCount : 0,
    retryLimit : 3,
    async: true,
    dataType: "json",
    success: function (data) {
      x = data.name;
      //console.log("User/Repo: " + data.full_name + " Star: " + data.stargazers_count+ " Forks: "+data.forks_count + " Watchers: "+data.watchers_count);
      $("div[repo='" + x + "']").find("span[class='star']").html("&nbsp;"+data.stargazers_count);
      $("div[repo='" + x + "']").find("span[class='fork']").html("&nbsp;"+data.forks_count);
      $("div[repo='" + x + "']").find("span[class='watchers']").html("&nbsp;"+data.watchers_count);
      $("div[repotext='" + x + "']").find("span[class='desc']").html(data.description);
    }
  })}
});
