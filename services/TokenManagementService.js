class TokenManagementService {
    constructor(length, count)   {
        this.tokensArray = [];
        this.length = (length > 0)?length:5;
        this.createTokens(count);
    }

    generateToken()   {   
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < this.length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    createTokens(count)  {

        for(let i=0; i < count; i++)   {
            let newToken = this.generateToken();
            this.tokensArray.push(newToken); 
            console.log("token " + i + ": " + newToken);  
        }             
    }

    validateToken(token) {

        let tokenIndex = this.tokensArray.indexOf(token);
        if(tokenIndex < 0)  {
            return false;    
        } else {
            this.tokensArray.splice(tokenIndex, 1);
            return true;
        }
    }

    removeAllTokens()   {
        this.tokensArray.splice(0, this.tokensArray.length);
    }

    getAllTokens()  {
        return this.tokensArray;
    }

    isAnyTokenAvailable()   {
        return (this.tokensArray.length !== 0);
    }

}

module.exports = new TokenManagementService(6, 3);
