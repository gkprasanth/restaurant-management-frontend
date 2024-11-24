import { Client, Account, Databases } from 'appwrite';

const client = new Client();
client.setEndpoint('http://localhost/v1').setProject('6740c30500328cadc34d');

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
