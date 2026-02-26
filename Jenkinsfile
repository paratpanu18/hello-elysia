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
                sh "bun install"
                sh "bun test"
            }
        }

        stage('Build container image') {
            steps {
            sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Push to ghcr.io') {
            steps {
            script {
                docker.withRegistry('https://ghcr.io', 'ghcr-token') {
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:latest"
                }
            }
            }
        }

        stage('Deploy to k8s') {
            when {
                branch 'master'
            }
            steps {
                withKubeConfig([credentialsId: 'ppechsa-kube-config']) {
                    sh "kubectl apply -f k8s/app.yaml"
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