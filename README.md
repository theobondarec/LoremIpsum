This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## test site web en local:
#### étape 1 :

### `npx create-react-app my-app`
### `cd my-app`
### `npm install axios bootstrap cors express mongodb react react-router-dom request react-svg-radar-chart react-circular-progressbar `
### `npm init --yes`

#### étape 2 :
extraire la partie Website du git et la copier coller les fichiers dans le dossier my-app créé précédemment
## ne pas oublier de mettre le fichier .env (avec les clés d'api, de bdd) dans la partie bakcend

#### étape 3 :
### `node finalAnalyseApp.js` depuis backend

### `npm start`  depuis my-app
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Afin de modifier la base de donnée
utiliser les fonctions:
# summonerIdApp.js => sert à recuperer/stocker les classements par ligue
# accountIdApp.js => sert à recuperer/stocker les infos d'un compte utilisateur par ligue (accountId/summonerId)
# getGameId.js => sert à recuperer/stocker des identifiants de partie par ligue (gameId)
# gameIdApp.js => sert à analyser une game, recuperation des stats par champion et par ligue
