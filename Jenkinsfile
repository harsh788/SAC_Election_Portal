pipeline {
    environment {
        docker_image=""
    }
    agent any
    stages {
        stage('Stage 0: Pull mongo docker image')
        {
            steps{
                script{
                    sh 'docker rm -f mongo_container frontend_container backend_container'
                    docker.withRegistry('', 'DockerHubCred') {
                        docker.image('mongo').pull()
                    }
                }
            }
        }
        stage('Stage 1: Git Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/harsh788/SAC_Election_Portal.git'
            }
        }
        stage('Stage 2: Build Docker Image'){
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
        stage('Stage 3: Push docker image to hub') {
            steps{
                script{
                    docker.withRegistry('', 'DockerHubCred'){
                        // docker_image.push()
                        sh 'docker push harsh788/frontend_image:latest'
                        sh 'docker push harsh788/backend_image:latest'
                    }
                }
            }
        }
        stage('Stage 4: Clean docker images'){
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