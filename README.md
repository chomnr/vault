# Vault
 A password manager project built with <b>Next.js</b>, <b>MongoDB</b>, <b>Prisma ORM</b> and <b>TypeScript</b>. You can only have one user, but multiple vaults, with each vault having its own key (AES 256).
<div align="center"> <img src="./docs/img/main_2.png"> </div>

## Prerequisites
* [Git](https://git-scm.com/downloads)
* [Node 18](https://nodejs.org/download/release/latest-v18.x/)

## Installation
First, [download](https://nodejs.org/en/download/package-manager/) and install <b>Node.js</b>
```sh
# Clone Repository
git clone https://github.com/chomnr/vault.git
cd vault

# Install Dependencies
npm install

# Set Up Environment Variables
cp .env.example .env # fill everything out.

# Push the schema onto Mongodb database
npx prisma db push

# Run 
npm run build
npm start   
```