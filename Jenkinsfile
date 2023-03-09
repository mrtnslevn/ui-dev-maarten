node {
    def dockerImage = ''
	def containerName = 'paymentsystem-ui'
    def registry = 'ndsteam/paymentsystem-ui'
    def registryCredential = 'ihwandockerhub'
    def posisi = ''
	def ssh_cred = 'sudo sshpass -f /root/jenkins/payment-pass ssh root@192.168.1.159'
	def jobName = 'Payment System UI'
    try {
		stage ('Jenkins Jobs Triggered'){
			echo "Pipeline Start ..."
		}
		
		stage('Get Source from SCM') {
			posisi = 'Get Source from SCM'
			echo "Get Source from SCM Start ..."
			git branch: "dev",
			credentialsId: 'd4d75464-8f03-440b-a0d4-cb00717574d3',
			url: 'https://gitlab.nds.co.id/siloam-payment-system/ui.git'
		}
		
		stage('Building Image') {
		    posisi = 'Building Image'
			echo "Building Image Start ..."
			dockerImage = docker.build registry + ":$BUILD_NUMBER"
		}
		
		stage('Push Image') {
		    posisi = 'Push Image'
		    echo "Push Image Start ..."
		    docker.withRegistry( '', registryCredential ) {
            dockerImage.push()
          }
        }
		
		stage('Remove Unused docker image') {
		    posisi = 'Remove Unused docker image'
		    echo "Remove Unused docker image ..."
		    sh "docker rmi $registry:$BUILD_NUMBER"
        }
		
		stage ('Run Container') {
		    posisi = 'Run Container'
			echo "Run Container ..."
			try {
				sh "$ssh_cred docker stop $containerName || true && $ssh_cred docker container rm $containerName || true && $ssh_cred docker image rm $registry || true"		    
			} finally {
				sh "$ssh_cred docker run -d --name $containerName -p 8888:80 $registry:$BUILD_NUMBER"
			}
		}
		
		stage ('Notification') {
		    posisi = 'Notification'
			echo "Notif ..."
			emailext body: "Haloo team,\nJob deploy $jobName pada number $BUILD_NUMBER SUCCESS\nInfo lebih lanjut kunjung: $BUILD_URL", 
			subject: "Jenkins Build SUCCESS: Job $jobName",
			to : 'ihwandaus@gmail.com, veronica.c.putri@gmail.com'
        }
	}	
	catch (e) {
		echo "Exception ..."
		emailext body: "Haloo team,\nJob deploy $jobName pada number $BUILD_NUMBER FAILED pada stage $posisi\nInfo lebih lanjut kunjung: $BUILD_URL", 
		subject: "Jenkins Build FAILED: Job $jobName",
		to : 'ihwandaus@gmail.com, veronica.c.putri@gmail.com'
	}
}
