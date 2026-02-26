pipeline {
    agent any

    environment {
        IMAGE_NAME = "ghcr.io/paratpanu18/hello-elysia"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Bun Unit-Test') {
            steps {
                script {
                    docker.image('oven/bun:canary-slim').inside('--network=host') {
                        sh "bun install"
                        sh "bun test"
                    }
                }
            }
        }

        stage('Build Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Robot Framework Tests') {
            steps {
                script {
                    dir('external-tests') {
                        git url: 'https://github.com/paratpanu18/hello-elysia-robot-test', branch: 'main'
                    }

                    sh "docker network create test-net || true"

                    try {
                        sh "docker run -d --name test-app --network test-net ${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "sleep 5"

                        docker.image('ppodgorsek/robot-framework:latest').inside("--network test-net -v ${WORKSPACE}/external-tests:/tests") {
                            sh "robot --variable BASE_URL:http://test-app:3000 --outputdir /results /tests"
                        }
                    } finally {
                        sh "docker rm -f test-app || true"
                        sh "docker network rm test-net || true"
                        robot outputPath: 'results/', logFileName: 'log.html', reportFileName: 'report.html'
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry('https://ghcr.io', 'ghcr-token') {
                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                        sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy to k8s') {
            steps {
                withKubeConfig([credentialsId: 'ppechsa-kube-config']) {
                    sh "kubectl apply -f k8s/app.yaml"
                    sh "kubectl set image deployment/hello-elysia-deployment hello-elysia-container=${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "kubectl rollout status deployment/hello-elysia-deployment"
                }
            }
        }
    }

    post {
        success { echo "Success. Image: ${IMAGE_NAME}:${IMAGE_TAG}" }
        failure { echo "Failed, check the logs for details." }
        always {
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest || true"
        }
    }
}