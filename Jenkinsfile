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

        stage('Bun Test') {
            steps {
                script {
                    docker.image('oven/bun:canary-slim').inside('--network=host') {
                    sh "bun install"
                    sh "bun test"
            }
                }
            }
        }

        stage('Build & Push') {
            steps {
                script {
                    docker.withRegistry('https://ghcr.io', 'ghcr-token') {
                        def customImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}", "--network=host .")
                        customImage.push()
                        customImage.push('latest')
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
        success {
            echo "Success. Image: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "Failed, check the logs for details."
        }
        always {
            // Clean up
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
    }
}