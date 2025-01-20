# PostgreSQL Backup Automation on Windows

This guide provides the steps to automate daily backups for your PostgreSQL database on a Windows system. It uses the `pg_dump` command and Windows Task Scheduler.

## Steps to Automate PostgreSQL Backup

### 1. Use `pg_dump` to Create a Backup

`pg_dump` is a utility provided by PostgreSQL to back up databases. You can run this command to dump your database into a file.

#### Example Command:
bash
pg_dump -U your_username -h localhost -p 5432 -F c -b -v -f "C:\path\to\backup\your_backup_name.backup" your_database_name

# Build image form GitRepo

### BuuildwithPersoal toke (All access)
docker build --build-arg GH_TOKEN=<Token vale> -t meditrack:1.0.0 .
### Run By Docker Compose
docker-compose up


## Create a GitHub Personal Access Token (PAT):
#### Step-1. GH_TOKEN

Go to GitHub > Settings > Developer settings > Personal access tokens.
Click on Generate new token, select the required scopes (repo for accessing private repositories), and generate the token.
Copy the token; you won’t be able to view it again.
Add the Token to GitHub Secrets:

Go to your GitHub repository > Settings > Secrets > New repository secret.
Name the secret GH_TOKEN and paste the PAT you copied earlier.

#### Step-2. DOCKER_TOKEN and DOCKER_PASSWORD

Steps to Create a Docker Hub Token:
Log in to Docker Hub:

Go to Docker Hub and log in with your Docker Hub account.
Generate an Access Token:

Once logged in, click on your profile picture in the top-right corner.
From the dropdown menu, select Account Settings.
In the left-hand sidebar, select Security.
Under the Access Tokens section, click Create Token.
Give your token a name (e.g., GitHub Actions Token).
Click Create.
Copy the token as you won't be able to see it again.

Add the Docker Hub Token to GitHub Secrets: Step-1.


# Register User

http://localhost:8080/api/register

Headers:
Content-Type:application/json
{
"username": "1",
"password": "1",
"roles": "USER"
}

# Login User


http://localhost:8080/api/login

Headers:
Content-Type:application/json
{
"username": "1",
"password": "1"
}










