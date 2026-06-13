# CI/CD DevOps Practice Lab

An automated, cloud-native CI/CD pipeline built to package, verify, and simulate the production deployment of the **TaskFlow** web application. This project demonstrates hands-on implementation of Infrastructure as Code (IaC), containerization, and automated pipeline orchestration.

## System Architecture

The pipeline is designed to automatically pull source code on commit, validate configurations, and coordinate a secure deployment workflow using containerized strategies.

## Technologies Used

* **Orchestration:** Jenkins (Declarative Pipeline)
* **Containerization:** Docker(container builds)
* **Cloud Provider:** AWS (EC2,ECR,EKS)
* **Configuration Management:** Ansible
* **Container Orchestration:** Kubernetes (kubectl)
* **Version Control:** Git & GitHub

## Pipeline Stages & Implementation Details

### 1. Checkout 
* Automatically monitors the repository and fetches the latest codebase modifications directly from targeted development branches.

### 2. Build & Push Container Image (Cloud-Native Bypass)
* **The Challenge:** Running standard `npm install` and local Docker daemon operations on a limited `t2.micro` AWS EC2 instance caused 100% memory exhaustion and system crashes.
* **The Engineering Solution:** Successfully optimized the workflow by shifting to a cloud-native, daemonless simulation model. This verified environment parameters, injected AWS credential masks securely, and generated clean build parameters without resource choking.

### 3. Ansible Infrastructure Configuration
* Integrates an Ansible playbook setup (`ansible-playbook -i ansible/inventory/aws_ec2.yml`) designed to automatically target, connect to, and dynamically configure running AWS EC2 environments.

### 4. Deploy to AWS EKS Cluster
* Configures automated Kubernetes connection states using the AWS CLI (`aws eks update-kubeconfig`).
* Applies localized Kubernetes manifests (`namespace.yaml`, `configmap.yaml`) and updates live image tags dynamically using `kubectl set image`.

### 5. Smoke Test Verification
* Implements automated runtime verification by programmatically extracting the active AWS LoadBalancer ingress hostname and executing a `curl -f` health-check handshake to confirm a `200 OK` application status.
* 
## Key Engineering Insights & Workarounds

* **Out-of-Memory (OOM) Remediation:** Diagnosed and recovered an unresponsive Jenkins interface by executing hard platform-level reboots via the AWS EC2 Console, followed by removing heavy local node dependencies.
* **Jenkins Sandbox Access Control:** Overcame strict Groovy script sandbox permission limitations (`RejectedAccessException`) by restructuring pipeline blocks into trusted native declarative syntax.
* **Isolating Tool Dependencies:** Successfully navigated isolated container limitations (`docker: not found` and `ansible-playbook: not found`) by exploring distributed Master/Agent system nodes and native tool injection strategies.
