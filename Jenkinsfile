pipeline {

    agent any
 
    environment {

        COMPOSE_PROJECT_NAME = "formlet"

    }
 
    stages {
 
        stage('Clone Repo') {

            steps {

                git branch: 'main',

                    url: 'https://github.com/training-11/formlet.git'

            }

        }
 
        stage('Verify Environment') {

            steps {

                sh '''

                echo "🔍 Verifying required files..."

                ls -l docker-compose.yml

                ls -l backend/.env

                '''

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
 
        stage('Health Check') {

            steps {

                sh '''

                echo "⏳ Waiting for backend to start..."

                sleep 15
 
                echo "🔎 Checking backend logs..."

                docker logs formlet-backend --tail 20

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

        always {

            sh '''

            echo "🧹 Cleaning dangling images..."

            docker image prune -f || true

            '''

        }

    }

}
 