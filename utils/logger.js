class Logger{
    constructor(elementId, messageLimit){
        this.logger = $(`#${elementId || 'logger'}`)[0];

        this.messageLimit = messageLimit || 5;
        this.messageList = [];
        this.prefix = '> ';
        this.displayMessage('Logger initialized');
    }

    displayMessage(message){
        this.messageList.push(`${this.prefix}${message}`);
        if(this.messageList.length > this.messageLimit) this.messageList.shift();

        this.logger.innerHTML = this.messageList.join('<br>');
    }

    startTimer(){
        this.startTime = new Date();
    }

    endTimer(message){
        let elapsedTime = new Date() - this.startTime;
        this.displayMessage(`${message} ${elapsedTime}ms`);
        this.startTime = undefined;
    }
}