# JEDI chat 
**J**avascript **e**mit **d**iscussion **i**nterface


### Installation:
1. Download JEDIchat from github
    ```
    $ git clone https://github.com/Bennobianco/JEDIchat
    ```
    
2. Go to folder
    ```
    $ cd JEDIchat/
    ```
    
3. Installe dependencies
    ```
    $ npm install
    ```
4. add a `.env` file
    ```
    SERVER_PORT = 3000
    EMAIL_HOST = email.host
    EMAIL_PORT = 800
    EMAIL_USER = test.user@email.eu
    EMAIL_PASS = ********
    HTTPS = false
    HTTPS_KEY = cert/https.key
    HTTPS_CERT = cert/https.cet
    ```
    
5. Run JEDIchat
    ```
    $ npm start
    ```
    
6. Now open you Webbrowser at `http://localhost:3000/`

### Dependencies:
* [socket.io](https://www.npmjs.com/package/socket.io)
* [express](https://www.npmjs.com/package/express)
* [dotenv](https://www.npmjs.com/package/dotenv)
