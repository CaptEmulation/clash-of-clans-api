String REF = "${params.repo_commit}"

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
            branches: [[name: "${REF}" ]],
            doGenerateSubmoduleConfigurations: false,
            extensions: [
              [$class: "SubmoduleOption",
                          disableSubmodules: false,
                          recursiveSubmodules: true,
                          parentCredentials: true],
              [$class: "CleanBeforeCheckout",
                deleteUntrackedNestedRepositories: true]
            ],
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
          yarn install
          yarn build
          """
      }
    }
  }
}
