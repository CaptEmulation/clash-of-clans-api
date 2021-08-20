
pipeline {
  agent {
    kubernetes {
      label "build"
      yaml """
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: node
            image: node:12-alpine
            command:
            - sleep
            args:
            - 99d
      """
    }
  }
  stages {
    stage("Pull repo") {
      steps {
          checkout([$class: "GitSCM",
            branches: [[name: "${params.repo_branch}" ]],
            doGenerateSubmoduleConfigurations: false,
            userRemoteConfigs: [[
              credentialsId: "github-ssh",
              url: "git@github.com:CaptEmulation/clash-of-clans-api.git"
            ]]
          ])
      }
    }
    stage("Build") {
      steps {
          sh """
          yarn
          yarn build
          """
      }
    }
  }
}
