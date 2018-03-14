// var http = require('http');

// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end('Hello World!');
// }).listen(8080);



// var { graphql, buildSchema } = require('graphql');

// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// var root = { hello: () => 'Hello world!' };

// graphql(schema, '{ hello }', root).then((response) => {
//   console.log(response);
// });


var GithubGraphQLApi = require('node-github-graphql')
var sql = require('mysql');
var github = new GithubGraphQLApi({
  token: "cc90d291c793196d044637a20c042b38ac10a2c7",
  debug: true
})
// github.query(`
// {
//     repositoryOwner(login: "GoyfAscetic") {
//         repository(name: "googleplay-api") {
//             object(expression: "master") {
//                 ... on Commit {
//                     blame(path: "gpapi/googleplay.py") {
//                         ranges {
//                             startingLine
//                             endingLine
//                             age
//                             commit {
//                                 oid
//                                 committedDate 
//                                 author {
//                                 name
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

// `, null, (res, err) => {

//   console.log(JSON.stringify(res.data.repositoryOwner.repository, null, 2))
// })

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
                //console.log(newpath + " is a tree!");
                populatefiles(repo_name, newpath);
            }
        }
        console.log(path + " contents");
        console.log(JSON.stringify(res, null, 2))
    })
}
