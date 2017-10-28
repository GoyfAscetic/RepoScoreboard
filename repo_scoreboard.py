import requests

if __name__ == "__main__":
    url = "https://api.github.com/graphql"
    headers = {
            "Authorization": "token $GITHUB_PRODUCTION_TOKEN"
        }
    stringRequest = 
    """
        query {
            repositoryOwner(login: "GoyfAscetic") {
                repository(name: "googleplay-api") {
                    object(expression: "master") {
                        ... on Commit {
                            blame(path: "gpapi/googleplay.py") {
                                ranges {
                                    startingLine
                                    endingLine
                                    age
                                    commit {
                                        oid
                                        committedDate 
                                        author {
                                        name
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    """
    response = requests.post(url, headers=headers, data=stringRequest)