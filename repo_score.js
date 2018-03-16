
//Package to connect to GitHub's GraphQL API
var GithubGraphQLApi = require('node-github-graphql') 

//Package to edit SQL db
var sql = require('mysql'); 

//Connect to GitHub API
var github = new GithubGraphQLApi({
  token: process.env.GITHUB_API_TOKEN,
  debug: true
})

//Call the recursive function
populatefiles("googleplay-api", "master:");

//Find all the files in a repo for a given path
function populatefiles(repo_name, path){
    //Query the GitHub API for all files in repo <repo_name>
    //found at <path>
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

        //The array of files returned by Github
        var entries  = res.data.viewer.repository.object.entries

        for (var e in entries){
            var entry = entries[e];

            //If the entry is a directory("tree") 
            if(entry.type === "tree"){

                //update the path and log it
                var newpath = path + entry.name + "/";
                console.log(newpath + " is a tree!");

                //call the function with the new path
                populatefiles(repo_name, newpath);
            }
        }
        //log all entries found at <path>
        console.log(path + " contents");
        //console.log(JSON.stringify(res, null, 2))
    })
}
