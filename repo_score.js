
var GithubGraphQLApi = require('node-github-graphql')
var sql = require('mysql');
var github = new GithubGraphQLApi({
  token: process.env.GITHUB_API_TOKEN,
  debug: true
})

populatefiles("googleplay-api", "master:");

function populatefiles(repo_name, path){
    github.query(`
        {
            viewer {
                repository(name: "` + repo_name +`") {
                    object(expression: "` + path +`") {
                        ... on Tree{
                            entries{
                                name
                                type
                                mode
                            }
                        }
                    }
                }
            }
        }

        `, null, (res, err) => {
        var entries  = res.data.viewer.repository.object.entries
        for (var e in entries){
            var entry = entries[e];
            if(entry.type === "tree"){
                var newpath = path + entry.name + "/";
                console.log(newpath + " is a tree!");
                populatefiles(repo_name, newpath);
            }
        }
        console.log(path + " contents");
        //console.log(JSON.stringify(res, null, 2))
    })
}
