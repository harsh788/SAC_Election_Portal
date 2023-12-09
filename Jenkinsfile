pipeline {
    environment {
        docker_image=""
    }
    agent any
    stages {
        stage('Stage 0: Remove Old Containers')
        {
            steps{
                sh 'docker rm -f mongo_container frontend_container backend_container'
            }
        }
        stage('Stage 1: Git Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/harsh788/SAC_Election_Portal.git'
            }
        }
        stage('Stage 2: Build Docker Images'){
            steps{
                dir('backend')
                {
                    script{
                        docker_image = docker.build "harsh788/backend_image:latest"
                    }
                }
                dir('frontend')
                {
                    script{
                        docker_image = docker.build "harsh788/frontend_image:latest"
                    }
                }
            }
        }
        stage('Stage 3: Push Images to DockerHub') {
            steps{
                script{
                    docker.withRegistry('', 'DockerHubCred'){
                        sh 'docker push harsh788/frontend_image:latest'
                        sh 'docker push harsh788/backend_image:latest'
                    }
                }
            }
        }
        stage('Stage 4: Clean Docker Images'){
            steps{
                script{
                    sh 'docker container prune -f'
                    sh 'docker image prune -f'
                }   
            }
        }
        stage('Step 5: Ansible Deployment'){
            steps{
                ansiblePlaybook becomeUser: null,
                colorized: true,
                credentialsId: 'localhost',
                disableHostKeyChecking: true,
                installation: 'Ansible',
                inventory: 'deployment/inventory',
                playbook: 'deployment/deploy.yml',
                sudoUser: null
            }
        }
    }
}