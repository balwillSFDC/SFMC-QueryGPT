
## :wave: Welcome to QueryGPT for Salesforce Marketing Cloud :wave:

### :question: What is QueryGPT
QueryGPT is designed to automate and simplify the creation of queries by leveraging the advanced natural language processing capabilities of ChatGPT. It specifically focuses on working within the considerations of Salesforce Marketing Cloud, using source and target data extensions provided, and allowing users to provide names and descriptions that are then translated into precise query syntax.

#### Features 
* :white_check_mark: **Intuitive Interface:** Users can easily input the names of the source and target data extensions, along with a description of the query they want to perform. The app's user-friendly design guides users through the process.

* :white_check_mark: **Integration with ChatGPT:** By harnessing the power of ChatGPT, the app translates user-provided descriptions into complex query syntax. This allows users to define queries in natural language, without needing to know the specific query language.

* :white_check_mark: **Data Extension Handling:** Users can specify source and target data extensions, and the app will retrieve the corresponding fields and use them in the query creation process. This includes error handling for data extensions that are not found.

* :hourglass: **[In Development] Query Execution**: Depending on the app's setup, it may also support executing the generated queries on the specified data extensions, providing real-time results or other functionalities like scheduling.


### :construction: Local Development
Local development requires Redis, Open AI API key, and admin access to SFMC. In order to deploy locally, keep 3 separate terminal windows open to run 1. backend 2. worker.js 3. react front end
```
# clone the project & navigate to cloned project folder
git clone https://github.com/balwillSFDC/SFMC-QueryGPT 
cd SFMC-QueryGPT

# install dependencies & start server
npm install 
npm start

# New terminal - start worker.js
node server/worker.js

# New terminal - navigate to react folder, install dependencies and start frontend
cd react-ui
npm install 
npm start
```
Don't forget to create your own .env file with the necessary variables. See following section for variables.


### :running: Deploying to Production 
You will need the following before deploying:
* Heroku account
* SFMC Installed Package with Data Extension read/writer permissions and Server-side API integration
* Env variables: 
  * Client ID -> Set as REACT_APP_SFMC_CLIENTID
  * Client Secret -> Set as REACT_APP_SFMC_CLIENTSECRET
  * SFMC Stack -> Set as REACT_APP_SFMC_STACK
  * Rest URI -> Set as REACT_APP_SFMC_ORIGIN
  * Auth URI -> Set as REACT_APP_SFMC_AUTHORIGIN
  * Soap URI -> Set as REACT_APP_SFMC_SOAPORIGIN
  * Open AI API Key -> Set as OPENAI_API_KEY

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/balwillSFDC/sfmc-queryGPT)


### FAQ
- What LLM does this use? 
  - GPT-4
- Is my data stored anywhere? 
  - No. The query is passed through the Einstein Trust Layer, removing PII, obsentities and other sensitive info. Salesforce also has an agreement with Open AI to prevent data being stored 
- Why didn't you use SF Codegen API? 
  - Requires security review and process would've taken too long for project timeline 
- Why didn't you use Conversation API to allow user to continually refine query? 
  - Conversation API not available in prod or ConnectAPI
- What's in store for the future?
  - Use Conversation API to extract and process additional metadata from the request (i.e. additional DEs, complex requirements, etc.)