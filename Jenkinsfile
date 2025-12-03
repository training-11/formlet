pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/training-11/formlet.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                echo "📦 Building Docker images..."
                docker-compose build
                '''
            }
        }

        stage('Stop & Cleanup Old Containers') {
            steps {
                sh '''
                echo "🛑 Stopping old containers..."
                docker-compose down || true

                echo "🧹 Removing old containers (avoid name conflicts)..."
                docker rm -f formlet-backend || true
                docker rm -f formlet-frontend || true
                '''
            }
        }

        stage('Start New Containers') {
            steps {
                sh '''
                echo "🚀 Starting new containers..."
                docker-compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 Formlet Deployment Completed Successfully!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}

